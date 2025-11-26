/**
 * Meal Prep Suggestions API Route
 * 
 * GET /api/meal-plans/suggest-meal-prep
 * 
 * Returns meal prep suggestions based on the meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mealPlanId = searchParams.get("mealPlanId");

    if (!mealPlanId) {
      return NextResponse.json(
        { error: "mealPlanId is required" },
        { status: 400 }
      );
    }

    // Get meal plan with recipes
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: mealPlanId,
        userId,
      },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                isMakeAhead: true,
                prepTimeMinutes: true,
                cookTimeMinutes: true,
                totalTimeMinutes: true,
                tips: {
                  where: {
                    tipType: "MAKE_AHEAD",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Generate meal prep suggestions
    const suggestions = [];

    // Find make-ahead recipes
    const makeAheadRecipes = mealPlan.items.filter(
      (item) => item.recipe.isMakeAhead
    );

    if (makeAheadRecipes.length > 0) {
      suggestions.push({
        type: "MAKE_AHEAD",
        title: "Make-Ahead Meals",
        description: `${makeAheadRecipes.length} recipe(s) can be prepared in advance`,
        recipes: makeAheadRecipes.map((item) => ({
          id: item.recipe.id,
          name: item.recipe.name,
          tips: item.recipe.tips.map((tip) => tip.content),
        })),
      });
    }

    // Find batch cooking opportunities
    const batchCookingRecipes = mealPlan.items.filter(
      (item) => item.recipe.totalTimeMinutes && item.recipe.totalTimeMinutes > 30
    );

    if (batchCookingRecipes.length >= 3) {
      suggestions.push({
        type: "BATCH_COOKING",
        title: "Batch Cooking Opportunity",
        description: "Consider preparing multiple meals at once to save time",
        recipes: batchCookingRecipes.slice(0, 3).map((item) => ({
          id: item.recipe.id,
          name: item.recipe.name,
          totalTime: item.recipe.totalTimeMinutes,
        })),
      });
    }

    // Find quick prep recipes for busy days
    const quickRecipes = mealPlan.items.filter(
      (item) => {
        const recipe = item.recipe as any;
        return recipe.isQuick || (recipe.totalTimeMinutes && recipe.totalTimeMinutes <= 30);
      }
    );

    if (quickRecipes.length > 0) {
      suggestions.push({
        type: "QUICK_PREP",
        title: "Quick Prep Options",
        description: `${quickRecipes.length} recipe(s) can be prepared in under 30 minutes`,
        recipes: quickRecipes.map((item) => ({
          id: item.recipe.id,
          name: item.recipe.name,
          totalTime: item.recipe.totalTimeMinutes,
        })),
      });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating meal prep suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate meal prep suggestions" },
      { status: 500 }
    );
  }
}

