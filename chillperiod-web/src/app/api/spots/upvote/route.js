import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import { auth } from '@/auth';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { spotId } = await req.json();
    const userId = session.user.id;

    // Check for existing upvote
    const existingInteraction = await UserInteraction.findOne({
      userId,
      spotId,
      type: 'upvote'
    });

    let spot;

    if (existingInteraction) {
      // Toggle OFF: Remove upvote
      await UserInteraction.findByIdAndDelete(existingInteraction._id);
      spot = await Spot.findByIdAndUpdate(
        spotId,
        { $inc: { upvotes: -1 } },
        { new: true }
      );
    } else {
      // Toggle ON: Add upvote
      await UserInteraction.create({
        userId,
        spotId,
        type: 'upvote'
      });
      spot = await Spot.findByIdAndUpdate(
        spotId,
        { $inc: { upvotes: 1 } },
        { new: true }
      );
    }

    return NextResponse.json({ 
      success: true, 
      upvotes: spot.upvotes, 
      isUpvoted: !existingInteraction 
    });

  } catch (error) {
    console.error('Upvote error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
