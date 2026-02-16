'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function UserListModal({ isOpen, onClose, title, users, loading }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100
    }} onClick={onClose}>
      <div style={{
        width: '90%', maxWidth: '400px', maxHeight: '80vh',
        background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
        borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-secondary)', 
              fontSize: '24px', cursor: 'pointer', padding: '4px' 
            }}
          >
            &times;
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '16px' }}>
          {loading ? (
             <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No users found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map(user => (
                <Link 
                  key={user._id} 
                  href={`/profile/${user._id}`}
                  onClick={onClose}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '8px', borderRadius: '8px', textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                    background: 'var(--bg-tertiary)', flexShrink: 0
                  }}>
                    {user.image ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={user.image} 
                          alt={user.name} 
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }} 
                        />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        👤
                      </div>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    {user.username && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{user.username}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
