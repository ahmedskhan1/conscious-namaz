import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "../db/mongodb";
import Cart from "../db/models/cart";
import mongoose from "mongoose";

const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request) {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature, cartId } = await request.json();

    // Verify payment signature
    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verification failed", success: false },
        { status: 400 }
      );
    }

    // If cartId is provided, update the cart's payment status to 'paid'
    if (cartId && mongoose.Types.ObjectId.isValid(cartId)) {
      await connectToDatabase();

      // Update the cart with payment details
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { 
          $set: {
            paymentStatus: 'paid',
            razorpayOrderId: orderId,
            razorpayPaymentId: razorpayPaymentId,
            paidAt: new Date()
          }
        },
        { new: true }
      );

      if (!updatedCart) {
        console.error("Cart not found during payment verification:", cartId);
        // Even if cart update fails, we still want to acknowledge successful payment
      }
    }

    return NextResponse.json(
      { 
        message: "Payment verified successfully", 
        success: true,
        orderId: orderId,
        paymentId: razorpayPaymentId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Server error during payment verification" },
      { status: 500 }
    );
  }
}
