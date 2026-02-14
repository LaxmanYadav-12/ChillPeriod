
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

    // 2. Create notifications for all followers
    const { subject, type, subjects } = await req.json(); // Support both single and multiple

    if (!subject && (!subjects || subjects.length === 0)) {
       return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    let messageStr = '';
    let metadataObj = {};

    if (subjects && subjects.length > 0) {
        // Multiple subjects
        const names = subjects.map(s => s.subject);
        const subjectList = names.length > 1 
            ? names.slice(0, -1).join(', ') + ' & ' + names.slice(-1)
            : names[0];
        
        messageStr = `${user.name} is bunking ${subjectList}. Want to join?`;
        metadataObj = {
            subjects, // Store array
            originalBunkerId: user._id,
            actionUrl: '/attendance'
        };
    } else {
        // Single subject (Legacy/Single Bunk)
        messageStr = `${user.name} is bunking ${subject} (${type || 'Class'}). Want to join?`;
        metadataObj = {
            subject,
            classType: type,
            originalBunkerId: user._id,
            actionUrl: '/attendance'
        };
    }

    const notifications = followerIds.map(followerId => ({
      userId: followerId, // Mongoose handles string -> ObjectId conversion
      type: 'mass_bunk',
      title: 'Mass Bunk Alert! 🚨',
      message: messageStr,
      fromUserId: user._id,
      metadata: metadataObj,
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
