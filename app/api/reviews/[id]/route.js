import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/mongodb';
import Review from '../../db/models/review';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Helper function to save an image
async function saveImage(formData) {
  const image = formData.get('image');
  
  if (!image) {
    return null;
  }
  
  // Create a unique filename
  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = `${uuidv4()}-${image.name.replace(/\s/g, '_')}`;
  const relativePath = `/images/reviews/${filename}`;
  const fullPath = join(process.cwd(), 'public', relativePath);
  
  // Write the file to the public directory
  await writeFile(fullPath, buffer);
  
  return relativePath;
}

// GET a specific review by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PATCH to update a specific review
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const contentType = request.headers.get('content-type') || '';
    
    await connectToDatabase();
    
    let updateData = {};
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract form fields
      updateData.name = formData.get('name');
      updateData.email = formData.get('email');
      updateData.title = formData.get('title');
      updateData.description = formData.get('description');
      updateData.url = formData.get('url');
      updateData.rating = parseInt(formData.get('rating'), 10);
      updateData.review = formData.get('review');
      
      if (formData.has('approved')) {
        updateData.approved = formData.get('approved') === 'true';
      }
      
      // Handle existing image
      if (formData.has('img') && formData.get('img')) {
        updateData.img = formData.get('img');
      }
      
      // Handle new image upload
      if (formData.has('image')) {
        const imgPath = await saveImage(formData);
        if (imgPath) {
          updateData.img = imgPath;
        }
      }
    } else {
      // Handle JSON request
      updateData = await request.json();
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: updatedReview, message: 'Review updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE a specific review
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 