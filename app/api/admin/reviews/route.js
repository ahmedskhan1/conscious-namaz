import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/mongodb';
import Review from '../../db/models/review';

// GET endpoint to fetch all reviews (approved and unapproved) for admin
export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a review's approval status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, approved } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { approved: approved },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedReview, message: 'Review updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a review
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 