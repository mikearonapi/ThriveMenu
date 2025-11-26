/**
 * Update Nutrition Data Script
 * 
 * This script UPDATES existing nutrition records without deleting anything.
 * It estimates missing macro and micronutrient values based on ingredients.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================
// NUTRITION ESTIMATION DATA
// =============================================

// Saturated fat ratios by ingredient type (as % of total fat)
const SATURATED_FAT_RATIOS: Record<string, number> = {
  // High saturated fat
  'butter': 0.65,
  'ghee': 0.65,
  'coconut oil': 0.85,
  'coconut milk': 0.85,
  'coconut cream': 0.85,
  'cream cheese': 0.60,
  'heavy cream': 0.65,
  'sour cream': 0.60,
  'cheese': 0.60,
  'cheddar': 0.65,
  'parmesan': 0.65,
  'mozzarella': 0.55,
  'feta': 0.50,
  'bacon': 0.40,
  'sausage': 0.35,
  'ground beef': 0.40,
  'beef': 0.40,
  'lamb': 0.45,
  'pork': 0.35,
  
  // Medium saturated fat
  'chicken': 0.30,
  'turkey': 0.25,
  'egg': 0.30,
  'eggs': 0.30,
  'milk': 0.60,
  'yogurt': 0.55,
  'greek yogurt': 0.50,
  
  // Low saturated fat
  'salmon': 0.20,
  'tuna': 0.25,
  'fish': 0.20,
  'shrimp': 0.25,
  'olive oil': 0.14,
  'avocado': 0.15,
  'nuts': 0.10,
  'almonds': 0.08,
  'walnuts': 0.09,
  'seeds': 0.10,
  
  // Default
  'default': 0.25,
};

// Cholesterol content estimates (mg per typical serving)
const CHOLESTEROL_ESTIMATES: Record<string, number> = {
  'egg': 186,
  'eggs': 186,
  'shrimp': 180,
  'liver': 300,
  'beef': 75,
  'chicken': 85,
  'turkey': 70,
  'pork': 75,
  'lamb': 80,
  'salmon': 55,
  'tuna': 45,
  'fish': 50,
  'cheese': 30,
  'butter': 30,
  'cream': 40,
  'milk': 10,
  'yogurt': 15,
  'bacon': 40,
  'sausage': 45,
};

// Sugar content indicators
const HIGH_SUGAR_INGREDIENTS = [
  'honey', 'maple syrup', 'sugar', 'brown sugar', 'agave',
  'dates', 'raisins', 'dried fruit', 'banana', 'mango',
  'pineapple', 'grapes', 'apple juice', 'orange juice',
  'jam', 'jelly', 'chocolate', 'molasses',
];

const MEDIUM_SUGAR_INGREDIENTS = [
  'apple', 'orange', 'berries', 'strawberries', 'blueberries',
  'peach', 'pear', 'melon', 'watermelon', 'cherry',
  'milk', 'yogurt', 'ketchup', 'bbq sauce', 'teriyaki',
];

// Potassium-rich ingredients (mg per serving estimate)
const POTASSIUM_SOURCES: Record<string, number> = {
  'banana': 400,
  'potato': 900,
  'sweet potato': 700,
  'spinach': 550,
  'avocado': 500,
  'salmon': 400,
  'beans': 350,
  'lentils': 350,
  'chickpeas': 300,
  'yogurt': 350,
  'tomato': 290,
  'squash': 400,
  'mushrooms': 300,
  'broccoli': 300,
};

// Iron-rich ingredients (mg per serving estimate)
const IRON_SOURCES: Record<string, number> = {
  'beef': 3.0,
  'lamb': 2.5,
  'liver': 6.0,
  'spinach': 3.5,
  'lentils': 3.3,
  'chickpeas': 2.5,
  'beans': 2.0,
  'tofu': 2.5,
  'quinoa': 2.8,
  'fortified cereal': 8.0,
  'oysters': 8.0,
  'dark chocolate': 3.5,
  'turkey': 1.5,
  'chicken': 1.0,
};

// Calcium-rich ingredients (mg per serving estimate)
const CALCIUM_SOURCES: Record<string, number> = {
  'milk': 300,
  'yogurt': 250,
  'cheese': 200,
  'parmesan': 330,
  'mozzarella': 220,
  'feta': 140,
  'cottage cheese': 80,
  'tofu': 250,
  'sardines': 350,
  'salmon': 180,
  'kale': 100,
  'broccoli': 45,
  'spinach': 30,
  'almonds': 75,
  'fortified': 300,
};

// =============================================
// ESTIMATION FUNCTIONS
// =============================================

function containsIngredient(ingredients: string[], ...keywords: string[]): boolean {
  const joined = ingredients.join(' ').toLowerCase();
  return keywords.some(k => joined.includes(k.toLowerCase()));
}

function countIngredient(ingredients: string[], ...keywords: string[]): number {
  let count = 0;
  for (const ing of ingredients) {
    const lower = ing.toLowerCase();
    if (keywords.some(k => lower.includes(k.toLowerCase()))) {
      count++;
    }
  }
  return count;
}

function estimateSaturatedFat(totalFat: number, ingredients: string[]): number {
  if (totalFat === 0) return 0;
  
  // Find the dominant fat source and use its ratio
  let maxRatio = SATURATED_FAT_RATIOS['default'];
  
  for (const [ingredient, ratio] of Object.entries(SATURATED_FAT_RATIOS)) {
    if (containsIngredient(ingredients, ingredient)) {
      if (ratio > maxRatio) {
        maxRatio = ratio;
      }
    }
  }
  
  // Adjust based on multiple sources
  if (containsIngredient(ingredients, 'olive oil', 'avocado')) {
    maxRatio = Math.max(0.15, maxRatio - 0.10);
  }
  
  return Math.round(totalFat * maxRatio * 10) / 10;
}

function estimateCholesterol(ingredients: string[], protein: number): number {
  let cholesterol = 0;
  
  for (const [ingredient, mg] of Object.entries(CHOLESTEROL_ESTIMATES)) {
    const count = countIngredient(ingredients, ingredient);
    if (count > 0) {
      cholesterol += mg * Math.min(count, 2);
    }
  }
  
  // If no specific sources found but has protein, estimate based on protein
  if (cholesterol === 0 && protein > 10) {
    if (containsIngredient(ingredients, 'chicken', 'turkey', 'fish', 'salmon', 'beef', 'pork')) {
      cholesterol = protein * 3; // ~3mg per gram of animal protein
    }
  }
  
  return Math.round(cholesterol);
}

function estimateSugar(carbs: number, ingredients: string[]): number {
  let sugarRatio = 0.1; // Default 10% of carbs are sugars
  
  // High sugar ingredients
  const highSugarCount = HIGH_SUGAR_INGREDIENTS.filter(s => 
    containsIngredient(ingredients, s)
  ).length;
  
  // Medium sugar ingredients
  const medSugarCount = MEDIUM_SUGAR_INGREDIENTS.filter(s => 
    containsIngredient(ingredients, s)
  ).length;
  
  if (highSugarCount > 0) {
    sugarRatio += 0.15 * highSugarCount;
  }
  if (medSugarCount > 0) {
    sugarRatio += 0.08 * medSugarCount;
  }
  
  // Cap at 50% of carbs
  sugarRatio = Math.min(sugarRatio, 0.5);
  
  return Math.round(carbs * sugarRatio);
}

function estimatePotassium(ingredients: string[]): number {
  let potassium = 100; // Base amount
  
  for (const [ingredient, mg] of Object.entries(POTASSIUM_SOURCES)) {
    if (containsIngredient(ingredients, ingredient)) {
      potassium += mg;
    }
  }
  
  return Math.round(potassium);
}

function estimateIron(ingredients: string[], isVegetarian: boolean): number {
  let iron = 0.5; // Base amount
  
  for (const [ingredient, mg] of Object.entries(IRON_SOURCES)) {
    if (containsIngredient(ingredients, ingredient)) {
      iron += mg;
    }
  }
  
  return Math.round(iron * 10) / 10;
}

function estimateCalcium(ingredients: string[]): number {
  let calcium = 20; // Base amount
  
  for (const [ingredient, mg] of Object.entries(CALCIUM_SOURCES)) {
    if (containsIngredient(ingredients, ingredient)) {
      calcium += mg;
    }
  }
  
  return Math.round(calcium);
}

// =============================================
// MAIN UPDATE FUNCTION
// =============================================

async function updateNutrition() {
  console.log('🥗 Starting nutrition data update...\n');
  console.log('This will UPDATE existing records, not delete anything.\n');
  
  // Get all recipes with their ingredients and current nutrition
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      nutritionInfo: true,
      dietaryTags: {
        include: {
          dietaryTag: true,
        },
      },
    },
  });
  
  console.log(`📋 Found ${recipes.length} recipes to update\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const recipe of recipes) {
    if (!recipe.nutritionInfo) {
      console.log(`⚠️  Skipping ${recipe.name} - no nutrition record`);
      skipped++;
      continue;
    }
    
    const ingredientNames = recipe.ingredients.map(ri => ri.ingredient.name);
    const isVegetarian = recipe.dietaryTags.some(dt => 
      dt.dietaryTag.slug === 'vegetarian' || dt.dietaryTag.slug === 'vegan'
    );
    
    const currentNutrition = recipe.nutritionInfo;
    
    // Estimate missing values
    const saturatedFat = currentNutrition.saturatedFat === 0 
      ? estimateSaturatedFat(currentNutrition.fat, ingredientNames)
      : currentNutrition.saturatedFat;
      
    const cholesterol = currentNutrition.cholesterol === 0
      ? estimateCholesterol(ingredientNames, currentNutrition.protein)
      : currentNutrition.cholesterol;
      
    const sugar = currentNutrition.sugar === 0
      ? estimateSugar(currentNutrition.carbohydrates, ingredientNames)
      : currentNutrition.sugar;
      
    const potassium = currentNutrition.potassium === null
      ? estimatePotassium(ingredientNames)
      : currentNutrition.potassium;
      
    const iron = currentNutrition.iron === null
      ? estimateIron(ingredientNames, isVegetarian)
      : currentNutrition.iron;
      
    const calcium = currentNutrition.calcium === null
      ? estimateCalcium(ingredientNames)
      : currentNutrition.calcium;
    
    // Calculate unsaturated fat
    const unsaturatedFat = Math.max(0, currentNutrition.fat - saturatedFat);
    
    // Update the record
    await prisma.nutritionInfo.update({
      where: { id: currentNutrition.id },
      data: {
        saturatedFat,
        unsaturatedFat,
        cholesterol,
        sugar,
        potassium,
        iron,
        calcium,
      },
    });
    
    updated++;
    
    if (updated % 50 === 0) {
      console.log(`📝 Updated ${updated}/${recipes.length} recipes...`);
    }
  }
  
  console.log(`\n✅ Nutrition update complete!`);
  console.log(`   Updated: ${updated} recipes`);
  console.log(`   Skipped: ${skipped} recipes`);
  
  // Show sample of updated data
  const sample = await prisma.nutritionInfo.findFirst({
    include: { recipe: { select: { name: true } } },
  });
  
  console.log(`\n📊 Sample updated nutrition (${sample?.recipe.name}):`);
  console.log(`   Calories: ${sample?.calories}`);
  console.log(`   Protein: ${sample?.protein}g`);
  console.log(`   Carbs: ${sample?.carbohydrates}g`);
  console.log(`   Fiber: ${sample?.fiber}g`);
  console.log(`   Sugar: ${sample?.sugar}g`);
  console.log(`   Fat: ${sample?.fat}g`);
  console.log(`   Saturated Fat: ${sample?.saturatedFat}g`);
  console.log(`   Unsaturated Fat: ${sample?.unsaturatedFat}g`);
  console.log(`   Cholesterol: ${sample?.cholesterol}mg`);
  console.log(`   Sodium: ${sample?.sodium}mg`);
  console.log(`   Potassium: ${sample?.potassium}mg`);
  console.log(`   Iron: ${sample?.iron}mg`);
  console.log(`   Calcium: ${sample?.calcium}mg`);
  
  await prisma.$disconnect();
}

updateNutrition().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});

