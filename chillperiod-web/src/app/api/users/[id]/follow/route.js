import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST /api/users/[id]/follow - Follow a user
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const { id: targetUserId } = await params;
    const currentUserId = session.user.id;
    
    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: "You can't follow yourself" }, { status: 400 });
    }
    
    // Add to current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });
    
    // Add to target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });
    
    return NextResponse.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
  }
}

// DELETE /api/users/[id]/follow - Unfollow a user
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const { id: targetUserId } = await params;
    const currentUserId = session.user.id;
    
    // Remove from current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });
    
    // Remove from target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });
    
    return NextResponse.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
  }
}
