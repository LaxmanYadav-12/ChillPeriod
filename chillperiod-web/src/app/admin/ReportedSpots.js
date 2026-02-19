'use client';

import { useState, useEffect } from 'react';

const categoryEmojis = {
  cafe: '☕', restaurant: '🍕', street_food: '🌭',
  park: '🌳', library: '📚', shopping: '🛍️',
  gaming: '🎮', sweet_shop: '🍬', other: '📍'
};

const reasonLabels = {
  closed: '🚫 Permanently Closed',
  inaccurate: '📍 Inaccurate Info',
  spam: '🗑️ Spam / Fake',
  inappropriate: '⛔ Inappropriate',
  other: '📝 Other'
};

export default function ReportedSpots() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReported();
  }, []);

  const fetchReported = async () => {
    try {
      const res = await fetch('/api/admin/reported-spots');
      if (res.ok) setSpots(await res.json());
    } catch (err) {
      console.error('Failed to fetch reported spots', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (spotId, action) => {
    setActionLoading(spotId);
    try {
      const res = await fetch('/api/admin/reported-spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotId, action })
      });
      if (res.ok) {
        setSpots(prev => prev.filter(s => s._id !== spotId));
      }
    } catch (err) {
      console.error('Action failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading reported spots...
      </div>
    );
  }

  if (spots.length === 0) {
    return (
      <div style={{
        padding: '32px', textAlign: 'center', background: 'var(--card-bg)',
        borderRadius: '16px', border: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
        <p style={{ color: 'var(--text-secondary)' }}>No reported spots. All clear!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {spots.map(spot => (
        <div key={spot._id} style={{
          background: 'var(--card-bg)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '16px', padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{categoryEmojis[spot.category] || '📍'}</span>
              <div>
                <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{spot.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{spot.address}</p>
              </div>
            </div>
            <span style={{
              fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600
            }}>
              {spot.reportCount} {spot.reportCount === 1 ? 'report' : 'reports'}
            </span>
          </div>

          {/* Report reasons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {(spot.reports || []).map((report, i) => (
              <div key={i} style={{
                fontSize: '13px', padding: '8px 12px', borderRadius: '8px',
                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)'
              }}>
                <span style={{ fontWeight: 500 }}>{reasonLabels[report.reason] || report.reason}</span>
                {report.detail && <span> — {report.detail}</span>}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleAction(spot._id, 'dismiss')}
              disabled={actionLoading === spot._id}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 500,
                opacity: actionLoading === spot._id ? 0.6 : 1
              }}
            >
              ✅ Dismiss (Mark Safe)
            </button>
            <button
              onClick={() => handleAction(spot._id, 'remove')}
              disabled={actionLoading === spot._id}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                background: '#ef4444', color: 'white',
                border: 'none', cursor: 'pointer', fontWeight: 500,
                opacity: actionLoading === spot._id ? 0.6 : 1
              }}
            >
              🗑️ Remove Spot
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
