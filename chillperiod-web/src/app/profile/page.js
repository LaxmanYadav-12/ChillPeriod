'use client';

import MobileNav from '@/components/MobileNav';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const [userName, setUserName] = useState('Student');
  const [userUsername, setUserUsername] = useState('');
  const [collegeName, setCollegeName] = useState('Your College');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editUsername, setEditUsername] = useState(userUsername);
  const [editCollege, setEditCollege] = useState(collegeName);
  const [usernameError, setUsernameError] = useState('');

  // Mock stats - in real app would come from context/storage
  const stats = {
    totalClasses: 58,
    attendedClasses: 48,
    bunksSaved: 12,
    currentStreak: 5,
    longestStreak: 14
  };

  const attendancePercentage = Math.round((stats.attendedClasses / stats.totalClasses) * 100);

  const achievements = [
    { id: 1, emoji: '🔥', title: 'On Fire!', desc: '5-day streak', unlocked: stats.currentStreak >= 5 },
    { id: 2, emoji: '🎯', title: 'Sharp Shooter', desc: '90%+ attendance', unlocked: attendancePercentage >= 90 },
    { id: 3, emoji: '😎', title: 'Chill Master', desc: 'Bunked 10+ safely', unlocked: stats.bunksSaved >= 10 },
    { id: 4, emoji: '📚', title: 'Dedicated', desc: 'Attended 50+ classes', unlocked: stats.attendedClasses >= 50 },
    { id: 5, emoji: '⚡', title: 'Streak Legend', desc: '14-day streak', unlocked: stats.longestStreak >= 14 },
    { id: 6, emoji: '🏆', title: 'Perfect Week', desc: 'Full week attendance', unlocked: true },
  ];

  const validateUsername = (username) => {
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!username) return '';
    if (!regex.test(username)) return 'Only lowercase letters, numbers, underscores. 3-20 chars.';
    return '';
  };

  const handleSaveProfile = async () => {
    const error = validateUsername(editUsername);
    if (error && editUsername) {
      setUsernameError(error);
      return;
    }
    
    // TODO: Check uniqueness with API
    // const res = await fetch(`/api/users/check-username?username=${editUsername}`);
    
    setUserName(editName);
    setUserUsername(editUsername);
    setCollegeName(editCollege);
    setIsEditing(false);
    setUsernameError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <MobileNav currentPage="profile" />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setIsEditing(false)}>
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '32px', maxWidth: '400px', width: '100%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
              ✏️ Edit Profile
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Display Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)}
                placeholder="Your name"
                style={{ 
                  width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)', borderRadius: '10px', 
                  color: 'var(--text-primary)', fontSize: '14px' 
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>
                Username <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>(unique)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>@</span>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={e => { setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setUsernameError(''); }}
                  placeholder="your_username"
                  style={{ 
                    width: '100%', padding: '12px 16px 12px 32px', background: 'var(--bg-tertiary)', 
                    border: usernameError ? '1px solid #ef4444' : '1px solid var(--border-color)', borderRadius: '10px', 
                    color: 'var(--text-primary)', fontSize: '14px' 
                  }}
                />
              </div>
              {usernameError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{usernameError}</p>}
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>Others can find you by @username</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>College</label>
              <input 
                type="text" 
                value={editCollege} 
                onChange={e => setEditCollege(e.target.value)}
                placeholder="Your college name"
                style={{ 
                  width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)', borderRadius: '10px', 
                  color: 'var(--text-primary)', fontSize: '14px' 
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIsEditing(false)} 
                style={{ 
                  flex: 1, padding: '12px', background: 'var(--bg-tertiary)', 
                  color: 'var(--text-secondary)', border: 'none', borderRadius: '10px', 
                  cursor: 'pointer', fontWeight: 500 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile} 
                style={{ 
                  flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', 
                  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

          {/* Profile Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Avatar */}
            <div style={{ 
              width: '120px', height: '120px', margin: '0 auto 20px auto',
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              padding: '4px'
            }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', 
                background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '48px'
              }}>
                👤
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {userName}
            </h1>
            {userUsername && (
              <p style={{ color: '#a78bfa', fontSize: '15px', marginBottom: '8px' }}>
                @{userUsername}
              </p>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              📍 {collegeName}
            </p>

            {/* Follower/Following Counts - Instagram Style */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>127</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>89</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Following</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>12</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bunks</div>
              </div>
            </div>

            <button 
              onClick={() => { setEditName(userName); setEditUsername(userUsername); setEditCollege(collegeName); setIsEditing(true); }}
              style={{ 
                padding: '10px 24px', background: 'rgba(139,92,246,0.1)', 
                color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', 
                borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '14px'
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px'
          }} id="profile-stats-grid">
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '16px', padding: '20px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>{attendancePercentage}%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Attendance</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '16px', padding: '20px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{stats.bunksSaved}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Bunks Saved</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '16px', padding: '20px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.currentStreak}🔥</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Day Streak</div>
            </div>
          </div>

          {/* Achievements Section */}
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
            borderRadius: '20px', padding: '24px', marginBottom: '24px' 
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>
              🏅 Achievements
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} id="achievements-grid">
              {achievements.map(a => (
                <div 
                  key={a.id}
                  style={{ 
                    background: a.unlocked ? 'rgba(139,92,246,0.1)' : 'var(--bg-tertiary)', 
                    border: a.unlocked ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-color)',
                    borderRadius: '12px', padding: '16px', textAlign: 'center',
                    opacity: a.unlocked ? 1 : 0.5,
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{a.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
            borderRadius: '20px', padding: '24px', marginBottom: '24px' 
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>
              ⚙️ Settings
            </h2>

            {/* Theme Toggle */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '12px'
            }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Theme</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Switch between light and dark mode</div>
              </div>
              <ThemeToggle />
            </div>

            {/* Notifications (placeholder) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '12px'
            }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Notifications</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Get alerts when attendance drops</div>
              </div>
              <div style={{ 
                width: '44px', height: '24px', background: '#8b5cf6', borderRadius: '12px', 
                position: 'relative', cursor: 'pointer' 
              }}>
                <div style={{ 
                  width: '18px', height: '18px', background: 'white', borderRadius: '50%', 
                  position: 'absolute', top: '3px', right: '3px' 
                }} />
              </div>
            </div>

            {/* Target Percentage (placeholder) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px'
            }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Target Attendance</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Minimum percentage to maintain</div>
              </div>
              <div style={{ 
                padding: '8px 16px', background: 'rgba(139,92,246,0.2)', 
                borderRadius: '8px', color: '#a78bfa', fontWeight: 600, fontSize: '14px'
              }}>
                75%
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '12px' }} id="profile-actions">
            <Link href="/attendance" style={{ 
              flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
              color: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
              textDecoration: 'none', textAlign: 'center'
            }}>
              📊 View Dashboard
            </Link>
            <Link href="/spots" style={{ 
              flex: 1, padding: '14px', background: 'var(--card-bg)', 
              color: 'var(--text-primary)', border: '1px solid var(--border-color)',
              borderRadius: '12px', fontWeight: 600, fontSize: '14px',
              textDecoration: 'none', textAlign: 'center'
            }}>
              📍 Find Spots
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          #profile-stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          #achievements-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          #profile-actions {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
