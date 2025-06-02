import { NextResponse } from "next/server";
import connectToDatabase from "../db/mongodb";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Create a model for storing OTPs
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

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send email with OTP
const sendEmail = async (email, name, otp) => {
  // Create a reusable transporter object using SMTP
  // You need to add these SMTP configuration to your .env.local file
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Email content
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Verification OTP for Your Conscious Namaz Order',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #53593F; text-align: center;">Conscious Namaz</h2>
        <p>Hello ${name || 'Valued Customer'},</p>
        <p>Your OTP for email verification is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes and can be used only once.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Thank you,<br>Conscious Namaz Team</p>
      </div>
    `
  };

  // Send email
  return transporter.sendMail(mailOptions);
};

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database (upsert - update if exists, insert if not)
    await OTP.findOneAndUpdate(
      { email },
      { otp, email },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendEmail(email, name, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
} 