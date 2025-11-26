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
        substitutions: true,
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
      slug: recipe.slug,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      cuisine: recipe.cuisine,
      mealType: recipe.mealType,
      
      // Timing
      prepTime: recipe.prepTimeMinutes,
      cookTime: recipe.cookTimeMinutes,
      totalTime: recipe.totalTimeMinutes,
      activeTime: recipe.activeTimeMinutes,
      
      // Servings
      servings: recipe.servings,
      servingSize: recipe.servingSize,
      minServings: recipe.minServings,
      maxServings: recipe.maxServings,
      
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl,
      videoUrl: recipe.videoUrl,
      healthBenefits: recipe.healthBenefits,
      
      // Cost & Budget
      costPerServing: recipe.costPerServing,
      costLevel: recipe.costLevel,
      
      // Equipment
      equipment: recipe.equipment,
      
      // Serving & Pairing
      servingSuggestions: recipe.servingSuggestions,
      winePairing: recipe.winePairing,
      beveragePairing: recipe.beveragePairing,
      scalingNotes: recipe.scalingNotes,
      
      // Seasonal
      seasonalAvailability: recipe.seasonalAvailability,
      
      // Iodine
      iodineLevel: recipe.iodineLevel,
      
      // Boolean flags
      isKidFriendly: recipe.isKidFriendly,
      isMakeAhead: recipe.isMakeAhead,
      isOnePot: recipe.isOnePot,
      isQuick: recipe.isQuick,
      isBudgetFriendly: recipe.isBudgetFriendly,
      isFreezerFriendly: recipe.isFreezerFriendly,
      
      sourceUrl: recipe.sourceUrl,
      sourceAttribution: recipe.sourceAttribution,
      
      // Ingredients
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
      
      // Instructions
      instructions: recipe.instructions.map((inst) => ({
        stepNumber: inst.stepNumber,
        instruction: inst.instruction,
        imageUrl: inst.imageUrl,
        tipText: inst.tipText,
        durationMinutes: inst.durationMinutes,
      })),
      
      // Comprehensive Nutrition
      nutrition: recipe.nutritionInfo ? {
        calories: recipe.nutritionInfo.calories,
        protein: recipe.nutritionInfo.protein,
        carbs: recipe.nutritionInfo.carbohydrates,
        netCarbs: recipe.nutritionInfo.netCarbs,
        fiber: recipe.nutritionInfo.fiber,
        sugar: recipe.nutritionInfo.sugar,
        fat: recipe.nutritionInfo.fat,
        saturatedFat: recipe.nutritionInfo.saturatedFat,
        unsaturatedFat: recipe.nutritionInfo.unsaturatedFat,
        transFat: recipe.nutritionInfo.transFat,
        cholesterol: recipe.nutritionInfo.cholesterol,
        sodium: recipe.nutritionInfo.sodium,
        potassium: recipe.nutritionInfo.potassium,
        
        // Glycemic
        glycemicIndex: recipe.nutritionInfo.glycemicIndex,
        glycemicLoad: recipe.nutritionInfo.glycemicLoad,
        
        // Micronutrients
        omega3: recipe.nutritionInfo.omega3,
        omega6: recipe.nutritionInfo.omega6,
        selenium: recipe.nutritionInfo.selenium,
        vitaminD: recipe.nutritionInfo.vitaminD,
        iron: recipe.nutritionInfo.iron,
        calcium: recipe.nutritionInfo.calcium,
        magnesium: recipe.nutritionInfo.magnesium,
        zinc: recipe.nutritionInfo.zinc,
        vitaminC: recipe.nutritionInfo.vitaminC,
        vitaminA: recipe.nutritionInfo.vitaminA,
        vitaminB12: recipe.nutritionInfo.vitaminB12,
        folate: recipe.nutritionInfo.folate,
        
        // Health scores
        heartHealthScore: recipe.nutritionInfo.heartHealthScore,
        antiInflammatoryScore: recipe.nutritionInfo.antiInflammatoryScore,
        bloodSugarScore: recipe.nutritionInfo.bloodSugarScore,
      } : null,
      
      // Tags
      healthTags: recipe.healthTags.map((ht) => ({
        id: ht.healthTag.id,
        name: ht.healthTag.name,
        slug: ht.healthTag.slug,
        color: ht.healthTag.color,
      })),
      dietaryTags: recipe.dietaryTags.map((dt) => ({
        id: dt.dietaryTag.id,
        name: dt.dietaryTag.name,
        slug: dt.dietaryTag.slug,
        icon: dt.dietaryTag.icon,
      })),
      
      // Tips
      tips: recipe.tips.map((tip) => ({
        id: tip.id,
        tipType: tip.tipType,
        content: tip.content,
      })),
      
      // Variations
      variations: recipe.variations,
      
      // Substitutions
      substitutions: recipe.substitutions.map((sub) => ({
        original: sub.originalIngredient,
        substitute: sub.substituteIngredient,
        ratio: sub.substitutionRatio,
        notes: sub.notes,
        forDairyFree: sub.forDairyFree,
        forGlutenFree: sub.forGlutenFree,
        forVegan: sub.forVegan,
        forNutFree: sub.forNutFree,
        forLowSodium: sub.forLowSodium,
        forLowCarb: sub.forLowCarb,
      })),
      
      // Stats
      favoriteCount: recipe._count.favorites,
      ratingCount: recipe._count.ratings,
      
      // Derived boolean flags from tags
      hasOmega3: recipe.healthTags.some((ht) => ht.healthTag.slug === "omega-3-rich"),
      hasHighFiber: recipe.healthTags.some((ht) => ht.healthTag.slug === "high-fiber"),
      hasHighProtein: recipe.healthTags.some((ht) => ht.healthTag.slug === "high-protein"),
      hasSelenium: recipe.healthTags.some((ht) => ht.healthTag.slug === "selenium-rich"),
      isAntiInflammatory: recipe.healthTags.some((ht) => ht.healthTag.slug === "anti-inflammatory"),
      isHeartHealthy: recipe.healthTags.some((ht) => ht.healthTag.slug === "heart-healthy"),
      isLowSaturatedFat: recipe.healthTags.some((ht) => ht.healthTag.slug === "low-saturated-fat"),
      isLowSodium: recipe.healthTags.some((ht) => ht.healthTag.slug === "low-sodium"),
      isLowCarb: recipe.healthTags.some((ht) => ht.healthTag.slug === "low-carb"),
      isLowCalorie: recipe.healthTags.some((ht) => ht.healthTag.slug === "low-calorie"),
      
      isGlutenFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "gluten-free"),
      isDairyFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "dairy-free"),
      isVegetarian: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "vegetarian"),
      isVegan: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "vegan"),
      isPescatarian: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "pescatarian"),
      isEggFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "egg-free"),
      isNutFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "nut-free"),
      isSoyFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "soy-free"),
      isNightShadeFree: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "nightshade-free"),
      isLowFodmap: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "low-fodmap"),
      isKetoFriendly: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "keto-friendly"),
      isMediterranean: recipe.dietaryTags.some((dt) => dt.dietaryTag.slug === "mediterranean"),
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
