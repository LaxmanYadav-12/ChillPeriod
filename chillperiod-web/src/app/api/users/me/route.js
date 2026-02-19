import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';

// GET /api/users/me — returns current user's profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id)
      .select('name username image college semester section group role')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ...user, _id: user._id.toString() });
  } catch (error) {
    console.error('[users/me]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
