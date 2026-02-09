import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'followers' or 'following'

    if (!['followers', 'following'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type requested' }, { status: 400 });
    }

    const user = await User.findById(id).populate({
      path: type,
      select: 'name username image college',
      model: User
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[type] || []);
  } catch (error) {
    console.error('Error fetching follow details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
