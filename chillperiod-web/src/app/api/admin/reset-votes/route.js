import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';

import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

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
