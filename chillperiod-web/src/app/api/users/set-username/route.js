import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { username, name,RZ_college, semester, section } = await request.json();

    // Validate username format
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(username)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.email !== session.user.email) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Update user with username and profile details
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        username,
        name,
        college: RZ_college,
        semester: parseInt(semester),
        section,
        hasCompletedOnboarding: true 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        hasCompletedOnboarding: true
      }
    });
  } catch (error) {
    console.error('Error setting profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

