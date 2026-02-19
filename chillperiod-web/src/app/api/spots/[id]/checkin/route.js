import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import { auth } from '@/auth';

const THREE_HOURS = 3 * 60 * 60 * 1000;

// POST /api/spots/[id]/checkin — Toggle check-in at a spot
export async function POST(req, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();
    const { id: spotId } = await context.params;
    const userId = session.user.id;
    const now = new Date();
    const cutoff = new Date(now.getTime() - THREE_HOURS);

    // Find the spot
    const spot = await Spot.findById(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Clean expired check-ins
    spot.checkins = (spot.checkins || []).filter(c => new Date(c.checkedInAt) > cutoff);

    // Check if user already checked in at THIS spot
    const existingIdx = spot.checkins.findIndex(c => c.userId.toString() === userId);

    if (existingIdx !== -1) {
      // Already checked in → check out
      spot.checkins.splice(existingIdx, 1);
      await spot.save();

      return NextResponse.json({
        success: true,
        action: 'checkout',
        activeCount: spot.checkins.length,
        isCheckedIn: false
      });
    }

    // Remove user's check-in from any OTHER spot
    await Spot.updateMany(
      { _id: { $ne: spotId }, 'checkins.userId': userId },
      { $pull: { checkins: { userId } } }
    );

    // Check in at this spot
    spot.checkins.push({
      userId,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image || null,
      checkedInAt: now
    });
    await spot.save();

    return NextResponse.json({
      success: true,
      action: 'checkin',
      activeCount: spot.checkins.length,
      isCheckedIn: true
    });

  } catch (error) {
    console.error('[checkin POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
