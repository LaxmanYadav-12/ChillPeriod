import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // In Next.js 15+, params might be a promise, but for safe access in route handlers:
  const resolvedParams = await params;
  const path = resolvedParams.path;
  
  const targetUrl = `https://api.syllabusx.live/${path.join('/')}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache control can be added here if needed, or rely on fetch defaults
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Ext API Error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}
