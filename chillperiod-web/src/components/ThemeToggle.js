'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div style={{
        width: '42px',
        height: '38px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px'
      }} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '10px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-primary)'
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
