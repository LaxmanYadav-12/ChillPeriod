'use client';

export default function LoadingSpinner({ size = 'medium', color = 'purple' }) {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const colors = {
    purple: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    cyan: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    pink: 'linear-gradient(135deg, #ec4899, #f472b6)',
    white: '#ffffff'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div 
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: `3px solid transparent`,
          borderRadius: '50%',
          background: colors[color],
          WebkitMaskImage: 'linear-gradient(transparent 40%, black)',
          maskImage: 'linear-gradient(transparent 40%, black)',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
