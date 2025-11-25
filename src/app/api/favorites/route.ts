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
import { mockFavorites } from "@/lib/mock-storage";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ favorites: [] });
  }

  const userId = (session.user as any).id;
  const userFavorites = mockFavorites.filter((f) => f.userId === userId);

  return NextResponse.json({
    favorites: userFavorites.map((f) => ({
      recipeId: f.recipeId,
      createdAt: f.createdAt,
    })),
  });
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

  // Check if already favorited
  const existing = mockFavorites.find(
    (f) => f.userId === userId && f.recipeId === recipeId
  );

  if (existing) {
    return NextResponse.json({ message: "Already favorited" }, { status: 409 });
  }

  // Add favorite
  const newFavorite: Favorite = {
    id: crypto.randomUUID(),
    userId,
    recipeId,
    createdAt: new Date(),
  };

  mockFavorites.push(newFavorite);

  return NextResponse.json(
    {
      success: true,
      favorite: {
        recipeId: newFavorite.recipeId,
        createdAt: newFavorite.createdAt,
      },
    },
    { status: 201 }
  );
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

  const index = mockFavorites.findIndex(
    (f) => f.userId === userId && f.recipeId === recipeId
  );

  if (index === -1) {
    return NextResponse.json({ message: "Favorite not found" }, { status: 404 });
  }

  mockFavorites.splice(index, 1);

  return NextResponse.json({ success: true });
}

