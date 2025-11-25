/**
 * Recipe Detail API Route
 * 
 * GET /api/recipes/[id] - Get full recipe details including ingredients and instructions
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
          orderBy: { orderIndex: "asc" },
        },
        instructions: {
          orderBy: { stepNumber: "asc" },
        },
        nutritionInfo: true,
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
        tips: {
          orderBy: { orderIndex: "asc" },
        },
        variations: true,
        _count: {
          select: {
            favorites: true,
            ratings: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Transform to match frontend format
    const transformedRecipe = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      mealType: recipe.mealType,
      prepTime: recipe.prepTimeMinutes,
      cookTime: recipe.cookTimeMinutes,
      totalTime: recipe.totalTimeMinutes,
      servings: recipe.servings,
      servingSize: recipe.servingSize,
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl,
      videoUrl: recipe.videoUrl,
      healthBenefits: recipe.healthBenefits,
      isKidFriendly: recipe.isKidFriendly,
      isMakeAhead: recipe.isMakeAhead,
      isOnePot: recipe.isOnePot,
      isQuick: recipe.isQuick,
      isBudgetFriendly: recipe.isBudgetFriendly,
      sourceUrl: recipe.sourceUrl,
      sourceAttribution: recipe.sourceAttribution,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.id,
        amount: ri.amount,
        unit: ri.unit,
        name: ri.ingredient.name,
        preparation: ri.preparation,
        notes: ri.notes,
        isOptional: ri.isOptional,
        groupName: ri.groupName,
      })),
      instructions: recipe.instructions.map((inst) => ({
        stepNumber: inst.stepNumber,
        instruction: inst.instruction,
        imageUrl: inst.imageUrl,
        tipText: inst.tipText,
        durationMinutes: inst.durationMinutes,
      })),
      nutrition: recipe.nutritionInfo ? {
        calories: recipe.nutritionInfo.calories,
        protein: recipe.nutritionInfo.protein,
        carbs: recipe.nutritionInfo.carbohydrates,
        fiber: recipe.nutritionInfo.fiber,
        sugar: recipe.nutritionInfo.sugar,
        fat: recipe.nutritionInfo.fat,
        saturatedFat: recipe.nutritionInfo.saturatedFat,
        cholesterol: recipe.nutritionInfo.cholesterol,
        sodium: recipe.nutritionInfo.sodium,
        omega3: recipe.nutritionInfo.omega3,
        selenium: recipe.nutritionInfo.selenium,
        vitaminD: recipe.nutritionInfo.vitaminD,
        iron: recipe.nutritionInfo.iron,
        calcium: recipe.nutritionInfo.calcium,
        vitaminC: recipe.nutritionInfo.vitaminC,
        vitaminA: recipe.nutritionInfo.vitaminA,
      } : null,
      healthTags: recipe.healthTags.map((ht) => ({
        id: ht.healthTag.id,
        name: ht.healthTag.name,
        slug: ht.healthTag.slug,
      })),
      dietaryTags: recipe.dietaryTags.map((dt) => ({
        id: dt.dietaryTag.id,
        name: dt.dietaryTag.name,
        slug: dt.dietaryTag.slug,
      })),
      tips: recipe.tips.map((tip) => ({
        id: tip.id,
        tipType: tip.tipType,
        content: tip.content,
      })),
      variations: recipe.variations,
      favoriteCount: recipe._count.favorites,
      ratingCount: recipe._count.ratings,
      hasOmega3: recipe.healthTags.some((ht) => ht.healthTag.slug === "omega-3-rich"),
      hasHighFiber: recipe.healthTags.some((ht) => ht.healthTag.slug === "high-fiber"),
      isAntiInflammatory: recipe.healthTags.some((ht) => ht.healthTag.slug === "anti-inflammatory"),
      isHeartHealthy: recipe.healthTags.some((ht) => ht.healthTag.slug === "heart-healthy"),
    };

    return NextResponse.json(transformedRecipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

