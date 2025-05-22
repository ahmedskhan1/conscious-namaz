import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db/mongodb';
import Blog from '../../../db/models/blog';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    await connectToDatabase();
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog || !blog.img) {
      console.error(`Blog image not found for slug: ${slug}`);
      return NextResponse.json(
        { error: 'Blog image not found' },
        { status: 404 }
      );
    }
    
    // Instead of serving the image directly, redirect to the Cloudinary URL
    return NextResponse.redirect(blog.img);
  } catch (error) {
    console.error('Error fetching blog image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog image: ' + error.message },
      { status: 500 }
    );
  }
} 