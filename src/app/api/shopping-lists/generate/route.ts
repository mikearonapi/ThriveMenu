/**
 * Shopping List Generation API Route
 * 
 * POST /api/shopping-lists/generate
 * 
 * Generates a shopping list from a meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mealPlanId, name } = body;

    if (!mealPlanId) {
      return NextResponse.json(
        { error: "mealPlanId is required" },
        { status: 400 }
      );
    }

    // Verify meal plan belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: mealPlanId,
        userId: userId,
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true,
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

    // Aggregate ingredients from all recipes
    const ingredientMap = new Map<string, {
      amount: number;
      unit: string;
      name: string;
      category: string;
      recipes: string[];
    }>();

    for (const item of mealPlan.items) {
      const scale = item.servings / item.recipe.servings;
      
      for (const recipeIngredient of item.recipe.ingredients) {
        const key = recipeIngredient.ingredient.name.toLowerCase();
        const scaledAmount = (recipeIngredient.amount || 0) * scale;

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.amount += scaledAmount;
          if (!existing.recipes.includes(item.recipe.name)) {
            existing.recipes.push(item.recipe.name);
          }
        } else {
          ingredientMap.set(key, {
            amount: scaledAmount,
            unit: recipeIngredient.unit || "",
            name: recipeIngredient.ingredient.name,
            category: recipeIngredient.ingredient.category,
            recipes: [item.recipe.name],
          });
        }
      }
    }

    // Create shopping list
    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId: userId,
        name: name || `Shopping List - ${mealPlan.name || "Week Plan"}`,
        mealPlanId: mealPlan.id,
        items: {
          create: Array.from(ingredientMap.values()).map((ing) => ({
            ingredientId: undefined, // Will need to find or create ingredient
            customName: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category as any,
            notes: `For: ${ing.recipes.join(", ")}`,
            sourceRecipeIds: mealPlan.items
              .filter((item) => ing.recipes.includes(item.recipe.name))
              .map((item) => item.recipeId),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ shoppingList }, { status: 201 });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}

