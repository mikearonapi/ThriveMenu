/**
 * Meal Plan Items API Route
 * 
 * POST /api/meal-plans/items - Add a recipe to a meal plan
 * DELETE /api/meal-plans/items - Remove a recipe from a meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mealPlanId, recipeId, date, mealType, servings, notes, forFamilyMembers } = body;

    if (!mealPlanId || !recipeId || !date || !mealType) {
      return NextResponse.json(
        { error: "mealPlanId, recipeId, date, and mealType are required" },
        { status: 400 }
      );
    }

    // Verify meal plan belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: mealPlanId,
        userId: session.user.id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Verify recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Create or update meal plan item
    const mealPlanItem = await prisma.mealPlanItem.upsert({
      where: {
        mealPlanId_date_mealType: {
          mealPlanId,
          date: new Date(date),
          mealType: mealType as any,
        },
      },
      update: {
        recipeId,
        servings: servings || recipe.servings || 4,
        notes: notes || null,
        forFamilyMembers: forFamilyMembers || [],
      },
      create: {
        mealPlanId,
        recipeId,
        date: new Date(date),
        mealType: mealType as any,
        servings: servings || recipe.servings || 4,
        notes: notes || null,
        forFamilyMembers: forFamilyMembers || [],
      },
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
    });

    return NextResponse.json({ mealPlanItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding meal plan item:", error);
    return NextResponse.json(
      { error: "Failed to add meal plan item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const mealPlanId = searchParams.get("mealPlanId");
    const date = searchParams.get("date");
    const mealType = searchParams.get("mealType");

    if (itemId) {
      // Delete by item ID
      const item = await prisma.mealPlanItem.findUnique({
        where: { id: itemId },
        include: {
          mealPlan: true,
        },
      });

      if (!item || item.mealPlan.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Meal plan item not found" },
          { status: 404 }
        );
      }

      await prisma.mealPlanItem.delete({
        where: { id: itemId },
      });
    } else if (mealPlanId && date && mealType) {
      // Delete by meal plan, date, and meal type
      const item = await prisma.mealPlanItem.findUnique({
        where: {
          mealPlanId_date_mealType: {
            mealPlanId,
            date: new Date(date),
            mealType: mealType as any,
          },
        },
        include: {
          mealPlan: true,
        },
      });

      if (!item || item.mealPlan.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Meal plan item not found" },
          { status: 404 }
        );
      }

      await prisma.mealPlanItem.delete({
        where: {
          mealPlanId_date_mealType: {
            mealPlanId,
            date: new Date(date),
            mealType: mealType as any,
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: "itemId or (mealPlanId, date, mealType) required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal plan item:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan item" },
      { status: 500 }
    );
  }
}

