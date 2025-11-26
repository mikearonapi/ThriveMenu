/**
 * Filters API Route
 * 
 * GET /api/filters - Get all available filter options with recipe counts
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Fetch all health tags with recipe counts
    const healthTags = await prisma.healthTag.findMany({
      include: {
        _count: { select: { recipes: true } },
      },
      orderBy: { name: "asc" },
    });

    // Fetch all dietary tags with recipe counts
    const dietaryTags = await prisma.dietaryTag.findMany({
      include: {
        _count: { select: { recipes: true } },
      },
      orderBy: { name: "asc" },
    });

    // Get counts for new filters
    const [
      totalRecipes,
      seasonCounts,
      costLevelCounts,
      iodineLevelCounts,
      equipmentList,
    ] = await Promise.all([
      prisma.recipe.count(),
      
      // Season counts
      Promise.all([
        prisma.recipe.count({ where: { seasonalAvailability: { has: 'SPRING' } } }),
        prisma.recipe.count({ where: { seasonalAvailability: { has: 'SUMMER' } } }),
        prisma.recipe.count({ where: { seasonalAvailability: { has: 'FALL' } } }),
        prisma.recipe.count({ where: { seasonalAvailability: { has: 'WINTER' } } }),
        prisma.recipe.count({ where: { seasonalAvailability: { has: 'ALL_YEAR' } } }),
      ]),
      
      // Cost level counts
      Promise.all([
        prisma.recipe.count({ where: { costLevel: 'BUDGET' } }),
        prisma.recipe.count({ where: { costLevel: 'MEDIUM' } }),
        prisma.recipe.count({ where: { costLevel: 'PREMIUM' } }),
        prisma.recipe.count({ where: { costLevel: 'SPLURGE' } }),
      ]),
      
      // Iodine level counts
      Promise.all([
        prisma.recipe.count({ where: { iodineLevel: 'LOW' } }),
        prisma.recipe.count({ where: { iodineLevel: 'MODERATE' } }),
        prisma.recipe.count({ where: { iodineLevel: 'HIGH' } }),
      ]),
      
      // Get all unique equipment
      prisma.recipe.findMany({
        select: { equipment: true },
        where: { equipment: { isEmpty: false } },
      }),
    ]);

    // Process equipment into counts
    const equipmentCounts: Record<string, number> = {};
    for (const recipe of equipmentList) {
      for (const equip of recipe.equipment) {
        equipmentCounts[equip] = (equipmentCounts[equip] || 0) + 1;
      }
    }

    // Get glycemic index ranges
    const [lowGI, mediumGI, highGI] = await Promise.all([
      prisma.recipe.count({ where: { nutritionInfo: { glycemicIndex: { lte: 55 } } } }),
      prisma.recipe.count({ where: { nutritionInfo: { glycemicIndex: { gt: 55, lte: 69 } } } }),
      prisma.recipe.count({ where: { nutritionInfo: { glycemicIndex: { gt: 69 } } } }),
    ]);

    // Categorize health tags
    const healthTagCategories = {
      nutrients: ["omega-3-rich", "high-fiber", "high-protein", "selenium-rich"],
      healthConditions: ["heart-healthy", "anti-inflammatory", "graves-friendly", "cholesterol-friendly", "blood-sugar-balance"],
      nutritionLimits: ["low-saturated-fat", "low-sodium", "low-carb", "low-calorie"],
      lifestyle: ["kid-friendly", "budget-friendly", "quick-easy", "make-ahead", "one-pot"],
    };

    // Categorize dietary tags
    const dietaryTagCategories = {
      allergenFree: ["gluten-free", "dairy-free", "egg-free", "nut-free", "soy-free", "shellfish-free"],
      dietTypes: ["vegetarian", "vegan", "pescatarian"],
      specialtyDiets: ["nightshade-free", "low-fodmap", "paleo-friendly", "whole30", "keto-friendly", "mediterranean"],
    };

    // Transform tags
    const transformedHealthTags = healthTags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      recipeCount: tag._count.recipes,
    }));

    const transformedDietaryTags = dietaryTags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
      description: tag.description,
      icon: tag.icon,
      recipeCount: tag._count.recipes,
    }));

    // Group tags by category
    const groupedHealthTags = {
      nutrients: transformedHealthTags.filter((t) => healthTagCategories.nutrients.includes(t.slug)),
      healthConditions: transformedHealthTags.filter((t) => healthTagCategories.healthConditions.includes(t.slug)),
      nutritionLimits: transformedHealthTags.filter((t) => healthTagCategories.nutritionLimits.includes(t.slug)),
      lifestyle: transformedHealthTags.filter((t) => healthTagCategories.lifestyle.includes(t.slug)),
    };

    const groupedDietaryTags = {
      allergenFree: transformedDietaryTags.filter((t) => dietaryTagCategories.allergenFree.includes(t.slug)),
      dietTypes: transformedDietaryTags.filter((t) => dietaryTagCategories.dietTypes.includes(t.slug)),
      specialtyDiets: transformedDietaryTags.filter((t) => dietaryTagCategories.specialtyDiets.includes(t.slug)),
    };

    return NextResponse.json({
      totalRecipes,
      
      // Health & Dietary Tags
      healthTags: {
        all: transformedHealthTags,
        grouped: groupedHealthTags,
      },
      dietaryTags: {
        all: transformedDietaryTags,
        grouped: groupedDietaryTags,
      },
      
      // Seasonal Filters
      seasons: [
        { value: "SPRING", label: "Spring", icon: "🌸", count: seasonCounts[0] },
        { value: "SUMMER", label: "Summer", icon: "☀️", count: seasonCounts[1] },
        { value: "FALL", label: "Fall", icon: "🍂", count: seasonCounts[2] },
        { value: "WINTER", label: "Winter", icon: "❄️", count: seasonCounts[3] },
        { value: "ALL_YEAR", label: "All Year", icon: "📅", count: seasonCounts[4] },
      ],
      
      // Cost Levels
      costLevels: [
        { value: "BUDGET", label: "Budget (< $3)", icon: "💰", count: costLevelCounts[0] },
        { value: "MEDIUM", label: "Medium ($3-6)", icon: "💵", count: costLevelCounts[1] },
        { value: "PREMIUM", label: "Premium ($6-10)", icon: "💎", count: costLevelCounts[2] },
        { value: "SPLURGE", label: "Splurge ($10+)", icon: "✨", count: costLevelCounts[3] },
      ],
      
      // Iodine Levels (for Graves Disease)
      iodineLevels: [
        { value: "LOW", label: "Low Iodine", icon: "✅", count: iodineLevelCounts[0], description: "Safe for Graves disease" },
        { value: "MODERATE", label: "Moderate Iodine", icon: "⚠️", count: iodineLevelCounts[1], description: "Normal iodine content" },
        { value: "HIGH", label: "High Iodine", icon: "🚫", count: iodineLevelCounts[2], description: "Limit for Graves disease" },
      ],
      
      // Glycemic Index Ranges
      glycemicIndex: [
        { value: "low", label: "Low GI (≤55)", maxValue: 55, count: lowGI, description: "Slow blood sugar rise" },
        { value: "medium", label: "Medium GI (56-69)", minValue: 56, maxValue: 69, count: mediumGI, description: "Moderate blood sugar impact" },
        { value: "high", label: "High GI (70+)", minValue: 70, count: highGI, description: "Rapid blood sugar spike" },
      ],
      
      // Equipment Options
      equipment: Object.entries(equipmentCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({
          value: name,
          label: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          count,
        })),
      
      // Quick Filters for UI
      quickFilters: [
        { slug: "gluten-free", name: "Gluten-Free", type: "dietary", icon: "🌾" },
        { slug: "dairy-free", name: "Dairy-Free", type: "dietary", icon: "🥛" },
        { slug: "vegetarian", name: "Vegetarian", type: "dietary", icon: "🥬" },
        { slug: "vegan", name: "Vegan", type: "dietary", icon: "🌱" },
        { slug: "low-carb", name: "Low Carb", type: "health", icon: "📉" },
        { slug: "high-protein", name: "High Protein", type: "health", icon: "💪" },
        { slug: "quick-easy", name: "Quick & Easy", type: "health", icon: "⚡" },
        { slug: "heart-healthy", name: "Heart Healthy", type: "health", icon: "❤️" },
        { slug: "kid-friendly", name: "Kid-Friendly", type: "health", icon: "👶" },
        { slug: "keto-friendly", name: "Keto", type: "dietary", icon: "🥑" },
      ],
      
      // Health Condition Presets
      healthPresets: [
        {
          name: "Graves Disease Friendly",
          description: "Low iodine, anti-inflammatory options",
          filters: { iodineLevel: "LOW", healthTags: ["anti-inflammatory"] },
        },
        {
          name: "Blood Sugar Friendly",
          description: "Low glycemic index, high fiber",
          filters: { maxGlycemicIndex: 55, healthTags: ["high-fiber"] },
        },
        {
          name: "Heart Healthy",
          description: "Low sodium, low saturated fat",
          filters: { healthTags: ["heart-healthy", "low-sodium", "low-saturated-fat"] },
        },
        {
          name: "Keto/Low Carb",
          description: "Under 20g net carbs",
          filters: { maxNetCarbs: 20, dietaryTags: ["keto-friendly"] },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
