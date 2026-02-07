
import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function DebugSessionPage() {
  const session = await auth();
  const headersList = await headers(); // Next.js 15+ requires await
  const cookieHeader = headersList.get('cookie');

  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1>Session Debugger</h1>
      
      <h2>Session Data (Server-Side)</h2>
      <pre style={{ background: '#222', padding: '20px', borderRadius: '10px', overflow: 'auto', border: '1px solid #444' }}>
        {JSON.stringify(session, null, 2)}
      </pre>

      <h2>Incoming Cookies</h2>
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', wordBreak: 'break-all' }}>
        {cookieHeader || 'No cookies found in request'}
      </div>

      <p style={{ marginTop: '20px', color: '#aaa' }}>
        <strong>Diagnosis:</strong><br/>
        - If Session is null but Cookies show `next-auth.session-token`, the token is invalid or signature mismatch.<br/>
        - If Cookies are empty, the browser refused to set/send the cookie (likely a Secure/SameSite issue).
      </p>
    </div>
  );
}
