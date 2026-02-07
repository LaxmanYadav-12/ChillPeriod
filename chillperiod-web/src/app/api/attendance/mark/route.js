
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';

// POST /api/attendance/mark
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { courseId, status, date } = await req.json(); // status: 'attended' | 'bunked'

    if (!courseId || !status || !date) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 1. Find the course
    const course = user.courses.id(courseId);
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // 2. Update Course Stats
    course.totalClasses += 1;
    if (status === 'attended') {
        course.attendedClasses += 1;
    }

    // 3. Update User Global Stats
    user.totalClasses += 1;
    if (status === 'attended') {
        user.attendedClasses += 1;
    } else {
        user.totalBunks += 1;
    }

    // 4. Update Daily Log
    // Check if log entry for this date exists
    let logEntry = user.attendanceLog.find(l => l.date === date);
    
    if (logEntry) {
        logEntry.actions.push({ courseId, status });
    } else {
        user.attendanceLog.push({
            date,
            actions: [{ courseId, status }]
        });
    }

    await user.save();

    return NextResponse.json({ 
        success: true, 
        course: course,
        userStats: {
            totalClasses: user.totalClasses,
            attendedClasses: user.attendedClasses,
            totalBunks: user.totalBunks
        }
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
