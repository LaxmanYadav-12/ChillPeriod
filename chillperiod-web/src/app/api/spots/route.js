import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import { auth } from '@/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();
    
    // Sort by upvotes desc by default
    const spots = await Spot.find({}).sort({ upvotes: -1 }).lean();

    if (session) {
      const upvotes = await UserInteraction.find({
        userId: session.user.id,
        type: 'upvote'
      }).select('spotId');

      const upvotedSpotIds = new Set(upvotes.map(u => u.spotId.toString()));

      const enrichedSpots = spots.map(spot => ({
        ...spot,
        isUpvoted: upvotedSpotIds.has(spot._id.toString())
      }));
      
      return NextResponse.json(enrichedSpots);
    }

    return NextResponse.json(spots);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and Category are required' }, 
        { status: 400 }
      );
    }

    // Attempt to extract coordinates from google maps link if provided in address
    let coordinates = body.coordinates || {};
    if (body.googleMapsUrl) {
      // Regex to find @lat,lng
      const match = body.googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        coordinates = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        };
      }
    }

    const newSpot = await Spot.create({
      ...body,
      coordinates,
      upvotes: 0,
      downvotes: 0,
      verified: false // User submissions need verification
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
