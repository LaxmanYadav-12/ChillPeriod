import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { userProfileSchema } from '@/lib/validators';

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = userProfileSchema.parse(body);
    const { username, name, RZ_college, semester, section } = validatedData;

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
    if (error.name === 'ZodError') {
         return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
