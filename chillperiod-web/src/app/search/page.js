'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from '../../components/MobileNav';
import PeopleYouMayKnow from '../../components/PeopleYouMayKnow';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.users || []);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px', fontFamily: '"Outfit", sans-serif' }}>
      <MobileNav currentPage="search" />

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px 20px' }}>
        <h1 style={{ 
          fontSize: '28px', fontWeight: 700, marginBottom: '24px',
          color: 'var(--text-primary)'
        }}>
            Find Friends 🕵️‍♂️
        </h1>

        {/* People You May Know Suggestions */}
        <PeopleYouMayKnow />

        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              paddingLeft: '48px',
              fontSize: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Searching...</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map(user => (
            <Link href={`/profile/${user._id}`} key={user._id} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}>
                 {/* Avatar */}
                <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', fontWeight: 'bold', color: 'white',
                    overflow: 'hidden'
                }}>
                    {user.image ? <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name?.[0] || 'U')}
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {user.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        @{user.username || 'user'} • {(typeof user.college === 'object' ? user.college?.name : user.college) || 'No College'}
                    </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bunks</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#f87171' }}>{user.totalBunks}</div>
                </div>
              </div>
            </Link>
          ))}

          {!loading && query.length >= 2 && results.length === 0 && (
             <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No users found matching "{query}"</div>
          )}
        </div>
      </main>
    </div>
  );
}
