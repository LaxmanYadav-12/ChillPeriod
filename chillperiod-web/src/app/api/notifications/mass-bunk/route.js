
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

    await dbConnect();

    // Fetch the current user from DB
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { subject, type, subjects } = await req.json();

    if (!subject && (!subjects || subjects.length === 0)) {
       return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    // Get follower IDs from the user's followers array
    const followerIds = user.followers || [];

    if (followerIds.length === 0) {
      return NextResponse.json({ 
        success: true, 
        count: 0, 
        message: 'No followers to notify' 
      });
    }

    let messageStr = '';
    let metadataObj = {};

    if (subjects && subjects.length > 0) {
        // Multiple subjects (Mass Bunk)
        const names = subjects.map(s => s.subject);
        const subjectList = names.length > 1 
            ? names.slice(0, -1).join(', ') + ' & ' + names.slice(-1)
            : names[0];
        
        messageStr = `${user.name} is bunking ${subjectList}. Want to join?`;
        metadataObj = {
            subjects,
            originalBunkerId: user._id,
            actionUrl: '/attendance'
        };
    } else {
        // Single subject
        messageStr = `${user.name} is bunking ${subject} (${type || 'Class'}). Want to join?`;
        metadataObj = {
            subject,
            classType: type,
            originalBunkerId: user._id,
            actionUrl: '/attendance'
        };
    }

    const notifications = followerIds.map(followerId => ({
      userId: followerId,
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
