import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import { withApi } from '@/lib/security/apiHandler';
import { spotImportSchema } from '@/lib/validators';
import { escapeRegex } from '@/lib/security/sanitize';

// POST /api/spots/import — bulk import spots (admin only, validated)
// SECURITY: Admin-only, Zod validation, regex-safe duplicate check
export const POST = withApi(
  async (req, { validatedData }) => {
    await dbConnect();
    const { spots } = validatedData;

    const savedSpots = [];
    
    for (const spotData of spots) {
      // SECURITY: Escape name before using in regex to prevent ReDoS / injection
      const escapedName = escapeRegex(spotData.name);
      const existing = await Spot.findOne({ 
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') } 
      });

      if (!existing) {
        // SECURITY: Whitelist fields — never spread raw input
        const newSpot = await Spot.create({
          name: spotData.name,
          description: spotData.description || '',
          category: spotData.category,
          vibe: spotData.vibe,
          budget: spotData.budget,
          distance: spotData.distance || '',
          address: spotData.address || '',
          coordinates: spotData.coordinates,
          college: 'BPIT',
          verified: true,
          upvotes: 0,
          downvotes: 0,
        });
        savedSpots.push(newSpot);
      } else {
        savedSpots.push(existing);
      }
    }

    return NextResponse.json({ savedSpots });
  },
  { auth: true, role: 'admin', schema: spotImportSchema, rateLimit: 'write' }
);
