'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MobileNav from '@/components/MobileNav';
import { TIMETABLE_DATA, getSemesters, getSectionsForSemester } from '@/lib/data/timetable';

const DEFAULT_TIME_SLOTS = [
  { slot: 1, time: '09:30-10:20' },
  { slot: 2, time: '10:20-11:10' },
  { slot: 3, time: '11:10-12:00' },
  { slot: 4, time: '12:00-12:50' },
  { slot: 5, time: '12:50-13:40' },
  { slot: 6, time: '13:40-14:30' },
  { slot: 7, time: '14:30-15:20' },
  { slot: 8, time: '15:20-16:10' },
  { slot: 9, time: '16:10-17:00' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOT_TYPES = ['THEORY', 'LAB', 'BREAK', 'ACTIVITY'];

export default function TimetablePage() {
  const { data: session } = useSession();
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [selectedSection, setSelectedSection] = useState('CSE-A');
  const [currentDay, setCurrentDay] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);

  // Custom timetable state
  const [viewMode, setViewMode] = useState('official'); // 'official' | 'custom'
  const [customTimetable, setCustomTimetable] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorSchedule, setEditorSchedule] = useState({});
  const [editorTimeSlots, setEditorTimeSlots] = useState([...DEFAULT_TIME_SLOTS]);
  const [editorDay, setEditorDay] = useState('Monday');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Add slot modal
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ subject: '', type: 'THEORY', slotIdx: 1 });

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (DAYS.includes(today)) {
      setCurrentDay(today);
    } else {
      setCurrentDay('Monday');
    }
    setTimeSlots(TIMETABLE_DATA.time_slots);

    if (session?.user?.semester) setSelectedSemester(session.user.semester);
    if (session?.user?.section) setSelectedSection(session.user.section);
  }, [session]);

  // Fetch user's custom timetable
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.customTimetable?.schedule) {
            // Convert Map if needed
            const schedule = data.customTimetable.schedule instanceof Map
              ? Object.fromEntries(data.customTimetable.schedule)
              : data.customTimetable.schedule;
            setCustomTimetable({
              timeSlots: data.customTimetable.timeSlots || [...DEFAULT_TIME_SLOTS],
              schedule
            });
            setViewMode('custom');
          }
        })
        .catch(err => console.error('Failed to fetch user data', err));
    }
  }, [session]);

  useEffect(() => {
    const sectionData = TIMETABLE_DATA.sections.find(
      s => s.semester === selectedSemester && s.section === selectedSection
    );
    setScheduleData(sectionData);
  }, [selectedSemester, selectedSection]);

  const handleSemesterChange = (e) => {
    const sem = parseInt(e.target.value);
    setSelectedSemester(sem);
    const sections = getSectionsForSemester(sem);
    if (sections.length > 0) setSelectedSection(sections[0]);
  };

  // Get the active schedule based on view mode
  const getActiveTimeSlots = () => {
    if (viewMode === 'custom' && customTimetable) {
      return customTimetable.timeSlots || DEFAULT_TIME_SLOTS;
    }
    return timeSlots;
  };

  const getActiveSlotData = (slotId) => {
    if (viewMode === 'custom' && customTimetable?.schedule) {
      const daySlots = customTimetable.schedule[currentDay];
      if (!daySlots) return null;
      return daySlots.find(s => s.slot === slotId);
    }
    if (!scheduleData || !scheduleData.schedule[currentDay]) return null;
    return scheduleData.schedule[currentDay].find(s => s.slot === slotId);
  };

  const hasCustom = !!customTimetable?.schedule;

  // === Editor Functions ===
  const openEditor = () => {
    if (customTimetable) {
      setEditorSchedule(JSON.parse(JSON.stringify(customTimetable.schedule || {})));
      setEditorTimeSlots([...(customTimetable.timeSlots || DEFAULT_TIME_SLOTS)]);
    } else {
      setEditorSchedule({});
      setEditorTimeSlots([...DEFAULT_TIME_SLOTS]);
    }
    setEditorDay('Monday');
    setShowEditor(true);
  };

  const addSlotToDay = () => {
    if (!newSlot.subject.trim() && newSlot.type !== 'BREAK') return;

    const daySlots = editorSchedule[editorDay] || [];
    const entry = {
      slot: newSlot.slotIdx,
      type: newSlot.type,
      subject: newSlot.type === 'BREAK' ? 'LUNCH' : newSlot.subject.trim()
    };

    // Replace if slot already exists for this day
    const existing = daySlots.findIndex(s => s.slot === entry.slot);
    if (existing !== -1) {
      daySlots[existing] = entry;
    } else {
      daySlots.push(entry);
      daySlots.sort((a, b) => a.slot - b.slot);
    }

    setEditorSchedule({ ...editorSchedule, [editorDay]: [...daySlots] });
    setNewSlot({ subject: '', type: 'THEORY', slotIdx: newSlot.slotIdx });
    setShowAddSlot(false);
  };

  const removeSlotFromDay = (slotNum) => {
    const daySlots = (editorSchedule[editorDay] || []).filter(s => s.slot !== slotNum);
    setEditorSchedule({ ...editorSchedule, [editorDay]: daySlots });
  };

  const saveCustomTimetable = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    setSaveMsg('');

    try {
      const payload = {
        customTimetable: {
          timeSlots: editorTimeSlots,
          schedule: editorSchedule
        }
      };

      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCustomTimetable(payload.customTimetable);
        setViewMode('custom');
        setShowEditor(false);
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(''), 2000);
      } else {
        const err = await res.json();
        setSaveMsg(`Error: ${err.error || 'Failed to save'}`);
      }
    } catch (err) {
      console.error(err);
      setSaveMsg('Network error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomTimetable = async () => {
    if (!session?.user?.id) return;
    if (!confirm('Delete your custom timetable? This cannot be undone.')) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customTimetable: null })
      });

      if (res.ok) {
        setCustomTimetable(null);
        setViewMode('official');
        setShowEditor(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const activeTimeSlots = getActiveTimeSlots();

  // Styles
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    border: '1px solid var(--border-color)', outline: 'none', fontSize: '14px'
  };

  const btnPrimary = {
    padding: '10px 20px', background: '#8b5cf6', color: 'white',
    border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px'
  };

  const btnSecondary = {
    padding: '10px 20px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '14px'
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

        {/* View Mode Toggle + Custom Button */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '12px',
            border: '1px solid var(--border-color)', overflow: 'hidden'
          }}>
            <button
              onClick={() => setViewMode('official')}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                background: viewMode === 'official' ? 'var(--accent-purple)' : 'transparent',
                color: viewMode === 'official' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              📋 Official
            </button>
            <button
              onClick={() => hasCustom ? setViewMode('custom') : openEditor()}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                background: viewMode === 'custom' ? 'var(--accent-purple)' : 'transparent',
                color: viewMode === 'custom' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              ✏️ Custom
            </button>
          </div>

          {viewMode === 'custom' && hasCustom && (
            <button onClick={openEditor} style={{
              padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer',
              fontWeight: 500, fontSize: '13px'
            }}>
              ✏️ Edit
            </button>
          )}

          {!hasCustom && viewMode === 'official' && (
            <button onClick={openEditor} style={{
              padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.3)',
              background: 'rgba(6,182,212,0.1)', color: '#06b6d4', cursor: 'pointer',
              fontWeight: 500, fontSize: '13px', marginLeft: 'auto'
            }}>
              + Create Custom Timetable
            </button>
          )}

          {saveMsg && (
            <span style={{ fontSize: '12px', color: saveMsg.startsWith('Error') ? '#ef4444' : '#10b981', fontWeight: 500 }}>
              {saveMsg}
            </span>
          )}
        </div>

        {/* Official Controls (only when viewing official) */}
        {viewMode === 'official' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
        )}

        {/* Day Tabs */}
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {DAYS.map(day => (
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
          {viewMode === 'official' && scheduleData && scheduleData.room && (
            <div style={{
              marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px',
              display: 'inline-block', alignSelf: 'flex-start'
            }}>
              📍 Room: {scheduleData.room}
            </div>
          )}

          {viewMode === 'custom' && hasCustom && (
            <div style={{
              marginBottom: '10px', fontSize: '13px', color: 'var(--accent-cyan)',
              background: 'rgba(6,182,212,0.08)', padding: '8px 12px', borderRadius: '8px',
              display: 'inline-block', alignSelf: 'flex-start',
              border: '1px solid rgba(6,182,212,0.2)'
            }}>
              ✨ Your custom timetable
            </div>
          )}

          {activeTimeSlots.map(slot => {
            const classData = getActiveSlotData(slot.slot);
            if (!classData) return null;

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
                        {isLab && classData.G1 ? (
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

          {/* Empty state */}
          {(() => {
            const hasSlots = activeTimeSlots.some(slot => getActiveSlotData(slot.slot));
            if (!hasSlots) {
              return (
                <div style={{
                  padding: '40px', textAlign: 'center', color: 'var(--text-muted)',
                  background: 'var(--bg-tertiary)', borderRadius: '16px'
                }}>
                  {viewMode === 'custom' && !hasCustom
                    ? 'No custom timetable yet. Click "Create Custom Timetable" to get started! ✨'
                    : `No classes scheduled for ${currentDay} 🏝️`}
                </div>
              );
            }
            return null;
          })()}
        </div>

      </main>

      {/* ========== EDITOR MODAL ========== */}
      {showEditor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={() => setShowEditor(false)}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px',
            padding: '28px', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', textAlign: 'center' }}>
              ✏️ Custom Timetable Editor
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
              Build your own weekly schedule
            </p>

            {/* Day selector */}
            <div style={{
              display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '20px',
              scrollbarWidth: 'none', paddingBottom: '4px'
            }}>
              {DAYS.map(day => {
                const slotCount = (editorSchedule[day] || []).length;
                return (
                  <button
                    key={day}
                    onClick={() => setEditorDay(day)}
                    style={{
                      padding: '6px 14px', borderRadius: '16px', whiteSpace: 'nowrap',
                      background: editorDay === day ? '#8b5cf6' : 'var(--bg-tertiary)',
                      color: editorDay === day ? 'white' : 'var(--text-secondary)',
                      border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                      position: 'relative'
                    }}
                  >
                    {day.slice(0, 3)}
                    {slotCount > 0 && (
                      <span style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        background: '#06b6d4', color: 'white', borderRadius: '50%',
                        width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {slotCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Current day's slots */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {editorDay}'s Classes
                </span>
                <button
                  onClick={() => { setNewSlot({ subject: '', type: 'THEORY', slotIdx: (editorSchedule[editorDay]?.length || 0) + 1 }); setShowAddSlot(true); }}
                  style={{
                    padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.3)',
                    background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer',
                    fontWeight: 600, fontSize: '12px'
                  }}
                >
                  + Add Class
                </button>
              </div>

              {(editorSchedule[editorDay] || []).length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
                  background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  No classes added for {editorDay} yet
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(editorSchedule[editorDay] || []).sort((a, b) => a.slot - b.slot).map((slot, idx) => {
                  const ts = editorTimeSlots.find(t => t.slot === slot.slot);
                  return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                      background: 'var(--bg-tertiary)', borderRadius: '12px',
                      borderLeft: `3px solid ${slot.type === 'LAB' ? '#06b6d4' : slot.type === 'BREAK' ? '#6b7280' : '#8b5cf6'}`
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '55px' }}>
                        {ts ? ts.time : `Slot ${slot.slot}`}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {slot.subject}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                        background: slot.type === 'LAB' ? 'rgba(6,182,212,0.1)' : 'rgba(139,92,246,0.1)',
                        color: slot.type === 'LAB' ? '#06b6d4' : '#8b5cf6'
                      }}>
                        {slot.type}
                      </span>
                      <button
                        onClick={() => removeSlotFromDay(slot.slot)}
                        style={{
                          background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer',
                          fontSize: '16px', padding: '2px'
                        }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add slot inline form */}
            {showAddSlot && (
              <div style={{
                padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '14px',
                marginBottom: '16px', border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Add Class to {editorDay}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Time Slot</label>
                    <select
                      value={newSlot.slotIdx}
                      onChange={e => setNewSlot({ ...newSlot, slotIdx: parseInt(e.target.value) })}
                      style={inputStyle}
                    >
                      {editorTimeSlots.map(ts => (
                        <option key={ts.slot} value={ts.slot}>{ts.time}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Type</label>
                    <select
                      value={newSlot.type}
                      onChange={e => setNewSlot({ ...newSlot, type: e.target.value })}
                      style={inputStyle}
                    >
                      {SLOT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {newSlot.type !== 'BREAK' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Subject Name</label>
                    <input
                      type="text"
                      value={newSlot.subject}
                      onChange={e => setNewSlot({ ...newSlot, subject: e.target.value })}
                      placeholder="e.g. Data Structures"
                      style={inputStyle}
                      onKeyDown={e => e.key === 'Enter' && addSlotToDay()}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowAddSlot(false)} style={btnSecondary}>Cancel</button>
                  <button onClick={addSlotToDay} style={btnPrimary}>Add</button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {hasCustom && (
                <button
                  onClick={deleteCustomTimetable}
                  disabled={saving}
                  style={{
                    ...btnSecondary,
                    color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.05)'
                  }}
                >
                  🗑️ Delete
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowEditor(false)} style={btnSecondary}>Cancel</button>
              <button
                onClick={saveCustomTimetable}
                disabled={saving}
                style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
