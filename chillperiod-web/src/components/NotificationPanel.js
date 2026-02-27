'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TIMETABLE_DATA, getSchedule } from '@/lib/data/timetable';

export default function NotificationPanel({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [friendsBunking, setFriendsBunking] = useState([]);
  const [nextClasses, setNextClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch everything when panel opens
  useEffect(() => {
    if (!isOpen || !session?.user?.id) return;
    setLoading(true);

    // Check for missing group
    if (!session.user.group && !notifications.some(n => n.id === 'missing-group')) {
        setNotifications(prev => [
            {
                _id: 'missing-group',
                type: 'system',
                message: '⚠️ Please set your Group (G1/G2) in Profile to get accurate lab schedules!',
                read: false,
                link: '/profile',
                createdAt: new Date().toISOString()
            },
            ...prev
        ]);
    }

    const fetchAll = async () => {
      try {
        // Fetch in-app notifications
        const notifRes = await fetch('/api/notifications');
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }

        // Fetch friends bunking
        const actRes = await fetch('/api/users/friends/activity');
        if (actRes.ok) {
          const data = await actRes.json();
          setFriendsBunking(data.friendsBunking || []);
        }

        // Calculate next classes
        let semester = session.user.semester;
        let section = session.user.section;
        try {
          const userRes = await fetch(`/api/users/${session.user.id}?t=${Date.now()}`, { cache: 'no-store' });
          if (userRes.ok) {
            const userData = await userRes.json();
            semester = userData.semester;
            section = userData.section;
          }
        } catch (e) { /* use defaults */ }

        if (semester && section) {
          const now = new Date();
          const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const sectionData = getSchedule(parseInt(semester), section);

          if (sectionData?.schedule[dayName]) {
            const upcoming = [];
            sectionData.schedule[dayName].forEach(classSlot => {
              if (classSlot.type === 'BREAK' || classSlot.type === 'ACTIVITY') return;
              const timeSlot = TIMETABLE_DATA.time_slots.find(ts => ts.slot === classSlot.slot);
              if (!timeSlot) return;
              const [startStr] = timeSlot.time.split('-');
              const [h, m] = startStr.split(':').map(Number);
              const startTime = h * 60 + m;
              if (startTime > currentTime) {
                upcoming.push({
                  subject: classSlot.subject || classSlot.G1 || 'Lab',
                  time: timeSlot.time,
                  room: sectionData.room || 'N/A',
                  minutesAway: startTime - currentTime,
                  slot: classSlot.slot,
                  type: classSlot.type,
                });
              }
            });
            setNextClasses(upcoming.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('NotificationPanel fetch error:', err);
      }
      setLoading(false);
    };

    fetchAll();
  }, [isOpen, session]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleJoinBunk = async (notificationId) => {
    try {
        const res = await fetch('/api/notifications/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId, action: 'join' })
        });
        if (res.ok) {
            const data = await res.json();
            // Mark as read and update UI
            setNotifications(prev => prev.map(n => n._id === notificationId 
              ? { ...n, read: true, joinResult: data } 
              : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    } catch (err) {
        console.error('Failed to join bunk', err);
    }
  };

  const formatTime = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const followNotifications = notifications.filter(n => n.type === 'follow');

  const tabs = [
    { id: 'all', label: 'All', icon: '🔔' },
    { id: 'followers', label: 'Followers', icon: '👥' },
    { id: 'bunking', label: 'Bunking', icon: '😴' },
    { id: 'classes', label: 'Classes', icon: '📅' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 998, transition: 'opacity 0.3s',
            opacity: isOpen ? 1 : 0
          }}
        />
      )}

      {/* Side Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-primary)',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
        zIndex: 999,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto'
      }}>

        {/* Panel Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-primary)',
          position: 'sticky', top: 0, zIndex: 1
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            🔔 Notifications
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  padding: '6px 12px', background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px',
                  color: '#a78bfa', fontSize: '12px', fontWeight: 500, cursor: 'pointer'
                }}
              >
                Read all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--bg-tertiary)', border: 'none',
                color: 'var(--text-secondary)', fontSize: '18px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '6px', padding: '12px 20px',
          overflowX: 'auto', borderBottom: '1px solid var(--border-color)'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                background: activeTab === tab.id ? '#8b5cf6' : 'var(--bg-tertiary)',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Loading...
            </div>
          ) : (
            <>
              {/* System/Followers */}
              {(activeTab === 'all' || activeTab === 'followers') && (
                <div style={{ marginBottom: '16px' }}>
                  {activeTab === 'all' && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📢 Notifications
                    </div>
                  )}
                  
                  {/* System Notifications (Manual Injection) */}
                  {notifications.filter(n => n.type === 'system').map(notif => (
                     <Link 
                        key={notif._id}
                        href={notif.link || '#'}
                        onClick={onClose}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px', textDecoration: 'none',
                            marginBottom: '8px'
                        }}
                     >
                        <div style={{ fontSize: '20px' }}>⚠️</div>
                        <div style={{ flex: 1, color: '#ef4444', fontWeight: 500, fontSize: '13px' }}>
                            {notif.message}
                        </div>
                        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>Fix →</div>
                     </Link>
                  ))}

                  {activeTab === 'all' && followNotifications.length > 0 && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '12px' }}>
                      👥 Followers
                    </div>
                  )}
                  {followNotifications.length === 0 && activeTab === 'followers' && (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>👥</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>No followers yet</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>When someone follows you, it'll show here</div>
                    </div>
                  )}
                  {/* Mass Bunk Notifications */}
                  {notifications.filter(n => n.type === 'mass_bunk').map(notif => (
                    <div
                      key={notif._id}
                      style={{
                        padding: '12px', background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: '12px', marginBottom: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '15px', color: 'white', fontWeight: 600, overflow: 'hidden'
                        }}>
                          {notif.fromUserId?.image ? (
                            <img src={notif.fromUserId.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (notif.fromUserId?.name?.[0] || '👤')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>{notif.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>{notif.message}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>{formatTime(notif.createdAt)}</div>
                        </div>
                      </div>
                      
                      {notif.joinResult ? (
                        <div style={{ 
                          marginLeft: '50px', padding: '10px', borderRadius: '8px',
                          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)'
                        }}>
                          <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>✅</span>
                            {notif.joinResult.bunkedCount > 0 
                              ? `Bunked ${notif.joinResult.bunkedCount} class${notif.joinResult.bunkedCount > 1 ? 'es' : ''}: ${notif.joinResult.bunkedSubjects?.join(', ')}`
                              : 'Joined! No overlapping classes in your schedule.'
                            }
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                            Followers notified 📢
                          </div>
                        </div>
                      ) : !notif.read && (
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '50px' }}>
                          <button
                            onClick={() => handleJoinBunk(notif._id)}
                            style={{
                              flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                              background: '#f59e0b', color: 'white', fontSize: '12px',
                              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }}
                          >
                            <span>🏃</span> Bunk Together
                          </button>
                          <button
                            onClick={() => handleMarkRead(notif._id)}
                            style={{
                              padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '12px',
                              fontWeight: 500, cursor: 'pointer'
                            }}
                          >
                            Ignore
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Standard Follow/BunkJoin Notifications */}
                  {notifications.filter(n => n.type === 'follow' || n.type === 'bunk_join').map(notif => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.read && handleMarkRead(notif._id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', background: notif.read ? 'transparent' : 'rgba(139,92,246,0.06)',
                        border: `1px solid ${notif.read ? 'var(--border-color)' : 'rgba(139,92,246,0.2)'}`,
                        borderRadius: '12px', cursor: notif.read ? 'default' : 'pointer',
                        marginBottom: '6px', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '15px', color: 'white', fontWeight: 600, overflow: 'hidden'
                      }}>
                        {notif.fromUserId?.image ? (
                          <img src={notif.fromUserId.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (notif.fromUserId?.name?.[0] || '👤')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '13px' }}>{notif.message}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{formatTime(notif.createdAt)}</div>
                      </div>
                      {!notif.read && (
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bunking */}
              {(activeTab === 'all' || activeTab === 'bunking') && (
                <div style={{ marginBottom: '16px' }}>
                  {activeTab === 'all' && friendsBunking.length > 0 && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      😴 Bunking Today
                    </div>
                  )}
                  {friendsBunking.length === 0 && activeTab === 'bunking' && (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>😎</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>Everyone's in class!</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>No friends bunking right now</div>
                    </div>
                  )}
                  {friendsBunking.map(friend => (
                    <Link
                      key={friend.id}
                      href={`/users/${friend.id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', background: 'rgba(245,158,11,0.05)',
                        border: '1px solid rgba(245,158,11,0.15)',
                        borderRadius: '12px', textDecoration: 'none',
                        marginBottom: '6px', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '15px', color: 'white', fontWeight: 600, overflow: 'hidden'
                      }}>
                        {friend.image ? (
                          <img src={friend.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : friend.name[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '13px' }}>{friend.name} is bunking</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                          {(friend.favoriteSpot?.name) ? `at ${friend.favoriteSpot.emoji || '📍'} ${friend.favoriteSpot.name}` : 'Somewhere nearby'}
                        </div>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>→</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Classes */}
              {(activeTab === 'all' || activeTab === 'classes') && (
                <div style={{ marginBottom: '16px' }}>
                  {activeTab === 'all' && nextClasses.length > 0 && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📅 Upcoming Classes
                    </div>
                  )}
                  {nextClasses.length === 0 && (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>No more classes today!</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Go find a chill spot!</div>
                    </div>
                  )}
                  {nextClasses.map((cls) => (
                    <div
                      key={cls.slot}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px',
                        background: cls.minutesAway <= 10 ? 'rgba(239,68,68,0.05)' : 'transparent',
                        border: `1px solid ${cls.minutesAway <= 10 ? 'rgba(239,68,68,0.2)' : 'var(--border-color)'}`,
                        borderRadius: '12px', marginBottom: '6px'
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: cls.minutesAway <= 10
                          ? 'linear-gradient(135deg, #ef4444, #f59e0b)'
                          : 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', color: cls.minutesAway <= 10 ? 'white' : 'var(--text-secondary)'
                      }}>
                        {cls.minutesAway <= 10 ? '⚡' : cls.type === 'LAB' ? '🔬' : '📖'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '13px' }}>
                          {cls.subject}
                          <span style={{ marginLeft: '6px', fontSize: '10px', padding: '2px 5px', borderRadius: '4px', background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
                            {cls.type}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                          🕐 {cls.time} • Room {cls.room}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                        background: cls.minutesAway <= 10 ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.1)',
                        color: cls.minutesAway <= 10 ? '#ef4444' : '#a78bfa'
                      }}>
                        {cls.minutesAway < 60 ? `${cls.minutesAway}m` : `${Math.floor(cls.minutesAway / 60)}h ${cls.minutesAway % 60}m`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state for All tab */}
              {activeTab === 'all' && followNotifications.length === 0 && friendsBunking.length === 0 && nextClasses.length === 0 && (
                <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>
                    You're all caught up!
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                    Follow friends to see their activity here.
                  </div>
                  <Link href="/search" onClick={onClose} style={{
                    display: 'inline-block', padding: '10px 20px', background: '#8b5cf6', color: 'white',
                    borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '13px'
                  }}>
                    Find Friends
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
