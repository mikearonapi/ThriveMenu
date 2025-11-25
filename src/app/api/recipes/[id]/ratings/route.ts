/**
 * Recipe Ratings API Routes
 * 
 * GET /api/recipes/[id]/ratings - Get all ratings for a recipe
 * POST /api/recipes/[id]/ratings - Submit a rating for a recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get ratings for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;
    const session = await getServerSession(authOptions);

    // Get all ratings for this recipe
    const ratings = await prisma.rating.findMany({
      where: { recipeId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

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

    // Get user's rating if authenticated
    let userRating = null;
    if (session && session.user) {
      const userId = (session.user as any).id;
      const userRatingObj = ratings.find((r) => r.userId === userId);
      userRating = userRatingObj?.rating || null;
    }

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      userRating,
      ratingCounts,
      ratings: ratings.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
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

    const userId = (session.user as any).id;

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Upsert rating (create or update)
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: {
        rating,
        updatedAt: new Date(),
      },
      create: {
        userId,
        recipeId,
        rating,
      },
    });

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
