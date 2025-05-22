import connectToDatabase from '../db/mongodb';
import HomeVideo from '../db/models/homevideo';
import { NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// GET all home videos
export async function GET() {
  try {
    await connectToDatabase();
    const homevideos = await HomeVideo.find({});
    return NextResponse.json({ success: true, homevideos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a new home video
export async function POST(request) {
  try {
    // Handle multipart form data
    const formData = await request.formData();
    
    // Get form fields
    const title = formData.get('title');
    const description = formData.get('description');
    const url = formData.get('url');
    
    // Check for required img field
    const imgUrl = formData.get('img');
    const public_id = formData.get('cloudinary_id') || '';
    
    if (!imgUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image path is required. Please upload an image for the video.' 
      }, { status: 400 });
    }
    
    // Log the data we're using to create the video
    console.log('Creating video with data:', {
      title,
      description,
      imgUrl,
      public_id,
      url
    });
    
    await connectToDatabase();
    
    // Create new video document
    const homevideo = await HomeVideo.create({
      title,
      description,
      img: imgUrl,
      cloudinary_id: public_id,
      url,
      isActive: true
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Home video created successfully', 
      homevideo
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving video:', error);
    console.error('Error stack trace:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// PUT update a home video
export async function PUT(request) {
  try {
    // Handle multipart form data
    const formData = await request.formData();
    const id = formData.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required for update' 
      }, { status: 400 });
    }
    
    // Get existing video
    await connectToDatabase();
    const existingVideo = await HomeVideo.findById(id);
    
    if (!existingVideo) {
      return NextResponse.json({ 
        success: false, 
        message: 'Home video not found' 
      }, { status: 404 });
    }
    
    // Get other form fields
    const title = formData.get('title');
    const description = formData.get('description');
    const url = formData.get('url');
    
    // Check for img field
    const imgUrl = formData.get('img');
    const public_id = formData.get('cloudinary_id') || existingVideo.cloudinary_id || '';
    
    if (!imgUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image path is required. Please upload an image for the video.' 
      }, { status: 400 });
    }
    
    // Update fields
    const updateData = {
      title,
      description,
      img: imgUrl,
      cloudinary_id: public_id,
      url
    };
    
    // Update the video document
    const homevideo = await HomeVideo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Home video updated successfully', 
      homevideo
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a home video
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectToDatabase();
    
    const homevideo = await HomeVideo.findById(id);
    
    if (!homevideo) {
      return NextResponse.json({ success: false, message: 'Home video not found' }, { status: 404 });
    }
    
    // Delete the image from Cloudinary if it exists
    if (homevideo.cloudinary_id) {
      await deleteFromCloudinary(homevideo.cloudinary_id);
    }
    
    // Delete the document
    await HomeVideo.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Home video deleted successfully'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 