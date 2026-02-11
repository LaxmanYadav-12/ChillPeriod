import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { escapeRegex } from '@/lib/security/sanitize';

// GET /api/users/search — search users by username (public)
// SECURITY: Regex escape prevents injection, limit capped
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2 || query.length > 50) {
      return NextResponse.json({ users: [] });
    }

    await dbConnect();

    // SECURITY: Escape regex special characters to prevent ReDoS / injection
    const safeQuery = escapeRegex(query);

    const users = await User.find({
      username: { $regex: safeQuery, $options: 'i' }
    })
    .select('name username image totalBunks college')
    .limit(10)
    .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[user search]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
