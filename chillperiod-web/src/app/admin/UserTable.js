'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser, updateUser } from './actions';

export default function UserTable({ initialUsers }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  
  // Delete State
  const [userToDelete, setUserToDelete] = useState(null); // User object to delete
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({});

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteUser(userToDelete._id);
      if (result.success) {
        setUsers(users.filter(u => u._id !== userToDelete._id));
        router.refresh();
        setUserToDelete(null); // Close modal
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to delete user');
    }
    setIsDeleting(false);
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      college: user.college,
      semester: user.semester,
      section: user.section,
      group: user.group
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      const result = await updateUser(editingUser._id, formData);
      if (result.success) {
        setUsers(users.map(u => u._id === editingUser._id ? result.user : u));
        setEditingUser(null);
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to update user');
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name, username, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>User</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Role</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>College Details</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Stats</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>@{user.username || 'no-username'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: user.role === 'admin' ? '#8b5cf6' : 'var(--bg-tertiary)',
                    color: user.role === 'admin' ? 'white' : 'var(--text-secondary)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '14px' }}>
                  <div>{user.college || 'N/A'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {user.semester}th Sem • {user.section} • {user.group}
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '14px' }}>
                  <div>Bunks: {user.totalBunks}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {((user.attendancePercentage || 0) * 1).toFixed(0)}% Attendance
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => startEdit(user)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal (Themed) */}
      {userToDelete && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setUserToDelete(null)}>
          <div style={{ 
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Delete User?
            </h3>
            <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px' }}>
              {userToDelete.name}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              This action cannot be undone. This will permanently delete their account and all associated data.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setUserToDelete(null)}
                style={{ 
                  flex: 1, padding: '12px', background: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)', border: '1px solid var(--border-color)', 
                  borderRadius: '10px', cursor: 'pointer', fontWeight: 500 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{ 
                  flex: 1, padding: '12px', background: '#ef4444', color: 'white', 
                  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500,
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setEditingUser(null)}>
          <div style={{
            background: 'var(--card-bg)', padding: '24px', borderRadius: '16px',
            width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)', fontSize: '20px', fontWeight: 'bold' }}>
              Edit User: {editingUser.name}
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                   <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Group</label>
                   <select
                    value={formData.group || 'G1'}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  >
                    <option value="G1">G1</option>
                    <option value="G2">G2</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
              </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Semester</label>
                    <input
                      type="number"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                 </div>
                 <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>Section</label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                 </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  background: '#8b5cf6', color: 'white',
                  border: 'none', cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
