'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-br from-violet-600 to-cyan-500 bg-clip-text text-transparent decoration-0">
          ChillPeriod
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/spots" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Spots</Link>
          <Link href="/attendance" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Attendance</Link>
          
          <ThemeToggle />

          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-1"
              >
                <div className="relative w-8 h-8">
                  <Image 
                    src={session.user.image || `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`}
                    alt="avatar"
                    fill
                    sizes="32px"
                    className="rounded-full border-2 border-violet-500 object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                    unoptimized
                  />
                </div>
                <span className="text-[var(--text-primary)] text-sm font-medium">
                  {session.user.name || session.user.username}
                </span>
              </button>
              
              {showMenu && (
                <div className="absolute top-full right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-2 min-w-[150px] shadow-xl">
                  <div className="px-3 py-2 text-[var(--text-secondary)] text-xs border-b border-[var(--border-primary)] mb-1">
                    Signed in as<br/>
                    <span className="text-[var(--text-primary)]">{session.user.email}</span>
                  </div>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-3 py-2 mt-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-[#5865F2] text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#4752C4] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
