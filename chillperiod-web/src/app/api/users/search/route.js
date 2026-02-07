
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';

export async function GET(req) {
  try {
    const session = await auth();
    // Allow public search for now, or restrict to logged in users:
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    await dbConnect();

    // Case-insensitive regex search
    const users = await User.find({
      $and: [
        { 
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        },
        // Exclude current user from results if logged in
        session ? { _id: { $ne: session.user.id } } : {}
      ]
    })
    .select('name username image totalBunks college')
    .limit(10)
    .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
