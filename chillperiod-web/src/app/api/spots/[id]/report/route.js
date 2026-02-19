import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import { withApi } from '@/lib/security/apiHandler';
import { spotReportSchema } from '@/lib/validators';

// POST /api/spots/[id]/report — Report a spot
export const POST = withApi(
  async (req, { session, params, validatedData }) => {
    await dbConnect();
    const { id: spotId } = params;
    const userId = session.user.id;

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Check for duplicate report from same user
    const alreadyReported = (spot.reports || []).some(
      r => r.userId.toString() === userId
    );
    if (alreadyReported) {
      return NextResponse.json({ error: 'You have already reported this spot' }, { status: 409 });
    }

    // Add report
    spot.reports.push({
      userId,
      reason: validatedData.reason,
      detail: validatedData.detail || '',
      createdAt: new Date()
    });
    spot.reportCount = spot.reports.length;

    // Auto-flag when threshold reached
    if (spot.reportCount >= 3) {
      spot.reported = true;
    }

    await spot.save();

    return NextResponse.json({
      success: true,
      reportCount: spot.reportCount,
      flagged: spot.reported
    });
  },
  { auth: true, schema: spotReportSchema, rateLimit: 'write' }
);
