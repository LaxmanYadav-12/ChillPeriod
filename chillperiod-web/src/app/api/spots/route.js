import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';

export async function GET() {
  try {
    await dbConnect();
    const spots = await Spot.find({}).sort({ upvotes: -1 });
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
