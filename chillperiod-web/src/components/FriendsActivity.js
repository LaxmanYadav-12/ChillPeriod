'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FriendsActivity() {
  const { data: session } = useSession();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - in production would fetch from API
  const mockFriends = [
    { id: '1', name: 'Rahul', image: null, attendancePercentage: 82, status: 'attended', favoriteSpot: { name: 'Sector 17 Park', emoji: '🌳' } },
    { id: '2', name: 'Priya', image: null, attendancePercentage: 78, status: 'bunked', favoriteSpot: { name: 'CCD', emoji: '☕' } },
    { id: '3', name: 'Amit', image: null, attendancePercentage: 91, status: 'attended', favoriteSpot: { name: 'Library', emoji: '📚' } },
  ];

  useEffect(() => {
    // In production, fetch from /api/users/friends/activity
    setFriends(mockFriends);
    setLoading(false);
  }, []);

  if (!session) return null;

  const friendsAbove80 = friends.filter(f => f.attendancePercentage >= 80).length;
  const friendsBunking = friends.filter(f => f.status === 'bunked');

  if (loading) {
    return (
      <div style={{ 
        padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: '16px', marginBottom: '24px'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading friends activity...</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Summary Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '16px', padding: '20px', marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>👥</span>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px' }}>
              {friendsAbove80} of your friends attended 80%+ this week
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Keep up with their progress!
            </div>
          </div>
        </div>

        {/* Friend avatars */}
        <div style={{ display: 'flex', marginLeft: '36px' }}>
          {friends.slice(0, 5).map((friend, i) => (
            <div 
              key={friend.id}
              style={{ 
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: '2px solid var(--bg-primary)',
                marginLeft: i > 0 ? '-8px' : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: 'white', fontWeight: 600
              }}
            >
              {friend.image ? (
                <img src={friend.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : friend.name[0]}
            </div>
          ))}
          {friends.length > 5 && (
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--bg-tertiary)', border: '2px solid var(--bg-primary)',
              marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: 'var(--text-muted)'
            }}>
              +{friends.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Bunking Now */}
      {friendsBunking.length > 0 && (
        <div style={{ 
          background: 'var(--card-bg)', border: '1px solid var(--border-color)',
          borderRadius: '16px', padding: '16px'
        }}>
          <div style={{ 
            fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span>😴</span> Bunking right now
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {friendsBunking.map(friend => (
              <Link
                key={friend.id}
                href={`/users/${friend.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: 'white', fontWeight: 600
                }}>
                  {friend.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>
                    {friend.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    at {friend.favoriteSpot?.emoji} {friend.favoriteSpot?.name}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
