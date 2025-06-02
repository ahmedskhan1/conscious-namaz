import { NextResponse } from "next/server";
import  connectToDatabase  from "../../db/mongodb";
import Coupon from "../../db/models/coupon";
import mongoose from "mongoose";

// GET - Get a specific coupon by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon ID format" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PATCH - Update a coupon's details
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon ID format" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if required fields are present
    if (!data.discount || !data.name || !data.city || !data.phone) {
      return NextResponse.json(
        { success: false, error: "Discount percentage, name, city, and phone are required" },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData = {
      discount: data.discount,
      discountType: data.discountType || 'percentage',
      name: data.name,
      city: data.city,
      phone: data.phone,
      instagramId: data.instagramId
    };
    
    // Add bank details if provided
    if (data.bankDetails) {
      updateData.bankDetails = {
        accountNumber: data.bankDetails.accountNumber,
        ifscCode: data.bankDetails.ifscCode
      };
    }
    
    // Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedCoupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      coupon: updatedCoupon
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update coupon" },
      { status: 500 }
    );
  }
} 