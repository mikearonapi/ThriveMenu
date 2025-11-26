/**
 * Recipes API Route
 * 
 * GET /api/recipes - Get all recipes with comprehensive filtering
 * 
 * Query params:
 * - mealType: BREAKFAST, LUNCH, DINNER, SNACK, BEVERAGE
 * - search: search query
 * - limit: number of results (default: 50)
 * - offset: pagination offset
 * 
 * NEW FILTERS:
 * - season: SPRING, SUMMER, FALL, WINTER, ALL_YEAR
 * - costLevel: BUDGET, MEDIUM, PREMIUM, SPLURGE
 * - maxCost: maximum cost per serving (e.g., 5.00)
 * - iodineLevel: LOW, MODERATE, HIGH
 * - maxGlycemicIndex: maximum GI value (e.g., 55 for low GI)
 * - maxGlycemicLoad: maximum GL value (e.g., 10 for low GL)
 * - maxNetCarbs: maximum net carbs (e.g., 20 for keto)
 * - equipment: comma-separated required equipment
 * 
 * DIETARY FILTERS (comma-separated slugs):
 * - dietaryTags: gluten-free,dairy-free,vegetarian,vegan,pescatarian,
 *                egg-free,nut-free,soy-free,shellfish-free,nightshade-free,
 *                low-fodmap,paleo-friendly,whole30,keto-friendly,mediterranean
 * 
 * HEALTH FILTERS (comma-separated slugs):
 * - healthTags: omega-3-rich,high-fiber,high-protein,selenium-rich,
 *               heart-healthy,anti-inflammatory,graves-friendly,
 *               cholesterol-friendly,blood-sugar-balance,low-saturated-fat,
 *               low-sodium,low-carb,low-calorie,kid-friendly,budget-friendly,
 *               quick-easy,make-ahead,one-pot
 * 
 * BOOLEAN SHORTCUTS:
 * - kidFriendly, glutenFree, dairyFree, vegetarian, vegan, lowSodium,
 *   lowCarb, highProtein, quickEasy, etc.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Basic filters
    const mealType = searchParams.get("mealType");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // New filters
    const season = searchParams.get("season");
    const costLevel = searchParams.get("costLevel");
    const maxCost = searchParams.get("maxCost") ? parseFloat(searchParams.get("maxCost")!) : null;
    const iodineLevel = searchParams.get("iodineLevel");
    const maxGlycemicIndex = searchParams.get("maxGlycemicIndex") ? parseInt(searchParams.get("maxGlycemicIndex")!) : null;
    const maxGlycemicLoad = searchParams.get("maxGlycemicLoad") ? parseFloat(searchParams.get("maxGlycemicLoad")!) : null;
    const maxNetCarbs = searchParams.get("maxNetCarbs") ? parseFloat(searchParams.get("maxNetCarbs")!) : null;
    const requiredEquipment = searchParams.get("equipment")?.split(",").filter(Boolean) || [];
    
    // Tag-based filters (comma-separated slugs)
    const dietaryTagSlugs = searchParams.get("dietaryTags")?.split(",").filter(Boolean) || [];
    const healthTagSlugs = searchParams.get("healthTags")?.split(",").filter(Boolean) || [];
    
    // Boolean shortcut filters
    const booleanShortcuts: Record<string, string> = {
      kidFriendly: "kid-friendly",
      glutenFree: "gluten-free",
      dairyFree: "dairy-free",
      vegetarian: "vegetarian",
      vegan: "vegan",
      pescatarian: "pescatarian",
      eggFree: "egg-free",
      nutFree: "nut-free",
      soyFree: "soy-free",
      lowSodium: "low-sodium",
      lowCarb: "low-carb",
      highProtein: "high-protein",
      highFiber: "high-fiber",
      quickEasy: "quick-easy",
      makeAhead: "make-ahead",
      onePot: "one-pot",
      heartHealthy: "heart-healthy",
      antiInflammatory: "anti-inflammatory",
      gravesFriendly: "graves-friendly",
      cholesterolFriendly: "cholesterol-friendly",
      bloodSugarBalance: "blood-sugar-balance",
      lowSaturatedFat: "low-saturated-fat",
      lowCalorie: "low-calorie",
      ketoFriendly: "keto-friendly",
      lowFodmap: "low-fodmap",
      nightshadeFree: "nightshade-free",
      shellfishFree: "shellfish-free",
      omega3Rich: "omega-3-rich",
      seleniumRich: "selenium-rich",
      mediterranean: "mediterranean",
    };

    // Process boolean shortcuts into tag slugs
    for (const [param, tagSlug] of Object.entries(booleanShortcuts)) {
      if (searchParams.get(param) === "true") {
        const isDietary = [
          "gluten-free", "dairy-free", "vegetarian", "vegan", "pescatarian",
          "egg-free", "nut-free", "soy-free", "shellfish-free", "nightshade-free",
          "low-fodmap", "paleo-friendly", "whole30", "keto-friendly", "mediterranean"
        ].includes(tagSlug);
        
        if (isDietary) {
          if (!dietaryTagSlugs.includes(tagSlug)) {
            dietaryTagSlugs.push(tagSlug);
          }
        } else {
          if (!healthTagSlugs.includes(tagSlug)) {
            healthTagSlugs.push(tagSlug);
          }
        }
      }
    }

    // Build where clause
    const where: any = {};

    if (mealType) {
      where.mealType = mealType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { healthBenefits: { contains: search, mode: "insensitive" } },
      ];
    }

    // Season filter
    if (season) {
      where.seasonalAvailability = { has: season };
    }

    // Cost filters
    if (costLevel) {
      where.costLevel = costLevel;
    }
    if (maxCost !== null) {
      where.costPerServing = { lte: maxCost };
    }

    // Iodine level filter (important for Graves disease)
    if (iodineLevel) {
      where.iodineLevel = iodineLevel;
    }

    // Equipment filter (must have all required equipment)
    if (requiredEquipment.length > 0) {
      where.equipment = { hasEvery: requiredEquipment };
    }

    // Glycemic filters (require nutritionInfo join)
    if (maxGlycemicIndex !== null || maxGlycemicLoad !== null || maxNetCarbs !== null) {
      where.nutritionInfo = {};
      if (maxGlycemicIndex !== null) {
        where.nutritionInfo.glycemicIndex = { lte: maxGlycemicIndex };
      }
      if (maxGlycemicLoad !== null) {
        where.nutritionInfo.glycemicLoad = { lte: maxGlycemicLoad };
      }
      if (maxNetCarbs !== null) {
        where.nutritionInfo.netCarbs = { lte: maxNetCarbs };
      }
    }

    // Add dietary tag filters (recipe must have ALL specified tags)
    if (dietaryTagSlugs.length > 0) {
      where.AND = where.AND || [];
      for (const slug of dietaryTagSlugs) {
        where.AND.push({
          dietaryTags: {
            some: {
              dietaryTag: { slug },
            },
          },
        });
      }
    }

    // Add health tag filters (recipe must have ALL specified tags)
    if (healthTagSlugs.length > 0) {
      where.AND = where.AND || [];
      for (const slug of healthTagSlugs) {
        where.AND.push({
          healthTags: {
            some: {
              healthTag: { slug },
            },
          },
        });
      }
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
            include: { healthTag: true },
          },
          dietaryTags: {
            include: { dietaryTag: true },
          },
          nutritionInfo: true,
          substitutions: true,
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

    // Transform to match frontend format with comprehensive data
    const transformedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      slug: recipe.slug,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      mealType: recipe.mealType,
      
      // Timing
      prepTime: recipe.prepTimeMinutes,
      cookTime: recipe.cookTimeMinutes,
      totalTime: recipe.totalTimeMinutes,
      activeTime: recipe.activeTimeMinutes,
      
      // Servings & Scaling
      servings: recipe.servings,
      servingSize: recipe.servingSize,
      minServings: recipe.minServings,
      maxServings: recipe.maxServings,
      scalingNotes: recipe.scalingNotes,
      
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl,
      healthBenefits: recipe.healthBenefits,
      
      // Cost
      costPerServing: recipe.costPerServing,
      costLevel: recipe.costLevel,
      
      // Equipment
      equipment: recipe.equipment,
      
      // Serving & Pairing
      servingSuggestions: recipe.servingSuggestions,
      winePairing: recipe.winePairing,
      beveragePairing: recipe.beveragePairing,
      
      // Seasonal
      seasonalAvailability: recipe.seasonalAvailability,
      
      // Health-specific
      iodineLevel: recipe.iodineLevel,
      
      // Boolean flags
      isKidFriendly: recipe.isKidFriendly,
      isQuick: recipe.isQuick,
      isMakeAhead: recipe.isMakeAhead,
      isOnePot: recipe.isOnePot,
      isBudgetFriendly: recipe.isBudgetFriendly,
      isFreezerFriendly: recipe.isFreezerFriendly,
      
      // Derived from health tags
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
      
      // Derived from dietary tags
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
      
      // Full tag objects for UI
      healthTags: recipe.healthTags.map((ht) => ({
        slug: ht.healthTag.slug,
        name: ht.healthTag.name,
        color: ht.healthTag.color,
      })),
      dietaryTags: recipe.dietaryTags.map((dt) => ({
        slug: dt.dietaryTag.slug,
        name: dt.dietaryTag.name,
        icon: dt.dietaryTag.icon,
      })),
      
      // Comprehensive Nutrition
      nutrition: recipe.nutritionInfo ? {
        calories: recipe.nutritionInfo.calories,
        protein: recipe.nutritionInfo.protein,
        carbs: recipe.nutritionInfo.carbohydrates,
        netCarbs: recipe.nutritionInfo.netCarbs,
        fat: recipe.nutritionInfo.fat,
        saturatedFat: recipe.nutritionInfo.saturatedFat,
        unsaturatedFat: recipe.nutritionInfo.unsaturatedFat,
        fiber: recipe.nutritionInfo.fiber,
        sugar: recipe.nutritionInfo.sugar,
        sodium: recipe.nutritionInfo.sodium,
        cholesterol: recipe.nutritionInfo.cholesterol,
        potassium: recipe.nutritionInfo.potassium,
        iron: recipe.nutritionInfo.iron,
        calcium: recipe.nutritionInfo.calcium,
        glycemicIndex: recipe.nutritionInfo.glycemicIndex,
        glycemicLoad: recipe.nutritionInfo.glycemicLoad,
      } : null,
      
      // Substitutions
      substitutions: recipe.substitutions?.map((sub) => ({
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
      })) || [],
      
      // Engagement stats
      favoriteCount: recipe._count.favorites,
      ratingCount: recipe._count.ratings,
    }));

    return NextResponse.json({
      recipes: transformedRecipes,
      total,
      limit,
      offset,
      filters: {
        applied: {
          dietaryTags: dietaryTagSlugs,
          healthTags: healthTagSlugs,
          mealType: mealType || null,
          search: search || null,
          season: season || null,
          costLevel: costLevel || null,
          maxCost: maxCost,
          iodineLevel: iodineLevel || null,
          maxGlycemicIndex,
          maxGlycemicLoad,
          maxNetCarbs,
          equipment: requiredEquipment,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
