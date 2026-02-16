export const metadata = {
  title: "Terms and Conditions - ChillPeriod",
  description: "Terms and Conditions for using ChillPeriod.",
};

export default function TermsPage() {
  return (
    <div style={{ 
      maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px',
      color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif'
    }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>Terms and Conditions</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>1. Acceptance of Terms</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          By accessing and using ChillPeriod ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Service.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>2. Description of Service</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          ChillPeriod provides attendance tracking, syllabus information, and social coordination features for students. The Service is a utility tool and is not affiliated with any educational institution.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>3. User Conduct & Responsibilities</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '8px' }}>You are responsible for the accuracy of the attendance data you enter.</li>
          <li style={{ marginBottom: '8px' }}>You agree not to use the "Mass Bunk" features to harass others or disrupt academic activities maliciously.</li>
          <li style={{ marginBottom: '8px' }}>You must not upload false information regarding "Chill Spots" or public locations.</li>
          <li style={{ marginBottom: '8px' }}>I reserve the right to suspend accounts that engage in harassment, spam, or abuse.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>4. Academic Disclaimer</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          <strong>ChillPeriod is not responsible for your academic performance or attendance records.</strong> The calculations provided are estimates based on your input. Always verify your official attendance with your college administration. I am not liable for any detentions, grade reductions, or academic penalties you may face.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>5. Data & Privacy</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          I collect basic profile information (name, email, college details) to provide the Service. By using the Service, you consent to this collection. I do not sell your personal data to third parties.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>6. Termination</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          I may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#8b5cf6' }}>7. Contact</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          For any questions about these Terms, please contact me on Instagram <a href="https://www.instagram.com/twokney/" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>@twokney</a>.
        </p>
      </section>
    </div>
  );
}
