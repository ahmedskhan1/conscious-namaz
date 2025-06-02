import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/mongodb';
import Blog from '../../db/models/blog';

// Set revalidation time to 0 to disable caching
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    await connectToDatabase();
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      console.error(`Blog not found for slug: ${slug}`);
      return NextResponse.json(
        { error: 'Blog not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    // Set cache-control headers to prevent caching
    return NextResponse.json(
      { blog }, 
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
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
} 