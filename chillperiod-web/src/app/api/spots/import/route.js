import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';

export async function POST(req) {
  try {
    await dbConnect();
    const { spots } = await req.json();

    if (!Array.isArray(spots) || spots.length === 0) {
      return NextResponse.json({ savedSpots: [] });
    }

    const savedSpots = [];
    
    for (const spotData of spots) {
      // Check for duplicates by name (case-insensitive)
      const existing = await Spot.findOne({ 
        name: { $regex: new RegExp(`^${spotData.name}$`, 'i') } 
      });

      if (!existing) {
        const newSpot = await Spot.create({
          ...spotData,
          college: 'BPIT',
          verified: true // Auto-verify map spots? Maybe.
        });
        savedSpots.push(newSpot);
      } else {
        savedSpots.push(existing);
      }
    }

    return NextResponse.json({ savedSpots });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
