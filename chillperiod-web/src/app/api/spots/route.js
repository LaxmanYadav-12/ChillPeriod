import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import { auth } from '@/auth';
import { withApi } from '@/lib/security/apiHandler';
import { spotCreateSchema } from '@/lib/validators';

// GET /api/spots — list all spots (public, rate-limited)
export async function GET() {
  try {
    await dbConnect();
    const session = await auth();
    
    const spots = await Spot.find({}).sort({ upvotes: -1 }).lean();

    if (session) {
      const interactions = await UserInteraction.find({
        userId: session.user.id,
        type: { $in: ['upvote', 'downvote'] }
      }).select('spotId type').lean();

      const upvotedIds = new Set(interactions.filter(i => i.type === 'upvote').map(i => i.spotId.toString()));
      const downvotedIds = new Set(interactions.filter(i => i.type === 'downvote').map(i => i.spotId.toString()));

      const enrichedSpots = spots.map(spot => ({
        ...spot,
        isUpvoted: upvotedIds.has(spot._id.toString()),
        isDownvoted: downvotedIds.has(spot._id.toString())
      }));
      
      return NextResponse.json(enrichedSpots);
    }

    return NextResponse.json(spots);
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
