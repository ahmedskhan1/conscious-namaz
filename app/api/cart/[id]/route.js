import { NextResponse } from "next/server";
import connectToDatabase from "../../db/mongodb";
import Cart from "../../db/models/cart";
import mongoose from "mongoose";

// GET - Get a specific cart by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid cart ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cart = await Cart.findById(id);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// PATCH - Update a cart's payment status
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid cart ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Only allow updating payment status for now
    const updateData = {};
    if (data.paymentStatus) {
      updateData.paymentStatus = data.paymentStatus;
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
