import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';

export async function GET() {
  try {
    await dbConnect();

    // 1. Reset all spots to 0
    const result = await Spot.updateMany({}, { 
      $set: { upvotes: 0, downvotes: 0 } 
    });

    // 2. Clear all user interactions (votes)
    await UserInteraction.deleteMany({ type: { $in: ['upvote', 'downvote'] } });

    return NextResponse.json({ 
      message: 'All votes reset successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
