'use client';

import MobileNav from '@/components/MobileNav';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setLoading(false); // Should redirect or show login prompt really
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        // Initialize edit states
        setEditName(data.name || '');
        setEditUsername(data.username || '');
        setEditCollege(data.college || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

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
    
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          username: editUsername,
          college: editCollege
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserData(updatedUser);
        setIsEditing(false);
        setUsernameError('');
      } else {
        const data = await res.json();
        setUsernameError(data.error || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      setUsernameError('Something went wrong');
    }
  };

  if (loading || status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>
      </div>
    );
  }

  const user = userData || {
    name: session?.user?.name || 'User',
    username: session?.user?.username || '',
    college: 'Your College',
    totalBunks: 0,
    attendedClasses: 0,
    totalClasses: 0,
    attendancePercentage: 100,
    currentStreak: 0,
    longestStreak: 0,
    followerCount: 0,
    followingCount: 0
  };

  const achievements = [
    { id: 1, emoji: '🔥', title: 'On Fire!', desc: '5-day streak', unlocked: (user.currentStreak || 0) >= 5 },
    { id: 2, emoji: '🎯', title: 'Sharp Shooter', desc: '90%+ attendance', unlocked: (user.attendancePercentage || 0) >= 90 },
    { id: 3, emoji: '😎', title: 'Chill Master', desc: 'Bunked 10+ safely', unlocked: (user.totalBunks || 0) >= 10 },
    { id: 4, emoji: '📚', title: 'Dedicated', desc: 'Attended 50+ classes', unlocked: (user.attendedClasses || 0) >= 50 },
    { id: 5, emoji: '⚡', title: 'Streak Legend', desc: '14-day streak', unlocked: (user.longestStreak || 0) >= 14 },
    { id: 6, emoji: '🏆', title: 'Perfect Week', desc: 'Full week attendance', unlocked: false }, // Logic needs complex backend support
  ];

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
                fontSize: '48px', overflow: 'hidden'
              }}>
                {user.image ? (
                  <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '👤'}
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {user.name}
            </h1>
            {user.username && (
              <p style={{ color: '#a78bfa', fontSize: '15px', marginBottom: '8px' }}>
                @{user.username}
              </p>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              📍 {user.college || 'No college set'}
            </p>

            {/* Follower/Following Counts - Real Data */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {user.followerCount || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {user.followingCount || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Following</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {user.totalBunks || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bunks</div>
              </div>
            </div>

            <button 
              onClick={() => { 
                setEditName(user.name); 
                setEditUsername(user.username || ''); 
                setEditCollege(user.college || ''); 
                setIsEditing(true); 
              }}
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
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>{user.attendancePercentage || 0}%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Attendance</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '16px', padding: '20px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{user.totalBunks || 0}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Bunks Saved</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '16px', padding: '20px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{user.currentStreak || 0}🔥</div>
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
