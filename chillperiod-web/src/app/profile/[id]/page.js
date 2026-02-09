'use client';

import MobileNav from '@/components/MobileNav';
import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserListModal from '@/components/UserListModal';

export default function UserProfile({ params }) {
  // Unwrap params using React.use() or await if async, but in client component with Next 15+ usually direct or hook
  // In Next.js 15, params is a Promise. fallback to unwrapping.
  const { id } = use(params);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id, session?.user?.id]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        if (session?.user?.id && data.followers) {
          setIsFollowing(data.followers.includes(session.user.id));
        }
      } else {
        if (res.status === 404) setError('User not found.');
        else setError('Failed to load profile.');
      }
    } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowDetails = async (type) => {
    setModalTitle(type === 'followers' ? 'Followers' : 'Following');
    setModalOpen(true);
    setModalLoading(true);
    setModalUsers([]);

    try {
      const res = await fetch(`/api/users/${id}/follow-details?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setModalUsers(data);
      } else {
        console.error('Failed to fetch follow details');
      }
    } catch (error) {
      console.error('Error fetching follow details:', error);
    }
    setModalLoading(false);
  };

  const handleFollow = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setFollowLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`/api/users/${id}/follow`, { method });
      
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setUserData(prev => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + (isFollowing ? -1 : 1)
        }));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
    setFollowLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ color: '#ef4444' }}>⚠️ {error}</div>
      <button onClick={() => router.back()} style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: '8px', color: 'var(--text-primary)' }}>Go Back</button>
    </div>
  );

  const user = userData || {};
  const isOwner = session?.user?.id === id;

  const achievements = [
    { id: 1, emoji: '🔥', title: 'On Fire!', desc: '5-day streak', unlocked: (user.currentStreak || 0) >= 5 },
    { id: 2, emoji: '🎯', title: 'Sharp Shooter', desc: '90%+ attendance', unlocked: (user.attendancePercentage || 0) >= 90 },
    { id: 3, emoji: '😎', title: 'Chill Master', desc: 'Bunked 10+ safely', unlocked: (user.totalBunks || 0) >= 10 },
    { id: 4, emoji: '📚', title: 'Dedicated', desc: 'Attended 50+ classes', unlocked: (user.attendedClasses || 0) >= 50 },
    { id: 5, emoji: '⚡', title: 'Streak Legend', desc: '14-day streak', unlocked: (user.longestStreak || 0) >= 14 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <MobileNav currentPage="profile" />

      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
            
            {/* Header / Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                    fontSize: '48px', fontWeight: 'bold', color: 'var(--text-primary)',
                    overflow: 'hidden'
                }}>
                    {user.image ? (
                    <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                    user.name?.[0] || 'U'
                    )}
                </div>
                </div>

                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {user.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '16px' }}>
                @{user.username || 'user'} • {typeof user.college === 'object' ? user.college?.name : (user.college || 'No College')}
                </p>

                {/* Follow Button */}
                {!isOwner && (
                  <div style={{ marginBottom: '24px' }}>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      style={{
                        padding: '10px 32px', border: 'none', borderRadius: '12px',
                        fontWeight: 600, fontSize: '15px', cursor: followLoading ? 'wait' : 'pointer',
                        background: isFollowing ? 'var(--bg-tertiary)' : '#8b5cf6',
                        color: isFollowing ? 'var(--text-secondary)' : 'white',
                        transition: 'all 0.2s',
                        border: isFollowing ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      {followLoading ? '...' : isFollowing ? 'Following ✓' : 'Follow +'}
                    </button>
                  </div>
                )}

                {/* Follower Stats - Clickable */}
                <div style={{ 
                  display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px',
                  padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                  borderRadius: '14px'
                }}>
                  <div 
                    style={{ textAlign: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onClick={() => fetchFollowDetails('followers')}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--text-primary)' }}>
                      {user.followerCount || user.followers?.length || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Followers</div>
                  </div>
                  <div style={{ width: '1px', background: 'var(--border-color)' }} />
                  <div 
                    style={{ textAlign: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onClick={() => fetchFollowDetails('following')}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--text-primary)' }}>
                      {user.followingCount || user.following?.length || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Following</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div id="profile-stats-grid" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
                background: 'var(--card-bg)', padding: '24px', borderRadius: '20px',
                border: '1px solid var(--border-color)', marginBottom: '32px'
                }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.totalClasses}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Classes</div>
                </div>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{user.attendancePercentage}%</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Attendance</div>
                </div>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171' }}>{user.totalBunks}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Bunks</div>
                </div>
                </div>
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>
                🏆 Achievements
                </h2>
                <div id="achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {achievements.map(a => (
                    <div 
                    key={a.id}
                    style={{ 
                        background: a.unlocked ? 'rgba(139,92,246,0.1)' : 'var(--bg-tertiary)', 
                        border: a.unlocked ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-color)',
                        borderRadius: '12px', padding: '16px', textAlign: 'center',
                        opacity: a.unlocked ? 1 : 0.5
                    }}
                    >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{a.emoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {a.title}
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Owner Actions (Edit Profile Button if Owner) */}
            {isOwner && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button 
                        onClick={() => router.push('/profile')}
                        style={{ 
                            padding: '12px 24px', background: 'var(--bg-tertiary)', 
                            border: '1px solid var(--border-color)', borderRadius: '12px',
                            color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        ⚙️ Manage My Profile
                    </button>
                </div>
            )}
        </div>
      </div>

      <UserListModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle} 
        users={modalUsers} 
        loading={modalLoading}
      />
    </div>
  );
}
