import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id).populate('following', 'name image attendanceLog favoriteSpot totalClasses attendedClasses');
    if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const friends = currentUser.following || [];
    const today = new Date().toISOString().split('T')[0];

    // Helper to calculate weekly attendance
    const getWeeklyAttendance = (attendanceLog) => {
        // Simple logic: Check last 7 days from log
        if (!attendanceLog || attendanceLog.length === 0) return 0;
        
        // Filter logs for this week (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let attended = 0;
        let total = 0;

        attendanceLog.forEach(day => {
            if (new Date(day.date) >= sevenDaysAgo) {
                day.actions.forEach(action => {
                    total++;
                    if (action.status === 'attended') attended++;
                });
            }
        });

        return total > 0 ? Math.round((attended / total) * 100) : 100; // Default to 100 if no classes
    };

    const friendActivity = friends.map(friend => {
        const weeklyAttendance = getWeeklyAttendance(friend.attendanceLog);
        
        // Check if bunked today
        const todayLog = friend.attendanceLog?.find(day => day.date === today);
        const bunkedToday = todayLog?.actions.some(action => action.status === 'bunked') || false;

        // Determine status
        let status = 'attended';
        if (bunkedToday) status = 'bunked';

        return {
            id: friend._id,
            name: friend.name,
            image: friend.image,
            attendancePercentage: weeklyAttendance,
            status: status,
            favoriteSpot: friend.favoriteSpot || { name: 'Unknown', emoji: '❓' }
        };
    });

    const friendsAbove80 = friendActivity.filter(f => f.attendancePercentage >= 80);
    const friendsBunking = friendActivity.filter(f => f.status === 'bunked');

    return NextResponse.json({
        friendsAbove80,
        friendsBunking
    });

  } catch (error) {
    console.error('Error fetching friends activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
