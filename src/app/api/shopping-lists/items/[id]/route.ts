/**
 * Shopping List Item API Route
 * 
 * PATCH /api/shopping-lists/items/[id] - Update a shopping list item
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isChecked } = body;

    // Verify item belongs to user's shopping list
    const item = await prisma.shoppingListItem.findUnique({
      where: { id: params.id },
      include: {
        shoppingList: true,
      },
    });

    if (!item || item.shoppingList.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Shopping list item not found" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: params.id },
      data: { isChecked: isChecked ?? item.isChecked },
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    return NextResponse.json(
      { error: "Failed to update shopping list item" },
      { status: 500 }
    );
  }
}

