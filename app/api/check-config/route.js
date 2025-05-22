import { NextResponse } from 'next/server';
import cloudinary from '../utils/cloudinary';

export async function GET() {
  try {
    // Check if Cloudinary environment variables are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration missing:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      });
      
      return NextResponse.json({
        success: false,
        error: 'Cloudinary configuration is incomplete',
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        }
      });
    }
    
    // Verify the Cloudinary connection by making a simple request
    try {
      const result = await cloudinary.api.ping();
      
      return NextResponse.json({
        success: true,
        status: result.status,
        message: 'Cloudinary configuration is valid'
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary API error:', cloudinaryError);
      
      return NextResponse.json({
        success: false,
        error: 'Cloudinary configuration is invalid',
        message: cloudinaryError.message
      });
    }
  } catch (error) {
    console.error('Error checking configuration:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check configuration',
      message: error.message
    });
  }
} 