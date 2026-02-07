'use client';

import { useState } from 'react';
import MobileNav from '@/components/MobileNav';
import { semesters, branches, getSubjects, getPdfLink } from '@/lib/data/btech-syllabus';

export default function SyllabusPage() {
  const [selectedSem, setSelectedSem] = useState('1');
  const [selectedBranch, setSelectedBranch] = useState('CSE');

  const subjects = getSubjects(selectedSem, selectedBranch);
  const pdfLink = getPdfLink(selectedBranch);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--card-bg)',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>📚 B.Tech Syllabus</h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Official 2025 Scheme & Subjects</p>
      </div>

      {/* Filters */}
      <div style={{ padding: '24px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <select 
          value={selectedSem} 
          onChange={(e) => setSelectedSem(e.target.value)}
          style={{
            padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px',
            minWidth: '200px'
          }}
        >
          {semesters.map(sem => (
            <option key={sem.value} value={sem.value}>{sem.label}</option>
          ))}
        </select>

        <select 
          value={selectedBranch} 
          onChange={(e) => setSelectedBranch(e.target.value)}
          style={{
            padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px',
            minWidth: '200px'
          }}
        >
          {branches.map(branch => (
            <option key={branch.value} value={branch.value}>{branch.label}</option>
          ))}
        </select>
      </div>

      {/* Official PDF Link */}
      {pdfLink && (
        <div style={{ padding: '0 24px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <a 
              href={pdfLink} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '16px', background: 'rgba(139, 92, 246, 0.1)', 
                border: '1px solid #8b5cf6', borderRadius: '12px',
                color: '#8b5cf6', textDecoration: 'none', fontWeight: 600,
                transition: 'background 0.2s ease'
              }}
            >
              📄 Download Official {selectedBranch} Syllabus PDF (2025)
            </a>
        </div>
      )}

      {/* Subject List */}
      <div style={{ flex: 1, padding: '0 24px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {subjects.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {subjects.map((sub, index) => (
              <div 
                key={index} 
                className="syllabus-card"
                style={{ 
                  padding: '16px', background: 'var(--card-bg)', borderRadius: '12px',
                  border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{sub.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '2px 8px', borderRadius: '4px' }}>
                    {sub.code}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Credit: {sub.credits}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <p>No subjects found for this selection yet.</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>We are updating the database!</p>
          </div>
        )}
      </div>

      <MobileNav currentPage="syllabus" />
      
      <style jsx>{`
        .syllabus-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: #8b5cf6;
        }
      `}</style>
    </div>
  );
}
