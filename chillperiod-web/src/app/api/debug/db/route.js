import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const start = Date.now();
    await dbConnect();
    const connectionTime = Date.now() - start;

    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connected successfully',
      connectionTimeMs: connectionTime,
      userCount: userCount,
      mongooseVersion: require('mongoose').version
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
