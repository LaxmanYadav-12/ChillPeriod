import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import User from '@/lib/models/User';
import { auth } from '@/auth';
import { withApi } from '@/lib/security/apiHandler';
import { spotCreateSchema } from '@/lib/validators';
import { findCollege } from '@/lib/data/colleges';

// GET /api/spots — list spots scoped to user's college
export async function GET() {
  try {
    await dbConnect();
    const session = await auth();
    
    // Build college filter from user profile
    let filter = {};
    if (session) {
      const user = await User.findById(session.user.id).select('college').lean();
      if (user?.college) {
        const college = findCollege(user.college);
        // Match by college key or legacy college string
        if (college) {
          filter.college = { $in: [college.key, college.name, user.college] };
        } else {
          filter.college = user.college;
        }
      }
    }

    const spots = await Spot.find(filter).sort({ upvotes: -1 }).lean();
    const now = new Date();
    const cutoff = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    // Compute active check-in counts for all spots
    const spotsWithCheckins = spots.map(spot => {
      const activeCheckins = (spot.checkins || []).filter(c => new Date(c.checkedInAt) > cutoff);
      return {
        ...spot,
        checkins: undefined, // Don't send full checkins array to client
        activeCheckinCount: activeCheckins.length,
        isCheckedIn: session ? activeCheckins.some(c => c.userId.toString() === session.user.id) : false,
      };
    });

    if (session) {
      const interactions = await UserInteraction.find({
        userId: session.user.id,
        type: { $in: ['upvote', 'downvote'] }
      }).select('spotId type').lean();

      const upvotedIds = new Set(interactions.filter(i => i.type === 'upvote').map(i => i.spotId.toString()));
      const downvotedIds = new Set(interactions.filter(i => i.type === 'downvote').map(i => i.spotId.toString()));

      const enrichedSpots = spotsWithCheckins.map(spot => ({
        ...spot,
        isUpvoted: upvotedIds.has(spot._id.toString()),
        isDownvoted: downvotedIds.has(spot._id.toString())
      }));
      
      return NextResponse.json(enrichedSpots);
    }

    return NextResponse.json(spotsWithCheckins);
  } catch (error) {
    console.error('[spots GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/spots — create a new spot (auth required, validated)
// SECURITY: Requires authentication, validates body with Zod, whitelists fields
export const POST = withApi(
  async (req, { session, validatedData }) => {
    await dbConnect();

    // Extract coordinates from Google Maps URL if provided
    let coordinates = validatedData.coordinates || {};
    if (validatedData.googleMapsUrl) {
      const match = validatedData.googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        coordinates = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        };
      }
    }

    // SECURITY: Only use validated/whitelisted fields — never spread raw body
    const newSpot = await Spot.create({
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      vibe: validatedData.vibe,
      budget: validatedData.budget,
      distance: validatedData.distance,
      address: validatedData.address,
      coordinates,
      upvotes: 0,
      downvotes: 0,
      verified: false,  // User submissions need admin verification
      submittedBy: session.user.id,
    });

    return NextResponse.json(newSpot, { status: 201 });
  },
  { auth: true, schema: spotCreateSchema, rateLimit: 'write' }
);
