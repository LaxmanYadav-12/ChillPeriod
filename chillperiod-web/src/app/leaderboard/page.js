'use client';

import MobileNav from '@/components/MobileNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, month, week
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?limit=50`);
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Use mock data if API fails
      setLeaderboard(mockLeaderboard);
    }
    setLoading(false);
  };

  // Mock data for demo
  const mockLeaderboard = [
    { _id: '1', name: 'Bunk Master Tony', username: 'tony', totalBunks: 127, rank: 1, title: 'Bunk Legend', titleEmoji: '👑', attendancePercentage: 76 },
    { _id: '2', name: 'Sleepy Sharma', username: 'sharma', totalBunks: 89, rank: 2, title: 'Bunk King', titleEmoji: '🏆', attendancePercentage: 71 },
    { _id: '3', name: 'Chill Kumar', username: 'kumar', totalBunks: 67, rank: 3, title: 'Bunk King', titleEmoji: '🏆', attendancePercentage: 78 },
    { _id: '4', name: 'Lazy Gupta', username: 'gupta', totalBunks: 45, rank: 4, title: 'Serial Skipper', titleEmoji: '😴', attendancePercentage: 75 },
    { _id: '5', name: 'Snooze Singh', username: 'singh', totalBunks: 34, rank: 5, title: 'Serial Skipper', titleEmoji: '😴', attendancePercentage: 80 },
    { _id: '6', name: 'Nap King Verma', username: 'verma', totalBunks: 28, rank: 6, title: 'Serial Skipper', titleEmoji: '😴', attendancePercentage: 82 },
    { _id: '7', name: 'Rest Mode Rao', username: 'rao', totalBunks: 21, rank: 7, title: 'Chill Master', titleEmoji: '😎', attendancePercentage: 79 },
    { _id: '8', name: 'Break Time Bhai', username: 'bhai', totalBunks: 15, rank: 8, title: 'Chill Master', titleEmoji: '😎', attendancePercentage: 77 },
    { _id: '9', name: 'Skip Day Shah', username: 'shah', totalBunks: 12, rank: 9, title: 'Chill Master', titleEmoji: '😎', attendancePercentage: 81 },
    { _id: '10', name: 'Newbie Nair', username: 'nair', totalBunks: 5, rank: 10, title: 'Casual Bunker', titleEmoji: '🌴', attendancePercentage: 85 },
  ];

  const displayData = (leaderboard.length > 0 ? leaderboard : mockLeaderboard).filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return user.name?.toLowerCase().includes(query) || user.username?.toLowerCase().includes(query);
  });

  const getRankStyle = (rank) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #ffd700, #ffb347)', color: '#1a1a2e' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #c0c0c0, #a8a8a8)', color: '#1a1a2e' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #cd7f32, #b87333)', color: '#1a1a2e' };
    return { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <MobileNav currentPage="leaderboard" />

      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bunk Leaderboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Who's the ultimate bunker? 
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: '400px', margin: '0 auto 24px auto' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or @username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px', 
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px',
                color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
              }}
            />
          </div>

          {/* Time Filter Tabs */}
          <div style={{ 
            display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px',
            padding: '4px', background: 'var(--bg-tertiary)', borderRadius: '12px', width: 'fit-content', margin: '0 auto 24px auto'
          }}>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'This Week' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeFilter(tab.id)}
                style={{
                  padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 500, fontSize: '14px', transition: 'all 0.2s',
                  background: timeFilter === tab.id ? '#8b5cf6' : 'transparent',
                  color: timeFilter === tab.id ? 'white' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          {displayData.length >= 3 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '32px' }} id="podium">
              {/* 2nd Place */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '150px' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 8px auto',
                  background: 'linear-gradient(135deg, #c0c0c0, #a8a8a8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
                }}>🥈</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                  {displayData[1]?.name?.split(' ')[0]}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{displayData[1]?.totalBunks} bunks</div>
                <div style={{ 
                  height: '80px', background: 'linear-gradient(135deg, #c0c0c0, #a8a8a8)', 
                  borderRadius: '8px 8px 0 0', marginTop: '8px'
                }} />
              </div>

              {/* 1st Place */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '150px' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 8px auto',
                  background: 'linear-gradient(135deg, #ffd700, #ffb347)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                  boxShadow: '0 0 30px rgba(255,215,0,0.4)'
                }}>👑</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>
                  {displayData[0]?.name?.split(' ')[0]}
                </div>
                <div style={{ color: '#ffd700', fontSize: '13px', fontWeight: 600 }}>{displayData[0]?.totalBunks} bunks</div>
                <div style={{ 
                  height: '120px', background: 'linear-gradient(135deg, #ffd700, #ffb347)', 
                  borderRadius: '8px 8px 0 0', marginTop: '8px'
                }} />
              </div>

              {/* 3rd Place */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '150px' }}>
                <div style={{ 
                  width: '55px', height: '55px', borderRadius: '50%', margin: '0 auto 8px auto',
                  background: 'linear-gradient(135deg, #cd7f32, #b87333)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                }}>🥉</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                  {displayData[2]?.name?.split(' ')[0]}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{displayData[2]?.totalBunks} bunks</div>
                <div style={{ 
                  height: '60px', background: 'linear-gradient(135deg, #cd7f32, #b87333)', 
                  borderRadius: '8px 8px 0 0', marginTop: '8px'
                }} />
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
            borderRadius: '20px', overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading leaderboard...
              </div>
            ) : (
              displayData.map((user, index) => (
                <Link
                  key={user._id}
                  href={`/users/${user._id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
                    borderBottom: index < displayData.length - 1 ? '1px solid var(--border-color)' : 'none',
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px',
                    ...getRankStyle(user.rank)
                  }}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {user.image ? (
                      <img src={user.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : user.titleEmoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{user.name}</span>
                      <span style={{ 
                        fontSize: '11px', padding: '2px 8px', 
                        background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                        borderRadius: '4px'
                      }}>{user.title}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {user.attendancePercentage}% attendance
                    </div>
                  </div>

                  {/* Bunks */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#8b5cf6' }}>{user.totalBunks}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>bunks</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Your Stats */}
          {session?.user && (
            <div style={{ 
              marginTop: '24px', padding: '20px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Your Rank</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                #{session.user.totalBunks > 0 ? '??' : '-'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {session.user.totalBunks || 0} bunks total
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          #podium {
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
