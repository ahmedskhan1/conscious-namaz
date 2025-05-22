import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db/mongodb';
import Blog from '../../../db/models/blog';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../utils/cloudinary';

// Get a specific blog by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog: ' + error.message },
      { status: 500 }
    );
  }
}

// Update a blog by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const content = formData.get('content');
    const slug = formData.get('slug');
    const readTime = formData.get('readTime');
    const published = formData.get('published') === 'true';
    const featured = formData.get('featured') === 'true';
    
    // Get image data
    const imageFile = formData.get('image');
    const imageUrl = formData.get('img');
    const cloudinary_id = formData.get('cloudinary_id');
    
    // Check for required fields
    if (!title || !description || !content || !slug || !readTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the blog to update
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Check if the slug is already used by another blog
    const existingBlog = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Update blog data
    blog.title = title;
    blog.description = description;
    blog.content = content;
    blog.slug = slug;
    blog.readTime = readTime;
    blog.published = published;
    blog.featured = featured;
    
    // Handle image updates
    if (imageFile && imageFile.size > 0) {
      try {
        // If there's an existing Cloudinary image, delete it
        if (blog.cloudinary_id) {
          await deleteFromCloudinary(blog.cloudinary_id);
        }
        
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: 'blogs'
        });
        
        blog.img = uploadResult.secure_url;
        blog.cloudinary_id = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image: ' + uploadError.message },
          { status: 500 }
        );
      }
    } else if (imageUrl) {
      // If no new file but image URL provided, use that
      blog.img = imageUrl;
      
      // Update cloudinary_id if provided
      if (cloudinary_id) {
        blog.cloudinary_id = cloudinary_id;
      }
    } else if (!blog.img) {
      // If no image is provided or set
      return NextResponse.json(
        { error: 'An image is required for the blog' },
        { status: 400 }
      );
    }
    
    await blog.save();
    
    return NextResponse.json(
      { blog, message: 'Blog updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog: ' + error.message },
      { status: 500 }
    );
  }
}

// Delete a blog by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Delete image from Cloudinary if exists
    if (blog.cloudinary_id) {
      await deleteFromCloudinary(blog.cloudinary_id);
    }
    
    await Blog.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
} 