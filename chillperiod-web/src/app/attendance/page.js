'use client';

import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import FriendsActivity from '@/components/FriendsActivity';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AttendanceTrendChart from '@/components/charts/AttendanceTrendChart';
import SubjectPieChart from '@/components/charts/SubjectPieChart';
import MonthlyBarChart from '@/components/charts/MonthlyBarChart';
import { excusesData } from '@/lib/data/excuses';
import { TIMETABLE_DATA } from '@/lib/data/timetable';

const initialCourses = [
  { id: 1, name: "Data Structures", code: "CS201", total: 15, attended: 12 },
  { id: 2, name: "Database Systems", code: "CS301", total: 12, attended: 10 },
  { id: 3, name: "Web Development", code: "CS401", total: 13, attended: 10 },
  { id: 4, name: "Mathematics III", code: "MA201", total: 10, attended: 8 },
  { id: 5, name: "Soft Skills", code: "HS101", total: 8, attended: 8 },
];

const categoryEmojis = {
  cafe: '☕', restaurant: '🍕', street_food: '🌭',
  park: '🌳', library: '📚', shopping: '🛍️',
  gaming: '🎮', sweet_shop: '🍬', other: '📍',
  arcade: '🕹️', mall: '🏬'
};

function getStats(total, attended, required) {
  if (total === 0) {
    return { percentage: 0, safeToBunk: 0, needToAttend: 0, status: 'neutral' };
  }
  const percentage = Math.round((attended / total) * 100);
  const safeToBunk = Math.max(0, Math.floor((attended * 100 / required) - total));
  const needToAttend = percentage >= required ? 0 : Math.ceil((required * total - 100 * attended) / (100 - required));
  let status = 'safe';
  if (percentage < required) status = 'danger';
  else if (percentage < required + 10) status = 'caution';
  return { percentage, safeToBunk, needToAttend, status };
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function AttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Optional: You could show a toast here for guest users
    if (status === 'unauthenticated') {
      console.log('Running in Guest Mode');
    }
  }, [status]);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requiredPercentage] = useState(75);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBunkModal, setShowBunkModal] = useState(false);
  const [showMassBunkModal, setShowMassBunkModal] = useState(false);
  const [massBunkSelection, setMassBunkSelection] = useState(new Set());
  const [bunkingCourse, setBunkingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', type: 'Theory', total: 0, attended: 0 });
  const [chillSpots, setChillSpots] = useState([]);
  
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [attendanceLog, setAttendanceLog] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Excuse Generator State
  const [excuseTone, setExcuseTone] = useState('funny');
  const [generatedExcuse, setGeneratedExcuse] = useState('');
  
  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [todaysClasses, setTodaysClasses] = useState([]);

  useEffect(() => {
    if (session?.user?.semester && session?.user?.section) {
        const { semester, section } = session.user;
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        const sectionData = TIMETABLE_DATA.sections.find(
            s => s.semester === semester && s.section === section
        );

        if (sectionData && sectionData.schedule[dayName]) {
            setTodaysClasses(sectionData.schedule[dayName]);
        }
    }
  }, [session]);

  const generateExcuse = () => {
    const tones = excusesData.tones[excuseTone];
    const randomExcuse = tones[Math.floor(Math.random() * tones.length)];
    setGeneratedExcuse(randomExcuse);
  };
  
  // Fetch courses on load
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourses();
      fetchSpots();
    } else if (status === 'unauthenticated') {
      // Keep demo data for guests if needed, or clear it
      setLoading(false);
      // We could seed some dummy spots for guest mode if desired, or just leave empty
    }
  }, [status]);

  const fetchSpots = async () => {
    try {
      const res = await fetch('/api/spots');
      if (res.ok) {
        const data = await res.json();
        // Map _id to id for consistency
        setChillSpots(data.map(s => ({ ...s, id: s._id })));
      }
    } catch (error) {
      console.error('Failed to fetch spots', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        // data = { courses: [], attendanceLog: [] }
        const coursesData = data.courses || [];
        setCourses(coursesData.map(c => ({ ...c, id: c._id }))); 
        
        // Process attendanceLog for the calendar
        // Backend format: [{ date: "YYYY-MM-DD", actions: [...] }]
        // Frontend format: { "YYYY-MM-DD": { attended: X, bunked: Y, courses: { id: { status } } } }
        const logMap = {};
        
        // Create a Set of active course IDs for efficient lookup
        const activeCourseIds = new Set(coursesData.map(c => c._id));

        if (data.attendanceLog) {
            data.attendanceLog.forEach(day => {
                const dateKey = day.date; // already YYYY-MM-DD strings?
                
                // Filter actions to only include those for active courses
                const activeActions = day.actions.filter(action => activeCourseIds.has(action.courseId));
                
                // Construct the daily stats only from active actions
                let attendedCount = 0;
                let bunkedCount = 0;
                const courseStatus = {};
                
                activeActions.forEach(action => {
                    if (action.status === 'attended') attendedCount++;
                    if (action.status === 'bunked') bunkedCount++;
                    courseStatus[action.courseId] = { 
                        attended: action.status === 'attended',
                        bunked: action.status === 'bunked'
                    };
                });

                // Only add to logMap if there are active actions, or if we want to show empty days?
                // Actually, the calendar iterates over days and checks logMap[dateKey]. 
                // If we have 0 actions, it might be better to just not have an entry, OR have an entry with 0.
                if (activeActions.length > 0) {
                    logMap[dateKey] = {
                        attended: attendedCount,
                        bunked: bunkedCount,
                        courses: courseStatus,
                        actions: activeActions // Store raw actions for detailed modal view
                    };
                }
            });
            setAttendanceLog(logMap);
        }
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = getCalendarDays(calendarYear, calendarMonth);
  const totalClasses = courses.reduce((sum, c) => sum + c.totalClasses, 0); // Note: API uses totalClasses
  const attendedClasses = courses.reduce((sum, c) => sum + c.attendedClasses, 0);
  const overallStats = getStats(totalClasses, attendedClasses, requiredPercentage);

  const inititateBunk = (course) => {
    setBunkingCourse(course);
    setShowBunkModal(true);
  };

  const handleMassBunk = async (course) => {
    // Simple confirmation or toast could be better, trying simple text for now
    // Maybe better to put this button INSIDE the Bunk Modal? 
    // "Bunking? [Confirm Bunk] [Mass Bunk Alert]"
    // But user asked for "Mass Bunk" button. 
    // Let's call API directly.
    try {
        const res = await fetch('/api/notifications/mass-bunk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: course.name,
                type: course.type
            })
        });
        if (res.ok) {
            const data = await res.json();
            alert(`Mass Bunk Alert Sent to ${data.count} followers! 🚨`);
        }
    } catch (err) {
        console.error('Mass bunk failed', err);
    }
  };

  const markAttendance = async (courseId, status, spot = null) => {
    // Optimistic UI update
    setCourses(prev => prev.map(c => {
        if (c.id === courseId) {
            return {
                ...c,
                totalClasses: c.totalClasses + 1,
                attendedClasses: status === 'attended' ? c.attendedClasses + 1 : c.attendedClasses
            };
        }
        return c;
    }));

    // Call API
    try {
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        await fetch('/api/attendance/mark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                courseId, 
                status, 
                date: dateStr 
            })
        });
        
        // Update local log for calendar
        const dateKey = dateStr; // dateStr is already YYYY-MM-DD padded
        setAttendanceLog(prev => ({  
            ...prev, 
            [dateKey]: { 
                ...prev[dateKey], 
                [status]: (prev[dateKey]?.[status] || 0) + 1 
            } 
        }));

    } catch (error) {
        console.error('Failed to mark attendance', error);
        // Revert optimistic update if needed (omitted for brevity)
    }

    if (spot) {
      if (spot.googleMapsUrl) {
        window.open(spot.googleMapsUrl, '_blank');
      } else if (spot.coordinates && spot.coordinates.lat && spot.coordinates.lng) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${spot.coordinates.lat},${spot.coordinates.lng}`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + (spot.address || ''))}`, '_blank');
      }
    }
  };

  const handleDateEdit = async (courseId, newStatus, dateObj, occurrenceIndex = 0) => {
    const dateStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
    
    // Optimistic Update
    const prevSelectedDate = selectedDate;
    
    const newSelectedDate = { 
        ...selectedDate, 
        log: { 
            ...selectedDate.log, 
            actions: [...(selectedDate.log?.actions || [])] 
        } 
    };
    
    // Find actions for this course
    const courseActionsIndices = [];
    newSelectedDate.log.actions.forEach((action, idx) => {
        if (action.courseId === courseId) {
            courseActionsIndices.push(idx);
        }
    });
    
    const targetActionIndex = courseActionsIndices[occurrenceIndex];
    
    // Check current status to toggle
    let finalStatus = newStatus;
    if (targetActionIndex !== undefined) {
         const currentStatus = newSelectedDate.log.actions[targetActionIndex].status;
         if (currentStatus === newStatus) {
             finalStatus = 'none'; // Toggle off
         }
    }
    
    if (finalStatus === 'none') {
        // Remove action if it exists
        if (targetActionIndex !== undefined) {
             newSelectedDate.log.actions.splice(targetActionIndex, 1);
        }
    } else {
        // Update or Add
        if (targetActionIndex !== undefined) {
            // Update existing
            newSelectedDate.log.actions[targetActionIndex] = {
                ...newSelectedDate.log.actions[targetActionIndex],
                status: finalStatus
            };
        } else {
            // Add new
            newSelectedDate.log.actions.push({
                courseId,
                status: finalStatus,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    setSelectedDate(newSelectedDate); // Update UI immediately

    // API Call
    try {
        await fetch('/api/attendance/mark', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                courseId, 
                status: finalStatus, 
                date: dateStr,
                occurrenceIndex
            })
        });
        
        // Refresh data to ensure consistency and update global stats
        fetchCourses();
        
    } catch (error) {
        console.error('Failed to update attendance', error);
        setSelectedDate(prevSelectedDate); // Revert on error
    }
  };

  const confirmBunk = (spot) => {
    if (bunkingCourse) {
        markAttendance(bunkingCourse.id, 'bunked', spot);
    }
    setShowBunkModal(false);
    setBunkingCourse(null);
  };

  const handleAttend = (courseId) => {
    markAttendance(courseId, 'attended');
  };

  const handleAddCourse = async () => {
    if (!newCourse.name.trim()) {
        alert("Please enter a subject name.");
        return;
    }
    
    try {
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newCourse.name,
                code: newCourse.code,
                type: newCourse.type,
                totalClasses: Number(newCourse.total) || 0,
                attendedClasses: Number(newCourse.attended) || 0
            })
        });

        if (res.ok) {
            const addedCourse = await res.json();
            setCourses(prev => [...prev, { ...addedCourse, id: addedCourse._id }]);
            setNewCourse({ name: '', code: '', type: 'Theory', total: 0, attended: 0 });
            setShowAddModal(false);
            // alert("Subject added successfully!"); 
        } else {
            const err = await res.json();
            alert(`Failed to add subject: ${err.error}`);
            console.error(err);
        }
    } catch (error) {
        console.error('Failed to add course', error);
        alert("Something went wrong. Check console.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    // Optimistic
    setCourses(prev => prev.filter(c => c.id !== courseId));
    try {
        await fetch(`/api/courses?id=${courseId}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Failed to delete course', error);
    }
  };

  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Open modal with pre-filled data
  const initiateEdit = (course) => {
    setEditingCourse({ 
        ...course, 
        // Ensure numbers
        totalClasses: course.totalClasses || 0,
        attendedClasses: course.attendedClasses || 0
    });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !editingCourse.name.trim()) return;

    try {
        const res = await fetch('/api/courses', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                courseId: editingCourse.id,
                name: editingCourse.name,
                code: editingCourse.code,
                totalClasses: Number(editingCourse.totalClasses),
                attendedClasses: Number(editingCourse.attendedClasses)
            })
        });

        if (res.ok) {
            const updated = await res.json();
            // Update UI list
            setCourses(prev => prev.map(c => c.id === updated._id ? { ...updated, id: updated._id } : c));
            setShowEditModal(false);
            setEditingCourse(null);
        } else {
            const err = await res.json();
            alert(`Failed to update: ${err.error}`);
        }
    } catch (error) {
        console.error('Failed to update course', error);
        alert('Failed to update course');
    }
  };

  const upvoteSpot = async (spotId, e) => {
    e.stopPropagation();
    
    // Find spot to check current status
    const spot = chillSpots.find(s => s.id === spotId);
    if (!spot) return;

    // Optimistic Update
    setChillSpots(prev => prev.map(s => {
        if (s.id === spotId) {
            let newUpvotes = s.upvotes || 0;
            let newIsUpvoted = s.isUpvoted;

            if (newIsUpvoted) {
                 newUpvotes--;
                 newIsUpvoted = false;
            } else {
                 newUpvotes++;
                 newIsUpvoted = true;
            }
            return { ...s, upvotes: newUpvotes, isUpvoted: newIsUpvoted };
        }
        return s;
    }));

    try {
        const res = await fetch('/api/spots/upvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spotId, action: 'upvote' })
        });
        
        if (!res.ok) {
            console.error('Vote failed');
            // Revert if needed
        }
    } catch (error) {
        console.error('Vote error', error);
    }
  };

  // Sort spots by upvotes (highest first)
  const sortedSpots = [...chillSpots].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  const statusColor = overallStats.status === 'neutral' ? 'var(--text-secondary)' : overallStats.status === 'danger' ? '#ef4444' : overallStats.status === 'caution' ? '#f59e0b' : '#10b981';

  // Auto-sync subjects if list is empty
  useEffect(() => {
    if (status === 'authenticated' && !loading && courses.length === 0) {
        const syncCourses = async () => {
            try {
                const res = await fetch('/api/courses/sync', { method: 'POST' });
                const data = await res.json();
                if (data.success && data.added > 0) {
                    fetchCourses(); // Refresh list
                }
            } catch (err) {
                console.error("Failed to sync courses", err);
            }
        };
        syncCourses();
    }
  }, [status, loading, courses.length]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  // Helper to filter attendance log based on a subset of courses
  const getFilteredLog = (fullLog, subsetCourses) => {
    const subsetIds = new Set(subsetCourses.map(c => c.id));
    const newLog = {};

    Object.keys(fullLog).forEach(date => {
      const dayData = fullLog[date];
      let attended = 0;
      let bunked = 0;

      // Recalculate counts based on subset
      Object.keys(dayData.courses || {}).forEach(cId => {
        if (subsetIds.has(cId)) {
          if (dayData.courses[cId].attended) attended++;
          if (dayData.courses[cId].bunked) bunked++;
        }
      });

      // Only add day if there's relevant activity
      if (attended > 0 || bunked > 0) {
        newLog[date] = {
          ...dayData,
          attended,
          bunked
        };
      }
    });

    return newLog;
  };

  const labCourses = courses.filter(c => c.type === 'Lab');
  const theoryCourses = courses.filter(c => c.type !== 'Lab');
  
  const theoryLog = getFilteredLog(attendanceLog, theoryCourses);
  const labLog = getFilteredLog(attendanceLog, labCourses);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <MobileNav currentPage="attendance" />
      
      {/* Guest Mode Banner */}
      {status === 'unauthenticated' && (
        <div style={{ 
          background: '#f59e0b', color: 'black', textAlign: 'center', padding: '8px', 
          fontWeight: 600, fontSize: '14px' 
        }}>
          ⚠️ Guest Mode: Data will not be saved. <Link href="/login" style={{ textDecoration: 'underline' }}>Login here</Link>
        </div>
      )}

      {/* Date Details Modal */}
      {showDateModal && selectedDate && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowDateModal(false)}>
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '32px', maxWidth: '400px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
              </h3>
            </div>

            {/* Classes for this day - SCHEDULE BASED */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {(() => {
                  // Determine day name
                  const dateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  
                  // Get schedule for user's semester/section
                  let schedule = [];
                  if (session?.user?.semester && session?.user?.section) {
                      const sectionData = TIMETABLE_DATA.sections.find(
                          s => s.semester === session.user.semester && s.section === session.user.section
                      );
                      if (sectionData && sectionData.schedule[dayName]) {
                          schedule = sectionData.schedule[dayName].map(slot => {
                            // Filter labs based on group
                            if (slot.type === 'LAB') {
                                let subject = null;
                                const group = session?.user?.group;
                                
                                if (group === 'G1') subject = slot.G1;
                                else if (group === 'G2') subject = slot.G2;
                                else subject = `${slot.G1 || ''} / ${slot.G2 || ''}`; // Show both if no group set
                                
                                return { ...slot, subject }; // Override subject
                            }
                            return slot;
                          }).filter(slot => slot.subject); // Remove slots with no subject (e.g. empty lab for that group)
                      }
                  }

                  // Count occurrences to map specific slots
                  const courseOccurrences = {}; 
                  
                  // Helper to get status from complex log structure (which we need to fetch properly)
                  // Since we are not storing array-based status in `attendanceLog` yet, we need to RELY on `attendanceLog`
                  // containing the RAW actions to be accurate.
                  // Current `fetchCourses` doesn't populate raw actions into `attendanceLog`.
                  // For this to work perfectly, we need `fetchCourses` to store `actions` in `logMap`.
                  
                  // Temporary Workaround:
                  // The `selectedDate.log` comes from `attendanceLog`.
                  // We need to update `fetchCourses` to include `actions`.
                  // Assuming `selectedDate.log.actions` exists (it doesn't yet).
                  
                  // Let's assume we will update `fetchCourses` in a moment.
                  // For now, let's write the rendering logic assuming `selectedDate.log.actions` is available.
                  const dayActions = selectedDate.log?.actions || [];
                  
                  // Combine Schedule + Extra (filtering strictly schedule for now for simplicity, extras can be tricky)
                  
                  return schedule.map((slot, idx) => {
                      if (slot.type === 'BREAK') return null;
                      
                      // Find course details
                      // Slot only has subject name, e.g. "Math". We match by `name` or `code`?
                      // TIMETABLE_DATA usage of subject name might not match DB course name 1:1.
                      // We need fuzzy match or user mapping.
                      // For now, let's try to find a course that includes the subject string.
                      
                      const course = courses.find(c => 
                          (c.name && slot.subject && c.name.toLowerCase().includes(slot.subject.toLowerCase())) ||
                          (c.code && slot.subject && c.code.toLowerCase().includes(slot.subject.toLowerCase())) ||
                          (c.name && slot.subject && slot.subject.toLowerCase().includes(c.name.toLowerCase()))
                      );
                      
                      if (!course) {
                           // Allow handling unknown courses?
                           return (
                               <div key={idx} style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px', opacity: 0.5 }}>
                                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{slot.subject} (Not linked)</div>
                               </div>
                           );
                      }

                      // Determine occurrence index
                      const occIdx = courseOccurrences[course.id] || 0;
                      courseOccurrences[course.id] = occIdx + 1;
                      
                      // Find status for this specific occurrence
                      // We filter actions for this course, then take the one at occIdx
                      const relevantActions = dayActions.filter(a => a.courseId === course.id);
                      const action = relevantActions[occIdx];
                      const status = action ? action.status : 'none';
                      const attended = status === 'attended';
                      const bunked = status === 'bunked';

                      return (
                          <div key={`${course.id}-${occIdx}`} style={{ 
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                            background: 'var(--bg-tertiary)', borderRadius: '12px'
                          }}>
                            <div style={{ 
                              width: '12px', height: '12px', borderRadius: '50%',
                              background: attended ? '#10b981' : bunked ? '#ef4444' : 'var(--border-color)'
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>
                                 {course.name} <span style={{fontSize:'10px', opacity:0.7, marginLeft:'4px'}}>({slot.type})</span>
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{course.code} • Slot {slot.slot}</div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleDateEdit(course.id, 'attended', selectedDate, occIdx)}
                                style={{
                                  padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                  background: attended ? 'rgba(16,185,129,0.2)' : 'var(--bg-primary)',
                                  color: attended ? '#10b981' : 'var(--text-muted)',
                                  fontSize: '12px', fontWeight: 500, transition: 'all 0.2s'
                                }}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleDateEdit(course.id, 'bunked', selectedDate, occIdx)}
                                style={{
                                  padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                  background: bunked ? 'rgba(239,68,68,0.2)' : 'var(--bg-primary)',
                                  color: bunked ? '#ef4444' : 'var(--text-muted)',
                                  fontSize: '12px', fontWeight: 500, transition: 'all 0.2s'
                                }}
                              >
                                Bunked
                              </button>
                              
                              {/* Mass Bunk Trigger */}
                              <button
                                onClick={() => handleMassBunk(course)}
                                title="Mass Bunk Alert"
                                style={{
                                  padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                  background: 'var(--bg-primary)',
                                  color: '#f59e0b',
                                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                              >
                                📢
                              </button>
                            </div>
                          </div>
                      );
                  });
              })()}
              
              {(!session?.user?.semester || !session?.user?.section) && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                      Please update your profile with Semester & Section to see the schedule.
                  </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', gap: '24px', padding: '16px',
              background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {selectedDate.log?.attended || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attended</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  {selectedDate.log?.bunked || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bunked</div>
              </div>
            </div>

            <button 
              onClick={() => setShowDateModal(false)}
              style={{ 
                width: '100%', padding: '14px', background: '#8b5cf6', color: 'white', 
                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500
              }}
            >Close</button>
          </div>
        </div>
      )}

      {/* Bunk Modal - Where to go? */}
      {showBunkModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => { setShowBunkModal(false); setBunkingCourse(null); }}>
          <div style={{ 
            background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '24px', 
            padding: '32px', maxWidth: '450px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>😴</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                Bunking {bunkingCourse?.name}?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Where are you going to chill?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {sortedSpots.map((spot) => (
                <div 
                  key={spot.id}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{categoryEmojis[spot.category] || '📍'}</span>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => confirmBunk(spot)}>
                    <div style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{spot.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px', textTransform: 'capitalize' }}>
                      {spot.distance} • {spot.vibe?.replace('_', ' ')}
                    </div>
                  </div>
                  <button
                    onClick={(e) => upvoteSpot(spot.id, e)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                      background: spot.isUpvoted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                      border: spot.isUpvoted ? '1px solid rgba(16,185,129,0.4)' : '1px solid #2a2a3a',
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{spot.isUpvoted ? '💚' : '👍'}</span>
                    <span style={{ color: spot.isUpvoted ? '#10b981' : '#9ca3af', fontSize: '13px', fontWeight: 500 }}>{spot.upvotes || 0}</span>
                  </button>
                  <span 
                    style={{ color: '#8b5cf6', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
                    onClick={() => confirmBunk(spot)}
                  >→</span>
                </div>
              ))}
              {sortedSpots.length === 0 && (
                 <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    No chill spots found. <br /> 
                    <Link href="/spots" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Add some first!</Link>
                 </div>
              )}
            </div>


            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                onClick={() => { setShowBunkModal(false); setBunkingCourse(null); }}
                style={{ 
                  flex: 1, padding: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', 
                  border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmBunk(null)}
                style={{ 
                  flex: 1, padding: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 
                }}
              >
                Just Bunk
              </button>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
               <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
                 Need an excuse? 🎭
               </h4>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <select 
                   value={excuseTone}
                   onChange={(e) => setExcuseTone(e.target.value)}
                   style={{
                     flex: 1, padding: '10px', borderRadius: '8px', 
                     background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)'
                   }}
                 >
                   {Object.keys(excusesData.tones).map(tone => (
                     <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
                   ))}
                 </select>
                 <button
                   onClick={generateExcuse}
                   style={{
                     padding: '10px 16px', borderRadius: '8px', border: 'none',
                     background: '#8b5cf6', color: 'white', cursor: 'pointer', fontWeight: 600
                   }}
                 >
                   Generate
                 </button>
               </div>
               
               {generatedExcuse && (
                 <div style={{ 
                   marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', 
                   borderRadius: '8px', border: '1px solid var(--border-color)',
                   position: 'relative', animation: 'fadeIn 0.3s ease'
                 }}>
                   <p style={{ color: 'var(--text-primary)', fontSize: '14px', paddingRight: '24px', fontStyle: 'italic' }}>
                     "{generatedExcuse}"
                   </p>
                   <button
                     onClick={() => navigator.clipboard.writeText(generatedExcuse)}
                     style={{
                       position: 'absolute', top: '8px', right: '8px',
                       background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'
                     }}
                     title="Copy to clipboard"
                   >
                     📋
                   </button>
                 </div>
               )}
            </div>

            <Link href="/spots" style={{ 
              display: 'block', textAlign: 'center', marginTop: '16px', 
              color: '#8b5cf6', fontSize: '13px', textDecoration: 'none'
            }}>
              🔍 Browse all chill spots →
            </Link>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowAddModal(false)}>
          <div style={{ 
            background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '20px', 
            padding: '32px', maxWidth: '400px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
              ➕ Add New Subject
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Subject Name *</label>
              <input type="text" value={newCourse.name} onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Computer Networks"
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Subject Code</label>
              <input type="text" value={newCourse.code} onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. CS501"
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Total Classes</label>
                <input type="number" value={newCourse.total} onChange={e => setNewCourse(prev => ({ ...prev, total: e.target.value }))} min="0"
                  style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Attended</label>
                <input type="number" value={newCourse.attended} onChange={e => setNewCourse(prev => ({ ...prev, attended: e.target.value }))} min="0"
                  style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', background: '#1f2937', color: '#9ca3af', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAddCourse} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Add Subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowEditModal(false)}>
          <div style={{ 
            background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '20px', 
            padding: '32px', maxWidth: '400px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
              ✏️ Edit Subject
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Subject Name</label>
              <input type="text" value={editingCourse.name} onChange={e => setEditingCourse(prev => ({ ...prev, name: e.target.value }))}
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            {/* ... other fields ... */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Subject Code</label>
              <input type="text" value={editingCourse.code || ''} onChange={e => setEditingCourse(prev => ({ ...prev, code: e.target.value }))}
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Total Classes</label>
                <input type="number" value={editingCourse.totalClasses} onChange={e => setEditingCourse(prev => ({ ...prev, totalClasses: e.target.value }))} min="0"
                  style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' }}>Attended</label>
                <input type="number" value={editingCourse.attendedClasses} onChange={e => setEditingCourse(prev => ({ ...prev, attendedClasses: e.target.value }))} min="0"
                  style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', background: '#1f2937', color: '#9ca3af', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleUpdateCourse} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowDeleteModal(false)}>
          <div style={{ 
            background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '24px', 
            padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Delete {courseToDelete.name}?
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
              This action cannot be undone. All attendance data for this subject will be lost.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{ 
                  flex: 1, padding: '14px', background: '#1f2937', color: '#9ca3af', 
                  border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 
                }}
              >Cancel</button>
              <button 
                onClick={() => {
                  handleDeleteCourse(courseToDelete.id);
                  setShowDeleteModal(false);
                }}
                style={{ 
                  flex: 1, padding: '14px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Mass Bunk Modal */}
      {showMassBunkModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowMassBunkModal(false)}>
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '32px', maxWidth: '450px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Mass Bunk Day!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Select classes to skip today</p>
            </div>

            {/* Course Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', maxHeight: '250px', overflowY: 'auto' }}>
              {courses.map(course => {
                const isSelected = massBunkSelection.has(course.id);
                const stats = getStats(
                    course.totalClasses || course.total || 0, 
                    course.attendedClasses || course.attended || 0, 
                    requiredPercentage
                );
                return (
                  <div 
                    key={course.id}
                    onClick={() => {
                      const newSet = new Set(massBunkSelection);
                      if (isSelected) newSet.delete(course.id);
                      else newSet.add(course.id);
                      setMassBunkSelection(newSet);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                      background: isSelected ? 'rgba(139,92,246,0.15)' : 'var(--bg-tertiary)', 
                      border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                      borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: isSelected ? '#8b5cf6' : 'var(--bg-primary)',
                      border: isSelected ? 'none' : '2px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '14px'
                    }}>
                      {isSelected && '✓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>{course.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {stats.percentage}% • Can skip {stats.safeToBunk}
                      </div>
                    </div>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444'
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Selected count */}
            <div style={{ 
              padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '10px',
              textAlign: 'center', marginBottom: '16px'
            }}>
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>
                {massBunkSelection.size} classes selected
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { setShowMassBunkModal(false); setMassBunkSelection(new Set()); }}
                style={{ flex: 1, padding: '14px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}
              >Cancel</button>
              <button 
                onClick={async () => {
                  // 1. Notify for selected courses
                  const selectedCourses = courses.filter(c => massBunkSelection.has(c.id));
                  let notifiedCount = 0;

                  // Notify for each selected course
                  // We'll run these in parallel for speed
                  await Promise.all(selectedCourses.map(async (course) => {
                      try {
                          await fetch('/api/notifications/mass-bunk', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                  subject: course.name,
                                  type: course.type || 'Theory' 
                              })
                          });
                          notifiedCount++;
                      } catch (e) {
                          console.error('Failed to notify for', course.name, e);
                      }
                  }));

                  // 2. Update local state (existing logic)
                  setCourses(prev => prev.map(c => 
                    massBunkSelection.has(c.id) ? { ...c, total: c.total + 1 } : c
                  ));
                  const dateKey = `${calendarYear}-${calendarMonth}-${today.getDate()}`;
                  setAttendanceLog(prev => ({ 
                    ...prev, 
                    [dateKey]: { ...prev[dateKey], bunked: (prev[dateKey]?.bunked || 0) + massBunkSelection.size } 
                  }));
                  
                  // 3. Feedback
                  if (notifiedCount > 0) {
                      setSuccessMessage(`Bunked & Notified followers about ${notifiedCount} classes! 📢`);
                      setShowSuccessModal(true);
                  }

                  setShowMassBunkModal(false);
                  setMassBunkSelection(new Set());
                }}
                disabled={massBunkSelection.size === 0}
                style={{ 
                  flex: 1, padding: '14px', 
                  background: massBunkSelection.size > 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'var(--bg-tertiary)',
                  color: massBunkSelection.size > 0 ? 'white' : 'var(--text-muted)', 
                  border: 'none', borderRadius: '12px', cursor: massBunkSelection.size > 0 ? 'pointer' : 'not-allowed', 
                  fontWeight: 600
                }}
              >🎉 Confirm Bunks</button>
            </div>
          </div>
        </div>
      )}

      {/* Mass Bunk Success Modal */}
      {showSuccessModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowSuccessModal(false)}>
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Bunk Successful!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '24px', lineHeight: '1.5' }}>
              {successMessage}
            </p>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{ 
                width: '100%', padding: '14px', 
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
                color: 'white', border: 'none', borderRadius: '12px', 
                cursor: 'pointer', fontWeight: 600, fontSize: '16px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Attendance Tracker</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Required: {requiredPercentage}%</p>
          </div>

          {/* Today's Schedule Banner */}
          {todaysClasses.length > 0 && (
            <div className="animate-fade-in" style={{ 
                marginBottom: '32px', padding: '24px', borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))',
                border: '1px solid rgba(139,92,246,0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 Today's Schedule <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.7, padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>{session?.user?.section}</span>
                    </h3>
                    <Link href="/timetable" style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: 600 }}>View Full →</Link>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                    {todaysClasses.map((cls, i) => (
                        <div key={i} style={{ 
                            minWidth: '140px', padding: '12px', borderRadius: '14px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            opacity: cls.type === 'BREAK' ? 0.6 : 1
                        }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                {TIMETABLE_DATA.time_slots.find(t => t.slot === cls.slot)?.time}
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                                {cls.type === 'LAB' ? `LAB (G1/G2)` : cls.subject}
                            </div>
                            <div style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', background: cls.type === 'BREAK' ? '#e5e7eb' : 'rgba(139,92,246,0.1)', color: cls.type === 'BREAK' ? 'black' : '#8b5cf6' }}>
                                {cls.type}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Friends Activity */}
          <FriendsActivity />

          {/* Two Column Layout */}
          <div id="attendance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            
            {/* Stats Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(88,28,135,0.4), rgba(6,78,59,0.4))',
              border: '1px solid rgba(139,92,246,0.2)', borderRadius: '24px', 
              padding: '32px', textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r="70" stroke="#1f1f2e" strokeWidth="10" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke={statusColor} strokeWidth="10" fill="none" strokeLinecap="round"
                      strokeDasharray={`${(overallStats.percentage / 100) * 440} 440`} style={{ transition: 'all 0.7s' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '42px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{overallStats.percentage}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>percent</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{attendedClasses}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Attended</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalClasses}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{overallStats.safeToBunk}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Can Bunk</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{overallStats.needToAttend}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Must Attend</div>
                </div>
              </div>

              <div style={{ 
                display: 'inline-block', padding: '12px 24px', borderRadius: '12px',
                background: overallStats.status === 'neutral' ? 'var(--bg-tertiary)' : overallStats.status === 'safe' ? 'rgba(16,185,129,0.1)' : overallStats.status === 'caution' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${statusColor}33`
              }}>
                <span style={{ fontSize: '28px' }}>{overallStats.status === 'neutral' ? '☁️' : overallStats.status === 'safe' ? '😎' : overallStats.status === 'caution' ? '😰' : '😱'}</span>
                <div style={{ fontWeight: 'bold', color: statusColor, fontSize: '12px', marginTop: '4px' }}>
                  {overallStats.status === 'neutral' ? 'MOOD: CHILL' : overallStats.status === 'safe' ? 'SAFE TO CHILL' : overallStats.status === 'caution' ? 'BE CAREFUL' : 'DANGER ZONE'}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else { setCalendarMonth(m => m - 1); } }} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>←</button>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{monthNames[calendarMonth]} {calendarYear}</span>
                <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else { setCalendarMonth(m => m + 1); } }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>→</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', padding: '4px' }}>{d}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const dateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const log = attendanceLog[dateKey];
                  const isToday = day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear();
                  let bgColor = 'transparent';
                  if (log?.attended && !log?.bunked) bgColor = 'rgba(16,185,129,0.2)';
                  else if (log?.bunked && !log?.attended) bgColor = 'rgba(239,68,68,0.2)';
                  else if (log?.attended && log?.bunked) bgColor = 'rgba(245,158,11,0.2)';
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedDate({ day, month: calendarMonth, year: calendarYear, dateKey, log }); setShowDateModal(true); }}
                      style={{ 
                        aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '8px', fontSize: '13px', color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: bgColor, border: isToday ? '2px solid #8b5cf6' : 'none', fontWeight: isToday ? 600 : 400,
                        cursor: 'pointer', transition: 'transform 0.1s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >{day}</div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>🟢 Attended</span><span>🔴 Bunked</span><span>🟡 Mixed</span>
              </div>
            </div>
          </div>

          {/* Courses Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Your Subjects</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowMassBunkModal(true)} style={{ 
                padding: '10px 20px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', 
                border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize:'14px'
              }}>🎉 Mass Bunk</button>
              <button onClick={() => setShowAddModal(true)} style={{ 
                padding: '10px 20px', background: '#8b5cf6', color: 'white', 
                border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize:'14px'
              }}>+ Add Subject</button>
            </div>
          </div>

          {/* Courses List */}
          {/* Courses List */}
          {/* Courses List - Row Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Theory Section */}
            {labCourses.length > 0 && theoryCourses.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '-16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theory</h3>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(labCourses.length > 0 ? theoryCourses : courses).map(course => {
                  const stats = getStats(course.totalClasses, course.attendedClasses, course.targetPercentage || 75);
                  
                  // Determine bar color
                  let barColor = '#10b981'; // Green
                  if (stats.status === 'neutral') barColor = 'var(--text-secondary)';
                  else if (stats.percentage < 75) barColor = '#ef4444'; // Red
                  else if (stats.percentage < 85) barColor = '#f59e0b'; // Yellow (Caution)

                  return (
                    <div key={course.id} className="animate-scale-in" style={{ 
                      background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', 
                      padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '24px', flexWrap: 'wrap'
                    }}>
                      {/* Left Side: Info & Progress */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        
                        {/* Header: Dot + Name + Code */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ 
                                width: '8px', height: '8px', borderRadius: '50%', 
                                background: stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444',
                                boxShadow: `0 0 8px ${stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444'}40`
                            }} />
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{course.name}</h3>
                            {course.code && <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{course.code}</span>}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginBottom: '10px' }}>
                            <div style={{ 
                                height: '100%', borderRadius: '3px', background: barColor, 
                                width: `${Math.min(100, stats.percentage)}%`, transition: 'width 0.5s',
                                boxShadow: `0 0 10px ${barColor}40`
                            }} />
                        </div>

                        {/* Stats Line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <span>{course.attendedClasses}/{course.totalClasses}</span>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <span style={{ color: barColor, fontWeight: 500 }}>{stats.percentage}%</span>
                            {stats.safeToBunk > 0 && (
                                <>
                                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                                    <span style={{ color: '#10b981' }}>Skip {stats.safeToBunk}</span>
                                </>
                            )}
                            {stats.needToAttend > 0 && (
                                <>
                                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                                    <span style={{ color: '#ef4444' }}>Attend {stats.needToAttend}</span>
                                </>
                            )}
                        </div>
                      </div>

                      {/* Right Side: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => initiateEdit(course)} style={{ 
                            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                        }} title="Edit">✏️</button>
                        
                        <button onClick={() => { setCourseToDelete(course); setShowDeleteModal(true); }} style={{ 
                            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                        }} title="Delete">🗑️</button>

                        <button onClick={() => inititateBunk(course)} style={{ 
                            padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', 
                            borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span style={{ fontSize: '14px' }}>😴</span> Bunk
                        </button>

                        <button onClick={() => handleAttend(course.id)} style={{ 
                            padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', 
                            borderRadius: '10px', color: '#34d399', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span style={{ fontSize: '14px' }}>✅</span> Attend
                        </button>
                      </div>

                    </div>
                  );
                })}
            </div>

            {/* Labs Section */}
            {labCourses.length > 0 && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '-16px', marginTop: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Labs / Practicals</h3>
                        <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {labCourses.map(course => {
                          const stats = getStats(course.totalClasses, course.attendedClasses, course.targetPercentage || 75);
                          
                          // Determine bar color
                          let barColor = '#10b981'; // Green
                          if (stats.percentage < 75) barColor = '#ef4444'; // Red
                          else if (stats.percentage < 85) barColor = '#f59e0b'; // Yellow (Caution)

                          return (
                            <div key={course.id} className="animate-scale-in" style={{ 
                              background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', 
                              padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              gap: '24px', flexWrap: 'wrap'
                            }}>
                              {/* Left Side: Info & Progress */}
                              <div style={{ flex: 1, minWidth: '200px' }}>
                                
                                {/* Header: Dot + Name + Code */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ 
                                        width: '8px', height: '8px', borderRadius: '50%', 
                                        background: stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444',
                                        boxShadow: `0 0 8px ${stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444'}40`
                                    }} />
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{course.name}</h3>
                                    {course.code && <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{course.code}</span>}
                                </div>

                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginBottom: '10px' }}>
                                    <div style={{ 
                                        height: '100%', borderRadius: '3px', background: barColor, 
                                        width: `${Math.min(100, stats.percentage)}%`, transition: 'width 0.5s',
                                        boxShadow: `0 0 10px ${barColor}40`
                                    }} />
                                </div>

                                {/* Stats Line */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <span>{course.attendedClasses}/{course.totalClasses}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                                    <span style={{ color: barColor, fontWeight: 500 }}>{stats.percentage}%</span>
                                    {stats.safeToBunk > 0 && (
                                        <>
                                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                                            <span style={{ color: '#10b981' }}>Skip {stats.safeToBunk}</span>
                                        </>
                                    )}
                                    {stats.needToAttend > 0 && (
                                        <>
                                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                                            <span style={{ color: '#ef4444' }}>Attend {stats.needToAttend}</span>
                                        </>
                                    )}
                                </div>
                              </div>

                              {/* Right Side: Actions */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={() => initiateEdit(course)} style={{ 
                                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                                }} title="Edit">✏️</button>
                                
                                <button onClick={() => { setCourseToDelete(course); setShowDeleteModal(true); }} style={{ 
                                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                                }} title="Delete">🗑️</button>

                                <button onClick={() => inititateBunk(course)} style={{ 
                                    padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', 
                                    borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <span style={{ fontSize: '14px' }}>😴</span> Bunk
                                </button>

                                <button onClick={() => handleAttend(course.id)} style={{ 
                                    padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', 
                                    borderRadius: '10px', color: '#34d399', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <span style={{ fontSize: '14px' }}>✅</span> Attend
                                </button>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                </>
            )}
          </div>

          {courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <p>No subjects yet. Click "Add Subject" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="animate-fade-in analytics-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            📊 Your Attendance Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Visual insights into your attendance patterns
          </p>
        </div>

        {/* Trend Chart - Full Width */}
        <div className="chart-card" style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
            📈 Daily Efficiency (Last 7 Days)
          </h3>
          {labCourses.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                   <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', opacity: 0.8 }}>THEORY</h4>
                   <AttendanceTrendChart attendanceLog={theoryLog} />
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                   <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', opacity: 0.8 }}>LABS / PRACTICALS</h4>
                   <AttendanceTrendChart attendanceLog={labLog} />
                </div>
             </div>
          ) : (
             <AttendanceTrendChart attendanceLog={attendanceLog} />
          )}
        </div>

        {/* Charts Grid */}
        <div id="analytics-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Subject Pie Chart */}
          <div className="chart-card" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              🥧 Subject Breakdown
            </h3>
            {labCourses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theory</h4>
                  <SubjectPieChart courses={theoryCourses} />
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                   <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Labs / Practicals</h4>
                   <SubjectPieChart courses={labCourses} />
                </div>
              </div>
            ) : (
              <SubjectPieChart courses={courses} />
            )}
          </div>

          {/* Monthly Bar Chart */}
          <div className="chart-card" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              📊 Monthly Comparison
            </h3>
            {labCourses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theory</h4>
                  <MonthlyBarChart attendanceLog={theoryLog} />
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                   <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Labs / Practicals</h4>
                   <MonthlyBarChart attendanceLog={labLog} />
                </div>
              </div>
            ) : (
              <MonthlyBarChart attendanceLog={attendanceLog} />
            )}
          </div>
        </div>

        {/* Insights Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Quick Insights
          </h3>
          <div id="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Overall Percentage - Always same */}
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {overallStats.percentage}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Overall Attendance</div>
            </div>

            {/* Total Subjects - Split if labs exist */}
            <div>
              {labCourses.length > 0 ? (
                <div>
                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {theoryCourses.length} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>THEORY</span>
                   </div>
                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {labCourses.length} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>LABS</span>
                   </div>
                </div>
              ) : (
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {courses.length}
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Subjects</div>
            </div>

            {/* Subjects on Track - Split if labs exist */}
            <div>
              {labCourses.length > 0 ? (
                <div>
                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {theoryCourses.filter(c => ((c.attendedClasses / c.totalClasses) * 100) >= requiredPercentage).length}/{theoryCourses.length} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>THEORY</span>
                   </div>
                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {labCourses.filter(c => ((c.attendedClasses / c.totalClasses) * 100) >= requiredPercentage).length}/{labCourses.length} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>LABS</span>
                   </div>
                </div>
              ) : (
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {courses.filter(c => ((c.attendedClasses / c.totalClasses) * 100) >= requiredPercentage).length}/{courses.length}
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Subjects on Track</div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .analytics-container {
             padding: 24px 16px !important;
          }

          #attendance-grid {
            grid-template-columns: 1fr !important;
          }
          
          #analytics-grid {
            grid-template-columns: 1fr !important;
          }
          
          #insights-grid {
            grid-template-columns: 1fr !important;
          }

          .chart-card {
            padding: 16px !important;
            min-width: 0; /* Critical for grid/flex child shrinking */
          }
        }
      `}</style>
    </div>
  );
}
