'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MobileNav from '@/components/MobileNav';
import { TIMETABLE_DATA, getSemesters, getSectionsForSemester } from '@/lib/data/timetable';

export default function TimetablePage() {
  const { data: session } = useSession();
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [selectedSection, setSelectedSection] = useState('CSE-A');
  const [currentDay, setCurrentDay] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    // Set default day to today, or Monday if weekend
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (days.includes(today)) {
      setCurrentDay(today);
    } else {
      setCurrentDay('Monday');
    }
    setTimeSlots(TIMETABLE_DATA.time_slots);

    // Initialize from session if available
    if (session?.user?.semester) {
        setSelectedSemester(session.user.semester);
    }
    if (session?.user?.section) {
        setSelectedSection(session.user.section);
    }
  }, [session]);

  useEffect(() => {
    // Find the schedule for the selected semester and section
    const sectionData = TIMETABLE_DATA.sections.find(
      s => s.semester === selectedSemester && s.section === selectedSection
    );
    setScheduleData(sectionData);
  }, [selectedSemester, selectedSection]);

  const handleSemesterChange = (e) => {
    const sem = parseInt(e.target.value);
    setSelectedSemester(sem);
    // Reset section to first available for that semester
    const sections = getSectionsForSemester(sem);
    if (sections.length > 0) {
      setSelectedSection(sections[0]);
    }
  };

  const getSlotData = (slotId) => {
    if (!scheduleData || !scheduleData.schedule[currentDay]) return null;
    return scheduleData.schedule[currentDay].find(s => s.slot === slotId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px', fontFamily: '"Outfit", sans-serif' }}>
      <MobileNav currentPage="timetable" />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 20px 20px' }}>
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Timetable 📅
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {TIMETABLE_DATA.institute} • {TIMETABLE_DATA.academic_year}
          </p>
        </header>

        {/* Controls */}
        <div style={{ 
          display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Semester</label>
            <select 
              value={selectedSemester} 
              onChange={handleSemesterChange}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '12px',
                background: 'var(--card-bg)', color: 'var(--text-primary)',
                border: '1px solid var(--border-color)', outline: 'none'
              }}
            >
              {getSemesters().map(sem => (
                <option key={sem} value={sem}>{sem}th Semester</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Section</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '12px',
                background: 'var(--card-bg)', color: 'var(--text-primary)',
                border: '1px solid var(--border-color)', outline: 'none'
              }}
            >
              {getSectionsForSemester(selectedSemester).map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Tabs */}
        <div style={{ 
          display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {days.map(day => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              style={{
                padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap',
                background: currentDay === day ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                color: currentDay === day ? 'white' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scheduleData && scheduleData.room && (
            <div style={{ 
              marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px',
              display: 'inline-block', alignSelf: 'flex-start'
            }}>
              📍 Room: {scheduleData.room}
            </div>
          )}

          {timeSlots.map(slot => {
            const classData = getSlotData(slot.slot);
            if (!classData) return null; // Or render empty slot if desired

            const isBreak = classData.type === 'BREAK';
            const isLab = classData.type === 'LAB';
            
            return (
              <div key={slot.slot} style={{ 
                display: 'flex', gap: '16px',
                opacity: isBreak ? 0.7 : 1
              }}>
                {/* Time Column */}
                <div style={{ 
                  minWidth: '60px', textAlign: 'right', fontSize: '12px', 
                  color: 'var(--text-secondary)', paddingTop: '16px' 
                }}>
                  {slot.time.split('-')[0]}<br/>
                  <span style={{ opacity: 0.5 }}>{slot.time.split('-')[1]}</span>
                </div>

                {/* Card */}
                <div style={{ 
                  flex: 1, 
                  background: isBreak ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                  border: `1px solid ${isBreak ? 'transparent' : 'var(--border-color)'}`,
                  borderRadius: '16px', padding: '16px',
                  position: 'relative', overflow: 'hidden'
                }}>
                  {/* Left accent bar */}
                  {!isBreak && (
                    <div style={{ 
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                      background: isLab ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                    }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                     <h3 style={{ 
                       fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)',
                       marginBottom: '4px'
                     }}>
                        {isLab ? (
                          <span>
                            <span style={{ color: 'var(--accent-cyan)' }}>G1:</span> {classData.G1} <br/>
                            <span style={{ color: 'var(--accent-pink)' }}>G2:</span> {classData.G2}
                          </span>
                        ) : (
                          classData.subject
                        )}
                     </h3>
                     <span style={{ 
                       fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                       background: isBreak ? '#e5e7eb' : (isLab ? 'rgba(6,182,212,0.1)' : 'rgba(139,92,246,0.1)'),
                       color: isBreak ? '#374151' : (isLab ? 'var(--accent-cyan)' : 'var(--accent-purple)')
                     }}>
                       {classData.type}
                     </span>
                  </div>
                </div>
              </div>
            );
          })}

          {(!scheduleData?.schedule[currentDay] || scheduleData.schedule[currentDay].length === 0) && (
             <div style={{ 
               padding: '40px', textAlign: 'center', color: 'var(--text-muted)',
               background: 'var(--bg-tertiary)', borderRadius: '16px'
             }}>
               No classes scheduled for {currentDay} 🏝️
             </div>
          )}
        </div>

      </main>
    </div>
  );
}
