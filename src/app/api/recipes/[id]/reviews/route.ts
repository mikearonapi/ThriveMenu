/**
 * Recipe Reviews API Routes
 * 
 * GET /api/recipes/[id]/reviews - Get all reviews for a recipe
 * POST /api/recipes/[id]/reviews - Submit a review for a recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Mock reviews storage (will be replaced with Prisma when database is connected)
const mockReviews: Array<{
  id: string;
  userId: string;
  recipeId: string;
  title: string | null;
  content: string;
  wouldMakeAgain: boolean | null;
  tasteRating: number | null;
  difficultyRating: number | null;
  helpfulCount: number;
  createdAt: Date;
  user?: { id: string; name: string; image: string | null };
}> = [];

// GET - Get reviews for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;

    // Mock: Get reviews for recipe
    const reviews = mockReviews
      .filter((r) => r.recipeId === recipeId)
      .map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.createdAt.toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

    // Mock: Get user ID from session
    const userId = (session.user as any).id || "1";
    const userName = session.user.name || "User";

    const review = {
      id: `review_${Date.now()}`,
      userId,
      recipeId,
      title: title || null,
      content,
      wouldMakeAgain: wouldMakeAgain ?? null,
      tasteRating: tasteRating || null,
      difficultyRating: difficultyRating || null,
      helpfulCount: 0,
      createdAt: new Date(),
      user: {
        id: userId,
        name: userName,
        image: session.user.image || null,
      },
    };

    mockReviews.push(review);

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

