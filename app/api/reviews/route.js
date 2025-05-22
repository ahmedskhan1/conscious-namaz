import { NextResponse } from 'next/server';
import connectToDatabase from '../db/mongodb';
import Review from '../db/models/review';
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

// GET endpoint to fetch all approved reviews
export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new review
export async function POST(request) {
  try {
    // Check if this is a multipart form data request
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract form fields
      const name = formData.get('name');
      const email = formData.get('email');
      const title = formData.get('title');
      const description = formData.get('description');
      const url = formData.get('url');
      const rating = parseInt(formData.get('rating'), 10);
      const review = formData.get('review');
      const approved = formData.get('approved') === 'true';
      
      // Validate required fields
      if (!name || !email || !rating || !review || !title || !description) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      // Handle image upload
      let imgPath = null;
      if (formData.has('image')) {
        imgPath = await saveImage(formData);
      }
      
      await connectToDatabase();
      const newReview = await Review.create({
        name,
        email,
        title,
        description,
        img: imgPath,
        url,
        rating,
        review,
        approved: approved || false, // Default to not approved unless specified
      });
      
      return NextResponse.json(
        { 
          success: true, 
          data: newReview, 
          message: approved ? 'Review submitted successfully' : 'Review submitted successfully and pending approval' 
        },
        { status: 201 }
      );
    } else {
      // Handle JSON requests for backward compatibility
      const body = await request.json();
      const { name, email, title, description, img, url, rating, review, approved } = body;
      
      // Validate required fields
      if (!name || !email || !rating || !review || !title || !description) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      await connectToDatabase();
      const newReview = await Review.create({
        name,
        email,
        title,
        description,
        img,
        url,
        rating,
        review,
        approved: approved || false, // Default to not approved unless specified
      });
      
      return NextResponse.json(
        { 
          success: true, 
          data: newReview, 
          message: approved ? 'Review submitted successfully' : 'Review submitted successfully and pending approval' 
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    );
  }
} 