import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Spot from '@/models/Spot';
import { auth } from '@/auth';

// GET /api/spots/[id]/review — get reviews for a spot
export async function GET(req, context) {
  try {
    await dbConnect();
    const { id: spotId } = await context.params;

    const spot = await Spot.findById(spotId).select('reviews avgRating reviewCount').lean();
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Sort reviews newest first
    const reviews = (spot.reviews || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(r => ({
        ...r,
        userId: r.userId.toString(),
        _id: r._id?.toString()
      }));

    return NextResponse.json({
      reviews,
      avgRating: spot.avgRating || 0,
      reviewCount: spot.reviewCount || 0
    });
  } catch (error) {
    console.error('[review GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/spots/[id]/review — submit or update a review
export async function POST(req, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();
    const { id: spotId } = await context.params;
    const userId = session.user.id;

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { rating, text } = body;

    // Validate rating
    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    // Validate text
    if (text && typeof text === 'string' && text.length > 300) {
      return NextResponse.json({ error: 'Review text must be 300 characters or less' }, { status: 400 });
    }

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Check if user already reviewed — upsert
    const existingIdx = (spot.reviews || []).findIndex(
      r => r.userId.toString() === userId
    );

    if (existingIdx !== -1) {
      // Update existing review
      spot.reviews[existingIdx].rating = rating;
      spot.reviews[existingIdx].text = text || '';
      spot.reviews[existingIdx].userName = session.user.name || 'Anonymous';
      spot.reviews[existingIdx].userImage = session.user.image || null;
      spot.reviews[existingIdx].createdAt = new Date();
    } else {
      // Add new review
      spot.reviews.push({
        userId,
        userName: session.user.name || 'Anonymous',
        userImage: session.user.image || null,
        rating,
        text: text || '',
        createdAt: new Date()
      });
    }

    // Recalculate avg and count
    const allRatings = spot.reviews.map(r => r.rating);
    spot.reviewCount = allRatings.length;
    spot.avgRating = Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10;

    await spot.save();

    return NextResponse.json({
      success: true,
      avgRating: spot.avgRating,
      reviewCount: spot.reviewCount,
      action: existingIdx !== -1 ? 'updated' : 'created'
    });

  } catch (error) {
    console.error('[review POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
