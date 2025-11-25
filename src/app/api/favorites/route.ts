/**
 * Favorites API Route
 * 
 * GET /api/favorites - Get user's favorites
 * POST /api/favorites - Add a favorite
 * DELETE /api/favorites - Remove a favorite
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ favorites: [] });
  }

  const userId = (session.user as any).id;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        recipeId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { recipeId } = await request.json();

  if (!recipeId) {
    return NextResponse.json({ message: "Recipe ID is required" }, { status: 400 });
  }

  try {
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already favorited" }, { status: 409 });
    }

    // Add favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        recipeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        favorite: {
          recipeId: favorite.recipeId,
          createdAt: favorite.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { error: "Failed to create favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return NextResponse.json({ message: "Recipe ID is required" }, { status: 400 });
  }

  try {
    await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Favorite not found or failed to delete" },
      { status: 404 }
    );
  }
}
