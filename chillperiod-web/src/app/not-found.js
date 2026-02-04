'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="animate-scale-in" style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        {/* Big 404 */}
        <div style={{
          fontSize: '120px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          lineHeight: 1
        }}>
          404
        </div>

        {/* Emoji */}
        <div style={{
          fontSize: '80px',
          marginBottom: '32px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          🤷‍♂️
        </div>

        {/* Message */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '40px',
          lineHeight: 1.6
        }}>
          Oops! The page you're looking for doesn't exist. Maybe it's bunking class too? 😄
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/" style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}>
            🏠 Go Home
          </Link>

          <Link href="/attendance" style={{
            padding: '12px 28px',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            📊 Check Attendance
          </Link>

          <Link href="/spots" style={{
            padding: '12px 28px',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#06b6d4';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            📍 Find Spots
          </Link>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
