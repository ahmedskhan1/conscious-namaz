import { NextResponse } from "next/server";
import connectToDatabase from "../db/mongodb";
import Cart from "../db/models/cart";

// This export ensures the route is always dynamically evaluated
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// This is just a redirect to the cart API for better semantics in the dashboard
export async function GET(request) {
  try {
    await connectToDatabase();

    // Get all cart entries, sort by newest first
    const carts = await Cart.find({}).sort({ createdAt: -1 });

    // Create response with no-cache headers
    const response = NextResponse.json({
      success: true,
      orders: carts,
      // Add timestamp to help verify fresh data
      timestamp: new Date().toISOString(),
    });

    // Set the strongest possible cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
