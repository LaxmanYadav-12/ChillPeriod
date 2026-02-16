import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  if (!email && !username) {
    return NextResponse.json({ error: "Please provide ?email=... or ?username=... in the URL" }, { status: 400 });
  }

  try {
    await dbConnect();
    
    const query = email ? { email } : { username };
    const user = await User.findOneAndUpdate(
      query,
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${user.name} is now an Admin!`, 
      user: { name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
