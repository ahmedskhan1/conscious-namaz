import connectToDatabase from '../../db/mongodb';
import User from '../../db/models/user';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();
    
    // Find user by username
    const user = await User.findOne({ username });
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username
    };
    
    return NextResponse.json(
      { success: true, user: userData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 