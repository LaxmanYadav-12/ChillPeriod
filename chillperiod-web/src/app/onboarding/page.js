'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { COLLEGES } from '@/lib/data/colleges';

// Mock data for dropdowns (in real app, could come from config)
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const SECTIONS = ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-DS', 'EEE', 'ECE', 'IT'];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    semester: 4,
    section: 'CSE-A',
    username: ''
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user?.name) {
        setFormData(prev => ({ ...prev, name: session.user.name }));
    }
  }, [status, session, router]);

  // Username check
  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await fetch(`/api/users/check-username?username=${formData.username}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
        if (!data.available) setError('Username taken');
        else setError('');
      } catch (err) {
        console.error(err);
      }
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'username') setError('');
  };

  const validateStep1 = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.college) return 'Please select a college';
    return '';
  };

  const validateStep2 = () => {
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(formData.username)) return 'Invalid username format';
    if (usernameAvailable === false) return 'Username is taken';
    return '';
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/users/set-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: formData.username,
            name: formData.name,
            RZ_college: formData.college, // Using mapped Key from backend
            semester: formData.semester,
            section: formData.section
        })
      });

      if (res.ok) {
        await update(); // Update session
        router.push('/attendance');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create profile');
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setSubmitting(false);
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)]">Loading...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', background: 'var(--bg-primary)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{ 
        maxWidth: '500px', width: '100%', 
        background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: '24px', padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Setup your Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Let's get you ready for college life!
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '4px', borderRadius: '4px', background: step >= 1 ? 'var(--accent-purple)' : 'var(--bg-tertiary)' }} />
            <div style={{ flex: 1, height: '4px', borderRadius: '4px', background: step >= 2 ? 'var(--accent-purple)' : 'var(--bg-tertiary)' }} />
        </div>

        {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Display Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Rahul Gupta"
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)', outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>College</label>
                    <select
                        value={formData.college}
                        onChange={(e) => handleChange('college', e.target.value)}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)', outline: 'none'
                        }}
                    >
                        <option value="">Select College</option>
                        {COLLEGES.map(college => (
                            <option key={college} value={college}>{college}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Semester</label>
                        <select
                            value={formData.semester}
                            onChange={(e) => handleChange('semester', e.target.value)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)', outline: 'none'
                            }}
                        >
                            {SEMESTERS.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Section</label>
                        <select
                            value={formData.section}
                            onChange={(e) => handleChange('section', e.target.value)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)', outline: 'none'
                            }}
                        >
                            {SECTIONS.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => {
                        const err = validateStep1();
                        if (err) setError(err);
                        else { setError(''); setStep(2); }
                    }}
                    style={{
                        padding: '16px', background: 'var(--accent-purple)', color: 'white',
                        borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '16px',
                        cursor: 'pointer', marginTop: '8px'
                    }}
                >
                    Next Step →
                </button>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Choose Username</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>@</span>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="username"
                            style={{
                                width: '100%', padding: '14px 16px 14px 36px', borderRadius: '12px',
                                background: 'var(--bg-tertiary)', 
                                border: error && step === 2 ? '1px solid #ef4444' : usernameAvailable === true ? '1px solid #10b981' : '1px solid var(--border-color)',
                                color: 'var(--text-primary)', outline: 'none'
                            }}
                        />
                         {checkingUsername && <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>⏳</span>}
                    </div>
                    {usernameAvailable === true && <p style={{ color: '#10b981', fontSize: '12px', marginTop: '6px' }}>Available!</p>}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setStep(1)}
                        style={{
                            padding: '16px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                            borderRadius: '12px', border: 'none', fontWeight: 600, flex: 1, cursor: 'pointer'
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || checkingUsername || !usernameAvailable}
                        style={{
                            padding: '16px', 
                            background: submitting ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
                            color: submitting ? 'var(--text-muted)' : 'white',
                            borderRadius: '12px', border: 'none', fontWeight: 600, flex: 2, cursor: 'pointer',
                            opacity: (submitting || checkingUsername || !usernameAvailable) ? 0.7 : 1
                        }}
                    >
                        {submitting ? 'Creating Profile...' : 'Complete Setup ✨'}
                    </button>
                </div>
            </div>
        )}

        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>{error}</p>}
      </div>
    </div>
  );
}
