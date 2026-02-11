import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import UserInteraction from '@/models/UserInteraction';
import { withApi } from '@/lib/security/apiHandler';

// POST /api/admin/reset-votes — reset all votes (admin only)
// SECURITY: Changed from GET to POST — destructive operations must not use GET
// (browsers prefetch, crawlers follow GET links, etc.)
export const POST = withApi(
  async () => {
    await dbConnect();

    // 1. Reset all spots to 0
    const result = await Spot.updateMany({}, { 
      $set: { upvotes: 0, downvotes: 0 } 
    });

    // 2. Clear all user interactions (votes)
    await UserInteraction.deleteMany({ type: { $in: ['upvote', 'downvote'] } });

    return NextResponse.json({ 
      message: 'All votes reset successfully', 
      modifiedCount: result.modifiedCount 
    });
  },
  { auth: true, role: 'admin', rateLimit: 'write' }
);
