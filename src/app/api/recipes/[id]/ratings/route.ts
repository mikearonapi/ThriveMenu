/**
 * Recipe Ratings API Routes
 * 
 * GET /api/recipes/[id]/ratings - Get all ratings for a recipe
 * POST /api/recipes/[id]/ratings - Submit a rating for a recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Mock ratings storage (will be replaced with Prisma when database is connected)
const mockRatings: Array<{
  id: string;
  userId: string;
  recipeId: string;
  rating: number;
  createdAt: Date;
  user?: { id: string; name: string; image: string | null };
}> = [];

// GET - Get ratings for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;

    // Mock: Get ratings for recipe
    const ratings = mockRatings
      .filter((r) => r.recipeId === recipeId)
      .map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    // Count ratings by star value
    const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: ratings.filter((r) => r.rating === star).length,
    }));

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratingCounts,
      ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

// POST - Submit a rating
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const recipeId = params.id;
    const { rating } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Mock: Get or create user ID from session
    const userId = (session.user as any).id || "1"; // Use session user ID

    // Mock: Upsert rating
    const existingIndex = mockRatings.findIndex(
      (r) => r.userId === userId && r.recipeId === recipeId
    );

    const ratingRecord = {
      id: existingIndex >= 0 ? mockRatings[existingIndex].id : `rating_${Date.now()}`,
      userId,
      recipeId,
      rating,
      createdAt: new Date(),
    };

    if (existingIndex >= 0) {
      mockRatings[existingIndex] = ratingRecord;
    } else {
      mockRatings.push(ratingRecord);
    }

    return NextResponse.json({
      success: true,
      rating: ratingRecord,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

