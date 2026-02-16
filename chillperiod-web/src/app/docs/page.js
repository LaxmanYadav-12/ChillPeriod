'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    // Theme-specific colors for Mermaid
    const mermaidVariables = theme === 'light' ? {
      darkMode: false,
      background: '#FAFBFC',
      primaryColor: '#8b5cf6',
      lineColor: '#D0D7DE',
      textColor: '#1F2937',
      mainBkg: '#FAFBFC',
    } : {
      darkMode: true,
      background: '#0a0a0f',
      primaryColor: '#8b5cf6',
      lineColor: '#2a2a3a',
      textColor: '#ffffff',
      mainBkg: '#0a0a0f',
    };

    // Load Mermaid
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    
    script.onload = () => {
      try {
        window.mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'base',
          themeVariables: mermaidVariables,
          fontFamily: 'Outfit, sans-serif'
        });
        window.mermaid.run({ querySelector: '.mermaid' });
      } catch (err) { console.error(err); }
    };
    
    // ScrollSpy - Manual Calculation for precision
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 150; // Offset for sticky header/padding

      // Find the current section
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      // Fallback: if we are at the bottom, highlight the last one
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
         current = sections[sections.length - 1]?.getAttribute('id') || '';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if(document.body.contains(script)) document.body.removeChild(script);
    };
  }, [theme]); 

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      
      <Navbar />

      {/* Main Container */}
      <div style={{ 
          maxWidth: '1400px', margin: '0 auto', padding: '120px 24px 60px 24px', 
          display: 'flex', gap: '60px', alignItems: 'flex-start' /* Critical for sticky to work */
      }}>
        
        {/* Sidebar - Floating, No Borders, Clean */}
        <aside style={{ 
            width: '260px', flexShrink: 0, position: 'sticky', top: '140px', 
            maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'
        }} className="hidden lg:block scrollbar-hide">
            <h4 style={{ 
                fontSize: '12px', fontWeight: 'bold', color: '#8b5cf6', 
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' 
            }}>
                Documentation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink id="intro" label="Introduction" active={activeSection} />
                <NavLink id="architecture" label="Architecture" active={activeSection} />
                <NavLink id="tech-stack" label="Tech Stack Details" active={activeSection} />
                <NavLink id="auth" label="Authentication" active={activeSection} />
                <NavLink id="database" label="Database Schema" active={activeSection} />
                <NavLink id="components" label="Component Library" active={activeSection} />
            </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
            
            {/* Hero */}
            <section id="intro" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 16px', background: 'rgba(139,92,246,0.1)', 
                    border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', marginBottom: '24px'
                }}>
                    <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>v1.0.0 Stable</span>
                </div>
                
                <h1 style={{ 
                    fontSize: '64px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '24px',
                    color: 'var(--text-primary)'
                }}>
                    Bunk <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smarter.</span>
                </h1>
                
                <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px', marginBottom: '48px' }}>
                    ChillPeriod bridges the gap between academic responsibility and social freedom. 
                    The technical foundation behind the ultimate student utility platform.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <InfoCard 
                        icon="📱" title="Mobile First" 
                        desc="Designed for touch. Interactions are fluid, responsive, and natural on all devices." 
                    />
                    <InfoCard 
                        icon="⚡" title="Real-time Social" 
                        desc="Coordinate chills and bunks instantly using live WebSocket polling." 
                    />
                </div>
            </section>

            {/* Architecture */}
            <section id="architecture" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <SectionTitle title="System Architecture" subtitle="High-performance hybrid rendering with Next.js App Router." />
                
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '800px' }}>
                    ChillPeriod leverages the <strong>Next.js 16 App Router</strong> for a seamless blend of server-side rendering (SSR) and client-side interactivity. 
                    Critical pages like the dashboard are pre-rendered on the edge for speed, while dynamic components like the <em>Spots Feed</em> and <em>Live Activity</em> 
                    utilize React Server Components (RSC) to stream data directly from MongoDB Atlas without exposing sensitive API logic to the client.
                </p>

                <div style={{ 
                    background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                    borderRadius: '24px', padding: '40px', overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                }}>
                     <div className="mermaid" style={{ display: 'flex', justifyContent: 'center', opacity: 0.9 }}>
                        {`graph TD
                          Client[Client Browser] --> CDN[Vercel Edge]
                          CDN --> Static[Assets]
                          CDN --> Server[Next.js Server]
                          Server --> Page[SSR Pages]
                          Server --> API[API Routes]
                          API --> DB[(MongoDB Atlas)]`}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section id="tech-stack" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <SectionTitle title="Technology Stack" subtitle="Modern, scalable, and type-safe foundation." />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    <div style={{ 
                        background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                        borderRadius: '20px', padding: '32px' 
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚛️</span> Frontend
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <TechRow name="Next.js 16" desc="App Router architecture using React Server Components for optimal performance and SEO." />
                            <TechRow name="React 19" desc="Leveraging the latest features like Actions and simplified hooks for state management." />
                            <TechRow name="Tailwind CSS" desc="Utility-first styling system enabling rapid UI development with a custom design system." />
                            <TechRow name="Framer Motion" desc="Declarative animations for smooth transitions and interactive micro-interactions." />
                        </div>
                    </div>

                     <div style={{ 
                        background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                        borderRadius: '20px', padding: '32px' 
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🛠️</span> Backend & Data
                        </h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <TechRow name="Mongoose v9" desc="Elegant MongoDB object modeling ensuring strict schema validation and type safety." />
                            <TechRow name="NextAuth v5" desc="Secure, stateless authentication handling Google & Discord OAuth providers." />
                            <TechRow name="MongoDB Atlas" desc="Fully managed cloud database providing scalability and high availability." />
                            <TechRow name="Vercel" desc="Global edge network for deployment, serverless functions, and instant rollbacks." />
                        </div>
                    </div>

                </div>
            </section>

             {/* Auth Flow */}
             <section id="auth" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <SectionTitle title="Authentication" subtitle="Secure, stateless OAuth flow (Google & Discord)." />
                
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '800px' }}>
                    Authentication is handled entirely via <strong>NextAuth.js v5</strong>. We prioritize security by using HTTP-only cookies to store session JWTs, preventing XSS attacks. 
                    Users can sign in with their Google or Discord accounts. On first login, a User document is automatically upserted into MongoDB, linking their OAuth profile 
                    to a persistent application identity.
                </p>

                <div style={{ 
                    background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                    borderRadius: '24px', padding: '40px', overflow: 'hidden'
                }}>
                    <div className="mermaid" style={{ display: 'flex', justifyContent: 'center', opacity: 0.9 }}>
                        {`sequenceDiagram
                          User->>App: Login
                          App->>NextAuth: signIn()
                          NextAuth->>Provider: OAuth
                          Provider-->>NextAuth: Token
                          NextAuth->>DB: Upsert User
                          NextAuth-->>App: Set Cookie`}
                    </div>
                </div>
            </section>
            
            {/* Database Schema */}
             <section id="database" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <SectionTitle title="Database Schema" subtitle="User-centric document model tailored for scalability." />
                
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '800px' }}>
                   Our MongoDB schema is designed around the <strong>User</strong> as the central entity. 
                   <strong>Spots</strong> are stored in a separate collection with geospatial indexing planned for future location-based features. 
                   <strong>Attendance</strong> records are embedded or referenced to allow for efficient aggregation of stats per semester.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <InfoCard 
                        icon="👤" title="User Collection" 
                        desc="Stores profile info, OAuth IDs, and preferences (theme, notifications)." 
                    />
                    <InfoCard 
                        icon="📍" title="Spot Collection" 
                        desc="Contains location data, category types, and vibe tags for hangout spots." 
                    />
                     <InfoCard 
                        icon="📅" title="Timetable Data" 
                        desc="Static JSON structure mapped to user Semester/Section for schedule lookup." 
                    />
                </div>
            </section>

             {/* Components */}
            <section id="components" style={{ marginBottom: '120px', scrollMarginTop: '120px' }}>
                <SectionTitle title="Interface Components" subtitle="Reusable UI building blocks." />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                     <ComponentCard name="TermsModal" desc="Forces acceptance of Terms & Conditions. Implements a strictly controlled modal that cannot be dismissed without explicit agreement, ensuring legal compliance during onboarding." />
                     <ComponentCard name="Navbar" desc="Responsive navigation bar that adapts to mobile and desktop views. Features a hamburger menu, dynamic route highlighting, and a user profile dropdown with theme toggling." />
                     <ComponentCard name="UserListModal" desc="A versatile modal for displaying lists of users (Followers/Following). Includes a real-time search bar to filter users and quick-action buttons for visiting profiles." />
                     <ComponentCard name="FriendsActivity" desc="A live polling component that fetches recent activity from friends. Displays their current status (Bunking/Chilling) with relative timestamps (e.g., '2 mins ago')." />
                     <ComponentCard name="NotificationManager" desc="A background service component that handles global push notifications and toast alerts. Manages the lifecycle of alerts to prevent spamming the user." />
                </div>
            </section>

             {/* Footer */}
            <footer style={{ 
                borderTop: '1px solid var(--border-color)', paddingTop: '64px', paddingBottom: '32px',
                marginTop: '120px' 
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                     <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                            ChillPeriod
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                            The ultimate student utility platform for tracking attendance, finding spots, and coordinating with friends.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '16px' }}>Product</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Link href="/attendance" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-violet-500">Attendance</Link></li>
                             <li><Link href="/spots" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-cyan-500">Spots</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '16px' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Link href="/terms" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-violet-500">Terms of Service</Link></li>
                             <li><Link href="/privacy" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-cyan-500">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                 <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    © {new Date().getFullYear()} ChillPeriod Engineering. All rights reserved.
                </div>
            </footer>

        </main>
      </div>

     {/* Responsive Styles Injection */}
      <style jsx>{`
        @media (max-width: 1024px) {
            aside { display: none !important; }
            #intro h1 { font-size: 42px !important; }
            main { padding-top: 20px; }
        }
      `}</style>
    </div>
  );
}

// --- Bespoke Components (Inline Styles for exact match) ---

function NavLink({ id, label, active }) {
    const isActive = active === id;
    return (
        <a 
            href={`#${id}`}
            style={{ 
                display: 'block', padding: '10px 16px', borderRadius: '12px', fontSize: '14px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? '#8b5cf6' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
                textDecoration: 'none'
            }}
        >
            {label}
        </a>
    );
}

function SectionTitle({ title, subtitle }) {
    return (
        <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>
    );
}

function InfoCard({ icon, title, desc }) {
    return (
        <div 
            style={{ 
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                borderRadius: '20px', padding: '32px', transition: 'all 0.3s', cursor: 'default'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
        </div>
    );
}

function TechRow({ name, desc }) {
    return (
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{name}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
        </div>
    );
}

function ComponentCard({ name, desc }) {
     return (
        <div 
            style={{ 
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                borderRadius: '16px', padding: '24px', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', gap: '12px'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</h3>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-muted)' }}>.js</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{desc}</p>
        </div>
    );
}
