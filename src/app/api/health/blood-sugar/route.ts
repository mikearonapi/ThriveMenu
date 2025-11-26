/**
 * Blood Sugar Balance API Route
 * 
 * GET /api/health/blood-sugar
 * 
 * Returns recipes and tips for balanced blood sugar
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Get blood sugar-friendly recipes (high fiber, low glycemic)
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            healthTags: {
              some: {
                healthTag: {
                  slug: {
                    in: ["high-fiber", "low-glycemic", "blood-sugar-balance"],
                  },
                },
              },
            },
          },
          {
            nutritionInfo: {
              fiber: { gte: 5 }, // High fiber
              sugar: { lte: 10 }, // Low sugar
            },
          },
        ],
      },
      include: {
        healthTags: { include: { healthTag: true } },
        dietaryTags: { include: { dietaryTag: true } },
        nutritionInfo: true,
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    const tips = [
      {
        title: "Pair Carbs with Protein",
        description: "Combining carbohydrates with protein helps stabilize blood sugar",
        example: "Oatmeal with nuts, or whole grain toast with eggs",
      },
      {
        title: "Choose High-Fiber Foods",
        description: "Fiber slows digestion and prevents blood sugar spikes",
        example: "Whole grains, legumes, vegetables, and fruits with skin",
      },
      {
        title: "Eat Regular Meals",
        description: "Consistent meal timing helps maintain stable blood sugar",
        example: "Aim for meals every 3-4 hours",
      },
      {
        title: "Limit Refined Sugars",
        description: "Avoid processed foods and sugary drinks",
        example: "Choose whole fruits over fruit juice",
      },
      {
        title: "Include Healthy Fats",
        description: "Healthy fats help slow carbohydrate absorption",
        example: "Avocado, nuts, seeds, olive oil",
      },
    ];

    return NextResponse.json({
      recipes,
      tips,
      count: recipes.length,
      message: "These recipes support balanced blood sugar levels",
    });
  } catch (error) {
    console.error("Error fetching blood sugar-friendly recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch blood sugar-friendly recipes" },
      { status: 500 }
    );
  }
}

