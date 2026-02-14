
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

    const { notificationId, action } = await req.json();

    if (!notificationId || action !== 'join') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();

    const originalNotification = await Notification.findById(notificationId);
    if (!originalNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const { subject, classType, originalBunkerId } = originalNotification.metadata || {};
    const currentUser = await User.findById(session.user.id).select('name followers');

    // 1. Notify the original bunker (User A) that Current User (User B) joined
    if (originalBunkerId) {
      await Notification.create({
        userId: originalBunkerId,
        type: 'bunk_join',
        title: 'Bunk Buddy! 👯',
        message: `${currentUser.name} is bunking ${subject} with you!`,
        fromUserId: currentUser._id,
        metadata: { subject, classType },
        read: false
      });
    }

    // 2. CASCADE: Notify Current User's (User B) followers
    // "User B is bunking [Subject]. Want to join?"
    if (currentUser.followers && currentUser.followers.length > 0) {
      const cascadeNotifications = currentUser.followers.map(followerId => ({
        userId: followerId,
        type: 'mass_bunk', // Same type to allow further cascading!
        title: 'Mass Bunk Alert! 🚨',
        message: `${currentUser.name} is bunking ${subject} (${classType || 'Class'}). Want to join?`,
        fromUserId: currentUser._id,
        metadata: {
          subject,
          classType,
          originalBunkerId: currentUser._id, // Chain continues from current user
          isCascade: true
        },
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await Notification.insertMany(cascadeNotifications);
    }
    
    // Mark original notification as read/handled (optional, but good UX)
    originalNotification.read = true;
    await originalNotification.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Joined bunk and notified followers!' 
    });

  } catch (error) {
    console.error('Respond error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
