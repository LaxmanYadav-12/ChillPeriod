import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import { withApi } from '@/lib/security/apiHandler';
import { voteActionSchema } from '@/lib/validators';

// POST /api/spots/upvote — vote on a spot (auth required, validated)
export const POST = withApi(
  async (req, { session, validatedData }) => {
    await dbConnect();
    const { spotId, action } = validatedData;
    const userId = session.user.id;

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
        // Same action → toggle OFF (remove vote)
        await UserInteraction.findByIdAndDelete(existingInteraction._id);
        spot = await Spot.findByIdAndUpdate(
          spotId,
          { $inc: { [action + 's']: -1 } },
          { new: true }
        );
      } else {
        // Different action → switch vote
        await UserInteraction.findByIdAndDelete(existingInteraction._id);
        await UserInteraction.create({ userId, spotId, type: action });
        
        const incUpdate = { 
          [existingInteraction.type + 's']: -1,
          [action + 's']: 1
        };

        spot = await Spot.findByIdAndUpdate(
          spotId,
          { $inc: incUpdate },
          { new: true }
        );
        newInteractionType = action;
      }
    } else {
      // No existing vote → add new
      await UserInteraction.create({ userId, spotId, type: action });
      spot = await Spot.findByIdAndUpdate(
        spotId,
        { $inc: { [action + 's']: 1 } },
        { new: true }
      );
      newInteractionType = action;
    }

    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      upvotes: spot.upvotes, 
      downvotes: spot.downvotes,
      userVote: newInteractionType
    });
  },
  { auth: true, schema: voteActionSchema, rateLimit: 'write' }
);
