'use client';

import MobileNav from '@/components/MobileNav';
import AttendanceHeatmap from '@/components/AttendanceHeatmap';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    // Only fetch user when session loading is finished (either authenticated or null)
    if (session !== undefined) {
      fetchUser();
    }
  }, [id, session]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        // Check if current user follows this user
        if (session?.user?.id && data.followers && Array.isArray(data.followers)) {
          const myId = String(session.user.id).trim();
          const alreadyFollowing = data.followers.some(f => {
            // Handle all possible formats: populated object, raw ObjectId, plain string
            const rawId = f?._id || f?.id || f;
            const fId = typeof rawId === 'object' ? String(rawId.$oid || rawId._id || rawId) : String(rawId);
            return fId.trim() === myId;
          });
          setIsFollowing(alreadyFollowing);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!session?.user) {
      window.location.href = '/login';
      return;
    }

    setFollowLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`/api/users/${id}/follow`, { method });
      
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setUser(prev => ({
          ...prev,
          followerCount: prev.followerCount + (isFollowing ? -1 : 1)
        }));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
    setFollowLoading(false);
  };

  // Mock user for demo
  const mockUser = {
    name: 'Demo User',
    username: 'demouser',
    college: 'Delhi University',
    totalBunks: 42,
    attendedClasses: 48,
    totalClasses: 60,
    attendancePercentage: 80,
    followerCount: 23,
    followingCount: 15,
    favoriteSpot: { name: 'Central Park', emoji: '🌳' },
    isPublic: true,
    xp: 0,
    level: 1
  };

  const displayUser = user || mockUser;
  const isOwnProfile = session?.user?.id === id;

  // Calculate Progress to next level
  const xp = displayUser.xp || 0;
  const level = displayUser.level || 1;
  const currentLevelXp = Math.pow(level - 1, 2) * 10;
  const nextLevelXp = Math.pow(level, 2) * 10;
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = xpNeededForLevel > 0 
    ? Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100))
    : 0;


  // Bunk title logic
  const getBunkTitle = (bunks) => {
    if (bunks >= 100) return { title: 'Bunk Legend', emoji: '👑' };
    if (bunks >= 50) return { title: 'Bunk King', emoji: '🏆' };
    if (bunks >= 25) return { title: 'Serial Skipper', emoji: '😴' };
    if (bunks >= 10) return { title: 'Chill Master', emoji: '😎' };
    if (bunks >= 5) return { title: 'Casual Bunker', emoji: '🌴' };
    return { title: 'Rookie', emoji: '🌱' };
  };

  const bunkTitle = getBunkTitle(displayUser.totalBunks || 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <MobileNav currentPage="profile" />

      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>

          {/* Profile Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {/* Avatar */}
            <div style={{ 
              width: '100px', height: '100px', margin: '0 auto 16px auto',
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              padding: '3px'
            }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', 
                background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '40px', overflow: 'hidden'
              }}>
                {displayUser.image ? (
                  <img src={displayUser.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '👤'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {displayUser.name}
              </h1>
            </div>
            
            {displayUser.username && (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
                @{displayUser.username}
              </p>
            )}

            {displayUser.college && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                📍 {displayUser.college}
              </p>
            )}

            {/* XP Progress Bar */}
            <div style={{ maxWidth: '300px', margin: '0 auto 20px auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                  }}>
                    Lv {level}
                  </div>
                  <span>XP: {xp} / {nextLevelXp}</span>
                </div>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${progressPercentage}%`, height: '100%', 
                  background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                  borderRadius: '4px', transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>

            {/* Bunk Title Badge */}
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span>{bunkTitle.emoji}</span>
              <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 500 }}>{bunkTitle.title}</span>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  style={{
                    padding: '12px 32px', border: 'none', borderRadius: '12px',
                    fontWeight: 600, fontSize: '15px', cursor: followLoading ? 'wait' : 'pointer',
                    background: isFollowing ? 'var(--bg-tertiary)' : '#8b5cf6',
                    color: isFollowing ? 'var(--text-secondary)' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  {followLoading ? '...' : isFollowing ? 'Following ✓' : 'Follow +'}
                </button>
              </div>
            )}

            {isOwnProfile && (
              <Link href="/profile" style={{
                display: 'inline-block', marginTop: '8px',
                padding: '10px 24px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)', borderRadius: '10px',
                color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none'
              }}>
                ✏️ Edit Profile
              </Link>
            )}
          </div>

          {/* Follower Stats */}
          <div style={{ 
            display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px',
            padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
            borderRadius: '14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--text-primary)' }}>
                {displayUser.followerCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Followers</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--text-primary)' }}>
                {displayUser.followingCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Following</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '14px', padding: '16px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {displayUser.attendancePercentage || 0}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attendance</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '14px', padding: '16px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {displayUser.totalBunks || 0}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Bunks</div>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderRadius: '14px', padding: '16px', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {displayUser.attendedClasses || 0}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attended</div>
            </div>
          </div>

          {/* Attendance Heatmap */}
          {(() => {
            // Transform array format to object format for the heatmap
            const logMap = {};
            const rawLog = displayUser.attendanceLog || [];
            if (Array.isArray(rawLog)) {
              rawLog.forEach(day => {
                if (!day.date || !day.actions) return;
                let attended = 0, bunked = 0;
                day.actions.forEach(a => {
                  if (a.status === 'attended') attended++;
                  if (a.status === 'bunked') bunked++;
                });
                if (attended > 0 || bunked > 0) {
                  logMap[day.date] = { attended, bunked };
                }
              });
            }
            return <AttendanceHeatmap attendanceLog={logMap} />;
          })()}

          {/* Favorite Spot */}
          {displayUser.favoriteSpot?.name && (
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '16px', padding: '20px', marginBottom: '24px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Favorite Bunking Spot
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{displayUser.favoriteSpot.emoji || '📍'}</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {displayUser.favoriteSpot.name}
                </span>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/leaderboard" style={{ 
              flex: 1, padding: '14px', background: 'var(--card-bg)', 
              border: '1px solid var(--border-color)', borderRadius: '12px',
              textAlign: 'center', textDecoration: 'none', color: 'var(--text-primary)',
              fontWeight: 500, fontSize: '14px'
            }}>
              🏆 View Leaderboard
            </Link>
            <Link href="/spots" style={{ 
              flex: 1, padding: '14px', background: 'var(--card-bg)', 
              border: '1px solid var(--border-color)', borderRadius: '12px',
              textAlign: 'center', textDecoration: 'none', color: 'var(--text-primary)',
              fontWeight: 500, fontSize: '14px'
            }}>
              📍 Find Spots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
