'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(null);

  const handleSignIn = async (provider) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: '/attendance' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background */}
      <div style={{ 
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ 
        maxWidth: '400px', width: '100%', margin: '0 24px',
        background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
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
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Login to sync your attendance data
        </p>

        {/* Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Google Login Button */}
          <button 
            onClick={() => handleSignIn('google')}
            disabled={isLoading}
            style={{ 
              width: '100%', padding: '14px 24px', 
              background: 'white', color: '#374151', 
              border: '1px solid #e5e7eb', borderRadius: '14px', 
              fontWeight: 600, fontSize: '15px', cursor: isLoading === 'google' ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              transition: 'all 0.2s',
              opacity: isLoading && isLoading !== 'google' ? 0.5 : 1
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Discord Login Button */}
          <button 
            onClick={() => handleSignIn('discord')}
            disabled={isLoading}
            style={{ 
              width: '100%', padding: '14px 24px', 
              background: '#5865F2', color: 'white', 
              border: 'none', borderRadius: '14px', 
              fontWeight: 600, fontSize: '15px', cursor: isLoading === 'discord' ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              transition: 'all 0.2s',
              opacity: isLoading && isLoading !== 'discord' ? 0.5 : 1
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {isLoading === 'discord' ? 'Connecting...' : 'Continue with Discord'}
          </button>
        </div>



        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px' }}>
          By logging in, you agree to our Terms of Service
        </p>

        {/* Info box */}
        <div style={{ 
          marginTop: '20px', padding: '12px 16px', 
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '10px', textAlign: 'left'
        }}>
          <p style={{ color: '#a78bfa', fontSize: '12px', margin: 0 }}>
            💡 Login with Discord to sync with the ChillPeriod bot!
          </p>
        </div>

        {/* Back link */}
        <Link href="/" style={{ 
          display: 'inline-block', marginTop: '24px', 
          color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none'
        }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
