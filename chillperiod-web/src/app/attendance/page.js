'use client';

import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import FriendsActivity from '@/components/FriendsActivity';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import AttendanceTrendChart from '@/components/charts/AttendanceTrendChart';
import SubjectPieChart from '@/components/charts/SubjectPieChart';
import MonthlyBarChart from '@/components/charts/MonthlyBarChart';

const initialCourses = [
  { id: 1, name: "Data Structures", code: "CS201", total: 15, attended: 12 },
  { id: 2, name: "Database Systems", code: "CS301", total: 12, attended: 10 },
  { id: 3, name: "Web Development", code: "CS401", total: 13, attended: 10 },
  { id: 4, name: "Mathematics III", code: "MA201", total: 10, attended: 8 },
  { id: 5, name: "Soft Skills", code: "HS101", total: 8, attended: 8 },
];

const initialChillSpots = [
  { id: 1, name: 'Sector 17/18 Park', emoji: '🌳', distance: '3 min walk', vibe: 'Chill outdoors', upvotes: 25, lat: 28.7372, lng: 77.1173 },
  { id: 2, name: 'Bhagya Vihar Market', emoji: '☕', distance: '10 min walk', vibe: 'Coffee & WiFi', upvotes: 12, lat: 28.7298, lng: 77.1089 },
  { id: 3, name: 'Garg Trade Centre', emoji: '🍕', distance: '12 min walk', vibe: 'Eat with friends', upvotes: 18, lat: 28.7356, lng: 77.1056 },
  { id: 4, name: 'Japanese Park Rohini', emoji: '🌳', distance: '8 min walk', vibe: 'Quiet space', upvotes: 15, lat: 28.7328, lng: 77.1147 },
  { id: 5, name: 'Unity One Mall', emoji: '🛍️', distance: '15 min walk', vibe: 'Mall hangout', upvotes: 8, lat: 28.7388, lng: 77.1131 },
];

