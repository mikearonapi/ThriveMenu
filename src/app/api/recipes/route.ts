/**
 * Recipes API Route
 * 
 * GET /api/recipes - Get all recipes with optional filtering
 * 
 * Query params:
 * - mealType: BREAKFAST, LUNCH, DINNER, SNACK
 * - search: search query
 * - limit: number of results (default: 50)
 * - offset: pagination offset
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
            const { searchParams } = new URL(request.url);
            const mealType = searchParams.get("mealType");
            const search = searchParams.get("search");
            const kidFriendly = searchParams.get("kidFriendly") === "true";
            const limit = parseInt(searchParams.get("limit") || "50");
            const offset = parseInt(searchParams.get("offset") || "0");

            // Build where clause
            const where: any = {};

            if (mealType) {
              where.mealType = mealType;
            }

            if (kidFriendly) {
              where.isKidFriendly = true;
            }

            if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { healthBenefits: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch recipes with related data
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          healthTags: {
            include: {
              healthTag: true,
            },
          },
          dietaryTags: {
            include: {
              dietaryTag: true,
            },
          },
          nutritionInfo: true,
          _count: {
            select: {
              favorites: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    // Transform to match frontend format
    const transformedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      mealType: recipe.mealType,
      prepTime: recipe.prepTimeMinutes,
      totalTime: recipe.totalTimeMinutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl,
      healthBenefits: recipe.healthBenefits,
      isKidFriendly: recipe.isKidFriendly,
      isQuick: recipe.isQuick,
      hasOmega3: recipe.healthTags.some((ht) => ht.healthTag.slug === "omega-3-rich"),
      hasHighFiber: recipe.healthTags.some((ht) => ht.healthTag.slug === "high-fiber"),
      isAntiInflammatory: recipe.healthTags.some((ht) => ht.healthTag.slug === "anti-inflammatory"),
      isHeartHealthy: recipe.healthTags.some((ht) => ht.healthTag.slug === "heart-healthy"),
      favoriteCount: recipe._count.favorites,
      ratingCount: recipe._count.ratings,
    }));

    return NextResponse.json({
      recipes: transformedRecipes,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

