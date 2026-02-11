import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import Notification from '@/models/Notification';
import { withApi } from '@/lib/security/apiHandler';
import { notificationPatchSchema } from '@/lib/validators';

// GET /api/notifications — fetch user's notifications (auth required)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const filter = { userId: session.user.id };
    if (unreadOnly) filter.read = false;

    const notifications = await Notification.find(filter)
      .populate('fromUserId', 'name image username')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ 
      userId: session.user.id, 
      read: false 
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('[notifications GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications as read (auth + validated)
export const PATCH = withApi(
  async (req, { session, validatedData }) => {
    await dbConnect();

    if (validatedData.markAll) {
      await Notification.updateMany(
        { userId: session.user.id, read: false },
        { $set: { read: true } }
      );
    } else if (validatedData.notificationId) {
      // SECURITY: Filter by userId to prevent marking other users' notifications
      await Notification.findOneAndUpdate(
        { _id: validatedData.notificationId, userId: session.user.id },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ success: true });
  },
  { auth: true, schema: notificationPatchSchema, rateLimit: 'write' }
);
