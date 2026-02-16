'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Load Mermaid for diagrams
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    
    script.onload = () => {
      try {
        window.mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Outfit',
          themeVariables: {
            darkMode: true,
            background: '#0A0A0F',
            primaryColor: '#8b5cf6',
            secondaryColor: '#06b6d4',
            tertiaryColor: '#10b981',
            primaryTextColor: '#fff',
            secondaryTextColor: '#cbd5e1',
            lineColor: '#475569'
          }
        });
        window.mermaid.run({
          querySelector: '.mermaid'
        });
      } catch (err) {
        console.error('Mermaid initialization failed:', err);
      }
    };
    
    document.body.appendChild(script);

    // ScrollSpy
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#05050A] text-gray-300 font-[family-name:var(--font-outfit)] selection:bg-violet-500/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">ChillPeriod</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none mt-1">Documentation</span>
            </div>
          </Link>
          <Link 
            href="/" 
            className="text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Application
          </Link>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex gap-12 lg:gap-24 px-6 lg:px-12 py-16 relative z-10">
        
        {/* Sidebar */}
        <nav className="hidden lg:block w-64 shrink-0 self-start sticky top-32">
          <div className="py-4 border-l border-white/10">
             <ul className="space-y-6">
              <NavGroup title="Getting Started">
                <NavItem id="intro" active={activeSection} label="Introduction" />
                <NavItem id="architecture" active={activeSection} label="System Architecture" />
              </NavGroup>
              <NavGroup title="Technical Guide">
                <NavItem id="tech-stack" active={activeSection} label="Tech Stack" />
                <NavItem id="auth-flow" active={activeSection} label="Authentication" />
                <NavItem id="database" active={activeSection} label="Database Schema" />
              </NavGroup>
              <NavGroup title="Reference">
                <NavItem id="components" active={activeSection} label="Component Library" />
              </NavGroup>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-4xl">
          
          <section id="intro" className="mb-32 scroll-mt-32">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              v1.0.0
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-white leading-[1.1]">
              Building the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                Academic Balance
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12 font-light">
              ChillPeriod is more than an attendance tracker. It's a social utility platform designed to bridge the gap between academic responsibility and campus life.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureItem 
                title="Mobile First Design" 
                desc="Built for the on-the-go student lifestyle with fluid, responsive touch interactions."
                color="violet"
              />
              <FeatureItem 
                title="Real-time Social" 
                desc="Coordinate chills and bunks instantly with live status updates and notifications."
                color="cyan"
              />
            </div>
          </section>

          <section id="architecture" className="mb-32 scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">System Architecture</h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              High-level overview of the application request flow. Built on the <strong className="text-white font-medium">Next.js 14+ App Router</strong>, utilizing a hybrid rendering strategy for optimal performance.
            </p>

            <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0F] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-50"></div>
              <div className="mermaid p-10 flex items-center justify-center min-h-[300px]">
                {`graph TD
                  Client[Client Browser] -->|HTTP/HTTPS| CDN[Vercel Edge Network]
                  CDN -->|Cache Hit| Static[Static Assets]
                  CDN -->|Cache Miss| Server[Next.js Server]
                  
                  subgraph "Next.js Application"
                    Server -->|SSR| Page[Page Components]
                    Server -->|API Routes| API[Data Layer]
                    Page -->|Server Actions| Actions[Mutations]
                  end
                  
                  API -->|Mongoose| DB[(MongoDB Atlas)]
                  Actions -->|Auth.js| Auth[OAuth Providers]
                  
                  style Client fill:#13131f,stroke:#4c1d95,stroke-width:1px,color:#e2e8f0
                  style Server fill:#13131f,stroke:#0891b2,stroke-width:1px,color:#e2e8f0
                  style DB fill:#13131f,stroke:#059669,stroke-width:1px,color:#e2e8f0
                  style CDN fill:#13131f,stroke:#d97706,stroke-width:1px,color:#e2e8f0`}
              </div>
            </div>
          </section>

          <section id="tech-stack" className="mb-32 scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Tech Stack Details</h2>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
               A breakdown of the core technologies powering functionality, chosen for scalability and developer experience.
            </p>
            
            <div className="space-y-16">
              {/* Frontend */}
              <div>
                <h3 className="text-xl font-medium text-white mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                  </div>
                  Frontend Architecture
                </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <TechRow name="Next.js 16" desc="App Router, Server Actions, SSR" />
                  <TechRow name="React 19" desc="Server Components, Suspense" />
                  <TechRow name="Tailwind CSS" desc="Utility-first styling system" />
                  <TechRow name="Framer Motion" desc="Declarative animations" />
                </div>
              </div>

               {/* Backend */}
               <div>
                <h3 className="text-xl font-medium text-white mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                  </div>
                  Backend & Data
                </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <TechRow name="Mongoose v9" desc="Strict schema validation" />
                  <TechRow name="NextAuth v5" desc="Stateless JWT authentication" />
                  <TechRow name="MongoDB Atlas" desc="Cloud document storage" />
                  <TechRow name="Vercel" desc="Edge Functions & Deployment" />
                </div>
              </div>
            </div>
          </section>

          <section id="auth-flow" className="mb-32 scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Authentication Flow</h2>
             <p className="text-lg text-gray-400 mb-10 leading-relaxed">
               Secure, stateless OAuth authentication (Google & Discord) eliminating password security risks. Sessions are JWT-based and stored in HTTP-only cookies.
            </p>
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0F] shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-50"></div>
              <div className="mermaid p-10 flex items-center justify-center min-h-[400px]">
                {`sequenceDiagram
                  participant User
                  participant App
                  participant NextAuth
                  participant Provider
                  participant DB

                  User->>App: Clicks Login
                  App->>NextAuth: signIn('google')
                  NextAuth->>Provider: Redirect to OAuth
                  Provider-->>NextAuth: Return Auth Token
                  NextAuth->>DB: Upsert User Document
                  NextAuth-->>App: Set Session Cookie
                  App-->>User: Redirect to Dashboard`}
              </div>
            </div>
          </section>

          <section id="database" className="mb-32 scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Database Schema</h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
               User-centric document model tailored for scalability.
            </p>
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0F] shadow-xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-50"></div>
              <div className="mermaid p-10 flex items-center justify-center min-h-[350px]">
                {`erDiagram
                  USER ||--o{ ATTENDANCE : tracks
                  USER ||--o{ SPOT : creates
                  USER ||--o{ VOTE : casts
                  USER {
                      ObjectId _id
                      string email
                      string college
                      int totalBunks
                  }
                  SPOT {
                      ObjectId _id
                      string name
                      geopoint location
                      int upvotes
                  }
                  ATTENDANCE {
                      string subjectCode
                      int attended
                      int total
                  }`}
              </div>
            </div>
          </section>

           <section id="components" className="mb-32 scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Component Library</h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
               Reusable UI building blocks that ensure consistency across the application.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard 
                name="TermsModal" 
                path="/components/TermsModal.js"
                desc="Forces T&C acceptance. Modal with strictly controlled close behavior."
              />
              <ComponentCard 
                name="Navbar" 
                path="/components/Navbar.js"
                desc="Responsive navigation with mobile menu interactions and user dropdown."
              />
              <ComponentCard 
                name="UserListModal" 
                path="/components/UserListModal.js"
                desc="Dynamic list view for displaying Followers/Following with smart search."
              />
               <ComponentCard 
                name="FriendsActivity" 
                path="/components/FriendsActivity.js"
                desc="Live activity feed polling system for tracking friends' status."
              />
               <ComponentCard 
                name="NotificationManager" 
                path="/components/NotificationManager.js"
                desc="Handles global push notifications and toast alerts for the application."
              />
            </div>
          </section>

          <footer className="mt-32 pb-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
             <p>© 2024 ChillPeriod Engineering</p>
             <div className="flex items-center gap-6 mt-4 md:mt-0">
               <span className="hover:text-gray-400 transition-colors cursor-pointer">Privacy</span>
               <span className="hover:text-gray-400 transition-colors cursor-pointer">Terms</span>
               <span className="hover:text-gray-400 transition-colors cursor-pointer">Status</span>
             </div>
          </footer>

        </main>
      </div>

      <style jsx global>{`
        .mermaid svg {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}

// --- Components ---

function NavGroup({ title, children }) {
  return (
    <li className="mb-6">
      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-4 mb-3">{title}</div>
      <ul className="space-y-1 border-l border-white/5 ml-4">
        {children}
      </ul>
    </li>
  );
}

function NavItem({ id, active, label }) {
  const isActive = active === id;
  return (
    <li>
      <a 
        href={`#${id}`}
        className={`block px-4 py-2 text-sm transition-all duration-300 border-l ${
          isActive 
            ? 'border-violet-500 text-violet-300 font-medium -ml-px' 
            : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-white/10'
        }`}
      >
        {label}
      </a>
    </li>
  );
}

function FeatureItem({ title, desc, color }) {
  const colorMap = {
    violet: 'text-violet-400 decoration-violet-500/30',
    cyan: 'text-cyan-400 decoration-cyan-500/30'
  }
  return (
    <div className="pl-4 border-l border-white/10 hover:border-white/30 transition-colors">
      <h3 className={`font-medium text-lg mb-2 ${colorMap[color]}`}>{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function TechRow({ name, desc }) {
  return (
    <div className="flex flex-col border-b border-white/5 pb-4 last:border-0">
      <span className="text-gray-200 font-medium">{name}</span>
      <span className="text-sm text-gray-500">{desc}</span>
    </div>
  );
}

function ComponentCard({ name, path, desc }) {
  return (
    <div className="group p-6 rounded-2xl bg-[#0F0F16] border border-white/5 hover:border-violet-500/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-violet-300 transition-colors">{name}</h3>
        <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-1 rounded">JSX</span>
      </div>
      <code className="text-xs text-gray-600 block mb-3 font-mono">{path}</code>
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
