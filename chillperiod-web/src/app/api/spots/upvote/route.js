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
    const { spotId, action } = await req.json(); // action: 'upvote' or 'downvote'
    const userId = session.user.id;

    if (!['upvote', 'downvote'].includes(action)) {
       return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Check for existing interaction (vote)
    const existingInteraction = await UserInteraction.findOne({
      userId,
      spotId,
      type: { $in: ['upvote', 'downvote'] }
    });

    let spot;
    let newInteractionType = null;

    if (existingInteraction) {
      if (existingInteraction.type === action) {
        // Same action? Toggle OFF (Remove vote)
        await UserInteraction.findByIdAndDelete(existingInteraction._id);
        spot = await Spot.findByIdAndUpdate(
          spotId,
          { $inc: { [action + 's']: -1 } }, // decrements upvotes or downvotes
          { new: true }
        );
      } else {
        // Different action? Switch Vote (e.g. up -> down)
        // 1. Remove old vote
        await UserInteraction.findByIdAndDelete(existingInteraction._id);
        // 2. Add new vote interaction
        await UserInteraction.create({ userId, spotId, type: action });
        
        // 3. Update Spot counts
        const incUpdate = { 
            [existingInteraction.type + 's']: -1, // decrement old
            [action + 's']: 1 // increment new
        };

        spot = await Spot.findByIdAndUpdate(
          spotId,
          { $inc: incUpdate },
          { new: true }
        );
        newInteractionType = action;
      }
    } else {
      // No existing vote? Add new vote
      await UserInteraction.create({ userId, spotId, type: action });
      spot = await Spot.findByIdAndUpdate(
        spotId,
        { $inc: { [action + 's']: 1 } },
        { new: true }
      );
      newInteractionType = action;
    }

    return NextResponse.json({ 
      success: true, 
      upvotes: spot.upvotes, 
      downvotes: spot.downvotes,
      userVote: newInteractionType // 'upvote', 'downvote', or null
    });

  } catch (error) {
    console.error('Upvote error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
