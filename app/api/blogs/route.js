import { NextResponse } from 'next/server';
import connectToDatabase from '../db/mongodb';
import Blog from '../db/models/blog';

// Set revalidation time to 0 to disable caching
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    
    // Only find published blogs and sort by newest first
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    
    // Set cache-control headers to prevent caching
    return NextResponse.json(
      { blogs }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
} 