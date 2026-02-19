import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import { withApi } from '@/lib/security/apiHandler';

// GET /api/admin/reported-spots — get all flagged spots (admin only)
export const GET = withApi(
  async () => {
    await dbConnect();
    const reportedSpots = await Spot.find({ reported: true })
      .sort({ reportCount: -1 })
      .select('name category address reportCount reports verified _id')
      .lean();

    // Serialize ObjectIds
    const serialized = reportedSpots.map(s => ({
      ...s,
      _id: s._id.toString(),
      reports: (s.reports || []).map(r => ({
        ...r,
        userId: r.userId.toString(),
        _id: r._id?.toString()
      }))
    }));

    return NextResponse.json(serialized);
  },
  { auth: true, role: 'admin', rateLimit: 'read' }
);

// POST /api/admin/reported-spots — dismiss or remove a reported spot (admin only)
export const POST = withApi(
  async (req, { validatedData }) => {
    await dbConnect();
    const body = await req.json();
    const { spotId, action } = body;

    if (!spotId || !['dismiss', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (action === 'remove') {
      await Spot.findByIdAndDelete(spotId);
      return NextResponse.json({ success: true, action: 'removed' });
    }

    // Dismiss — clear reports and unflag
    await Spot.findByIdAndUpdate(spotId, {
      $set: { reports: [], reportCount: 0, reported: false, verified: true }
    });

    return NextResponse.json({ success: true, action: 'dismissed' });
  },
  { auth: true, role: 'admin', rateLimit: 'write' }
);
