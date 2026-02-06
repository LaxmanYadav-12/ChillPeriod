'use client';

import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import { useState, useEffect } from 'react';

const demoSpots = [
  { _id: '1', name: 'Bhagya Vihar Internet Cafe', description: 'Internet cafe near campus, good for quick browsing and printing', category: 'cafe', vibe: 'quiet', budget: 'cheap', distance: '10 min walk', address: 'Mangal Bazar Rd, Bhagya Vihar', upvotes: 12 },
  { _id: '2', name: 'Sector 17/18 Park', description: 'Large park on Chhotu Ram Marg, good for groups', category: 'park', vibe: 'social', budget: 'free', distance: '3 min walk', address: 'Chhotu Ram Marg, Sector 17/18', upvotes: 25 },
  { _id: '3', name: 'Garg Trade Centre Food Court', description: 'Multiple food options in one place, good for groups', category: 'restaurant', vibe: 'social', budget: 'moderate', distance: '12 min walk', address: 'Sector 11, Rohini', upvotes: 18 },
  { _id: '4', name: 'Rohini Sector 6 Park', description: 'Nice green space for relaxing between classes', category: 'park', vibe: 'quiet', budget: 'free', distance: '5 min walk', address: 'Pocket 6D, Sector 6, Rohini', upvotes: 15 },
  { _id: '5', name: 'Meer Vihar Cafe', description: 'Cozy cafe in Block A, good for study sessions with coffee', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Block A, Meer Vihar', upvotes: 8 },
  { _id: '6', name: 'Twin District Centre Eatery', description: 'Near Swarn Jayanti Park, nice ambiance', category: 'restaurant', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Swarn Jayanti Park, Rohini', upvotes: 20 },
  { _id: '7', name: 'Japanese Park', description: 'Beautiful Japanese themed park, perfect for chilling', category: 'park', vibe: 'quiet', budget: 'free', distance: '8 min walk', address: 'Pocket 3, Sector 10, Rohini', upvotes: 32 },
  { _id: '8', name: 'Unity One Mall Food Court', description: 'AC food court with lots of options, great for summers', category: 'restaurant', vibe: 'social', budget: 'moderate', distance: '20 min walk', address: 'Sector 10, Rohini', upvotes: 22 },
  { _id: '9', name: 'Chaayos Rohini', description: 'Perfect chai and snacks, good WiFi for work', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '18 min walk', address: 'M2K Corporate Park, Sector 9', upvotes: 16 },
  { _id: '10', name: 'Dominos Near Gate', description: 'Quick pizza spot, AC and free WiFi', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '5 min walk', address: 'Sector 17, Main Road', upvotes: 14 },
  { _id: '11', name: 'Sector 11 Central Park', description: 'Huge open ground, great for cricket bunks', category: 'park', vibe: 'social', budget: 'free', distance: '10 min walk', address: 'Central Park, Sector 11', upvotes: 28 },
  { _id: '12', name: 'Barista Coffee', description: 'Premium coffee, perfect for solo study sessions', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '22 min walk', address: 'Eros City Square, Sector 11', upvotes: 11 },
  { _id: '13', name: 'Momo Corner Near Metro', description: 'Best momos in Rohini, super cheap', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '7 min walk', address: 'Near Rohini West Metro', upvotes: 35 },
  { _id: '14', name: 'Swarn Jayanti Park', description: 'Massive park, entry fee but worth it', category: 'park', vibe: 'both', budget: 'cheap', distance: '25 min walk', address: 'Sector 10, Rohini', upvotes: 40 },
  { _id: '15', name: 'Starbucks Unity One', description: 'Premium coffee experience, AC, charging points', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '20 min walk', address: 'Unity One Mall, Sector 10', upvotes: 19 },
  { _id: '16', name: 'Burger King Rohini', description: 'Fast food, AC, coupon friendly', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '18 min walk', address: 'Sector 9, Main Market', upvotes: 13 },
  { _id: '17', name: 'Sector 7 Kids Park', description: 'Usually empty during college hours, peaceful', category: 'park', vibe: 'quiet', budget: 'free', distance: '12 min walk', address: 'E Block, Sector 7', upvotes: 9 },
  { _id: '18', name: 'Cafe Delhi Heights', description: 'Great ambiance, rooftop seating available', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '25 min walk', address: 'M2K Pitampura, Sector 7', upvotes: 21 },
  { _id: '19', name: 'Haldiram Rohini', description: 'Desi snacks and sweets, affordable thalis', category: 'restaurant', vibe: 'both', budget: 'cheap', distance: '15 min walk', address: 'Sector 11, Main Chowk', upvotes: 24 },
  { _id: '20', name: 'Metro Station Sitting Area', description: 'Free AC, can sit for hours pretending to wait', category: 'other', vibe: 'quiet', budget: 'free', distance: '6 min walk', address: 'Rohini West Metro Station', upvotes: 17 },
  { _id: '21', name: 'CCD Near BPIT', description: 'Classic coffee spot, reliable WiFi', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '8 min walk', address: 'Sector 17, Near BPIT Gate', upvotes: 26 },
  { _id: '22', name: 'South Indian Corner', description: 'Cheap dosas and idlis, student budget friendly', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min walk', address: 'Bhagya Vihar Market', upvotes: 18 },
  { _id: '23', name: 'Rohini District Park', description: 'Jogging track, benches, good evening spot', category: 'park', vibe: 'both', budget: 'free', distance: '15 min walk', address: 'Sector 14, Rohini', upvotes: 14 },
  { _id: '24', name: 'McDonald\'s Sector 11', description: 'McCafe area is chill, affordable meals', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '12 min walk', address: 'Sector 11, Main Road', upvotes: 20 },
  { _id: '25', name: 'BPIT Back Gate Dhaba', description: 'Legendary chai and maggi spot, super cheap', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '2 min walk', address: 'Behind BPIT Gate', upvotes: 45 },
  { _id: '26', name: 'Sector 16 Sports Complex', description: 'Open ground, sometimes has events', category: 'park', vibe: 'social', budget: 'free', distance: '8 min walk', address: 'Pocket 16, Sector 16', upvotes: 11 },
  { _id: '27', name: 'Third Wave Coffee', description: 'Hipster vibes, great cold coffee', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '22 min walk', address: 'M2K Corporate Park', upvotes: 15 },
  { _id: '28', name: 'Punjab Sweet House', description: 'Chole bhature heaven, heavy but worth it', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min walk', address: 'Sector 11 Market', upvotes: 30 },
  { _id: '29', name: 'MKS Public Library', description: 'Free, AC, super quiet for actual studying', category: 'library', vibe: 'quiet', budget: 'free', distance: '20 min walk', address: 'Sector 11, Near Court', upvotes: 8 },
  { _id: '30', name: 'Bikanervala Rohini', description: 'Proper thalis, family restaurant vibes', category: 'restaurant', vibe: 'both', budget: 'moderate', distance: '18 min walk', address: 'Sector 11, Main Road', upvotes: 16 },
];

const categoryEmojis = { cafe: '☕', restaurant: '🍕', park: '🌳', library: '📚', arcade: '🎮', mall: '🛍️', other: '📍' };

export default function SpotsPage() {
  const [spots, setSpots] = useState(demoSpots);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: '', description: '', category: 'cafe', vibe: 'both', budget: 'moderate', 
    address: '', googleMapsUrl: '', distance: ''
  });

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch('/api/spots');
      if (res.ok) {
        const data = await res.json();
        // If API returns spots, use them; otherwise keep demo spots
        if (data.length > 0) {
          setSpots(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch spots', error);
      // Already initialized with demoSpots, so nothing to do
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSpot = async () => {
    if (!newSpot.name || !newSpot.address) return;

    try {
      const res = await fetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSpot, college: 'BPIT' })
      });

      if (res.ok) {
        const addedSpot = await res.json();
        setSpots(prev => [addedSpot, ...prev]);
        setShowAddModal(false);
        setNewSpot({
          name: '', description: '', category: 'cafe', vibe: 'both', budget: 'moderate', 
          address: '', googleMapsUrl: '', distance: ''
        });
      }
    } catch (error) {
      console.error('Failed to add spot', error);
    }
  };
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <MobileNav currentPage="spots" />

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header - Centered */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              📍 <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chill Spots</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Discover the best hangout spots near BPIT</p>
          </div>

          {/* Search & Filters - Centered */}
          <div style={{ 
            maxWidth: '800px', margin: '0 auto 32px auto',
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px'
          }}>
            <input
              type="text"
              placeholder="🔍 Search spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px', marginBottom: '16px',
                background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px',
                color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
              }}
            />
            <div id="filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                style={{ padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="all">All Categories</option>
                <option value="cafe">☕ Cafes</option>
                <option value="restaurant">🍕 Restaurants</option>
                <option value="park">🌳 Parks</option>
              </select>
              <select
                value={filter.vibe}
                onChange={(e) => setFilter(prev => ({ ...prev, vibe: e.target.value }))}
                style={{ padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="all">All Vibes</option>
                <option value="quiet">🤫 Quiet</option>
                <option value="social">🎉 Social</option>
                <option value="both">🎭 Both</option>
              </select>
              <select
                value={filter.budget}
                onChange={(e) => setFilter(prev => ({ ...prev, budget: e.target.value }))}
                style={{ padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="all">All Budgets</option>
                <option value="free">💚 Free</option>
                <option value="cheap">💵 Cheap</option>
                <option value="moderate">💵💵 Moderate</option>
              </select>
            </div>
          </div>

          {/* Results Count - Centered */}
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Found <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filteredSpots.length}</span> spots
          </p>

          {/* Spots Grid - Centered */}
          <div id="spots-grid" style={{ 
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
                  background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px',
                  transition: 'all 0.3s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{categoryEmojis[spot.category]}</span>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{spot.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{spot.distance}</p>
                    </div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '14px' }}>👍 {spot.upvotes}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{spot.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
                    background: spot.vibe === 'quiet' ? 'rgba(59,130,246,0.2)' : spot.vibe === 'social' ? 'rgba(249,115,22,0.2)' : 'rgba(139,92,246,0.2)',
                    color: spot.vibe === 'quiet' ? '#60a5fa' : spot.vibe === 'social' ? '#fb923c' : '#a78bfa'
                  }}>
                    {spot.vibe === 'quiet' ? '🤫 Quiet' : spot.vibe === 'social' ? '🎉 Social' : '🎭 Both'}
                  </span>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {spot.budget === 'free' ? '💚 Free' : spot.budget === 'cheap' ? '💵 Cheap' : '💵💵 Moderate'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {spot.address}</p>
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
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
              Share it with the community! Add it directly here.
            </p>
            <button onClick={() => setShowAddModal(true)} style={{ 
              padding: '12px 24px', background: '#8b5cf6', color: 'white', border: 'none',
              borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}>
              ➕ Add New Spot
            </button>
          </div>

          {/* Add Spot Modal */}
          {showAddModal && (
            <div style={{ 
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }} onClick={() => setShowAddModal(false)}>
              <div style={{ 
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px', 
                padding: '32px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
              }} onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
                  📍 Add New Spot
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Spot Name *</label>
                    <input type="text" value={newSpot.name} onChange={e => setNewSpot({ ...newSpot, name: e.target.value })}
                      placeholder="e.g. Hidden Cafe"
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Description</label>
                    <textarea value={newSpot.description} onChange={e => setNewSpot({ ...newSpot, description: e.target.value })}
                      placeholder="What makes this place special?"
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', minHeight: '80px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Category</label>
                      <select value={newSpot.category} onChange={e => setNewSpot({ ...newSpot, category: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                      >
                        <option value="cafe">☕ Cafe</option>
                        <option value="restaurant">🍕 Restaurant</option>
                        <option value="park">🌳 Park</option>
                        <option value="library">📚 Library</option>
                        <option value="other">📍 Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Distance</label>
                      <input type="text" value={newSpot.distance} onChange={e => setNewSpot({ ...newSpot, distance: e.target.value })}
                        placeholder="e.g. 10 min walk"
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Vibe</label>
                      <select value={newSpot.vibe} onChange={e => setNewSpot({ ...newSpot, vibe: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                      >
                        <option value="quiet">🤫 Quiet</option>
                        <option value="social">🎉 Social</option>
                        <option value="both">🎭 Both</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Budget</label>
                      <select value={newSpot.budget} onChange={e => setNewSpot({ ...newSpot, budget: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                      >
                        <option value="free">💚 Free</option>
                        <option value="cheap">💵 Cheap</option>
                        <option value="moderate">💵💵 Moderate</option>
                        <option value="expensive">💰 Expensive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Address / Location *</label>
                    <input type="text" value={newSpot.address} onChange={e => setNewSpot({ ...newSpot, address: e.target.value })}
                      placeholder="Street address or Area"
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Google Maps Link (Optional)</label>
                    <input type="text" value={newSpot.googleMapsUrl} onChange={e => setNewSpot({ ...newSpot, googleMapsUrl: e.target.value })}
                      placeholder="Paste link from Google Maps to auto-set location"
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                    />
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Tip: Paste a Google Maps link to help others find it exactly!
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={handleAddSpot} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Add Spot</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          #filters {
            flex-direction: column !important;
          }
          
          #filters select {
            width: 100%;
          }
          
          #spots-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
