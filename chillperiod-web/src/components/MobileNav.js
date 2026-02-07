'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function MobileNav({ currentPage = 'home' }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--bg-primary)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
            ChillPeriod
          </Link>
          
          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
            <Link href="/spots" style={{ color: currentPage === 'spots' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: currentPage === 'spots' ? 500 : 400, textDecoration: 'none' }}>Spots</Link>
            <Link href="/attendance" style={{ color: currentPage === 'attendance' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: currentPage === 'attendance' ? 500 : 400, textDecoration: 'none' }}>Attendance</Link>
            <Link href="/leaderboard" style={{ color: currentPage === 'leaderboard' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: currentPage === 'leaderboard' ? 500 : 400, textDecoration: 'none' }}>🏆</Link>
            <Link href="/search" style={{ color: currentPage === 'search' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: currentPage === 'search' ? 500 : 400, textDecoration: 'none' }}>🔍</Link>
            <Link href="/profile" style={{ color: currentPage === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: currentPage === 'profile' ? 500 : 400, textDecoration: 'none' }}>Profile</Link>
            <ThemeToggle />
            {status === 'authenticated' && session?.user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#10b981' }}>{session.user.name?.split(' ')[0] || 'User'}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#ef4444' }}>Not Logged In</span>
              </div>
            )}
            {currentPage === 'home' && status === 'unauthenticated' && (
              <Link href="/login" style={{ 
                padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-primary)', 
                borderRadius: '10px', fontWeight: 500, textDecoration: 'none', fontSize: '14px'
              }}>Login</Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{ 
              display: 'none',
              background: 'none', border: 'none', color: 'var(--text-primary)', 
              fontSize: '24px', cursor: 'pointer', padding: '8px'
            }}
            className="mobile-hamburger"
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          style={{ 
            position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0,
            background: 'var(--bg-primary)', 
            backdropFilter: 'blur(12px)',
            zIndex: 40, padding: '24px',
            display: 'none'
          }}
          className="mobile-menu"
          onClick={() => setIsOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link 
              href="/spots" 
              style={{ 
                color: currentPage === 'spots' ? '#8b5cf6' : 'white', 
                fontSize: '20px', fontWeight: 600, textDecoration: 'none',
                padding: '16px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', textAlign: 'center'
              }}
            >
              📍 Spots
            </Link>
            <Link 
              href="/attendance" 
              style={{ 
                color: currentPage === 'attendance' ? '#8b5cf6' : 'white', 
                fontSize: '20px', fontWeight: 600, textDecoration: 'none',
                padding: '16px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', textAlign: 'center'
              }}
            >
              📊 Attendance
            </Link>
            <Link 
              href="/leaderboard" 
              style={{ 
                color: currentPage === 'leaderboard' ? '#8b5cf6' : 'white', 
                fontSize: '20px', fontWeight: 600, textDecoration: 'none',
                padding: '16px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', textAlign: 'center'
              }}
            >
              🏆 Leaderboard
            </Link>
            <Link 
              href="/search" 
              style={{ 
                color: currentPage === 'search' ? '#8b5cf6' : 'white', 
                fontSize: '20px', fontWeight: 600, textDecoration: 'none',
                padding: '16px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', textAlign: 'center'
              }}
            >
              🔍 Find Friends
            </Link>
            <Link 
              href="/profile" 
              style={{ 
                color: currentPage === 'profile' ? '#8b5cf6' : 'white', 
                fontSize: '20px', fontWeight: 600, textDecoration: 'none',
                padding: '16px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', textAlign: 'center'
              }}
            >
              👤 Profile
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ 
                width: '100%',
                color: '#ef4444', 
                fontSize: '20px', fontWeight: 600, 
                padding: '16px', background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px', textAlign: 'center',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
            <Link 
              href="/attendance" 
              style={{ 
                padding: '16px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
                color: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '18px',
                textDecoration: 'none', textAlign: 'center'
              }}
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
