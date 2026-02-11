import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { withApi } from '@/lib/security/apiHandler';
import { attendanceSchema } from '@/lib/validators';

// POST /api/attendance/mark — mark attendance for a course (auth + validated)
export const POST = withApi(
  async (req, { session, validatedData }) => {
    const { courseId, status, date } = validatedData;

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
  },
  { auth: true, schema: attendanceSchema, rateLimit: 'write' }
);
