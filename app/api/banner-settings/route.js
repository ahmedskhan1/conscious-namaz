import { NextResponse } from "next/server";
import connectToDatabase from "../db/mongodb";
import BannerSettings from "../db/models/bannerSettings";

// GET: Fetch banner settings
export async function GET(request) {
  try {
    // Try to connect to the database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return fallback data if database connection fails
      return NextResponse.json({
        success: true,
        bannerSettings: {
          description: "JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF THE POWER OF CONSCIOUS PRAYING",
          price: 1999,
          originalPrice: 2999,
          isActive: true
        }
      });
    }
    
    // Get the banner settings
    let bannerSettings = await BannerSettings.findOne({ isActive: true });
    
    // If no settings exist, create default settings
    if (!bannerSettings) {
      bannerSettings = await BannerSettings.create({
        description: "JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF THE POWER OF CONSCIOUS PRAYING",
        price: 1999,
        originalPrice: 2999,
        isActive: true
      });
    }
    
    return NextResponse.json({
      success: true,
      bannerSettings
    });
  } catch (error) {
    console.error("Error fetching banner settings:", error);
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      bannerSettings: {
        description: "JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF THE POWER OF CONSCIOUS PRAYING",
        price: 1999,
        originalPrice: 2999,
        isActive: true
      }
    });
  }
}

// PUT: Update banner settings
export async function PUT(request) {
  return updateBannerSettings(request);
}

// POST: Alternative update method for environments that restrict PUT
export async function POST(request) {
  // Check if this is an update request
  const url = new URL(request.url);
  if (url.searchParams.get('_method') === 'put') {
    return updateBannerSettings(request);
  }
  
  // Regular POST behavior (if needed in the future)
  return NextResponse.json(
    { success: false, error: "Method not implemented" },
    { status: 501 }
  );
}

// Shared function for updating banner settings
async function updateBannerSettings(request) {
  try {
    // Try to connect to the database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error in update:", dbError);
      // Return success with error message
      return NextResponse.json({
        success: false,
        error: "Database connection failed"
      }, { status: 500 });
    }
    
    // Try to parse the request JSON
    let data;
    try {
      data = await request.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json({
        success: false,
        error: "Invalid JSON in request body"
      }, { status: 400 });
    }
    
    console.log("Received data for banner update:", data);
    
    // Find the active banner settings
    let bannerSettings = await BannerSettings.findOne({ isActive: true });
    
    // If no settings exist, create new settings
    if (!bannerSettings) {
      bannerSettings = await BannerSettings.create({
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        isActive: true
      });
    } else {
      // Update existing settings
      bannerSettings.description = data.description;
      bannerSettings.price = data.price;
      bannerSettings.originalPrice = data.originalPrice;
      await bannerSettings.save();
    }
    
    return NextResponse.json({
      success: true,
      bannerSettings: {
        description: bannerSettings.description,
        price: bannerSettings.price,
        originalPrice: bannerSettings.originalPrice
      }
    });
  } catch (error) {
    console.error("Error updating banner settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banner settings" },
      { status: 500 }
    );
  }
} 