import { NextResponse } from "next/server";
import connectToDatabase from "../../db/mongodb";
import Cart from "../../db/models/cart";

// GET - Get user details by email
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the latest cart with this email that has a completed payment
    const cart = await Cart.findOne({ 
      email: email,
      paymentStatus: 'paid'  
    }).sort({ createdAt: -1 });

    if (!cart) {
      return NextResponse.json({
        success: false,
        message: "No previous purchase found for this email"
      });
    }

    return NextResponse.json({
      success: true,
      userInfo: {
        name: cart.name,
        email: cart.email,
        phone: cart.phone
      }
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
} 