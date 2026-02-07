import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/[id] - Get user profile
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await dbConnect();
    
    const user = await User.findById(id)
      .select('-email -googleId -discordId')
      .populate('followers', 'name image')
      .populate('following', 'name image')
      .lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Add computed fields
    user.attendancePercentage = user.totalClasses > 0 
      ? Math.round((user.attendedClasses / user.totalClasses) * 100) 
      : 100;
    user.followerCount = user.followers?.length || 0;
    user.followingCount = user.following?.length || 0;
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user profile
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updates = {};

    // Handle username update with uniqueness check
    if (body.username) {
      // Validate format
      if (!/^[a-z0-9_]{3,20}$/.test(body.username)) {
        return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
      }

      // Check if taken by another user
      const existingUser = await User.findOne({ username: body.username });
      if (existingUser && existingUser._id.toString() !== id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
      updates.username = body.username;
    }
    
    // Only allow updating certain fields
    const allowedFields = ['name', 'college', 'favoriteSpot', 'isPublic', 'notificationsEnabled', 'targetPercentage'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }
    
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
