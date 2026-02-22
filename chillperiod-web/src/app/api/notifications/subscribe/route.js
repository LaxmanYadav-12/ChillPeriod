import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    await dbConnect();

    // Check if this endpoint already exists for the user to avoid duplicates
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const exists = user.pushSubscriptions?.some(sub => sub.endpoint === subscription.endpoint);
    
    if (!exists) {
      await User.findByIdAndUpdate(session.user.id, {
        $push: { pushSubscriptions: subscription }
      });
    }

    return NextResponse.json({ message: 'Subscription saved successfully' }, { status: 201 });

  } catch (error) {
    console.error('[Subscribe API Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
