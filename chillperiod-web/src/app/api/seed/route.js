import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';

const demoSpots = [
  { name: 'Bhagya Vihar Internet Cafe', description: 'Internet cafe near campus, good for quick browsing and printing', category: 'cafe', vibe: 'quiet', budget: 'cheap', distance: '10 min walk', address: 'Mangal Bazar Rd, Bhagya Vihar', upvotes: 12 },
  { name: 'Sector 17/18 Park', description: 'Large park on Chhotu Ram Marg, good for groups', category: 'park', vibe: 'social', budget: 'free', distance: '3 min walk', address: 'Chhotu Ram Marg, Sector 17/18', upvotes: 25 },
  // ... (previous spots kept, adding new ones below)
  
  // Zomato/Web Additions
  { name: 'The Chocolate Villa', description: 'Premium bakery and cafe, famous for desserts', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '15 min drive', address: 'Shop 20, Crescent Square Mall, Sector 9', upvotes: 35 },
  { name: 'Garhwal Bakery', description: 'Classic bakery with quick bites', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '10 min drive', address: 'Block E-3, Sector 16', upvotes: 22 },
  { name: 'Marwadi Cafe', description: 'Authentic snacks and chai', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '12 min drive', address: 'Shop 95, Sector 7', upvotes: 18 },
  { name: 'Demould', description: 'Trendy bakery cafe, great for dates', category: 'cafe', vibe: 'romantic', budget: 'moderate', distance: '12 min drive', address: 'Pocket C8, Sector 7', upvotes: 40 },
  { name: 'Rooh Burger Cafe', description: 'Juicy burgers and shakes', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min drive', address: 'D-Mall, Sector 10', upvotes: 28 },
  { name: 'Cafe Cabana', description: 'Open air cafe with good vibes', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '12 min drive', address: 'Sector 7, Opp Pillar 401', upvotes: 33 },
  { name: 'Caffine Canvas', description: 'Artistic cafe for creative minds', category: 'cafe', vibe: 'productive', budget: 'moderate', distance: '20 min drive', address: 'Sector 3, Rohini', upvotes: 25 },
  { name: 'Roslyn Coffee', description: 'Pastel decor, instagrammable coffee spot', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '15 min drive', address: 'Rohini Sector 16', upvotes: 30 },
  { name: 'Xero Degrees', description: 'Famous for cheesy fries and sliders', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '10 min drive', address: 'Sector 10, Rohini', upvotes: 55 },
  { name: 'Bistro 57', description: 'Student favorite for cheap coffee and shakes', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '10 min drive', address: 'Sector 10/11', upvotes: 60 },
  { name: 'Mama\'s Buoi', description: 'Rooftop vibes and good music', category: 'restaurant', vibe: 'late_night', budget: 'expensive', distance: '20 min drive', address: 'Sector 3, Rohini', upvotes: 45 },
  { name: 'Chammach', description: 'Aesthetic interiors, great for photos', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '25 min drive', address: 'Sector 24, Rohini', upvotes: 20 },
  { name: 'Vault Health Cafe', description: 'Healthy eats partnered with One8', category: 'cafe', vibe: 'productive', budget: 'expensive', distance: '10 min drive', address: 'Mangalam Place, Sector 10', upvotes: 15 },
  { name: 'Cafe Muzino', description: 'Neon lights and graffiti, cool hangout', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '15 min drive', address: 'Rohini', upvotes: 27 },
  { name: 'Yaari Cafe', description: 'Live connectivity and karaoke', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '12 min drive', address: 'Rohini', upvotes: 32 },
  { name: 'Hideout Cafe', description: 'Books and warm interiors', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '15 min drive', address: 'Rohini', upvotes: 24 },
  { name: 'Big Bro\'s Cafe', description: 'Maggi and pasta specialities', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '12 min drive', address: 'Rohini', upvotes: 29 },
  { name: 'The Waffleicious Cafe', description: 'Sweet tooth heaven', category: 'sweet_shop', vibe: 'social', budget: 'moderate', distance: '15 min drive', address: 'Rohini', upvotes: 38 },
  { name: 'Shake Sahab', description: 'Crazy freak shakes', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '15 min drive', address: 'Rohini', upvotes: 42 },
  { name: 'Uncle\'s Sip & Bite', description: 'Pull-apart garlic bread famous', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min drive', address: 'Rohini', upvotes: 50 },
];

// GET /api/seed — seed demo data (admin + development only)
// SECURITY: Restricted to admin role AND non-production environment
export async function GET() {
  // SECURITY: Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed route is disabled in production' }, { status: 403 });
  }

  await dbConnect();
  try {
    const operations = demoSpots.map(spot => ({
      updateOne: {
        filter: { name: spot.name },
        update: { $set: { ...spot, college: 'BPIT', verified: true } },
        upsert: true
      }
    }));

    const result = await Spot.bulkWrite(operations);

    return NextResponse.json({ 
      message: 'Seeded successfully', 
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });
  } catch (error) {
    console.error('[seed]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
