/**
 * Favorite Status API Route
 * 
 * GET /api/favorites/[recipeId] - Check if recipe is favorited by current user
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json({ isFavorited: false });
  }
}
