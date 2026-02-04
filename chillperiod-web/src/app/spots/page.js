'use client';

import Link from 'next/link';
import { useState } from 'react';

const demoSpots = [
  { _id: '1', name: 'Bhagya Vihar Internet Cafe', description: 'Internet cafe near campus, good for quick browsing and printing', category: 'cafe', vibe: 'quiet', budget: 'cheap', distance: '10 min walk', address: 'Mangal Bazar Rd, Bhagya Vihar', upvotes: 12 },
  { _id: '2', name: 'Sector 17/18 Park', description: 'Large park on Chhotu Ram Marg, good for groups', category: 'park', vibe: 'social', budget: 'free', distance: '3 min walk', address: 'Chhotu Ram Marg, Sector 17/18', upvotes: 25 },
  { _id: '3', name: 'Garg Trade Centre Food Court', description: 'Multiple food options in one place, good for groups', category: 'restaurant', vibe: 'social', budget: 'moderate', distance: '12 min walk', address: 'Sector 11, Rohini', upvotes: 18 },
  { _id: '4', name: 'Rohini Sector 6 Park', description: 'Nice green space for relaxing between classes', category: 'park', vibe: 'quiet', budget: 'free', distance: '5 min walk', address: 'Pocket 6D, Sector 6, Rohini', upvotes: 15 },
  { _id: '5', name: 'Meer Vihar Cafe', description: 'Cozy cafe in Block A, good for study sessions with coffee', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Block A, Meer Vihar', upvotes: 8 },
  { _id: '6', name: 'Twin District Centre Eatery', description: 'Near Swarn Jayanti Park, nice ambiance', category: 'restaurant', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Swarn Jayanti Park, Rohini', upvotes: 20 }
];

const categoryEmojis = { cafe: '☕', restaurant: '🍕', park: '🌳', library: '📚', arcade: '🎮', mall: '🛍️', other: '📍' };

export default function SpotsPage() {
  const [spots] = useState(demoSpots);
  const [filter, setFilter] = useState({ category: 'all', vibe: 'all', budget: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSpots = spots.filter(spot => {
    if (filter.category !== 'all' && spot.category !== filter.category) return false;
    if (filter.vibe !== 'all' && spot.vibe !== filter.vibe) return false;
    if (filter.budget !== 'all' && spot.budget !== filter.budget) return false;
    if (searchQuery && !spot.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
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
            <Link href="/spots" style={{ color: 'white', fontWeight: 500, textDecoration: 'none' }}>Spots</Link>
            <Link href="/attendance" style={{ color: '#9ca3af', textDecoration: 'none' }}>Attendance</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header - Centered */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              📍 <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chill Spots</span>
            </h1>
            <p style={{ color: '#6b7280' }}>Discover the best hangout spots near BPIT</p>
          </div>

          {/* Search & Filters - Centered */}
          <div style={{ 
            maxWidth: '800px', margin: '0 auto 32px auto',
            background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '20px'
          }}>
            <input
              type="text"
              placeholder="🔍 Search spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px', marginBottom: '16px',
                background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '12px',
                color: 'white', fontSize: '14px', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                style={{ padding: '10px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="all">All Categories</option>
                <option value="cafe">☕ Cafes</option>
                <option value="restaurant">🍕 Restaurants</option>
                <option value="park">🌳 Parks</option>
              </select>
              <select
                value={filter.vibe}
                onChange={(e) => setFilter(prev => ({ ...prev, vibe: e.target.value }))}
                style={{ padding: '10px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="all">All Vibes</option>
                <option value="quiet">🤫 Quiet</option>
                <option value="social">🎉 Social</option>
                <option value="both">🎭 Both</option>
              </select>
              <select
                value={filter.budget}
                onChange={(e) => setFilter(prev => ({ ...prev, budget: e.target.value }))}
                style={{ padding: '10px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="all">All Budgets</option>
                <option value="free">💚 Free</option>
                <option value="cheap">💵 Cheap</option>
                <option value="moderate">💵💵 Moderate</option>
              </select>
            </div>
          </div>

          {/* Results Count - Centered */}
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
            Found <span style={{ color: 'white', fontWeight: 600 }}>{filteredSpots.length}</span> spots
          </p>

          {/* Spots Grid - Centered */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {filteredSpots.map(spot => (
              <div 
                key={spot._id} 
                style={{ 
                  background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '20px',
                  transition: 'all 0.3s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{categoryEmojis[spot.category]}</span>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{spot.name}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>{spot.distance}</p>
                    </div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '14px' }}>👍 {spot.upvotes}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{spot.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
                    background: spot.vibe === 'quiet' ? 'rgba(59,130,246,0.2)' : spot.vibe === 'social' ? 'rgba(249,115,22,0.2)' : 'rgba(139,92,246,0.2)',
                    color: spot.vibe === 'quiet' ? '#60a5fa' : spot.vibe === 'social' ? '#fb923c' : '#a78bfa'
                  }}>
                    {spot.vibe === 'quiet' ? '🤫 Quiet' : spot.vibe === 'social' ? '🎉 Social' : '🎭 Both'}
                  </span>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: '#1f2937', color: '#9ca3af' }}>
                    {spot.budget === 'free' ? '💚 Free' : spot.budget === 'cheap' ? '💵 Cheap' : '💵💵 Moderate'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4b5563' }}>📍 {spot.address}</p>
              </div>
            ))}
          </div>

          {/* CTA - Centered */}
          <div style={{ 
            maxWidth: '600px', margin: '48px auto 0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(88,28,135,0.3), rgba(6,78,59,0.3))',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '32px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>Know a great chill spot?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Use the Discord bot: <code style={{ background: '#0a0a0f', padding: '4px 8px', borderRadius: '6px', color: '#a78bfa' }}>/addspot</code>
            </p>
            <button style={{ 
              padding: '12px 24px', background: '#8b5cf6', color: 'white', border: 'none',
              borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}>
              ➕ Add Spot via Discord
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
