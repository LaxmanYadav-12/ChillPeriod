
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Notification from '@/models/Notification';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, type } = await req.json(); // type: 'Theory' | 'Lab'

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Get current user's details and followers
    // 1. Get current user's details and followers
    const user = await User.findById(session.user.id).select('name followers');
    console.log('[MassBunk] Request from User:', session.user.id);
    
    if (!user) {
      console.log('[MassBunk] User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure we have a valid array of IDs
    const followerIds = user.followers ? user.followers.map(f => f.toString()) : [];
    console.log('[MassBunk] Found followers:', followerIds.length);

    if (followerIds.length === 0) {
      return NextResponse.json({ message: 'No followers to notify', count: 0 });
    }

    // 2. Create notifications for all followers
    const notifications = followerIds.map(followerId => ({
      userId: followerId, // Mongoose handles string -> ObjectId conversion
      type: 'mass_bunk',
      title: 'Mass Bunk Alert! 🚨',
      message: `${user.name} is bunking ${subject} (${type || 'Class'}). Want to join?`,
      fromUserId: user._id,
      metadata: {
        subject,
        classType: type,
        originalBunkerId: user._id,
        actionUrl: '/attendance' 
      },
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (notifications.length > 0) {
      const result = await Notification.insertMany(notifications);
      console.log('[MassBunk] Notifications inserted:', result.length);
    }

    return NextResponse.json({ 
      success: true, 
      count: notifications.length,
      message: `Notified ${notifications.length} followers` 
    });

  } catch (error) {
    console.error('Mass bunk error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
