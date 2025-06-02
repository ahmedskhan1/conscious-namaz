import { NextResponse } from "next/server";
import connectToDatabase from "../db/mongodb";
import mongoose from "mongoose";

// Get the OTP model
let OTP;

try {
  // Try to get the model if it already exists
  OTP = mongoose.model('OTP');
} catch (error) {
  // Define the model if it doesn't exist
  const otpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600 // OTP expires after 10 minutes
    }
  });
  
  OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
}

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the OTP document for the given email
    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (otpDoc.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // OTP is valid, delete it from the database
    await OTP.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
} 