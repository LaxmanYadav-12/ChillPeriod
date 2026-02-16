import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Create a random dummy user
    const randomId = Math.random().toString(36).substring(7);
    const dummyUser = await User.create({
      name: `Test User ${randomId}`,
      email: `test_${randomId}@example.com`,
      username: `test_user_${randomId}`,
      role: 'user',
      college: 'Test Institute',
      totalBunks: Math.floor(Math.random() * 20),
      hasCompletedOnboarding: true,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Dummy user created!", 
      user: dummyUser 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
