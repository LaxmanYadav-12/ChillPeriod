import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.toLowerCase();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Check if username is valid format
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(username)) {
      return NextResponse.json({ available: false, error: 'Invalid format' });
    }

    const existingUser = await User.findOne({ username });
    
    return NextResponse.json({ 
      available: !existingUser,
      username 
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
