'use client';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <LoadingSpinner size="large" color="purple" />
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '16px',
        fontWeight: 500
      }}>
        Loading ChillPeriod...
      </p>
    </div>
  );
}
