import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/auth';
import { withApi } from '@/lib/security/apiHandler';
import { courseCreateSchema, courseUpdateSchema } from '@/lib/validators';
import { isValidObjectId } from '@/lib/security/sanitize';

// GET /api/courses — Get all courses for the logged-in user
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id).select('courses attendanceLog').lean();
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      courses: user.courses,
      attendanceLog: user.attendanceLog
    });
  } catch (error) {
    console.error('[courses GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/courses — Add a new course (auth + validated)
export const POST = withApi(
  async (req, { session, validatedData }) => {
    await dbConnect();
    
    const newCourse = {
      name: validatedData.name,
      code: validatedData.code,
      type: validatedData.type,
      totalClasses: validatedData.totalClasses,
      attendedClasses: validatedData.attendedClasses,
      targetPercentage: validatedData.targetPercentage,
    };

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { courses: newCourse } },
      { new: true }
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const addedCourse = user.courses[user.courses.length - 1];
    return NextResponse.json(addedCourse);
  },
  { auth: true, schema: courseCreateSchema, rateLimit: 'write' }
);

// PATCH /api/courses — Update a course (auth + validated)
export const PATCH = withApi(
  async (req, { session, validatedData }) => {
    const { courseId, name, code, type, totalClasses, attendedClasses } = validatedData;

    await dbConnect();

    const updateFields = {};
    if (name) updateFields['courses.$.name'] = name;
    if (code !== undefined) updateFields['courses.$.code'] = code;
    if (type) updateFields['courses.$.type'] = type;
    if (totalClasses !== undefined) updateFields['courses.$.totalClasses'] = totalClasses;
    if (attendedClasses !== undefined) updateFields['courses.$.attendedClasses'] = attendedClasses;

    const user = await User.findOneAndUpdate(
      { _id: session.user.id, "courses._id": courseId },
      { $set: updateFields },
      { new: true }
    ).select('courses');

    if (!user) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const updatedCourse = user.courses.find(c => c._id.toString() === courseId);
    return NextResponse.json(updatedCourse);
  },
  { auth: true, schema: courseUpdateSchema, rateLimit: 'write' }
);

// DELETE /api/courses — Delete a course (auth required, ID validated)
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('id');

    // SECURITY: Validate ObjectId format
    if (!courseId || !isValidObjectId(courseId)) {
      return NextResponse.json({ error: 'Valid Course ID required' }, { status: 400 });
    }

    await dbConnect();
    
    await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { courses: { _id: courseId } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[courses DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
