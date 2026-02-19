'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PeopleYouMayKnow() {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    if (session?.user?.id) {
      fetchSuggestions();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch('/api/users/suggestions');
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    setFollowedIds(prev => new Set([...prev, userId]));
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
      if (!res.ok) {
        setFollowedIds(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    } catch {
      setFollowedIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleUnfollow = async (userId) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
    try {
      await fetch(`/api/users/${userId}/follow`, { method: 'DELETE' });
    } catch {
      setFollowedIds(prev => new Set([...prev, userId]));
    }
  };

  const handleDismiss = (userId) => {
    setDismissed(prev => new Set([...prev, userId]));
  };

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s._id));

  if (!loading && visibleSuggestions.length === 0) return null;

  // Skeleton cards
  if (loading) {
    return (
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          👥 People You May Know
        </h2>
        <div style={{
          display: 'flex', gap: '14px', overflowX: 'auto',
          paddingBottom: '8px', scrollSnapType: 'x mandatory',
          msOverflowStyle: 'none', scrollbarWidth: 'none',
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              minWidth: '180px', padding: '20px 16px',
              background: 'var(--card-bg)', border: '1px solid var(--border-color)',
              borderRadius: '20px', scrollSnapAlign: 'start',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--bg-tertiary)', margin: '0 auto 12px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                width: '80px', height: '14px', borderRadius: '6px',
                background: 'var(--bg-tertiary)', margin: '0 auto 8px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                width: '100px', height: '10px', borderRadius: '6px',
                background: 'var(--bg-tertiary)', margin: '0 auto 16px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                width: '100%', height: '36px', borderRadius: '10px',
                background: 'var(--bg-tertiary)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)',
        marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        👥 People You May Know
      </h2>

      <div style={{
        display: 'flex', gap: '14px', overflowX: 'auto',
        paddingBottom: '8px', scrollSnapType: 'x mandatory',
        msOverflowStyle: 'none', scrollbarWidth: 'none',
      }}>
        {visibleSuggestions.map(user => {
          const isFollowed = followedIds.has(user._id);

          return (
            <div key={user._id} style={{
              minWidth: '180px', maxWidth: '200px',
              padding: '20px 16px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              scrollSnapAlign: 'start',
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              textAlign: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              {/* Dismiss button */}
              <button
                onClick={() => handleDismiss(user._id)}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1,
                  padding: '4px', borderRadius: '50%',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                title="Dismiss"
              >
                ✕
              </button>

              {/* Avatar */}
              <Link href={`/profile/${user._id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', overflow: 'hidden',
                  fontSize: '22px', fontWeight: 'bold', color: 'white',
                }}>
                  {user.image
                    ? <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user.name?.[0] || 'U')
                  }
                </div>

                {/* Name */}
                <div style={{
                  fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  marginBottom: '2px',
                }}>
                  {user.name}
                </div>
                {user.username && (
                  <div style={{
                    fontSize: '12px', color: '#a78bfa',
                    marginBottom: '6px',
                  }}>
                    @{user.username}
                  </div>
                )}
              </Link>

              {/* Reason tag */}
              <div style={{
                fontSize: '10px', color: 'var(--text-secondary)',
                background: 'var(--bg-tertiary)',
                borderRadius: '8px', padding: '4px 8px',
                marginBottom: '14px', lineHeight: '1.3',
                display: 'inline-block',
                maxWidth: '100%',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.reason}
              </div>

              {/* Mutual count */}
              {user.mutualCount > 0 && (
                <div style={{
                  fontSize: '10px', color: 'var(--text-muted)',
                  marginBottom: '10px',
                }}>
                  {user.mutualCount} mutual connection{user.mutualCount > 1 ? 's' : ''}
                </div>
              )}

              {/* Follow / Following button */}
              <button
                onClick={() => isFollowed ? handleUnfollow(user._id) : handleFollow(user._id)}
                style={{
                  width: '100%', padding: '8px 0',
                  borderRadius: '10px', border: 'none',
                  fontWeight: 600, fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: isFollowed
                    ? 'var(--bg-tertiary)'
                    : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: isFollowed ? 'var(--text-secondary)' : 'white',
                }}
              >
                {isFollowed ? '✓ Following' : '+ Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
