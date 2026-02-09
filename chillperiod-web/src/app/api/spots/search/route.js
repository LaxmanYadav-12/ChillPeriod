import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`;
    console.log('Fetching URL:', nominatimUrl);
    
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'ChillPeriod-Student-App/1.0 (contact@chillperiod.app)', // Updated email format
        'Referer': 'https://chillperiod.vercel.app',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ 
        error: `Nominatim Error: ${res.status} ${res.statusText}`,
        details: errorText 
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Nominatim Proxy Error:', error);
    return NextResponse.json({ 
      error: 'Server Error: Failed to fetch from map service',
      details: error.message 
    }, { status: 500 });
  }
}
