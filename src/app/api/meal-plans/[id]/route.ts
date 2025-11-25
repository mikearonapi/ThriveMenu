/**
 * Meal Plan API Route
 * 
 * GET /api/meal-plans/[id] - Get a specific meal plan
 * PUT /api/meal-plans/[id] - Update a meal plan
 * DELETE /api/meal-plans/[id] - Delete a meal plan
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
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                mealType: true,
                prepTimeMinutes: true,
                totalTimeMinutes: true,
                servings: true,
              },
            },
          },
          orderBy: [
            { date: "asc" },
            { mealType: "asc" },
          ],
        },
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.mealPlan.delete({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}

