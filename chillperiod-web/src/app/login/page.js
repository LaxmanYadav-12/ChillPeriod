'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background */}
      <div style={{ 
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ 
        maxWidth: '400px', width: '100%', margin: '0 24px',
        background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '24px', 
        padding: '48px 32px', textAlign: 'center', position: 'relative'
      }}>
        {/* Logo */}
        <Link href="/" style={{ 
          fontSize: '28px', fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
          textDecoration: 'none', display: 'block', marginBottom: '8px'
        }}>
          ChillPeriod
        </Link>
        
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Login to sync your attendance data
        </p>

        {/* Discord Login Button */}
        <button 
          onClick={() => signIn('discord', { callbackUrl: '/attendance' })}
          style={{ 
            width: '100%', padding: '16px 24px', 
            background: '#5865F2', color: 'white', 
            border: 'none', borderRadius: '14px', 
            fontWeight: 600, fontSize: '16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#4752C4'}
          onMouseLeave={e => e.currentTarget.style.background = '#5865F2'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Continue with Discord
        </button>

        <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '24px' }}>
          By logging in, you agree to our Terms of Service
        </p>

        {/* Back link */}
        <Link href="/" style={{ 
          display: 'inline-block', marginTop: '24px', 
          color: '#6b7280', fontSize: '14px', textDecoration: 'none'
        }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
