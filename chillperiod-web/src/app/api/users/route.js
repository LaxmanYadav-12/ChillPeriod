import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { escapeRegex } from '@/lib/security/sanitize';

// GET /api/users — search/list public users
// SECURITY: Regex escape, limit capped to 100
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    // SECURITY: Clamp limit to prevent excessive data retrieval
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    
    let query = { isPublic: true };
    
    if (search) {
      // SECURITY: Escape regex special characters to prevent injection
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { username: { $regex: safeSearch, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('name username image totalBunks attendedClasses totalClasses favoriteSpot')
      .limit(limit)
      .lean();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('[users GET]', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
