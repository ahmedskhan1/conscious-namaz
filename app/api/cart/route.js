import { NextResponse } from "next/server";
import connectToDatabase from "../db/mongodb";
import Cart from "../db/models/cart";
import mongoose from "mongoose";

// POST - Create a new cart entry
export async function POST(req) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.email || !data.phone || !data.items || !data.paymentStatus) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }
    
    // Validate phone number format
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Phone number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create the new cart entry
    const cart = new Cart({
      email: data.email,
      phone: data.phone,
      name: data.name || '',
      city: data.city || '',
      coupon: data.coupon || null,
      paymentStatus: data.paymentStatus,
      items: data.items.map((item) => ({
        programId: item.programId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalAmount: data.totalAmount,
      discount: data.discount || 0,
      createdAt: new Date(),
    });

    await cart.save();

    return NextResponse.json({
      success: true,
      cartId: cart._id,
    });
  } catch (error) {
    console.error("Error creating cart entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cart entry" },
      { status: 500 }
    );
  }
}

// GET - Get all cart entries (for admin)
export async function GET() {
  try {
    await connectToDatabase();

    // Get all cart entries, sort by newest first
    const carts = await Cart.find({}).sort({ createdAt: -1 });

    // Create response with no-cache headers
    const response = NextResponse.json({
      success: true,
      carts,
    });

    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("Error fetching cart entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart entries" },
      { status: 500 }
    );
  }
}
