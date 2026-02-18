'use client';

import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      <Navbar />
      <MobileNav currentPage="profile" /> {/* Profile is closest relevant tab */}

      <div style={{ 
          maxWidth: '900px', margin: '0 auto', width: '100%', 
          padding: '120px 24px 60px', 
          flex: 1 
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
              fontSize: '42px', fontWeight: 'bold', marginBottom: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Glass Card Content */}
        <div style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border-color)',
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)'
        }}>
            
            <Section title="1. Acceptance of Terms">
                By accessing and using ChillPeriod ("the Service"), you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, you must not use the Service.
            </Section>

            <Section title="2. Description of Service">
                ChillPeriod provides attendance tracking, syllabus information, and social coordination features for students. 
                The Service is a utility tool and is not affiliated with any educational institution.
            </Section>

            <Section title="3. User Conduct & Responsibilities">
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>You are responsible for the accuracy of the attendance data you enter.</li>
                    <li>You agree not to use the "Mass Bunk" features to harass others or disrupt academic activities maliciously.</li>
                    <li>You must not upload false information regarding "Chill Spots" or public locations.</li>
                    <li>We reserve the right to suspend accounts that engage in harassment, spam, or abuse.</li>
                </ul>
            </Section>

            <Section title="4. Academic Disclaimer">
                <strong style={{ color: '#ef4444' }}>ChillPeriod is not responsible for your academic performance or attendance records.</strong> 
                The calculations provided are estimates based on your input. Always verify your official attendance with your college administration. 
                We are not liable for any detentions, grade reductions, or academic penalties you may face.
            </Section>

            <Section title="5. Data & Privacy">
                We collect basic profile information (name, email, college details) to provide the Service. 
                By using the Service, you consent to this collection. We do not sell your personal data to third parties.
            </Section>

            <Section title="6. Termination">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms.
            </Section>

            <Section title="7. Contact" last>
                For any questions about these Terms, please contact us on Instagram{' '}
                <a href="https://www.instagram.com/twokney/" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
                    @twokney
                </a>.
            </Section>

        </div>

        {/* Related Links */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px', flexWrap: 'wrap'
        }}>
          <Link href="/privacy" style={{ 
            color: '#8b5cf6', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)',
            background: 'rgba(139,92,246,0.05)', transition: 'all 0.2s'
          }}>
            🔒 Privacy Policy
          </Link>
          <Link href="/docs" style={{ 
            color: '#06b6d4', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.2)',
            background: 'rgba(6,182,212,0.05)', transition: 'all 0.2s'
          }}>
            📖 Documentation
          </Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
            © {new Date().getFullYear()} ChillPeriod Engineering. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, last }) {
    return (
        <div style={{ marginBottom: last ? 0 : '40px' }}>
            <h2 style={{ 
                fontSize: '20px', fontWeight: 'bold', marginBottom: '16px',
                color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span>
                {title}
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '16px' }}>
                {children}
            </div>
        </div>
    );
}
