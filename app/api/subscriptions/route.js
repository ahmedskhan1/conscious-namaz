import connectToDatabase from '../db/mongodb';
import Subscription from '../db/models/subscriptions';
import { NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// GET all subscriptions
export async function GET() {
  try {
    console.log('GET /api/subscriptions - Fetching all subscriptions');
    
    await connectToDatabase();
    const subscriptions = await Subscription.find({});
    
    console.log(`Found ${subscriptions.length} subscriptions`);
    
    return NextResponse.json({ success: true, subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/subscriptions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// POST create a new subscription
export async function POST(request) {
  try {
    console.log('POST /api/subscriptions - Creating new subscription');
    
    // Handle multipart form data
    const formData = await request.formData();
    
    // Log received form data keys for debugging
    console.log('Received form data keys:', [...formData.keys()]);
    
    // Get form fields
    const name = formData.get('name');
    const description = formData.get('description');
    const feeValue = formData.get('fee');
    const duration = formData.get('duration');
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    
    if (!feeValue) {
      return NextResponse.json({ success: false, error: 'Fee is required' }, { status: 400 });
    }
    
    const fee = parseFloat(feeValue);
    if (isNaN(fee)) {
      return NextResponse.json({ success: false, error: 'Fee must be a valid number' }, { status: 400 });
    }
    
    // Process the image
    let imageUrl = formData.get('image');
    let cloudinaryId = formData.get('cloudinary_id');
    
    // If image is not provided via direct upload to Cloudinary, check for a file
    if (!imageUrl) {
      const imageFile = formData.get('image_file');
      if (imageFile) {
        console.log('Image file received, uploading to Cloudinary...');
        try {
          const uploadResult = await uploadToCloudinary(imageFile, 'subscriptions');
          console.log('Cloudinary upload result:', uploadResult);
          
          if (!uploadResult || !uploadResult.url) {
            throw new Error('Failed to upload image to Cloudinary');
          }
          
          imageUrl = uploadResult.url;
          cloudinaryId = uploadResult.public_id;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to upload image: ' + error.message 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Image is required. Please provide an image for the subscription.' 
        }, { status: 400 });
      }
    }
    
    console.log('Creating subscription with data:', {
      name,
      fee,
      duration,
      imageUrl: imageUrl?.substring(0, 50) + '...',
      cloudinaryId
    });
    
    await connectToDatabase();
    
    // Create new subscription document
    const subscription = await Subscription.create({
      name,
      description,
      image: imageUrl,
      cloudinary_id: cloudinaryId,
      fee,
      duration,
      isActive: true
    });
    
    console.log('Subscription created with ID:', subscription._id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription created successfully', 
      subscription
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/subscriptions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// PUT update a subscription
export async function PUT(request) {
  try {
    console.log('PUT /api/subscriptions - Updating subscription');
    
    // Handle multipart form data
    const formData = await request.formData();
    
    // Log received form data keys for debugging
    console.log('Received form data keys:', [...formData.keys()]);
    
    const id = formData.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required for update' 
      }, { status: 400 });
    }
    
    console.log('Updating subscription ID:', id);
    
    // Get existing subscription
    await connectToDatabase();
    const existingSubscription = await Subscription.findById(id);
    
    if (!existingSubscription) {
      console.log('Subscription not found with ID:', id);
      return NextResponse.json({ 
        success: false, 
        error: 'Subscription not found' 
      }, { status: 404 });
    }
    
    // Get form fields
    const name = formData.get('name');
    const description = formData.get('description');
    const feeValue = formData.get('fee');
    const duration = formData.get('duration');
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    
    if (!feeValue) {
      return NextResponse.json({ success: false, error: 'Fee is required' }, { status: 400 });
    }
    
    const fee = parseFloat(feeValue);
    if (isNaN(fee)) {
      return NextResponse.json({ success: false, error: 'Fee must be a valid number' }, { status: 400 });
    }
    
    // Process the image
    let imageUrl = formData.get('image');
    let cloudinaryId = existingSubscription.cloudinary_id;
    
    // If no image URL provided directly, check for file upload
    if (!imageUrl) {
      const imageFile = formData.get('image_file');
      if (imageFile) {
        console.log('Image file received, uploading to Cloudinary...');
        try {
          // Delete old image from Cloudinary if it exists
          if (existingSubscription.cloudinary_id) {
            console.log('Deleting old image from Cloudinary:', existingSubscription.cloudinary_id);
            await deleteFromCloudinary(existingSubscription.cloudinary_id);
          }
          
          const uploadResult = await uploadToCloudinary(imageFile, 'subscriptions');
          console.log('Cloudinary upload result:', uploadResult);
          
          if (!uploadResult || !uploadResult.url) {
            throw new Error('Failed to upload image to Cloudinary');
          }
          
          imageUrl = uploadResult.url;
          cloudinaryId = uploadResult.public_id;
        } catch (error) {
          console.error('Cloudinary operation error:', error);
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to process image: ' + error.message 
          }, { status: 500 });
        }
      } else {
        // No new image provided, keep the old one
        imageUrl = existingSubscription.image;
      }
    }
    
    // Update fields
    const updateData = {
      name,
      description,
      image: imageUrl,
      cloudinary_id: cloudinaryId,
      fee,
      duration
    };
    
    console.log('Updating subscription with data:', {
      id,
      name,
      fee,
      duration,
      imageUrl: imageUrl?.substring(0, 50) + '...',
      cloudinaryId
    });
    
    // Update the subscription document
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Subscription updated successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription updated successfully', 
      subscription
    }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/subscriptions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

// DELETE a subscription
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectToDatabase();
    
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 });
    }
    
    // Delete the image from Cloudinary if it exists
    if (subscription.cloudinary_id) {
      await deleteFromCloudinary(subscription.cloudinary_id);
    }
    
    // Delete the document
    await Subscription.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription deleted successfully'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 