'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console in development
    console.error('Error caught by error boundary:', error);
  }, [error]);

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
        {/* Big 500 */}
        <div style={{
          fontSize: '120px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ef4444, #f97316, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          lineHeight: 1
        }}>
          500
        </div>

        {/* Emoji */}
        <div style={{
          fontSize: '80px',
          marginBottom: '32px',
          animation: 'shake 0.5s ease-in-out infinite'
        }}>
          😵
        </div>

        {/* Message */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          Something Went Wrong
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.6
        }}>
          Don't worry, it's not you. Our servers are having a moment. Let's try that again!
        </p>

        {/* Error details (dev mode) */}
        {process.env.NODE_ENV === 'development' && error?.message && (
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '32px',
            textAlign: 'left',
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            <code style={{
              fontSize: '14px',
              color: '#ef4444',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
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
            }}
          >
            🔄 Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 28px',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏠 Go Home
          </button>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
