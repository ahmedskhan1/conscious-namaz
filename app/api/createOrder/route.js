import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req) {
  try {
    const { amount, cartId } = await req.json();
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      notes: {
        cartId: cartId || 'direct_purchase'
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
