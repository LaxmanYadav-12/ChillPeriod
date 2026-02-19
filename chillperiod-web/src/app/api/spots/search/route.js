import { NextResponse } from 'next/server';

// Overpass API — structured radius search for real POIs near a location
// Much more accurate than Nominatim text search

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Map Overpass amenity/shop/leisure tags → our categories
const TAG_TO_CATEGORY = {
  cafe: 'cafe',
  restaurant: 'restaurant',
  fast_food: 'street_food',
  food_court: 'restaurant',
  ice_cream: 'sweet_shop',
  bakery: 'sweet_shop',
  confectionery: 'sweet_shop',
  park: 'park',
  garden: 'park',
  library: 'library',
  cinema: 'gaming',
  mall: 'shopping',
  supermarket: 'shopping',
  books: 'library',
  video_games: 'gaming',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));
  const radius = parseInt(searchParams.get('radius') || '7000'); // Default 7km
  const category = searchParams.get('category'); // Optional: filter by our category

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Missing or invalid lat/lng' }, { status: 400 });
  }

  try {
    // Build Overpass query for amenities + shops + leisure within radius
    const amenityTypes = [
      'cafe', 'restaurant', 'fast_food', 'food_court',
      'ice_cream', 'bakery', 'library', 'cinema'
    ];
    const shopTypes = ['mall', 'supermarket', 'confectionery', 'books', 'video_games'];
    const leisureTypes = ['park', 'garden'];

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"${amenityTypes.join('|')}"](around:${radius},${lat},${lng});
        node["shop"~"${shopTypes.join('|')}"](around:${radius},${lat},${lng});
        node["leisure"~"${leisureTypes.join('|')}"](around:${radius},${lat},${lng});
        way["leisure"~"${leisureTypes.join('|')}"](around:${radius},${lat},${lng});
      );
      out center body;
    `;

    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Overpass error:', errorText);
      return NextResponse.json({ error: 'Overpass API error' }, { status: 502 });
    }

    const data = await res.json();
    const elements = data.elements || [];

    // Process & filter results
    const spots = elements
      .map(el => {
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || '';
        
        // Skip unnamed or very short names
        if (!name || name.length < 3) return null;

        // Determine category from tags
        const amenity = tags.amenity || '';
        const shop = tags.shop || '';
        const leisure = tags.leisure || '';
        const tagType = amenity || shop || leisure;
        const mappedCategory = TAG_TO_CATEGORY[tagType] || 'other';

        // Skip 'other' - too vague
        if (mappedCategory === 'other') return null;

        // Optional category filter
        if (category && mappedCategory !== category) return null;

        // Get coordinates (ways use center)
        const spotLat = el.lat || el.center?.lat;
        const spotLng = el.lon || el.center?.lon;

        if (!spotLat || !spotLng) return null;

        // Calculate distance from college
        const distKm = haversine(lat, lng, spotLat, spotLng);
        const distStr = distKm < 1
          ? `${Math.round(distKm * 1000)}m away`
          : `${distKm.toFixed(1)}km away`;

        // Build address from tags
        const addressParts = [
          tags['addr:street'],
          tags['addr:suburb'] || tags['addr:neighbourhood'],
          tags['addr:city'] || 'Delhi'
        ].filter(Boolean);
        const address = addressParts.length > 0 
          ? addressParts.join(', ')
          : `Near ${tags['addr:postcode'] || 'campus'}`;

        return {
          name,
          category: mappedCategory,
          lat: spotLat,
          lng: spotLng,
          distance: distStr,
          distanceKm: distKm,
          address,
          cuisine: tags.cuisine || '',
          openingHours: tags.opening_hours || '',
          osmType: tagType,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${spotLat},${spotLng}`
        };
      })
      .filter(Boolean)
      // Deduplicate by name (case-insensitive)
      .filter((spot, idx, arr) => 
        arr.findIndex(s => s.name.toLowerCase() === spot.name.toLowerCase()) === idx
      )
      // Sort by distance
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json(spots);

  } catch (error) {
    console.error('Overpass search error:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

// Haversine formula — distance between two GPS points in km
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
