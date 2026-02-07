
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';

// GET /api/courses - Get all courses
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id).select('courses attendanceLog');
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
        courses: user.courses,
        attendanceLog: user.attendanceLog
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/courses - Add a new course
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, code, totalClasses, attendedClasses, targetPercentage } = body;

    if (!name) return NextResponse.json({ error: 'Course name is required' }, { status: 400 });

    await dbConnect();
    
    const newCourse = {
      name,
      code: code || '',
      totalClasses: Number(totalClasses) || 0,
      attendedClasses: Number(attendedClasses) || 0,
      targetPercentage: Number(targetPercentage) || 75
    };

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { courses: newCourse } },
      { new: true }
    );

    // Return the newly added course (it will be the last one)
    const addedCourse = user.courses[user.courses.length - 1];
    return NextResponse.json(addedCourse);

  } catch (error) {
    console.error('Error adding course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/courses - Update a course
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { courseId, name, code, totalClasses, attendedClasses } = body;

    if (!courseId) return NextResponse.json({ error: 'Course ID required' }, { status: 400 });

    await dbConnect();

    // Update specific fields in the courses array
    const updateFields = {};
    if (name) updateFields['courses.$.name'] = name;
    if (code !== undefined) updateFields['courses.$.code'] = code;
    if (totalClasses !== undefined) updateFields['courses.$.totalClasses'] = Number(totalClasses);
    if (attendedClasses !== undefined) updateFields['courses.$.attendedClasses'] = Number(attendedClasses);

    const user = await User.findOneAndUpdate(
      { _id: session.user.id, "courses._id": courseId },
      { $set: updateFields },
      { new: true }
    ).select('courses');

    if (!user) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const updatedCourse = user.courses.find(c => c._id.toString() === courseId);
    return NextResponse.json(updatedCourse);

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/courses - Delete a course (pass ID in query params)
export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('id');

        if (!courseId) return NextResponse.json({ error: 'Course ID required' }, { status: 400 });

        await dbConnect();
        
        await User.findByIdAndUpdate(
            session.user.id,
            { $pull: { courses: { _id: courseId } } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
