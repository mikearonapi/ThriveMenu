/**
 * Populate Recipe Enhancements Script
 * 
 * This script UPDATES existing recipes with new fields:
 * - Cost per serving
 * - Equipment needed
 * - Serving suggestions
 * - Glycemic index/load
 * - Iodine content level
 * - Net carbs
 * - Scaling notes
 * - Seasonal availability
 * - Wine/beverage pairings
 * - Ingredient substitutions
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient, Season, IodineLevel, CostLevel } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================
// EQUIPMENT MAPPING
// =============================================
const EQUIPMENT_KEYWORDS: Record<string, string[]> = {
  'blender': ['smoothie', 'puree', 'blend', 'soup'],
  'food-processor': ['process', 'chop finely', 'pulse'],
  'stand-mixer': ['knead', 'whip', 'beat'],
  'instant-pot': ['pressure cook', 'instant pot'],
  'slow-cooker': ['slow cook', 'crockpot', 'crock pot'],
  'sheet-pan': ['sheet pan', 'baking sheet', 'roast'],
  'cast-iron-skillet': ['sear', 'cast iron'],
  'grill': ['grill', 'barbecue', 'bbq'],
  'air-fryer': ['air fry', 'air fryer'],
  'dutch-oven': ['dutch oven', 'braise'],
  'wok': ['stir fry', 'stir-fry', 'wok'],
  'baking-dish': ['bake', 'casserole'],
  'muffin-tin': ['muffin', 'cupcake'],
  'loaf-pan': ['loaf', 'bread'],
  'skillet': ['sauté', 'pan fry', 'skillet'],
  'saucepan': ['simmer', 'boil', 'sauce'],
  'stockpot': ['stock', 'soup', 'boil pasta'],
  'mixing-bowls': ['mix', 'combine', 'whisk'],
  'cutting-board': ['chop', 'dice', 'slice', 'mince'],
  'knife': ['chop', 'dice', 'slice', 'mince', 'cut'],
};

// =============================================
// COST ESTIMATION
// =============================================
const EXPENSIVE_INGREDIENTS = [
  'salmon', 'shrimp', 'lobster', 'crab', 'scallops', 'tuna', 'halibut',
  'beef tenderloin', 'ribeye', 'filet', 'lamb', 'duck',
  'pine nuts', 'saffron', 'vanilla bean', 'truffle',
  'parmesan', 'gruyere', 'brie', 'goat cheese',
  'avocado', 'berries', 'pomegranate', 'mango',
  'quinoa', 'wild rice',
];

const BUDGET_INGREDIENTS = [
  'rice', 'pasta', 'beans', 'lentils', 'chickpeas', 'oats',
  'eggs', 'chicken thighs', 'ground turkey', 'ground beef',
  'cabbage', 'carrots', 'onions', 'potatoes', 'celery',
  'canned tomatoes', 'frozen vegetables',
];

// =============================================
// GLYCEMIC INDEX DATA
// =============================================
const HIGH_GI_INGREDIENTS = [
  'white rice', 'white bread', 'potato', 'corn flakes', 'watermelon',
  'instant oatmeal', 'white pasta', 'bagel', 'rice cakes',
];

const MEDIUM_GI_INGREDIENTS = [
  'brown rice', 'whole wheat', 'oatmeal', 'banana', 'grapes',
  'sweet potato', 'pita', 'couscous', 'raisins',
];

const LOW_GI_INGREDIENTS = [
  'quinoa', 'lentils', 'chickpeas', 'black beans', 'steel-cut oats',
  'most vegetables', 'berries', 'apple', 'pear', 'greek yogurt',
  'nuts', 'seeds', 'eggs', 'meat', 'fish', 'cheese',
];

// =============================================
// IODINE CONTENT
// =============================================
const HIGH_IODINE_INGREDIENTS = [
  'seaweed', 'nori', 'kelp', 'wakame', 'kombu',
  'iodized salt', 'cod', 'shrimp', 'tuna', 'lobster',
  'milk', 'yogurt', 'cheese', 'eggs',
];

const LOW_IODINE_INGREDIENTS = [
  'fresh fruits', 'fresh vegetables', 'unsalted nuts',
  'fresh meat', 'egg whites', 'non-iodized salt',
  'olive oil', 'vegetable oil',
];

// =============================================
// SEASONAL MAPPING
// =============================================
const SEASONAL_INGREDIENTS: Record<string, Season[]> = {
  // Spring
  'asparagus': ['SPRING'],
  'peas': ['SPRING'],
  'artichoke': ['SPRING'],
  'rhubarb': ['SPRING'],
  'strawberries': ['SPRING', 'SUMMER'],
  
  // Summer
  'tomato': ['SUMMER'],
  'zucchini': ['SUMMER'],
  'corn': ['SUMMER'],
  'peach': ['SUMMER'],
  'watermelon': ['SUMMER'],
  'berries': ['SUMMER'],
  'cucumber': ['SUMMER'],
  'bell pepper': ['SUMMER'],
  'eggplant': ['SUMMER'],
  
  // Fall
  'pumpkin': ['FALL'],
  'butternut squash': ['FALL', 'WINTER'],
  'apple': ['FALL'],
  'pear': ['FALL'],
  'cranberry': ['FALL'],
  'sweet potato': ['FALL', 'WINTER'],
  'brussels sprouts': ['FALL', 'WINTER'],
  
  // Winter
  'citrus': ['WINTER'],
  'orange': ['WINTER'],
  'grapefruit': ['WINTER'],
  'kale': ['WINTER'],
  'cabbage': ['WINTER'],
  'root vegetables': ['WINTER'],
  'parsnip': ['WINTER'],
  'turnip': ['WINTER'],
};

// =============================================
// WINE PAIRINGS
// =============================================
const WINE_PAIRINGS: Record<string, { wine: string; nonAlcoholic: string }> = {
  // Seafood
  'salmon': { wine: 'Pinot Noir or Chardonnay', nonAlcoholic: 'Sparkling water with lemon' },
  'shrimp': { wine: 'Sauvignon Blanc or Pinot Grigio', nonAlcoholic: 'Iced green tea' },
  'fish': { wine: 'Sauvignon Blanc or Chablis', nonAlcoholic: 'Lemon-infused water' },
  'tuna': { wine: 'Rosé or light Pinot Noir', nonAlcoholic: 'Ginger kombucha' },
  
  // Poultry
  'chicken': { wine: 'Chardonnay or Pinot Noir', nonAlcoholic: 'Apple cider' },
  'turkey': { wine: 'Pinot Noir or Beaujolais', nonAlcoholic: 'Cranberry spritzer' },
  
  // Beef
  'beef': { wine: 'Cabernet Sauvignon or Malbec', nonAlcoholic: 'Grape juice spritzer' },
  'steak': { wine: 'Cabernet Sauvignon or Syrah', nonAlcoholic: 'Pomegranate juice' },
  
  // Pork
  'pork': { wine: 'Riesling or Pinot Noir', nonAlcoholic: 'Apple juice spritzer' },
  
  // Vegetarian
  'pasta': { wine: 'Chianti or Sangiovese', nonAlcoholic: 'Sparkling grape juice' },
  'vegetarian': { wine: 'Sauvignon Blanc or light red', nonAlcoholic: 'Herbal iced tea' },
  'salad': { wine: 'Sauvignon Blanc or Rosé', nonAlcoholic: 'Cucumber water' },
  
  // Asian
  'asian': { wine: 'Riesling or Gewürztraminer', nonAlcoholic: 'Jasmine tea' },
  'thai': { wine: 'Off-dry Riesling', nonAlcoholic: 'Thai iced tea (no caffeine version)' },
  'indian': { wine: 'Gewürztraminer or Viognier', nonAlcoholic: 'Mango lassi' },
  
  // Mexican
  'mexican': { wine: 'Tempranillo or Albariño', nonAlcoholic: 'Agua fresca' },
  'taco': { wine: 'Rosé or Grenache', nonAlcoholic: 'Lime sparkling water' },
  
  // Mediterranean
  'mediterranean': { wine: 'Greek Assyrtiko or Spanish Albariño', nonAlcoholic: 'Mint lemonade' },
  'greek': { wine: 'Assyrtiko or Moschofilero', nonAlcoholic: 'Greek mountain tea' },
};

// =============================================
// SERVING SUGGESTIONS
// =============================================
const SERVING_SUGGESTIONS: Record<string, string> = {
  'BREAKFAST': 'Serve with fresh fruit and a glass of water. For extra protein, add a side of Greek yogurt.',
  'LUNCH': 'Pairs well with a simple side salad dressed with olive oil and lemon.',
  'DINNER': 'Complete the meal with steamed vegetables or a fresh green salad.',
  'SNACK': 'Perfect as an afternoon pick-me-up or pre/post workout snack.',
  'BEVERAGE': 'Best enjoyed fresh. Can be made ahead and stored in the refrigerator.',
};

// =============================================
// SCALING NOTES
// =============================================
const SCALING_NOTES: Record<string, string> = {
  'soup': 'Doubles well. For larger batches, increase cooking time slightly. Freezes well for up to 3 months.',
  'salad': 'Scales easily. Dress just before serving to keep greens fresh.',
  'stir-fry': 'Best made in batches - don\'t overcrowd the pan or ingredients will steam instead of sear.',
  'baked': 'Can be doubled using two pans. May need 5-10 extra minutes baking time for larger quantities.',
  'smoothie': 'Make one serving at a time for best texture. Prep ingredients in bags for quick blending.',
  'pasta': 'Sauce doubles well. Use a larger pot for more pasta but same water-to-pasta ratio.',
  'roasted': 'Use multiple sheet pans for larger batches - don\'t overcrowd or vegetables won\'t crisp.',
  'default': 'Recipe can be halved or doubled. Adjust seasonings to taste when scaling.',
};

// =============================================
// COMMON SUBSTITUTIONS
// =============================================
const COMMON_SUBSTITUTIONS: Array<{
  original: string;
  substitute: string;
  ratio: string;
  notes: string;
  forDairyFree?: boolean;
  forGlutenFree?: boolean;
  forVegan?: boolean;
  forNutFree?: boolean;
  forLowSodium?: boolean;
  forLowCarb?: boolean;
}> = [
  // Dairy-free
  { original: 'butter', substitute: 'coconut oil or vegan butter', ratio: '1:1', notes: 'Coconut oil works best for baking', forDairyFree: true, forVegan: true },
  { original: 'milk', substitute: 'unsweetened almond milk or oat milk', ratio: '1:1', notes: 'Oat milk is creamier', forDairyFree: true, forVegan: true },
  { original: 'heavy cream', substitute: 'full-fat coconut cream', ratio: '1:1', notes: 'Refrigerate can overnight, use solid part', forDairyFree: true, forVegan: true },
  { original: 'yogurt', substitute: 'coconut yogurt or cashew yogurt', ratio: '1:1', notes: 'Check for added sugars', forDairyFree: true, forVegan: true },
  { original: 'cheese', substitute: 'nutritional yeast or vegan cheese', ratio: '2 tbsp nutritional yeast per 1/4 cup cheese', notes: 'Nutritional yeast adds umami flavor', forDairyFree: true, forVegan: true },
  { original: 'parmesan', substitute: 'nutritional yeast', ratio: '1:1', notes: 'Add a pinch of salt', forDairyFree: true, forVegan: true },
  { original: 'sour cream', substitute: 'cashew cream or coconut cream', ratio: '1:1', notes: 'Add lemon juice for tang', forDairyFree: true, forVegan: true },
  
  // Gluten-free
  { original: 'flour', substitute: 'almond flour or gluten-free all-purpose', ratio: '1:1 for GF AP, 1:0.75 for almond flour', notes: 'May need xanthan gum for binding', forGlutenFree: true },
  { original: 'breadcrumbs', substitute: 'almond meal or crushed gluten-free crackers', ratio: '1:1', notes: 'Toast for extra crunch', forGlutenFree: true },
  { original: 'pasta', substitute: 'gluten-free pasta or zucchini noodles', ratio: '1:1', notes: 'GF pasta may need less cooking time', forGlutenFree: true },
  { original: 'soy sauce', substitute: 'tamari or coconut aminos', ratio: '1:1', notes: 'Coconut aminos is slightly sweeter', forGlutenFree: true },
  { original: 'bread', substitute: 'gluten-free bread or lettuce wraps', ratio: '1:1', notes: 'Toast GF bread for better texture', forGlutenFree: true },
  
  // Vegan (eggs)
  { original: 'egg', substitute: 'flax egg (1 tbsp ground flax + 3 tbsp water)', ratio: '1 egg = 1 flax egg', notes: 'Let sit 5 min to gel. Best for baking.', forVegan: true },
  { original: 'egg', substitute: 'chia egg (1 tbsp chia + 3 tbsp water)', ratio: '1 egg = 1 chia egg', notes: 'Let sit 5 min. Adds slight crunch.', forVegan: true },
  { original: 'honey', substitute: 'maple syrup or agave', ratio: '1:1', notes: 'Maple has stronger flavor', forVegan: true },
  
  // Nut-free
  { original: 'almond butter', substitute: 'sunflower seed butter or tahini', ratio: '1:1', notes: 'Sunflower butter may turn green in baked goods (harmless)', forNutFree: true },
  { original: 'almonds', substitute: 'pumpkin seeds or sunflower seeds', ratio: '1:1', notes: 'Toast for best flavor', forNutFree: true },
  { original: 'almond milk', substitute: 'oat milk or coconut milk', ratio: '1:1', notes: 'Check labels for nut cross-contamination', forNutFree: true },
  
  // Low-sodium
  { original: 'salt', substitute: 'herbs, lemon juice, or salt-free seasoning', ratio: 'To taste', notes: 'Build flavor with acid and aromatics', forLowSodium: true },
  { original: 'soy sauce', substitute: 'low-sodium soy sauce or coconut aminos', ratio: '1:1', notes: 'Coconut aminos has 73% less sodium', forLowSodium: true },
  { original: 'broth', substitute: 'low-sodium or homemade broth', ratio: '1:1', notes: 'Homemade allows salt control', forLowSodium: true },
  
  // Low-carb
  { original: 'rice', substitute: 'cauliflower rice', ratio: '1:1', notes: 'Squeeze out excess moisture', forLowCarb: true },
  { original: 'pasta', substitute: 'zucchini noodles or shirataki noodles', ratio: '1:1', notes: 'Don\'t overcook zucchini noodles', forLowCarb: true },
  { original: 'potato', substitute: 'cauliflower or turnip', ratio: '1:1', notes: 'Roast for best texture', forLowCarb: true },
  { original: 'bread', substitute: 'lettuce wraps or cloud bread', ratio: '1:1', notes: 'Butter lettuce works best for wraps', forLowCarb: true },
  { original: 'sugar', substitute: 'stevia, erythritol, or monk fruit', ratio: 'Varies - check package', notes: 'May need to adjust for sweetness level', forLowCarb: true },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k.toLowerCase()));
}

function estimateCost(ingredients: string[], category: string): { cost: number; level: CostLevel } {
  let baseCost = 4.0; // Base cost per serving
  
  // Adjust based on expensive ingredients
  const expensiveCount = ingredients.filter(ing => 
    EXPENSIVE_INGREDIENTS.some(e => ing.toLowerCase().includes(e))
  ).length;
  
  const budgetCount = ingredients.filter(ing =>
    BUDGET_INGREDIENTS.some(b => ing.toLowerCase().includes(b))
  ).length;
  
  baseCost += expensiveCount * 2.0;
  baseCost -= budgetCount * 0.5;
  
  // Category adjustments
  if (category.toLowerCase().includes('seafood')) baseCost += 2;
  if (category.toLowerCase().includes('vegetarian')) baseCost -= 1;
  
  // Clamp to reasonable range
  const cost = Math.max(2, Math.min(15, baseCost));
  
  let level: CostLevel = 'MEDIUM';
  if (cost < 3) level = 'BUDGET';
  else if (cost < 6) level = 'MEDIUM';
  else if (cost < 10) level = 'PREMIUM';
  else level = 'SPLURGE';
  
  return { cost: Math.round(cost * 100) / 100, level };
}

function determineEquipment(instructions: string[], ingredients: string[]): string[] {
  const equipment = new Set<string>();
  const combinedText = [...instructions, ...ingredients].join(' ').toLowerCase();
  
  for (const [equip, keywords] of Object.entries(EQUIPMENT_KEYWORDS)) {
    if (keywords.some(k => combinedText.includes(k))) {
      equipment.add(equip);
    }
  }
  
  // Always need basics
  if (combinedText.includes('chop') || combinedText.includes('dice') || combinedText.includes('slice')) {
    equipment.add('cutting-board');
    equipment.add('knife');
  }
  if (combinedText.includes('mix') || combinedText.includes('combine') || combinedText.includes('whisk')) {
    equipment.add('mixing-bowls');
  }
  
  return Array.from(equipment);
}

function estimateGlycemicIndex(ingredients: string[], carbs: number, fiber: number): { gi: number; gl: number } {
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  let baseGI = 50; // Start with medium
  
  // Adjust based on ingredients
  if (HIGH_GI_INGREDIENTS.some(i => ingredientText.includes(i))) {
    baseGI += 20;
  }
  if (MEDIUM_GI_INGREDIENTS.some(i => ingredientText.includes(i))) {
    baseGI += 5;
  }
  if (LOW_GI_INGREDIENTS.some(i => ingredientText.includes(i))) {
    baseGI -= 15;
  }
  
  // Fiber lowers GI
  baseGI -= fiber * 2;
  
  // Protein and fat lower GI
  if (ingredientText.includes('protein') || ingredientText.includes('meat') || 
      ingredientText.includes('fish') || ingredientText.includes('egg')) {
    baseGI -= 10;
  }
  
  // Clamp to valid range
  const gi = Math.max(10, Math.min(100, Math.round(baseGI)));
  
  // Calculate glycemic load: (GI x net carbs) / 100
  const netCarbs = Math.max(0, carbs - fiber);
  const gl = Math.round((gi * netCarbs) / 100 * 10) / 10;
  
  return { gi, gl };
}

function determineIodineLevel(ingredients: string[]): IodineLevel {
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  if (HIGH_IODINE_INGREDIENTS.some(i => ingredientText.includes(i))) {
    return 'HIGH';
  }
  
  // Check for multiple moderate sources
  const moderateSources = ['fish', 'dairy', 'egg'].filter(s => ingredientText.includes(s));
  if (moderateSources.length >= 2) {
    return 'MODERATE';
  }
  
  if (LOW_IODINE_INGREDIENTS.some(i => ingredientText.includes(i))) {
    return 'LOW';
  }
  
  return 'MODERATE';
}

function determineSeasons(ingredients: string[]): Season[] {
  const seasons = new Set<Season>();
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  for (const [ingredient, ingredientSeasons] of Object.entries(SEASONAL_INGREDIENTS)) {
    if (ingredientText.includes(ingredient)) {
      ingredientSeasons.forEach(s => seasons.add(s));
    }
  }
  
  // If no seasonal ingredients found, it's all-year
  if (seasons.size === 0) {
    return ['ALL_YEAR'];
  }
  
  return Array.from(seasons);
}

function getWinePairing(ingredients: string[], category: string, mealType: string): { wine: string; beverage: string } {
  const ingredientText = ingredients.join(' ').toLowerCase();
  const categoryLower = category.toLowerCase();
  
  // Check specific ingredients first
  for (const [key, pairing] of Object.entries(WINE_PAIRINGS)) {
    if (ingredientText.includes(key) || categoryLower.includes(key)) {
      return { wine: pairing.wine, beverage: pairing.nonAlcoholic };
    }
  }
  
  // Default by meal type
  if (mealType === 'BREAKFAST') {
    return { wine: 'Mimosa or Prosecco', beverage: 'Fresh orange juice or coffee' };
  }
  if (mealType === 'SNACK') {
    return { wine: 'Light white wine', beverage: 'Herbal tea or sparkling water' };
  }
  
  return { wine: 'Pairs well with your favorite wine', beverage: 'Sparkling water with citrus' };
}

function getServingSuggestion(mealType: string, category: string, ingredients: string[]): string {
  const base = SERVING_SUGGESTIONS[mealType] || SERVING_SUGGESTIONS['DINNER'];
  const extras: string[] = [];
  
  // Add specific suggestions based on recipe
  if (category.toLowerCase().includes('soup')) {
    extras.push('Serve with crusty bread or a grilled cheese sandwich.');
  }
  if (category.toLowerCase().includes('salad')) {
    extras.push('Top with grilled protein for a complete meal.');
  }
  if (category.toLowerCase().includes('asian') || category.toLowerCase().includes('stir')) {
    extras.push('Serve over steamed rice or cauliflower rice for low-carb.');
  }
  
  return extras.length > 0 ? `${base} ${extras.join(' ')}` : base;
}

function getScalingNotes(category: string, instructions: string[]): string {
  const instructionText = instructions.join(' ').toLowerCase();
  const categoryLower = category.toLowerCase();
  
  for (const [key, note] of Object.entries(SCALING_NOTES)) {
    if (categoryLower.includes(key) || instructionText.includes(key)) {
      return note;
    }
  }
  
  return SCALING_NOTES['default'];
}

// =============================================
// MAIN UPDATE FUNCTION
// =============================================

async function populateEnhancements() {
  console.log('🚀 Starting recipe enhancement population...\n');
  
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: { ingredient: true }
      },
      instructions: true,
      nutritionInfo: true,
    }
  });
  
  console.log(`📋 Found ${recipes.length} recipes to enhance\n`);
  
  let updated = 0;
  
  for (const recipe of recipes) {
    const ingredientNames = recipe.ingredients.map(ri => ri.ingredient.name);
    const instructionTexts = recipe.instructions.map(i => i.instruction);
    
    // 1. Cost estimation
    const { cost, level } = estimateCost(ingredientNames, recipe.category);
    
    // 2. Equipment
    const equipment = determineEquipment(instructionTexts, ingredientNames);
    
    // 3. Glycemic index/load
    const carbs = recipe.nutritionInfo?.carbohydrates || 0;
    const fiber = recipe.nutritionInfo?.fiber || 0;
    const { gi, gl } = estimateGlycemicIndex(ingredientNames, carbs, fiber);
    
    // 4. Iodine level
    const iodineLevel = determineIodineLevel(ingredientNames);
    
    // 5. Seasonal availability
    const seasons = determineSeasons(ingredientNames);
    
    // 6. Wine pairing
    const { wine, beverage } = getWinePairing(ingredientNames, recipe.category, recipe.mealType);
    
    // 7. Serving suggestions
    const servingSuggestions = getServingSuggestion(recipe.mealType, recipe.category, ingredientNames);
    
    // 8. Scaling notes
    const scalingNotes = getScalingNotes(recipe.category, instructionTexts);
    
    // 9. Net carbs
    const netCarbs = Math.max(0, carbs - fiber);
    
    // Update recipe
    await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        costPerServing: cost,
        costLevel: level,
        equipment,
        iodineLevel,
        seasonalAvailability: seasons,
        winePairing: wine,
        beveragePairing: beverage,
        servingSuggestions,
        scalingNotes,
        minServings: Math.max(1, Math.floor(recipe.servings / 2)),
        maxServings: recipe.servings * 3,
      }
    });
    
    // Update nutrition with glycemic data and net carbs
    if (recipe.nutritionInfo) {
      await prisma.nutritionInfo.update({
        where: { id: recipe.nutritionInfo.id },
        data: {
          glycemicIndex: gi,
          glycemicLoad: gl,
          netCarbs,
        }
      });
    }
    
    updated++;
    if (updated % 25 === 0) {
      console.log(`📝 Updated ${updated}/${recipes.length} recipes...`);
    }
  }
  
  // Add common substitutions for all recipes
  console.log('\n📦 Adding ingredient substitutions...');
  
  for (const recipe of recipes) {
    const ingredientNames = recipe.ingredients.map(ri => ri.ingredient.name.toLowerCase());
    
    for (const sub of COMMON_SUBSTITUTIONS) {
      // Check if this recipe uses the original ingredient
      if (ingredientNames.some(ing => ing.includes(sub.original.toLowerCase()))) {
        await prisma.ingredientSubstitution.create({
          data: {
            recipeId: recipe.id,
            originalIngredient: sub.original,
            substituteIngredient: sub.substitute,
            substitutionRatio: sub.ratio,
            notes: sub.notes,
            forDairyFree: sub.forDairyFree || false,
            forGlutenFree: sub.forGlutenFree || false,
            forVegan: sub.forVegan || false,
            forNutFree: sub.forNutFree || false,
            forLowSodium: sub.forLowSodium || false,
            forLowCarb: sub.forLowCarb || false,
          }
        });
      }
    }
  }
  
  console.log(`\n✅ Enhancement complete!`);
  console.log(`   Updated: ${updated} recipes`);
  
  // Show sample
  const sample = await prisma.recipe.findFirst({
    include: {
      nutritionInfo: true,
      substitutions: true,
    }
  });
  
  console.log(`\n📊 Sample enhanced recipe: ${sample?.name}`);
  console.log(`   Cost: $${sample?.costPerServing} (${sample?.costLevel})`);
  console.log(`   Equipment: ${sample?.equipment?.join(', ')}`);
  console.log(`   Iodine Level: ${sample?.iodineLevel}`);
  console.log(`   Seasons: ${sample?.seasonalAvailability?.join(', ')}`);
  console.log(`   Wine: ${sample?.winePairing}`);
  console.log(`   GI: ${sample?.nutritionInfo?.glycemicIndex}, GL: ${sample?.nutritionInfo?.glycemicLoad}`);
  console.log(`   Net Carbs: ${sample?.nutritionInfo?.netCarbs}g`);
  console.log(`   Substitutions: ${sample?.substitutions?.length || 0}`);
  
  await prisma.$disconnect();
}

populateEnhancements().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});

