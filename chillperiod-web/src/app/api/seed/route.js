import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';

const demoSpots = [
  { name: 'Bhagya Vihar Internet Cafe', description: 'Internet cafe near campus, good for quick browsing and printing', category: 'cafe', vibe: 'quiet', budget: 'cheap', distance: '10 min walk', address: 'Mangal Bazar Rd, Bhagya Vihar', upvotes: 12 },
  { name: 'Sector 17/18 Park', description: 'Large park on Chhotu Ram Marg, good for groups', category: 'park', vibe: 'social', budget: 'free', distance: '3 min walk', address: 'Chhotu Ram Marg, Sector 17/18', upvotes: 25 },
  { name: 'Garg Trade Centre Food Court', description: 'Multiple food options in one place, good for groups', category: 'restaurant', vibe: 'social', budget: 'moderate', distance: '12 min walk', address: 'Sector 11, Rohini', upvotes: 18 },
  { name: 'Rohini Sector 6 Park', description: 'Nice green space for relaxing between classes', category: 'park', vibe: 'quiet', budget: 'free', distance: '5 min walk', address: 'Pocket 6D, Sector 6, Rohini', upvotes: 15 },
  { name: 'Meer Vihar Cafe', description: 'Cozy cafe in Block A, good for study sessions with coffee', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Block A, Meer Vihar', upvotes: 8 },
  { name: 'Twin District Centre Eatery', description: 'Near Swarn Jayanti Park, nice ambiance', category: 'restaurant', vibe: 'both', budget: 'moderate', distance: '15 min walk', address: 'Swarn Jayanti Park, Rohini', upvotes: 20 },
  { name: 'Japanese Park', description: 'Beautiful Japanese themed park, perfect for chilling', category: 'park', vibe: 'quiet', budget: 'free', distance: '8 min walk', address: 'Pocket 3, Sector 10, Rohini', upvotes: 32 },
  { name: 'Unity One Mall Food Court', description: 'AC food court with lots of options, great for summers', category: 'shopping', vibe: 'social', budget: 'moderate', distance: '20 min walk', address: 'Sector 10, Rohini', upvotes: 22 },
  { name: 'Chaayos Rohini', description: 'Perfect chai and snacks, good WiFi for work', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '18 min walk', address: 'M2K Corporate Park, Sector 9', upvotes: 16 },
  { name: 'Dominos Near Gate', description: 'Quick pizza spot, AC and free WiFi', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '5 min walk', address: 'Sector 17, Main Road', upvotes: 14 },
  { name: 'Sector 11 Central Park', description: 'Huge open ground, great for cricket bunks', category: 'park', vibe: 'social', budget: 'free', distance: '10 min walk', address: 'Central Park, Sector 11', upvotes: 28 },
  { name: 'Barista Coffee', description: 'Premium coffee, perfect for solo study sessions', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '22 min walk', address: 'Eros City Square, Sector 11', upvotes: 11 },
  { name: 'Momo Corner Near Metro', description: 'Best momos in Rohini, super cheap', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '7 min walk', address: 'Near Rohini West Metro', upvotes: 35 },
  { name: 'Swarn Jayanti Park', description: 'Massive park, entry fee but worth it', category: 'park', vibe: 'both', budget: 'cheap', distance: '25 min walk', address: 'Sector 10, Rohini', upvotes: 40 },
  { name: 'Starbucks Unity One', description: 'Premium coffee experience, AC, charging points', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '20 min walk', address: 'Unity One Mall, Sector 10', upvotes: 19 },
  { name: 'Burger King Rohini', description: 'Fast food, AC, coupon friendly', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '18 min walk', address: 'Sector 9, Main Market', upvotes: 13 },
  { name: 'Sector 7 Kids Park', description: 'Usually empty during college hours, peaceful', category: 'park', vibe: 'quiet', budget: 'free', distance: '12 min walk', address: 'E Block, Sector 7', upvotes: 9 },
  { name: 'Cafe Delhi Heights', description: 'Great ambiance, rooftop seating available', category: 'cafe', vibe: 'social', budget: 'moderate', distance: '25 min walk', address: 'M2K Pitampura, Sector 7', upvotes: 21 },
  { name: 'Haldiram Rohini', description: 'Desi snacks and sweets, affordable thalis', category: 'restaurant', vibe: 'both', budget: 'cheap', distance: '15 min walk', address: 'Sector 11, Main Chowk', upvotes: 24 },
  { name: 'Metro Station Sitting Area', description: 'Free AC, can sit for hours pretending to wait', category: 'other', vibe: 'quiet', budget: 'free', distance: '6 min walk', address: 'Rohini West Metro Station', upvotes: 17 },
  { name: 'CCD Near BPIT', description: 'Classic coffee spot, reliable WiFi', category: 'cafe', vibe: 'both', budget: 'moderate', distance: '8 min walk', address: 'Sector 17, Near BPIT Gate', upvotes: 26 },
  { name: 'South Indian Corner', description: 'Cheap dosas and idlis, student budget friendly', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min walk', address: 'Bhagya Vihar Market', upvotes: 18 },
  { name: 'Rohini District Park', description: 'Jogging track, benches, good evening spot', category: 'park', vibe: 'both', budget: 'free', distance: '15 min walk', address: 'Sector 14, Rohini', upvotes: 14 },
  { name: 'McDonald\'s Sector 11', description: 'McCafe area is chill, affordable meals', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '12 min walk', address: 'Sector 11, Main Road', upvotes: 20 },
  { name: 'BPIT Back Gate Dhaba', description: 'Legendary chai and maggi spot, super cheap', category: 'cafe', vibe: 'social', budget: 'cheap', distance: '2 min walk', address: 'Behind BPIT Gate', upvotes: 45 },
  { name: 'Sector 16 Sports Complex', description: 'Open ground, sometimes has events', category: 'park', vibe: 'social', budget: 'free', distance: '8 min walk', address: 'Pocket 16, Sector 16', upvotes: 11 },
  { name: 'Third Wave Coffee', description: 'Hipster vibes, great cold coffee', category: 'cafe', vibe: 'quiet', budget: 'moderate', distance: '22 min walk', address: 'M2K Corporate Park', upvotes: 15 },
  { name: 'Punjab Sweet House', description: 'Chole bhature heaven, heavy but worth it', category: 'restaurant', vibe: 'social', budget: 'cheap', distance: '10 min walk', address: 'Sector 11 Market', upvotes: 30 },
  { name: 'MKS Public Library', description: 'Free, AC, super quiet for actual studying', category: 'library', vibe: 'quiet', budget: 'free', distance: '20 min walk', address: 'Sector 11, Near Court', upvotes: 8 },
  { name: 'Bikanervala Rohini', description: 'Proper thalis, family restaurant vibes', category: 'restaurant', vibe: 'both', budget: 'moderate', distance: '18 min walk', address: 'Sector 11, Main Road', upvotes: 16 },
];

export async function GET() {
  await dbConnect();
  try {
    // Check if spots already exist to avoid duplicates
    const count = await Spot.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Spots already populated', count });
    }

    // Insert demo spots
    const spots = await Spot.insertMany(demoSpots.map(s => ({
       ...s,
       college: 'BPIT', // Default college
       verified: true
    })));

    return NextResponse.json({ message: 'Seeded successfully', count: spots.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
