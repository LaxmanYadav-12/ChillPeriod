import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/leaderboard - Get bunk leaderboard
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    const users = await User.find({ isPublic: true, totalBunks: { $gt: 0 } })
      .select('name username image totalBunks attendedClasses totalClasses favoriteSpot')
      .sort({ totalBunks: -1 })
      .limit(limit)
      .lean();
    
    // Add rank and title to each user
    const leaderboard = users.map((user, index) => {
      const bunks = user.totalBunks;
      let title, emoji;
      
      if (bunks >= 100) { title = 'Bunk Legend'; emoji = '👑'; }
      else if (bunks >= 50) { title = 'Bunk King'; emoji = '🏆'; }
      else if (bunks >= 25) { title = 'Serial Skipper'; emoji = '😴'; }
      else if (bunks >= 10) { title = 'Chill Master'; emoji = '😎'; }
      else if (bunks >= 5) { title = 'Casual Bunker'; emoji = '🌴'; }
      else { title = 'Rookie'; emoji = '🌱'; }
      
      return {
        ...user,
        rank: index + 1,
        title,
        titleEmoji: emoji,
        attendancePercentage: user.totalClasses > 0 
          ? Math.round((user.attendedClasses / user.totalClasses) * 100) 
          : 100
      };
    });
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
