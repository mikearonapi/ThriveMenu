/**
 * Recipe Reviews API Routes
 * 
 * GET /api/recipes/[id]/reviews - Get all reviews for a recipe
 * POST /api/recipes/[id]/reviews - Submit a review for a recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get reviews for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;

    const reviews = await prisma.review.findMany({
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

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Submit a review
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
    const { title, content, wouldMakeAgain, tasteRating, difficultyRating } =
      await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Review content is required" },
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

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        recipeId,
        title: title || null,
        content,
        wouldMakeAgain: wouldMakeAgain ?? null,
        tasteRating: tasteRating || null,
        difficultyRating: difficultyRating || null,
      },
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

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

