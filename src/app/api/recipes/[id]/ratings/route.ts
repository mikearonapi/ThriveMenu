/**
 * Recipe Ratings API Routes
 * 
 * GET /api/recipes/[id]/ratings - Get all ratings for a recipe
 * POST /api/recipes/[id]/ratings - Submit a rating for a recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get ratings for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;

    const ratings = await prisma.rating.findMany({
      where: { recipeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Upsert rating (update if exists, create if not)
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId: user.id,
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

