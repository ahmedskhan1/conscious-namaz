import connectToDatabase from '../db/mongodb';
import User from '../db/models/user';
import { NextResponse } from 'next/server';

// GET all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('-password');
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a new user
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const user = await User.create(body);
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully', 
      user: userData,
      dbConnection: 'MongoDB connected successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 