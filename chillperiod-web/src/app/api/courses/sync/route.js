import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getSubjectsForSection, getSubjectsFromCustomTimetable } from '@/lib/utils/timetableUtils';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get fresh user data to ensure we have the correct semester/section
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prefer custom timetable subjects over hardcoded ones
    let subjects = [];
    if (user.customTimetable?.schedule) {
      subjects = getSubjectsFromCustomTimetable(user.customTimetable);
    } else {
      const { semester, section, group } = user;
      if (!semester || !section) {
        return NextResponse.json({ error: 'Profile incomplete' }, { status: 400 });
      }
      subjects = getSubjectsForSection(semester, section, group);
    }
    
    if (subjects.length === 0) {
         return NextResponse.json({ message: 'No subjects found in timetable', count: 0 });
    }

    // Filter out subjects that already exist
    const existingCourseNames = new Set(user.courses.map(c => c.name));
    const newCourses = subjects.filter(s => !existingCourseNames.has(s.name)).map(s => ({
        name: s.name,
        type: s.type,
        totalClasses: 0,
        attendedClasses: 0,
        targetPercentage: 75
    }));

    if (newCourses.length > 0) {
        user.courses.push(...newCourses);
        await user.save();
    }

    return NextResponse.json({ 
        success: true, 
        added: newCourses.length,
        courses: user.courses 
    });

  } catch (error) {
    console.error('Error syncing courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
