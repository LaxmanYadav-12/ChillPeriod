'use client';

import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import { useState, useEffect } from 'react';

// Demo data removed - using real API data

const categoryEmojis = { 
  cafe: '☕', restaurant: '🍕', street_food: '🌭', 
  park: '🌳', library: '📚', shopping: '🛍️', 
  gaming: '🎮', sweet_shop: '🍬', other: '📍' 
};

export default function SpotsPage() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: '', description: '', category: 'cafe', vibe: 'social', budget: 'moderate', 
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
        if (data.length === 0) {
            // Auto-seed if empty
            await fetch('/api/seed');
            const seededRes = await fetch('/api/spots');
            if (seededRes.ok) setSpots(await seededRes.json());
        } else {
            setSpots(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch API spots', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (spotId, action, e) => {
    e.stopPropagation();
    
    // Optimistic Update
    setSpots(prev => prev.map(s => {
        if (s._id === spotId) {
            let newUpvotes = s.upvotes || 0;
            let newDownvotes = s.downvotes || 0;
            let newIsUpvoted = s.isUpvoted;
            let newIsDownvoted = s.isDownvoted;

            if (action === 'upvote') {
                if (newIsUpvoted) {
                    newUpvotes--;
                    newIsUpvoted = false;
                } else {
                    newUpvotes++;
                    newIsUpvoted = true;
                    if (newIsDownvoted) {
                        newDownvotes--;
                        newIsDownvoted = false;
                    }
                }
            } else if (action === 'downvote') {
                if (newIsDownvoted) {
                    newDownvotes--;
                    newIsDownvoted = false;
                } else {
                    newDownvotes++;
                    newIsDownvoted = true;
                    if (newIsUpvoted) {
                        newUpvotes--;
                        newIsUpvoted = false;
                    }
                }
            }

            return {
                ...s,
                upvotes: newUpvotes,
                downvotes: newDownvotes,
                isUpvoted: newIsUpvoted,
                isDownvoted: newIsDownvoted
            };
        }
        return s;
    }));

    // Update selectedSpot if open
    if (selectedSpot && selectedSpot._id === spotId) {
        setSelectedSpot(prev => {
            // Simplified logic: just sync with spots state in next render or manually update here
            // To keep it simple, we'll let the user see the update in the list background or close/reopen
            // But let's try to update it here too for better UX
             let newUpvotes = prev.upvotes || 0;
            let newDownvotes = prev.downvotes || 0;
            let newIsUpvoted = prev.isUpvoted;
            let newIsDownvoted = prev.isDownvoted;

            if (action === 'upvote') {
                if (newIsUpvoted) { newUpvotes--; newIsUpvoted = false; } 
                else { newUpvotes++; newIsUpvoted = true; if (newIsDownvoted) { newDownvotes--; newIsDownvoted = false; } }
            } else if (action === 'downvote') {
                if (newIsDownvoted) { newDownvotes--; newIsDownvoted = false; } 
                else { newDownvotes++; newIsDownvoted = true; if (newIsUpvoted) { newUpvotes--; newIsUpvoted = false; } }
            }
            return { ...prev, upvotes: newUpvotes, downvotes: newDownvotes, isUpvoted: newIsUpvoted, isDownvoted: newIsDownvoted };
        });
    }

    try {
        const res = await fetch('/api/spots/upvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spotId, action })
        });
        
        if (!res.ok) {
             console.error('Vote failed');
             // Could revert state here
        }
    } catch (error) {
        console.error('Vote error', error);
    }
  };

  const [isMapLoading, setIsMapLoading] = useState(false);

  const fetchSpotsFromMap = async () => {
    setIsMapLoading(true);
    // BPIT Coordinates: 28.7362, 77.1127
    const queries = [
        { type: 'cafe', cat: 'cafe' },
        { type: 'restaurant', cat: 'restaurant' },
        { type: 'fast_food', cat: 'street_food' },
        { type: 'park', cat: 'park' },
        { type: 'mall', cat: 'shopping' },
        { type: 'cinema', cat: 'gaming' },
        { type: 'library', cat: 'library' }
    ];

    try {
      const results = [];
      for (const q of queries) {
        try {
          const res = await fetch(`/api/spots/search?q=${encodeURIComponent(q.type + ' near Sector 17 Rohini')}`);
          
          if (!res.ok) {
             const errorText = await res.text();
             console.error(`Failed to fetch ${q.type}:`, errorText);
             continue; // Skip failed requests
          }

          const items = await res.json();
          results.push(items.map(item => ({ ...item, mappedCat: q.cat })));
          
          // Respect Nominatim Usage Policy (1 request per second)
          await new Promise(resolve => setTimeout(resolve, 1200));

        } catch (err) {
          console.error(`Error querying ${q.type}`, err);
        }
      }
      const flatness = results.flat();
      const vibesList = ['quiet', 'social', 'productive', 'romantic', 'late_night', 'nature'];
      const budgetsList = ['free', 'cheap', 'moderate']; // removed broke/expensive/luxury to keep it simple for auto-generated

      const rawSpots = flatness
        .filter(item => item.name || item.display_name)
        .map((item) => ({
            name: item.name || item.display_name.split(',')[0],
            description: '📍 Discovered via OpenStreetMap',
            category: item.mappedCat || 'other',
            vibe: vibesList[Math.floor(Math.random() * vibesList.length)],
            budget: budgetsList[Math.floor(Math.random() * budgetsList.length)],
            distance: 'Nearby',
            address: item.display_name.split(',').slice(1, 4).join(', '),
            upvotes: 0,
            downvotes: 0,
            isUpvoted: false,
            isDownvoted: false,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name || item.display_name)}`
        }));
      
      // Persist to DB
      const res = await fetch('/api/spots/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spots: rawSpots })
      });

      if (res.ok) {
          const { savedSpots } = await res.json();
          setSpots(prev => {
            const existingIds = new Set(prev.map(s => s._id));
            const newSpots = savedSpots.filter(s => !existingIds.has(s._id));
            if (newSpots.length === 0) {
                 alert("No new spots found!");
                 return prev;
            }
            return [...prev, ...newSpots];
          });
      }

    } catch (error) {
      console.error("Map fetch failed", error);
      alert("Failed to fetch from maps.");
    } finally {
      setIsMapLoading(false);
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
          name: '', description: '', category: 'cafe', vibe: 'social', budget: 'moderate', 
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

  const [selectedSpot, setSelectedSpot] = useState(null);

  const openGoogleMaps = (spot) => {
    if (spot.googleMapsUrl) {
      window.open(spot.googleMapsUrl, '_blank');
    } else {
      const query = encodeURIComponent(`${spot.name} ${spot.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

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
                <option value="street_food">🌭 Street Food</option>
                <option value="park">🌳 Parks</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="gaming">🎮 Gaming</option>
                <option value="sweet_shop">🍬 Sweet Shop</option>
                <option value="library">📚 Library</option>
              </select>
              <select
                value={filter.vibe}
                onChange={(e) => setFilter(prev => ({ ...prev, vibe: e.target.value }))}
                style={{ padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="all">All Vibes</option>
                <option value="social">🎉 Social</option>
                <option value="quiet">🤫 Quiet</option>
                <option value="productive">💻 Productive</option>
                <option value="romantic">🌹 Romantic</option>
                <option value="nature">🍃 Nature</option>
                <option value="late_night">🌙 Late Night</option>
              </select>
              <select
                value={filter.budget}
                onChange={(e) => setFilter(prev => ({ ...prev, budget: e.target.value }))}
                style={{ padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="all">All Budgets</option>
                <option value="free">💚 Free</option>
                <option value="broke">💸 Broke</option>
                <option value="cheap">💵 Cheap</option>
                <option value="moderate">💵💵 Moderate</option>
                <option value="expensive">💰 Expensive</option>
                <option value="luxury">💎 Luxury</option>
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
                onClick={() => setSelectedSpot(spot)}
                style={{ 
                  background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px',
                  transition: 'all 0.3s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{categoryEmojis[spot.category] || '📍'}</span>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{spot.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{spot.distance}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => handleVote(spot._id, 'upvote', e)}
                        style={{ 
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: spot.isUpvoted ? '#10b981' : 'var(--text-secondary)',
                            fontWeight: spot.isUpvoted ? 700 : 400
                        }}
                    >
                        👍 {spot.upvotes || 0}
                    </button>
                    <button
                        onClick={(e) => handleVote(spot._id, 'downvote', e)}
                        style={{ 
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: spot.isDownvoted ? '#ef4444' : 'var(--text-secondary)',
                            fontWeight: spot.isDownvoted ? 700 : 400
                        }}
                    >
                        👎 {spot.downvotes || 0}
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{spot.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
                    background: 'rgba(139,92,246,0.1)', color: '#a78bfa', textTransform: 'capitalize'
                  }}>
                    ✨ {spot.vibe.replace('_', ' ')}
                  </span>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 10px', borderRadius: '20px', 
                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textTransform: 'capitalize' 
                  }}>
                    💰 {spot.budget}
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
              borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
              marginRight: '12px'
            }}>
              ➕ Add New Spot
            </button>
            <button onClick={fetchSpotsFromMap} disabled={isMapLoading} style={{ 
              padding: '12px 24px', background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6',
              borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}>
              {isMapLoading ? '🗺️ Searching...' : '🌍 Fetch from Maps'}
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
                        <option value="street_food">🌭 Street Food</option>
                        <option value="park">🌳 Park</option>
                        <option value="shopping">🛍️ Shopping</option>
                        <option value="gaming">🎮 Gaming</option>
                        <option value="sweet_shop">🍬 Sweet Shop</option>
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
                        <option value="social">🎉 Social</option>
                        <option value="quiet">🤫 Quiet</option>
                        <option value="productive">💻 Productive</option>
                        <option value="romantic">🌹 Romantic</option>
                        <option value="nature">🍃 Nature</option>
                        <option value="late_night">🌙 Late Night</option>
                        <option value="both">🎭 Both</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>Budget</label>
                      <select value={newSpot.budget} onChange={e => setNewSpot({ ...newSpot, budget: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }}
                      >
                        <option value="free">💚 Free</option>
                        <option value="broke">💸 Broke</option>
                        <option value="cheap">💵 Cheap</option>
                        <option value="moderate">💵💵 Moderate</option>
                        <option value="expensive">💰 Expensive</option>
                        <option value="luxury">💎 Luxury</option>
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

          {/* Spot Details Popup */}
          {selectedSpot && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 110,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }} onClick={() => setSelectedSpot(null)}>
              <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px',
                padding: '32px', maxWidth: '500px', width: '100%', position: 'relative',
                animation: 'fadeIn 0.2s ease-out'
              }} onClick={e => e.stopPropagation()}>
                
                <button onClick={() => setSelectedSpot(null)} style={{
                  position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
                  color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer'
                }}>×</button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{categoryEmojis[selectedSpot.category]}</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {selectedSpot.name}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{selectedSpot.distance}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    fontSize: '13px', padding: '6px 14px', borderRadius: '20px',
                    background: 'rgba(139,92,246,0.1)', color: '#a78bfa',
                    textTransform: 'capitalize'
                  }}>
                    ✨ {selectedSpot.vibe.replace('_', ' ')}
                  </span>
                  <span style={{ 
                    fontSize: '13px', padding: '6px 14px', borderRadius: '20px', 
                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    textTransform: 'capitalize'
                  }}>
                    💰 {selectedSpot.budget.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                    👍 {selectedSpot.upvotes} Upvotes
                  </span>
                </div>

                <p style={{ 
                    color: 'var(--text-primary)', fontSize: '15px', lineHeight: 1.6, textAlign: 'center',
                    marginBottom: '24px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px'
                }}>
                    {selectedSpot.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px', justifyContent: 'center' }}>
                        <span>📍 {selectedSpot.address}</span>
                    </div>

                    <button
                        onClick={(e) => handleVote(selectedSpot._id, 'upvote', e)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                          background: selectedSpot.isUpvoted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                          border: selectedSpot.isUpvoted ? '1px solid rgba(16,185,129,0.4)' : '1px solid #2a2a3a',
                          borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>{selectedSpot.isUpvoted ? '💚' : '👍'}</span>
                        <span style={{ color: selectedSpot.isUpvoted ? '#10b981' : '#9ca3af', fontSize: '13px', fontWeight: 500 }}>{selectedSpot.upvotes || 0}</span>
                    </button>

                    <button
                        onClick={(e) => handleVote(selectedSpot._id, 'downvote', e)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                          background: selectedSpot.isDownvoted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                          border: selectedSpot.isDownvoted ? '1px solid rgba(239,68,68,0.4)' : '1px solid #2a2a3a',
                          borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>👎</span>
                        <span style={{ color: selectedSpot.isDownvoted ? '#ef4444' : '#9ca3af', fontSize: '13px', fontWeight: 500 }}>{selectedSpot.downvotes || 0}</span>
                    </button>
                    <button 
                        onClick={() => openGoogleMaps(selectedSpot)}
                        style={{
                            width: '100%', padding: '14px', background: '#8b5cf6', color: 'white',
                            border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '16px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            marginTop: '8px', transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span>🗺️</span> Open in Google Maps
                    </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
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
