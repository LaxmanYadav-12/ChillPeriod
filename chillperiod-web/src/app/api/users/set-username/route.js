import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { userProfileSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

// POST /api/users/set-username — set profile during onboarding (auth + validated)
export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    // SECURITY: Validate with Zod schema (.strict() rejects unexpected fields)
    const result = userProfileSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 });
    }

    const { username, name, RZ_college, semester, section, group } = result.data;

    // Validate username format (lowercase only for storage)
    const lowerUsername = username.toLowerCase();
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(lowerUsername)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username: lowerUsername });
    if (existingUser && existingUser.email !== session.user.email) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Update user with username and profile details
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        username: lowerUsername,
        name,
        college: RZ_college,
        semester: parseInt(semester),
        section,
        group,
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
    console.error('[set-username]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
