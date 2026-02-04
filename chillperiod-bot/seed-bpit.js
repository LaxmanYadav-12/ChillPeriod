import { config } from 'dotenv';
import mongoose from 'mongoose';
import Spot from './src/models/Spot.js';

config();

const BPIT_SPOTS = [
    // Cafes
    {
        name: "Bhagya Vihar Internet Cafe",
        description: "Internet cafe near campus, good for quick browsing and printing",
        college: "bpit-rohini",
        category: "cafe",
        vibe: "quiet",
        budget: "cheap",
        distance: "10 min walk",
        address: "Mangal Bazar Rd, Bhagya Vihar, Madanpur Dabas",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Meer Vihar Cafe",
        description: "Cozy cafe in Block A, good for study sessions with coffee",
        college: "bpit-rohini",
        category: "cafe",
        vibe: "both",
        budget: "moderate",
        distance: "15 min walk",
        address: "C-50, Block A, Meer Vihar, Mubarakpur Dabas",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    
    // Parks
    {
        name: "Rohini Sector 6 Park",
        description: "Nice green space for relaxing between classes",
        college: "bpit-rohini",
        category: "park",
        vibe: "quiet",
        budget: "free",
        distance: "5 min walk",
        address: "Pocket 6D, Sector 6, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Sector 5B Community Park",
        description: "Good for morning walks and evening hangouts",
        college: "bpit-rohini",
        category: "park",
        vibe: "social",
        budget: "free",
        distance: "8 min walk",
        address: "Sector-5B, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Rohini 7D Garden",
        description: "Well-maintained park, peaceful atmosphere",
        college: "bpit-rohini",
        category: "park",
        vibe: "quiet",
        budget: "free",
        distance: "10 min walk",
        address: "Pocket 11, Sector 7D, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Sector 17/18 Park",
        description: "Large park on Chhotu Ram Marg, good for groups",
        college: "bpit-rohini",
        category: "park",
        vibe: "social",
        budget: "free",
        distance: "3 min walk",
        address: "Chhotu Ram Marg, Sector 17/18 Dividing Rd, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    
    // Restaurants/Hotels for food
    {
        name: "Garg Trade Centre Food Court",
        description: "Multiple food options in one place, good for groups",
        college: "bpit-rohini",
        category: "restaurant",
        vibe: "social",
        budget: "moderate",
        distance: "12 min walk",
        address: "Garg Trade Centre, Sector 11, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Twin District Centre Eatery",
        description: "Near Swarn Jayanti Park, nice ambiance",
        college: "bpit-rohini",
        category: "restaurant",
        vibe: "both",
        budget: "moderate",
        distance: "15 min walk",
        address: "Twin District Centre, Swarn Jayanti Park, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    },
    {
        name: "Sector 16 Restaurant Hub",
        description: "Multiple restaurants on Ram Krishna Marg",
        college: "bpit-rohini",
        category: "restaurant",
        vibe: "social",
        budget: "moderate",
        distance: "18 min walk",
        address: "Ram Krishna Marg, Pocket 5, Sector 16, Rohini",
        addedBy: { discordId: "system", username: "ChillPeriod" }
    }
];

async function seedBPITSpots() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🍃 Connected to MongoDB');
        
        // Check if spots already exist
        const existingCount = await Spot.countDocuments({ college: "bpit-rohini" });
        
        if (existingCount > 0) {
            console.log(`⚠️ ${existingCount} BPIT spots already exist. Skipping seed.`);
            console.log('   To re-seed, delete existing spots first.');
        } else {
            // Insert spots
            const result = await Spot.insertMany(BPIT_SPOTS);
            console.log(`✅ Seeded ${result.length} chill spots for BPIT!`);
        }
        
        // Show all spots
        const allSpots = await Spot.find({ college: "bpit-rohini" });
        console.log('\n📍 BPIT Chill Spots:');
        allSpots.forEach((spot, i) => {
            console.log(`   ${i + 1}. ${spot.name} (${spot.category})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🍃 Disconnected from MongoDB');
    }
}

seedBPITSpots();
