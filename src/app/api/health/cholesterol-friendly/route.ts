/**
 * Cholesterol-Friendly Recipe Suggestions API Route
 * 
 * GET /api/health/cholesterol-friendly
 * 
 * Returns recipes that are heart-healthy and cholesterol-friendly
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Get heart-healthy recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            healthTags: {
              some: {
                healthTag: {
                  slug: {
                    in: ["heart-healthy", "omega-3-rich", "high-fiber", "low-cholesterol"],
                  },
                },
              },
            },
          },
          {
            nutritionInfo: {
              saturatedFat: { lte: 5 }, // Low saturated fat
              cholesterol: { lte: 30 }, // Low cholesterol
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

    return NextResponse.json({
      recipes,
      count: recipes.length,
      message: "These recipes are heart-healthy and support healthy cholesterol levels",
    });
  } catch (error) {
    console.error("Error fetching cholesterol-friendly recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch cholesterol-friendly recipes" },
      { status: 500 }
    );
  }
}

