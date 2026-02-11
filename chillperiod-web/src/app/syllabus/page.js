'use client';

import { useState, useEffect, useCallback } from 'react';
import MobileNav from '@/components/MobileNav';
import { semesters, branches, getPdfLink, fetchSubjects, fetchSubjectDetails, getSyllabusXLink } from '@/lib/data/btech-syllabus';

function slugToTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function SubjectSkeleton() {
  return (
    <div className="skeleton-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
      <div style={{ width: '70%', height: '18px', background: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '10px' }} />
      <div style={{ width: '40%', height: '14px', background: 'var(--bg-secondary)', borderRadius: '6px' }} />
    </div>
  );
}

function SubjectCard({ slug, semesterValue, branch, semesterShort }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('theory');
  const [checkedTopics, setCheckedTopics] = useState({});

  // Load checked topics from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`syllabus_${semesterValue}_${branch}_${slug}`);
      if (stored) setCheckedTopics(JSON.parse(stored));
    } catch {}
  }, [semesterValue, branch, slug]);

  const toggleTopic = (unitIdx, topicIdx) => {
    const key = `${unitIdx}-${topicIdx}`;
    setCheckedTopics(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`syllabus_${semesterValue}_${branch}_${slug}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const subjectName = slugToTitle(slug);

  const loadDetails = useCallback(async () => {
    if (details) return;
    setLoading(true);
    const data = await fetchSubjectDetails(semesterValue, branch, subjectName);
    setDetails(data);
    setLoading(false);
  }, [details, semesterValue, branch, subjectName]);

  const handleClick = () => {
    if (!expanded) loadDetails();
    setExpanded(!expanded);
  };

  const syllabusXUrl = getSyllabusXLink(semesterShort, branch, slug);
  const hasTheory = details?.theory?.length > 0;
  const hasLab = details?.lab?.length > 0;

  return (
    <div className="subject-card" style={{
      background: 'var(--card-bg)',
      borderRadius: '14px',
      border: `1px solid ${expanded ? '#8b5cf6' : 'var(--border-color)'}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
    }}>
      {/* Header — always visible */}
      <div
        onClick={handleClick}
        style={{
          padding: '18px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {details?.subject || subjectName}
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {details?.theorypapercode && (
              <span className="badge badge-purple">{details.theorypapercode}</span>
            )}
            {details?.labpapercode && (
              <span className="badge badge-blue">{details.labpapercode}</span>
            )}
            {details?.theorycredits != null && (
              <span className="badge badge-ghost">{details.theorycredits} Credits</span>
            )}
            {details?.labcredits != null && details.labcredits > 0 && (
              <span className="badge badge-ghost">Lab: {details.labcredits} Cr</span>
            )}
          </div>
        </div>
        <span style={{
          fontSize: '18px',
          transition: 'transform 0.3s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          color: '#8b5cf6',
          flexShrink: 0,
        }}>
          ▾
        </span>
      </div>

      {/* Expanded details panel */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          animation: 'slideDown 0.3s ease',
        }}>
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div className="spinner" />
              <p style={{ marginTop: '8px', fontSize: '14px' }}>Loading syllabus...</p>
            </div>
          )}

          {details && !loading && (
            <>
              {/* Tabs */}
              {(hasTheory || hasLab) && (
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-color)' }}>
                  {hasTheory && (
                    <button
                      onClick={() => setActiveTab('theory')}
                      className={`tab-btn ${activeTab === 'theory' ? 'tab-active' : ''}`}
                    >
                      📖 Theory ({details.theory.length} Units)
                    </button>
                  )}
                  {hasLab && (
                    <button
                      onClick={() => setActiveTab('lab')}
                      className={`tab-btn ${activeTab === 'lab' ? 'tab-active' : ''}`}
                    >
                      🧪 Lab ({details.lab.length} Experiments)
                    </button>
                  )}
                </div>
              )}

              {/* Theory content */}
              {activeTab === 'theory' && hasTheory && (
                <div style={{ padding: '16px 20px' }}>
                  {details.theory.map((unit) => {
                    const checkedCount = unit.topics.filter((_, i) => checkedTopics[`${unit.unit}-${i}`]).length;
                    return (
                      <div key={unit.unit} style={{ marginBottom: '20px' }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#8b5cf6',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '24px', height: '24px',
                              borderRadius: '6px',
                              background: 'rgba(139, 92, 246, 0.15)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}>
                              {unit.unit}
                            </span>
                            Unit {unit.unit}
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'none' }}>
                            {checkedCount}/{unit.topics.length} done
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {unit.topics.map((topic, i) => {
                            const isChecked = !!checkedTopics[`${unit.unit}-${i}`];
                            return (
                              <div
                                key={i}
                                className={`topic-row ${isChecked ? 'topic-checked' : ''}`}
                                onClick={() => toggleTopic(unit.unit, i)}
                              >
                                <div className={`topic-checkbox ${isChecked ? 'checkbox-checked' : ''}`}>
                                  {isChecked && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </div>
                                <span style={{
                                  fontSize: '14px',
                                  color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                                  textDecoration: isChecked ? 'line-through' : 'none',
                                  transition: 'all 0.2s ease',
                                  lineHeight: '1.5',
                                }}>
                                  {topic}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lab content */}
              {activeTab === 'lab' && hasLab && (
                <div style={{ padding: '16px 20px' }}>
                  {details.lab.map((exp) => (
                    <div key={exp.experiment} style={{
                      marginBottom: '12px',
                      padding: '12px 16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span className="badge badge-blue" style={{ flexShrink: 0 }}>
                          Exp {exp.experiment}
                        </span>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                          {exp.aim?.objective || 'No description available'}
                        </p>
                      </div>
                      {exp.aim?.steps?.length > 0 && (
                        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {exp.aim.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer link */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <a
                  href={syllabusXUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="syllabusx-link"
                >
                  📚 Notes, PYQs & Books on SyllabusX →
                </a>
              </div>
            </>
          )}

          {!details && !loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Could not load details. Try again later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SyllabusPage() {
  const [selectedSem, setSelectedSem] = useState(semesters[0].value);
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSemester = semesters.find(s => s.value === selectedSem);
  const pdfLink = getPdfLink(selectedBranch);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSubjects([]);

    fetchSubjects(selectedSem, selectedBranch).then((data) => {
      if (!cancelled) {
        setSubjects(data || []);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [selectedSem, selectedBranch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '28px 24px 20px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.06))',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center',
      }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📚 B.Tech Syllabus
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          IPU Syllabus & Study Materials
        </p>
      </div>

      {/* Filters */}
      <div style={{ padding: '20px 24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
          className="filter-select"
        >
          {semesters.map(sem => (
            <option key={sem.value} value={sem.value}>{sem.label}</option>
          ))}
        </select>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="filter-select"
        >
          {branches.map(branch => (
            <option key={branch.value} value={branch.value}>{branch.label}</option>
          ))}
        </select>
      </div>

      {/* PDF Link */}
      {pdfLink && (
        <div style={{ padding: '0 24px 16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-link"
          >
            📄 Download Official {selectedBranch} Syllabus PDF
          </a>
        </div>
      )}

      {/* Subject count */}
      {!loading && subjects.length > 0 && (
        <div style={{ padding: '0 24px 8px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            {subjects.length} subject{subjects.length !== 1 ? 's' : ''} found — click to expand syllabus
          </p>
        </div>
      )}

      {/* Subject List */}
      <div style={{ flex: 1, padding: '0 24px 100px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map(i => <SubjectSkeleton key={i} />)}
          </div>
        ) : subjects.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {subjects.map((slug) => (
              <SubjectCard
                key={slug}
                slug={slug}
                semesterValue={selectedSem}
                branch={selectedBranch}
                semesterShort={currentSemester?.short}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>No subjects found</p>
            <p style={{ fontSize: '13px' }}>Try selecting a different semester or branch.</p>
          </div>
        )}
      </div>

      <MobileNav currentPage="syllabus" />

      <style jsx>{`
        .filter-select {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 15px;
          min-width: 200px;
          cursor: pointer;
          transition: border-color 0.2s ease;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        .filter-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
        }
        .pdf-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 12px;
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .pdf-link:hover {
          background: rgba(139, 92, 246, 0.15);
          transform: translateY(-1px);
        }
        .subject-card:hover {
          border-color: rgba(139, 92, 246, 0.4) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .badge-purple {
          background: rgba(139, 92, 246, 0.12);
          color: #8b5cf6;
        }
        .badge-blue {
          background: rgba(59, 130, 246, 0.12);
          color: #3b82f6;
        }
        .badge-ghost {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .tab-btn {
          flex: 1;
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(139, 92, 246, 0.04);
        }
        .tab-active {
          color: #8b5cf6 !important;
          border-bottom-color: #8b5cf6 !important;
          font-weight: 600;
        }
        .syllabusx-link {
          font-size: 13px;
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .syllabusx-link:hover {
          background: rgba(139, 92, 246, 0.08);
        }
        .topic-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }
        .topic-row:hover {
          border-color: rgba(139, 92, 246, 0.3);
          background: rgba(139, 92, 246, 0.04);
        }
        .topic-checked {
          opacity: 0.65;
        }
        .topic-checkbox {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border-radius: 5px;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          margin-top: 1px;
        }
        .checkbox-checked {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--border-color);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        .skeleton-card {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
