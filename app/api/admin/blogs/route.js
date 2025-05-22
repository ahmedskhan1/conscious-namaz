import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/mongodb';
import Blog from '../../db/models/blog';
import { uploadToCloudinary } from '../../utils/cloudinary';

// Get all blogs (admin view - includes unpublished blogs)
export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// Create a new blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const content = formData.get('content');
    const slug = formData.get('slug');
    const readTime = formData.get('readTime');
    const published = formData.get('published') === 'true';
    const featured = formData.get('featured') === 'true';
    
    // Get the image file or URL
    const imageFile = formData.get('image');
    const imageUrl = formData.get('img');
    const cloudinary_id = formData.get('cloudinary_id');
    
    if (!title || !description || !content || !slug || !readTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check that either an image file or image URL is provided
    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        { error: 'Blog image is required' },
        { status: 400 }
      );
    }
    
    // If an image file is provided, upload to Cloudinary
    let finalImageUrl = imageUrl;
    let finalCloudinaryId = cloudinary_id;
    
    if (imageFile && imageFile.size > 0) {
      // Validate image file type
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        );
      }
      
      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: 'blogs'
        });
        
        finalImageUrl = uploadResult.secure_url;
        finalCloudinaryId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image: ' + uploadError.message },
          { status: 500 }
        );
      }
    }
    
    await connectToDatabase();
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 409 }
      );
    }
    
    const newBlog = new Blog({
      title,
      description,
      content,
      slug,
      img: finalImageUrl,
      cloudinary_id: finalCloudinaryId,
      readTime,
      published,
      featured,
    });
    
    await newBlog.save();
    
    return NextResponse.json(
      { blog: newBlog, message: 'Blog created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog: ' + error.message },
      { status: 500 }
    );
  }
} 