/**
 * Weekly Nutrition Summary API Route
 * 
 * GET /api/health/nutrition-summary
 * 
 * Returns weekly nutrition summary based on meal plan
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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let mealPlanItems: any[] = [];

    if (mealPlanId) {
      const mealPlan = await prisma.mealPlan.findFirst({
        where: {
          id: mealPlanId,
          userId,
        },
        include: {
          items: {
            include: {
              recipe: {
                include: {
                  nutritionInfo: true,
                  healthTags: { include: { healthTag: true } },
                },
              },
            },
          },
        },
      });

      if (mealPlan) {
        mealPlanItems = mealPlan.items;
      }
    } else if (startDate && endDate) {
      const mealPlans = await prisma.mealPlan.findMany({
        where: {
          userId,
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
        include: {
          items: {
            include: {
              recipe: {
                include: {
                  nutritionInfo: true,
                  healthTags: { include: { healthTag: true } },
                },
              },
            },
          },
        },
      });

      mealPlanItems = mealPlans.flatMap((plan) => plan.items);
    }

    // Calculate nutrition totals
    const totals = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
      fat: 0,
      saturatedFat: 0,
      cholesterol: 0,
      sodium: 0,
      omega3: 0,
    };

    const healthTagCounts: Record<string, number> = {};

    mealPlanItems.forEach((item) => {
      const nutrition = item.recipe.nutritionInfo;
      if (nutrition) {
        const servings = item.servings || 1;
        totals.calories += (nutrition.calories || 0) * servings;
        totals.protein += (nutrition.protein || 0) * servings;
        totals.carbohydrates += (nutrition.carbohydrates || 0) * servings;
        totals.fiber += (nutrition.fiber || 0) * servings;
        totals.sugar += (nutrition.sugar || 0) * servings;
        totals.fat += (nutrition.fat || 0) * servings;
        totals.saturatedFat += (nutrition.saturatedFat || 0) * servings;
        totals.cholesterol += (nutrition.cholesterol || 0) * servings;
        totals.sodium += (nutrition.sodium || 0) * servings;
        totals.omega3 += (nutrition.omega3 || 0) * servings;
      }

      // Count health tags
      const healthTags = item.recipe.healthTags;
      if (healthTags && Array.isArray(healthTags)) {
        healthTags.forEach((tag: any) => {
          const slug = tag.healthTag?.slug;
          if (slug) {
            healthTagCounts[slug] = (healthTagCounts[slug] || 0) + 1;
          }
        });
      }
    });

    // Calculate averages per day
    const days = mealPlanItems.length > 0 ? 7 : 1;
    const averages = {
      calories: Math.round(totals.calories / days),
      protein: Math.round((totals.protein / days) * 10) / 10,
      carbohydrates: Math.round((totals.carbohydrates / days) * 10) / 10,
      fiber: Math.round((totals.fiber / days) * 10) / 10,
      sugar: Math.round((totals.sugar / days) * 10) / 10,
      fat: Math.round((totals.fat / days) * 10) / 10,
      omega3: Math.round((totals.omega3 / days) * 10) / 10,
    };

    return NextResponse.json({
      totals,
      averages,
      healthTagCounts,
      mealCount: mealPlanItems.length,
    });
  } catch (error) {
    console.error("Error calculating nutrition summary:", error);
    return NextResponse.json(
      { error: "Failed to calculate nutrition summary" },
      { status: 500 }
    );
  }
}

