/**
 * Shopping List API Route
 * 
 * GET /api/shopping-lists/[id] - Get a specific shopping list
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        items: {
          orderBy: [
            { category: "asc" },
            { customName: "asc" },
          ],
        },
      },
    });

    if (!shoppingList) {
      return NextResponse.json(
        { error: "Shopping list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}

