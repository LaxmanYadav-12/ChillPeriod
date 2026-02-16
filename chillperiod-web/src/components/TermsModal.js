'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TermsModal({ onAccept, onDecline }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: '24px', maxWidth: '600px', width: '100%',
        display: 'flex', flexDirection: 'column', maxHeight: '85vh',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            📜 Terms & Conditions
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Please review and accept my terms to continue.
          </p>
        </div>

        {/* Content - Scrollable */}
        <div style={{ 
          padding: '24px', overflowY: 'auto', flex: 1, 
          color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 
        }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Welcome to ChillPeriod!</strong> By using this app, you agree to the following:
          </p>
          
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <strong>Attendance Data:</strong> You are responsible for the data you enter. I am not liable for academic discrepancies.
            </li>
            <li>
              <strong>Conduct:</strong> Do not use the platform to harass others or coordinate disruptive activities.
            </li>
            <li>
              <strong>Privacy:</strong> I store your profile data (name, email, college info) to provide the service. I respect your privacy.
            </li>
            <li>
              <strong>Termination:</strong> I reserve the right to ban users who violate these rules.
            </li>
          </ul>

          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
            * You can read the full Terms and Conditions in the app settings later.
          </p>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {!showConfirm ? (
            <>
              <Link
                href="/terms"
                target="_blank"
                style={{
                  padding: '12px 20px', background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', fontWeight: 500, cursor: 'pointer',
                  fontSize: '14px', textDecoration: 'none', marginRight: 'auto'
                }}
              >
                View Full Terms
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  padding: '12px 20px', background: 'transparent',
                  color: '#ef4444', border: '1px solid transparent',
                  borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                  fontSize: '14px', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                style={{
                  padding: '12px 24px', background: '#8b5cf6',
                  color: 'white', border: 'none',
                  borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                  fontSize: '14px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                I Accept
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>
                ⚠️ This will delete your account. Are you sure?
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    padding: '8px 16px', background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', border: 'none',
                    borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={onDecline}
                  style={{
                    padding: '8px 16px', background: '#ef4444',
                    color: 'white', border: 'none',
                    borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