function getStats(total, attended, required) {
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;
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
  const [courses, setCourses] = useState(initialCourses);
  const [requiredPercentage] = useState(75);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBunkModal, setShowBunkModal] = useState(false);
  const [showMassBunkModal, setShowMassBunkModal] = useState(false);
  const [massBunkSelection, setMassBunkSelection] = useState(new Set());
  const [bunkingCourse, setBunkingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', total: 0, attended: 0 });
  const [chillSpots, setChillSpots] = useState(initialChillSpots);
  
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [attendanceLog, setAttendanceLog] = useState({});
  const [upvotedSpots, setUpvotedSpots] = useState(new Set());
  
  const calendarDays = getCalendarDays(calendarYear, calendarMonth);
  const totalClasses = courses.reduce((sum, c) => sum + c.total, 0);
  const attendedClasses = courses.reduce((sum, c) => sum + c.attended, 0);
  const overallStats = getStats(totalClasses, attendedClasses, requiredPercentage);

  const inititateBunk = (course) => {
    setBunkingCourse(course);
    setShowBunkModal(true);
  };

  const confirmBunk = (spot) => {
    if (bunkingCourse) {
      setCourses(prev => prev.map(c => c.id === bunkingCourse.id ? { ...c, total: c.total + 1 } : c));
      const dateKey = `${calendarYear}-${calendarMonth}-${today.getDate()}`;
      setAttendanceLog(prev => ({ ...prev, [dateKey]: { ...prev[dateKey], bunked: (prev[dateKey]?.bunked || 0) + 1 } }));
    }
    // Open Google Maps if spot has coordinates
    if (spot && spot.lat && spot.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`, '_blank');
    }
    setShowBunkModal(false);
    setBunkingCourse(null);
  };

  const handleAttend = (courseId) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, total: c.total + 1, attended: c.attended + 1 } : c));
    const dateKey = `${calendarYear}-${calendarMonth}-${today.getDate()}`;
    setAttendanceLog(prev => ({ ...prev, [dateKey]: { ...prev[dateKey], attended: (prev[dateKey]?.attended || 0) + 1 } }));
  };

  const handleAddCourse = () => {
    if (!newCourse.name.trim()) return;
    const id = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses(prev => [...prev, { ...newCourse, id, total: Number(newCourse.total) || 0, attended: Number(newCourse.attended) || 0 }]);
    setNewCourse({ name: '', code: '', total: 0, attended: 0 });
    setShowAddModal(false);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const upvoteSpot = (spotId, e) => {
    e.stopPropagation();
    if (upvotedSpots.has(spotId)) {
      // Remove upvote
      setChillSpots(prev => prev.map(s => s.id === spotId ? { ...s, upvotes: s.upvotes - 1 } : s));
      setUpvotedSpots(prev => { const next = new Set(prev); next.delete(spotId); return next; });
    } else {
      // Add upvote
      setChillSpots(prev => prev.map(s => s.id === spotId ? { ...s, upvotes: s.upvotes + 1 } : s));
      setUpvotedSpots(prev => new Set(prev).add(spotId));
    }
  };

  // Sort spots by upvotes (highest first)
  const sortedSpots = [...chillSpots].sort((a, b) => b.upvotes - a.upvotes);

  const statusColor = overallStats.status === 'danger' ? '#ef4444' : overallStats.status === 'caution' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <MobileNav currentPage="attendance" />

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
                  <span style={{ fontSize: '28px' }}>{spot.emoji}</span>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => confirmBunk(spot)}>
                    <div style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{spot.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>{spot.distance} • {spot.vibe}</div>
                  </div>
                  <button
                    onClick={(e) => upvoteSpot(spot.id, e)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                      background: upvotedSpots.has(spot.id) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                      border: upvotedSpots.has(spot.id) ? '1px solid rgba(16,185,129,0.4)' : '1px solid #2a2a3a',
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{upvotedSpots.has(spot.id) ? '💚' : '👍'}</span>
                    <span style={{ color: upvotedSpots.has(spot.id) ? '#10b981' : '#9ca3af', fontSize: '13px', fontWeight: 500 }}>{spot.upvotes}</span>
                  </button>
                  <span 
                    style={{ color: '#8b5cf6', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
                    onClick={() => confirmBunk(spot)}
                  >→</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => confirmBunk(null)}
                style={{ 
                  flex: 1, padding: '14px', background: 'rgba(239,68,68,0.1)', color: '#f87171', 
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600
                }}
              >
                Just Bunk 🏠
              </button>
              <button 
                onClick={() => { setShowBunkModal(false); setBunkingCourse(null); }}
                style={{ 
                  flex: 1, padding: '14px', background: '#1f2937', color: '#9ca3af', 
                  border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500
                }}
              >
                Cancel
              </button>
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
                const stats = getStats(course.total, course.attended, requiredPercentage);
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
                onClick={() => {
                  // Bunk all selected courses
                  setCourses(prev => prev.map(c => 
                    massBunkSelection.has(c.id) ? { ...c, total: c.total + 1 } : c
                  ));
                  const dateKey = `${calendarYear}-${calendarMonth}-${today.getDate()}`;
                  setAttendanceLog(prev => ({ 
                    ...prev, 
                    [dateKey]: { ...prev[dateKey], bunked: (prev[dateKey]?.bunked || 0) + massBunkSelection.size } 
                  }));
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

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Attendance Tracker</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Required: {requiredPercentage}%</p>
          </div>

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
                background: overallStats.status === 'safe' ? 'rgba(16,185,129,0.1)' : overallStats.status === 'caution' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${statusColor}33`
              }}>
                <span style={{ fontSize: '28px' }}>{overallStats.status === 'safe' ? '😎' : overallStats.status === 'caution' ? '😰' : '😱'}</span>
                <div style={{ fontWeight: 'bold', color: statusColor, fontSize: '12px', marginTop: '4px' }}>
                  {overallStats.status === 'safe' ? 'SAFE TO CHILL' : overallStats.status === 'caution' ? 'BE CAREFUL' : 'DANGER ZONE'}
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
                  const dateKey = `${calendarYear}-${calendarMonth}-${day}`;
                  const log = attendanceLog[dateKey];
                  const isToday = day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear();
                  let bgColor = 'transparent';
                  if (log?.attended && !log?.bunked) bgColor = 'rgba(16,185,129,0.2)';
                  else if (log?.bunked && !log?.attended) bgColor = 'rgba(239,68,68,0.2)';
                  else if (log?.attended && log?.bunked) bgColor = 'rgba(245,158,11,0.2)';
                  
                  return (
                    <div key={i} style={{ 
                      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '8px', fontSize: '13px', color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: bgColor, border: isToday ? '2px solid #8b5cf6' : 'none', fontWeight: isToday ? 600 : 400
                    }}>{day}</div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map(course => {
              const stats = getStats(course.total, course.attended, requiredPercentage);
              const barColor = stats.status === 'safe' ? 'linear-gradient(90deg, #059669, #34d399)' : 
                              stats.status === 'caution' ? 'linear-gradient(90deg, #d97706, #fbbf24)' : 
                              'linear-gradient(90deg, #dc2626, #f87171)';
              
              return (
                <div key={course.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{course.name}</span>
                        {course.code && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{course.code}</span>}
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginBottom: '6px' }}>
                        <div style={{ height: '100%', borderRadius: '3px', background: barColor, width: `${Math.min(100, stats.percentage)}%`, transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <span>{course.attended}/{course.total}</span>
                        <span>•</span>
                        <span style={{ color: stats.status === 'safe' ? '#10b981' : stats.status === 'caution' ? '#f59e0b' : '#ef4444' }}>{stats.percentage}%</span>
                        {stats.safeToBunk > 0 && <><span>•</span><span style={{ color: '#10b981' }}>Skip {stats.safeToBunk}</span></>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={() => inititateBunk(course)} style={{ 
                        padding: '8px 12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', 
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '12px'
                      }}>😴 Bunk</button>
                      <button onClick={() => handleAttend(course.id)} style={{ 
                        padding: '8px 12px', background: 'rgba(16,185,129,0.1)', color: '#34d399', 
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '12px'
                      }}>✅ Attend</button>
                      <button onClick={() => handleDeleteCourse(course.id)} style={{ 
                        padding: '8px', background: 'rgba(107,114,128,0.1)', color: '#6b7280', 
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                      }}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
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
      <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            📊 Your Attendance Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Visual insights into your attendance patterns
          </p>
        </div>

        {/* Trend Chart - Full Width */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
            📈 Attendance Trend
          </h3>
          <AttendanceTrendChart />
        </div>

        {/* Charts Grid */}
        <div id="analytics-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Subject Pie Chart */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              🥧 Subject Breakdown
            </h3>
            <SubjectPieChart courses={courses} />
          </div>

          {/* Monthly Bar Chart */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              📊 Monthly Comparison
            </h3>
            <MonthlyBarChart />
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
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {overallStats.percentage}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Overall Attendance</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {courses.length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Subjects</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                {courses.filter(c => ((c.attended / c.total) * 100) >= requiredPercentage).length}/{courses.length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Subjects on Track</div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          #attendance-grid {
            grid-template-columns: 1fr !important;
          }
          
          #analytics-grid {
            grid-template-columns: 1fr !important;
          }
          
          #insights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
