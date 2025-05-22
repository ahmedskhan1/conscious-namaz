import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../utils/cloudinary';

export async function POST(request) {
  try {
    console.log('POST /api/upload - Processing file upload request');
    
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'conscious-namaz';

    console.log('Upload request for folder:', folder);
    
    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Log file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Upload to Cloudinary with optional folder
    console.log('Uploading to Cloudinary...');
    const result = await uploadToCloudinary(file, {
      folder: folder,
      resource_type: 'auto',
    });
    
    console.log('Cloudinary upload successful:', {
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload image', 
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 