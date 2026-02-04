'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function MobileNav({ currentPage = 'home' }) {
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
            <ThemeToggle />
            {currentPage === 'home' && (
              <Link href="/attendance" style={{ 
                padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-primary)', 
                borderRadius: '10px', fontWeight: 500, textDecoration: 'none', fontSize: '14px'
              }}>Get Started</Link>
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
