'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(`/api/users/check-username?username=${username}`);
        const data = await res.json();
        setAvailable(data.available);
        if (!data.available) {
          setError('Username already taken');
        } else {
          setError('');
        }
      } catch (err) {
        console.error(err);
      }
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const validateUsername = (value) => {
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(value)) {
      return 'Only lowercase letters, numbers, underscores. 3-20 chars.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!available) {
      setError('Please choose an available username');
      return;
    }

    try {
      const res = await fetch('/api/users/set-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (res.ok) {
        router.push('/attendance');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to set username');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', background: 'var(--bg-primary)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ 
        maxWidth: '400px', width: '100%', 
        background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: '24px', padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome to ChillPeriod!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Choose a unique username to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--text-muted)', fontSize: '16px' 
              }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="your_username"
                style={{
                  width: '100%', padding: '14px 16px 14px 36px',
                  background: 'var(--bg-tertiary)', 
                  border: error ? '1px solid #ef4444' : available === true ? '1px solid #10b981' : '1px solid var(--border-color)',
                  borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
                }}
              />
              {checking && (
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  ⏳
                </span>
              )}
              {!checking && available === true && (
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }}>
                  ✓
                </span>
              )}
              {!checking && available === false && (
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }}>
                  ✗
                </span>
              )}
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
            {available && !error && (
              <p style={{ color: '#10b981', fontSize: '12px', marginTop: '6px' }}>Username available! ✓</p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px' }}>
              This is how others will find and follow you
            </p>
          </div>

          <button
            type="submit"
            disabled={!available || checking}
            style={{
              width: '100%', padding: '14px',
              background: available ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'var(--bg-tertiary)',
              color: available ? 'white' : 'var(--text-muted)',
              border: 'none', borderRadius: '12px',
              fontWeight: 600, fontSize: '16px', cursor: available ? 'pointer' : 'not-allowed'
            }}
          >
            Continue →
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px' }}>
          Logged in as {session?.user?.email}
        </p>
      </div>
    </div>
  );
}
