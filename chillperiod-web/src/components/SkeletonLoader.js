'use client';

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '24px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      {/* Header */}
      <div style={{
        height: '24px',
        width: '60%',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        marginBottom: '16px'
      }} />
      
      {/* Content lines */}
      <div style={{
        height: '16px',
        width: '100%',
        background: 'var(--bg-tertiary)',
        borderRadius: '6px',
        marginBottom: '12px'
      }} />
      <div style={{
        height: '16px',
        width: '80%',
        background: 'var(--bg-tertiary)',
        borderRadius: '6px',
        marginBottom: '12px'
      }} />
      <div style={{
        height: '16px',
        width: '40%',
        background: 'var(--bg-tertiary)',
        borderRadius: '6px'
      }} />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export function SkeletonGrid({ count = 3, columns = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '24px'
    }}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
