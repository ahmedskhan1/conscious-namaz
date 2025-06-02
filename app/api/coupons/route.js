import { NextResponse } from "next/server";
import  connectToDatabase from "../db/mongodb";
import Coupon from "../db/models/coupon";
import mongoose from "mongoose";

// GET all coupons
export async function GET() {
  try {
    await connectToDatabase();
    
    const coupons = await Coupon.find({});
    
    return NextResponse.json({
      success: true,
      coupons
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST - Create a new coupon
export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.code || !data.discount || !data.name || !data.city || !data.phone) {
      return NextResponse.json(
        { success: false, error: "Coupon code, discount percentage, name, city, and phone are required" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if coupon with this code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: "A coupon with this code already exists" },
        { status: 400 }
      );
    }
    
    // Create the new coupon
    const coupon = new Coupon({
      code: data.code.toUpperCase(),
      discount: data.discount,
      discountType: data.discountType || 'percentage',
      name: data.name,
      city: data.city,
      phone: data.phone,
      instagramId: data.instagramId,
      bankDetails: {
        accountNumber: data.bankDetails?.accountNumber,
        ifscCode: data.bankDetails?.ifscCode
      }
    });
    
    await coupon.save();
    
    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a coupon by ID
export async function DELETE(req) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon ID format" },
        { status: 400 }
      );
    }
    
    const deletedCoupon = await Coupon.findByIdAndDelete(data.id);
    
    if (!deletedCoupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
} 