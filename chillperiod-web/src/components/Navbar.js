'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
          ChillPeriod
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/spots" style={{ color: '#9ca3af', textDecoration: 'none' }}>Spots</Link>
          <Link href="/attendance" style={{ color: '#9ca3af', textDecoration: 'none' }}>Attendance</Link>
          
          {status === 'loading' ? (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2a2a3a' }} />
          ) : session ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
                }}
              >
                <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                  <Image 
                    src={session.user.image || `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`}
                    alt="avatar"
                    fill
                    sizes="32px"
                    style={{ borderRadius: '50%', border: '2px solid #8b5cf6', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                    unoptimized // Use unoptimized if using external CDNs that might not be fully configured in next.config yet or for simpler fallback handling
                  />
                </div>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                  {session.user.name || session.user.username}
                </span>
              </button>
              
              {showMenu && (
                <div style={{ 
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                  background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '12px',
                  padding: '8px', minWidth: '150px'
                }}>
                  <div style={{ padding: '8px 12px', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #2a2a3a' }}>
                    Signed in as<br/>
                    <span style={{ color: 'white' }}>{session.user.email}</span>
                  </div>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{ 
                      width: '100%', padding: '10px 12px', marginTop: '4px',
                      background: 'rgba(239,68,68,0.1)', color: '#f87171', 
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '14px', textAlign: 'left'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ 
              padding: '8px 16px', background: '#5865F2', color: 'white', 
              borderRadius: '10px', fontWeight: 500, textDecoration: 'none', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
