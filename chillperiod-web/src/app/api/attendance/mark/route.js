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
      
      // Award XP for attending
      user.xp += 10;
      user.level = Math.floor(Math.sqrt(user.xp / 10)) + 1;
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

// PATCH /api/attendance/mark — update attendance for a specific date (edit past records)
export const PATCH = withApi(
  async (req, { session, validatedData }) => {
    const { courseId, status, date } = validatedData;
    
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const course = user.courses.id(courseId);
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // Find the log entry for this date
    let logEntry = user.attendanceLog.find(l => l.date === date);
    
    // We need to act on a specific OCCURRENCE of this course on this day
    const { occurrenceIndex = 0 } = validatedData; 
    // Default to 0 if not provided (though frontend should provide it)
    
    // Find ALL actions for this course on this day to map index -> action
    let courseActionIndices = [];
    if (logEntry) {
        logEntry.actions.forEach((action, index) => {
            if (action.courseId.toString() === courseId) {
                courseActionIndices.push(index);
            }
        });
    }

    // Determine target action index in the main actions array
    let targetActionIndex = -1;
    if (occurrenceIndex < courseActionIndices.length) {
        targetActionIndex = courseActionIndices[occurrenceIndex];
    }
    
    if (targetActionIndex !== -1 && logEntry) {
      // --- UPDATE EXISTING RECORD ---
      const oldStatus = logEntry.actions[targetActionIndex].status;

      // Only proceed if status is actually changing
      if (oldStatus !== status) {
        // Revert old stats
        if (oldStatus === 'attended') {
          course.attendedClasses = Math.max(0, course.attendedClasses - 1);
          user.attendedClasses = Math.max(0, user.attendedClasses - 1);
        } else {
          user.totalBunks = Math.max(0, user.totalBunks - 1);
        }
        
        if (status === 'none') {
           // If removing, we decrement totals
           // Only assume we incremented totals if the record existed (which it did here)
           course.totalClasses = Math.max(0, course.totalClasses - 1);
           user.totalClasses = Math.max(0, user.totalClasses - 1);
           
           // Remove action
           logEntry.actions.splice(targetActionIndex, 1);
           
        } else {
           // Apply new stats
           if (status === 'attended') {
             course.attendedClasses += 1;
             user.attendedClasses += 1;

             // Award XP for attending
             user.xp += 10;
             user.level = Math.floor(Math.sqrt(user.xp / 10)) + 1;
           } else {
             user.totalBunks += 1;
           }
           // Update the action
           logEntry.actions[targetActionIndex].status = status;
        }
      }
    } else {
      // --- CREATE NEW RECORD ---
      // We only create if:
      // 1. status is NOT 'none'
      // 2. We are asking for the NEXT available slot (e.g., if existing length is 1, asking for index 1 makes sense)
      //    Asking for index 5 when only 0 exist is weird but let's just treat it as "add new"
      
      if (status !== 'none') {
          // Check constraint: Can only add new record if we are targeting a new index
          // Basically just push a new one.
          
          course.totalClasses += 1;
          user.totalClasses += 1;

          if (status === 'attended') {
            course.attendedClasses += 1;
            user.attendedClasses += 1;

            // Award XP for attending
            user.xp += 10;
            user.level = Math.floor(Math.sqrt(user.xp / 10)) + 1;
          } else {
            user.totalBunks += 1;
          }

          if (logEntry) {
            logEntry.actions.push({ courseId, status });
          } else {
            user.attendanceLog.push({
              date,
              actions: [{ courseId, status }]
            });
          }
      }
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
