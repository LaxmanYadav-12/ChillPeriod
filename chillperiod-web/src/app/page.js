'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const emojis = ['😎', '🎉', '🔥', '✨', '🚀'];

  useEffect(() => {
    const interval = setInterval(() => setCurrentEmoji(prev => (prev + 1) % emojis.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <div style={{ 
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Navigation */}
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
            <Link href="/attendance" style={{ 
              padding: '8px 16px', background: 'white', color: 'black', 
              borderRadius: '10px', fontWeight: 500, textDecoration: 'none', fontSize: '14px'
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Badge */}
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', background: 'rgba(139,92,246,0.1)', 
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', marginBottom: '32px'
          }}>
            <span style={{ fontSize: '20px' }}>{emojis[currentEmoji]}</span>
            <span style={{ color: '#a78bfa', fontSize: '14px' }}>Now with timetable sync</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '24px' }}>
            <span style={{ color: 'white' }}>Bunk</span>{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smarter</span>
          </h1>

          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            Track attendance, calculate safe bunks, and find chill spots near your college. All in one place.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/attendance" style={{ 
              padding: '16px 32px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
              color: 'white', borderRadius: '14px', fontWeight: 600, fontSize: '16px',
              textDecoration: 'none', boxShadow: '0 8px 32px rgba(139,92,246,0.3)'
            }}>
              Open Dashboard
            </Link>
            <Link href="/spots" style={{ 
              padding: '16px 32px', background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', color: 'white', 
              borderRadius: '14px', fontWeight: 600, fontSize: '16px', textDecoration: 'none'
            }}>
              Find Spots
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '64px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>75%</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Target</div>
            </div>
            <div style={{ width: '1px', background: '#2a2a3a' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>∞</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Bunks Saved</div>
            </div>
            <div style={{ width: '1px', background: '#2a2a3a' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>9+</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Chill Spots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '16px' }}>
          Everything you need
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '48px' }}>
          Inspired by BunkMate, built for the web
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { icon: '📊', title: 'Attendance Tracker', desc: 'Track per-course attendance with visual progress bars.' },
            { icon: '🧮', title: 'Bunk Calculator', desc: 'Know how many classes you can safely skip.' },
            { icon: '📅', title: 'Timetable Sync', desc: 'Add your timetable and manage courses easily.' },
            { icon: '📍', title: 'Chill Spots', desc: 'Discover cafes, parks curated by students.' },
            { icon: '🤖', title: 'Discord Bot', desc: 'Use /bunk, /attend commands in Discord.' },
            { icon: '🚨', title: 'Smart Alerts', desc: 'Get warnings when approaching danger zone.' },
          ].map((f, i) => (
            <div key={i} style={{ 
              background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 24px' }}>
        <div style={{ 
          maxWidth: '700px', margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(88,28,135,0.4), rgba(6,78,59,0.4))',
          border: '1px solid rgba(139,92,246,0.2)', borderRadius: '24px', padding: '48px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Ready to chill responsibly?</h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Join students who never stress about attendance again.</p>
          <Link href="/attendance" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 32px', background: 'white', color: 'black', 
            borderRadius: '14px', fontWeight: 600, textDecoration: 'none'
          }}>
            Get Started Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid #2a2a3a', textAlign: 'center' }}>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          © 2024 ChillPeriod. Made with ❤️ by <a href="https://github.com/DarkModeTony" style={{ color: '#a78bfa' }}>Tony</a>.
        </p>
      </footer>
    </div>
  );
}
