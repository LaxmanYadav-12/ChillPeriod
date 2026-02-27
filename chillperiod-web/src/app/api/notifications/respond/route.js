
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Notification from '@/models/Notification';
import { TIMETABLE_DATA, getSchedule } from '@/lib/data/timetable';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId, action } = await req.json();

    if (!notificationId || action !== 'join') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();

    const originalNotification = await Notification.findById(notificationId);
    if (!originalNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const { subject, classType, subjects, slots, originalBunkerId } = originalNotification.metadata || {};
    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // --- TIMEFRAME-BASED BUNK LOGIC ---
    // Determine which time slots User A is bunking
    let bunkedSlots = [];
    if (slots && slots.length > 0) {
      bunkedSlots = slots;
    } else if (subjects && subjects.length > 0) {
      // Fallback: extract slots from subjects array
      bunkedSlots = subjects.map(s => s.slot).filter(Boolean);
    }

    // Get today's day name
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Get User B's schedule for today
    let userBSchedule = [];
    
    // 1. Check for custom timetable first
    if (currentUser.customTimetable?.schedule) {
      const schedule = currentUser.customTimetable.schedule instanceof Map
        ? currentUser.customTimetable.schedule.get(dayName)
        : currentUser.customTimetable.schedule[dayName];
      if (schedule) {
        userBSchedule = schedule;
      }
    }
    
    // 2. Fallback to official timetable
    if (userBSchedule.length === 0 && currentUser.semester && currentUser.section) {
      const sectionData = getSchedule(currentUser.semester, currentUser.section);
      if (sectionData?.schedule?.[dayName]) {
        userBSchedule = sectionData.schedule[dayName].map(slot => {
          // Resolve lab subjects based on user's group
          if (slot.type === 'LAB') {
            let resolvedSubject = null;
            if (currentUser.group === 'G1') resolvedSubject = slot.G1;
            else if (currentUser.group === 'G2') resolvedSubject = slot.G2;
            else resolvedSubject = slot.G1 || slot.G2; // Default to G1 if no group set
            return { ...slot, subject: resolvedSubject };
          }
          return slot;
        });
      }
    }

    // Find User B's classes in the same slots as User A's bunked classes
    let bunkedCourses = [];
    let userBSubjects = [];

    if (bunkedSlots.length > 0 && userBSchedule.length > 0) {
      // Filter User B's schedule to only classes in the bunked time slots
      const classesInBunkedSlots = userBSchedule.filter(cls => 
        bunkedSlots.includes(cls.slot) && 
        cls.type !== 'BREAK' && 
        cls.type !== 'ACTIVITY' &&
        cls.subject
      );

      // Match each class to a course in User B's course list
      for (const cls of classesInBunkedSlots) {
        const course = currentUser.courses.find(c =>
          (c.name && cls.subject && (
            c.name.toLowerCase().includes(cls.subject.toLowerCase()) ||
            cls.subject.toLowerCase().includes(c.name.toLowerCase()) ||
            (c.code && cls.subject.toLowerCase().includes(c.code.toLowerCase()))
          ))
        );

        if (course) {
          // Mark attendance as bunked
          course.totalClasses += 1;
          currentUser.totalClasses += 1;
          currentUser.totalBunks += 1;

          // Update daily log
          let logEntry = currentUser.attendanceLog.find(l => l.date === dateStr);
          if (logEntry) {
            logEntry.actions.push({ courseId: course._id, status: 'bunked' });
          } else {
            currentUser.attendanceLog.push({
              date: dateStr,
              actions: [{ courseId: course._id, status: 'bunked' }]
            });
          }

          bunkedCourses.push(course);
          userBSubjects.push({
            subject: course.name,
            type: course.type || 'Theory',
            slot: cls.slot
          });
        }
      }

      // Save User B's updated attendance
      if (bunkedCourses.length > 0) {
        await currentUser.save();
      }
    }

    // --- NOTIFICATIONS ---
    // Build display strings
    let subjectDisplay = '';
    if (userBSubjects.length > 0) {
      // Use User B's own subjects for the notification text
      const names = userBSubjects.map(s => s.subject);
      subjectDisplay = names.length > 1 
        ? names.slice(0, -1).join(', ') + ' & ' + names.slice(-1)
        : names[0];
    } else if (subjects && subjects.length > 0) {
      // Fallback to User A's subjects if no overlap found
      const names = subjects.map(s => s.subject);
      subjectDisplay = names.length > 1 
        ? names.slice(0, -1).join(', ') + ' & ' + names.slice(-1)
        : names[0];
    } else {
      subjectDisplay = `${subject} (${classType || 'Class'})`;
    }

    // 1. Notify the original bunker (User A) that User B joined
    if (originalBunkerId) {
      const joinMessage = userBSubjects.length > 0
        ? `${currentUser.name} is bunking ${subjectDisplay} with you!`
        : `${currentUser.name} wants to bunk with you!`;
        
      await Notification.create({
        userId: originalBunkerId,
        type: 'bunk_join',
        title: 'Bunk Buddy! 👯',
        message: joinMessage,
        fromUserId: currentUser._id,
        metadata: { 
          subject, 
          classType, 
          subjects: userBSubjects.length > 0 ? userBSubjects : subjects,
          bunkedCount: bunkedCourses.length
        },
        read: false
      });
    }

    // 2. CASCADE: Notify User B's followers with User B's OWN subjects
    if (currentUser.followers && currentUser.followers.length > 0) {
      // Use User B's subjects if we found overlapping classes, otherwise use original
      const cascadeSubjects = userBSubjects.length > 0 ? userBSubjects : subjects;
      const cascadeSlots = userBSubjects.length > 0 
        ? userBSubjects.map(s => s.slot).filter(Boolean)
        : (slots || []);

      const cascadeMessage = userBSubjects.length > 0
        ? `${currentUser.name} is bunking ${subjectDisplay}. Want to join?`
        : `${currentUser.name} is bunking with friends. Want to join?`;

      const cascadeNotifications = currentUser.followers.map(followerId => ({
        userId: followerId,
        type: 'mass_bunk',
        title: 'Mass Bunk Alert! 🚨',
        message: cascadeMessage,
        fromUserId: currentUser._id,
        metadata: {
          subjects: cascadeSubjects,
          slots: cascadeSlots,
          originalBunkerId: currentUser._id,
          isCascade: true
        },
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await Notification.insertMany(cascadeNotifications);
    }
    
    // Mark original notification as read
    originalNotification.read = true;
    await originalNotification.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Joined bunk and notified followers!',
      bunkedCount: bunkedCourses.length,
      bunkedSubjects: userBSubjects.map(s => s.subject)
    });

  } catch (error) {
    console.error('Respond error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
