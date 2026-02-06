import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/[id] - Get user profile
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
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
    
    // Only allow updating certain fields
    const allowedFields = ['name', 'college', 'favoriteSpot', 'isPublic', 'notificationsEnabled', 'targetPercentage'];
    const updates = {};
    
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
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
