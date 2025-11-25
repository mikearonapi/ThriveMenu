/**
 * Favorite Status API Route
 * 
 * GET /api/favorites/[recipeId] - Check if recipe is favorited by current user
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mockFavorites } from "@/lib/mock-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ isFavorited: false });
  }

  const userId = (session.user as any).id;
  const recipeId = params.recipeId;

  // Check if recipe is favorited
  const isFavorited = mockFavorites.some(
    (f) => f.userId === userId && f.recipeId === recipeId
  );

  return NextResponse.json({ isFavorited });
}

