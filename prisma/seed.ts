import { PrismaClient } from "@prisma/client";
import { allRecipes } from "../src/data/recipes";
import { recipeDetails } from "../src/data/recipe-details";
import { analyzeRecipe } from "../src/lib/dietary-analysis";

// Use direct connection for seeding (bypasses connection pooling)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
    },
  },
});

// Helper to generate slug
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Starting ThriveMenu database seeding...");
  console.log(`📊 Found ${allRecipes.length} recipes to seed`);

  // Clear existing recipe data first (to handle re-seeding)
  console.log("🧹 Clearing existing recipe data...");
  await prisma.recipeTip.deleteMany({});
  await prisma.recipeHealthTag.deleteMany({});
  await prisma.recipeDietaryTag.deleteMany({});
  await prisma.recipeInstruction.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.nutritionInfo.deleteMany({});
  await prisma.recipe.deleteMany({});
  
  // Also clear tags to recreate with new definitions
  await prisma.healthTag.deleteMany({});
  await prisma.dietaryTag.deleteMany({});
  
  console.log("✅ Cleared existing recipes and tags");

  // =============================================
  // HEALTH TAGS - Comprehensive list
  // =============================================
  const healthTags = [
    // Nutrient-based
    { name: "Omega-3 Rich", slug: "omega-3-rich", description: "High in omega-3 fatty acids for heart and brain health", color: "#87a878" },
    { name: "High Fiber", slug: "high-fiber", description: "Excellent source of dietary fiber (≥5g per serving)", color: "#588873" },
    { name: "High Protein", slug: "high-protein", description: "Excellent source of protein (≥20g per serving)", color: "#6b8a63" },
    { name: "Selenium Rich", slug: "selenium-rich", description: "High in selenium for thyroid health", color: "#7a9a6c" },
    
    // Health condition-focused
    { name: "Heart Healthy", slug: "heart-healthy", description: "Supports cardiovascular health - low sat fat, sodium, high fiber", color: "#d64545" },
    { name: "Anti-inflammatory", slug: "anti-inflammatory", description: "Contains anti-inflammatory ingredients like turmeric, ginger, omega-3s", color: "#c4846c" },
    { name: "Graves-Friendly", slug: "graves-friendly", description: "Suitable for Graves Disease management", color: "#6a8a5c" },
    { name: "Cholesterol-Friendly", slug: "cholesterol-friendly", description: "Helps manage cholesterol levels", color: "#87a878" },
    { name: "Blood Sugar Balance", slug: "blood-sugar-balance", description: "Supports stable blood sugar - low carb, high fiber", color: "#588873" },
    
    // Nutrition limits
    { name: "Low Saturated Fat", slug: "low-saturated-fat", description: "Less than 3g saturated fat per serving", color: "#e8a87c" },
    { name: "Low Sodium", slug: "low-sodium", description: "Less than 600mg sodium per serving", color: "#c38d9e" },
    { name: "Low Carb", slug: "low-carb", description: "Less than 20g carbohydrates per serving", color: "#41b3a3" },
    { name: "Low Calorie", slug: "low-calorie", description: "Less than 300 calories per serving", color: "#e27d60" },
    
    // Lifestyle
    { name: "Kid-Friendly", slug: "kid-friendly", description: "Great for children - mild flavors, familiar textures", color: "#aa6651" },
    { name: "Budget-Friendly", slug: "budget-friendly", description: "Uses affordable, accessible ingredients", color: "#85dcb0" },
    { name: "Quick & Easy", slug: "quick-easy", description: "Ready in 30 minutes or less", color: "#e8b4b8" },
    { name: "Make-Ahead", slug: "make-ahead", description: "Can be prepared in advance", color: "#a8d8ea" },
    { name: "One-Pot", slug: "one-pot", description: "Minimal cleanup - cooks in a single pot or pan", color: "#aa96da" },
  ];

  const createdHealthTags: Record<string, string> = {};
  for (const tag of healthTags) {
    const created = await prisma.healthTag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
    createdHealthTags[tag.slug] = created.id;
  }
  console.log(`✅ Created ${healthTags.length} health tags`);

  // =============================================
  // DIETARY TAGS - Comprehensive list
  // =============================================
  const dietaryTags = [
    // Allergen-free
    { name: "Gluten-Free", slug: "gluten-free", description: "Contains no gluten (wheat, barley, rye)", icon: "🌾" },
    { name: "Dairy-Free", slug: "dairy-free", description: "Contains no dairy products", icon: "🥛" },
    { name: "Egg-Free", slug: "egg-free", description: "Contains no eggs", icon: "🥚" },
    { name: "Nut-Free", slug: "nut-free", description: "Contains no tree nuts", icon: "🥜" },
    { name: "Soy-Free", slug: "soy-free", description: "Contains no soy products", icon: "🫘" },
    { name: "Shellfish-Free", slug: "shellfish-free", description: "Contains no shellfish", icon: "🦐" },
    
    // Diet types
    { name: "Vegetarian", slug: "vegetarian", description: "No meat or fish - may contain eggs and dairy", icon: "🥬" },
    { name: "Vegan", slug: "vegan", description: "No animal products whatsoever", icon: "🌱" },
    { name: "Pescatarian", slug: "pescatarian", description: "Contains fish/seafood, no other meat", icon: "🐟" },
    
    // Specialty diets
    { name: "Nightshade-Free", slug: "nightshade-free", description: "No tomatoes, peppers, potatoes, or eggplant", icon: "🍅" },
    { name: "Low-FODMAP", slug: "low-fodmap", description: "Low in fermentable carbohydrates", icon: "💚" },
    { name: "Paleo-Friendly", slug: "paleo-friendly", description: "Compatible with paleo diet principles", icon: "🦴" },
    { name: "Whole30", slug: "whole30", description: "Compatible with Whole30 program", icon: "✅" },
    { name: "Keto-Friendly", slug: "keto-friendly", description: "Very low carb, high fat - suitable for ketogenic diet", icon: "🥑" },
    { name: "Mediterranean", slug: "mediterranean", description: "Follows Mediterranean diet principles", icon: "🫒" },
  ];

  const createdDietaryTags: Record<string, string> = {};
  for (const tag of dietaryTags) {
    const created = await prisma.dietaryTag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
    createdDietaryTags[tag.slug] = created.id;
  }
  console.log(`✅ Created ${dietaryTags.length} dietary tags`);

  // Create or update ingredients as we encounter them
  const ingredientCache: Record<string, string> = {};

  async function getOrCreateIngredient(name: string, category: string): Promise<string> {
    if (ingredientCache[name]) {
      return ingredientCache[name];
    }

    const ingredient = await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: {
        name,
        category: category as any,
      },
    });

    ingredientCache[name] = ingredient.id;
    return ingredient.id;
  }

  // Create default user (Christine)
  const christine = await prisma.user.upsert({
    where: { email: "christine@thrivemenu.com" },
    update: {},
    create: {
      email: "christine@thrivemenu.com",
      name: "Christine",
      preferences: {
        create: {
          hasGravesDisease: true,
          hasHighCholesterol: true,
          hasDiabetesRisk: true,
          servingsDefault: 4,
        },
      },
      familyMembers: {
        create: [
          { name: "Mike", ageGroup: "ADULT", isVegetarian: false, allergies: [], dislikes: [] },
          { name: "Daughter", ageGroup: "CHILD", isVegetarian: false, allergies: [], dislikes: [] },
          { name: "Son", ageGroup: "PRESCHOOL", isVegetarian: false, allergies: [], dislikes: [] },
          { name: "Baby", ageGroup: "INFANT", isVegetarian: false, allergies: [], dislikes: [] },
        ],
      },
    },
  });
  console.log(`✅ User ready: ${christine.name}`);

  // =============================================
  // CREATE RECIPES WITH DIETARY ANALYSIS
  // =============================================
  let recipeCount = 0;
  let withDetails = 0;
  let withoutDetails = 0;
  
  // Track tag statistics
  const tagStats: Record<string, number> = {};

  for (const recipeData of allRecipes) {
    const details = recipeDetails[recipeData.id];
    const slug = recipeData.id || slugify(recipeData.name);

    if (details) {
      withDetails++;
    } else {
      withoutDetails++;
    }

    try {
      // =============================================
      // ANALYZE RECIPE FOR DIETARY TAGS
      // =============================================
      const ingredients = details?.ingredients || [];
      const nutrition = details?.nutrition ? {
        calories: details.nutrition.calories,
        protein: details.nutrition.protein,
        carbs: details.nutrition.carbs,
        fat: details.nutrition.fat,
        fiber: details.nutrition.fiber,
        sodium: details.nutrition.sodium,
        saturatedFat: 0, // We'll estimate based on recipe type
        sugar: 0,
      } : null;
      
      // Get recipe flags from the recipe data
      const recipeFlags = {
        hasOmega3: recipeData.hasOmega3,
        hasHighFiber: recipeData.hasHighFiber,
        isHeartHealthy: recipeData.isHeartHealthy,
        isAntiInflammatory: recipeData.isAntiInflammatory,
        isKidFriendly: recipeData.isKidFriendly,
        hasSelenium: recipeData.hasSelenium,
      };
      
      // Run comprehensive analysis
      const analysis = analyzeRecipe(ingredients, nutrition, recipeFlags);

      // =============================================
      // BUILD HEALTH TAG IDS
      // =============================================
      const healthTagIds: string[] = [];
      
      // Add nutrition-based health tags
      for (const slug of analysis.healthTagSlugs) {
        if (createdHealthTags[slug]) {
          healthTagIds.push(createdHealthTags[slug]);
          tagStats[slug] = (tagStats[slug] || 0) + 1;
        }
      }
      
      // Add recipe description-based health tags
      if (recipeData.healthBenefits?.toLowerCase().includes("graves")) {
        if (createdHealthTags["graves-friendly"]) {
          healthTagIds.push(createdHealthTags["graves-friendly"]);
          tagStats["graves-friendly"] = (tagStats["graves-friendly"] || 0) + 1;
        }
      }
      if (recipeData.healthBenefits?.toLowerCase().includes("cholesterol")) {
        if (createdHealthTags["cholesterol-friendly"]) {
          healthTagIds.push(createdHealthTags["cholesterol-friendly"]);
          tagStats["cholesterol-friendly"] = (tagStats["cholesterol-friendly"] || 0) + 1;
        }
      }
      
      // Add lifestyle health tags
      if (recipeData.isQuick || (recipeData.totalTime && recipeData.totalTime <= 30)) {
        if (createdHealthTags["quick-easy"]) {
          healthTagIds.push(createdHealthTags["quick-easy"]);
          tagStats["quick-easy"] = (tagStats["quick-easy"] || 0) + 1;
        }
      }
      if (recipeData.isMakeAhead) {
        if (createdHealthTags["make-ahead"]) {
          healthTagIds.push(createdHealthTags["make-ahead"]);
          tagStats["make-ahead"] = (tagStats["make-ahead"] || 0) + 1;
        }
      }
      if (recipeData.isOnePot) {
        if (createdHealthTags["one-pot"]) {
          healthTagIds.push(createdHealthTags["one-pot"]);
          tagStats["one-pot"] = (tagStats["one-pot"] || 0) + 1;
        }
      }

      // =============================================
      // BUILD DIETARY TAG IDS
      // =============================================
      const dietaryTagIds: string[] = [];
      
      // Add ingredient-based dietary tags
      for (const slug of analysis.dietaryTagSlugs) {
        if (createdDietaryTags[slug]) {
          dietaryTagIds.push(createdDietaryTags[slug]);
          tagStats[`diet:${slug}`] = (tagStats[`diet:${slug}`] || 0) + 1;
        }
      }
      
      // Add category-based tags
      if (recipeData.category.toLowerCase().includes("mediterranean") || 
          recipeData.name.toLowerCase().includes("mediterranean") ||
          recipeData.name.toLowerCase().includes("greek")) {
        if (createdDietaryTags["mediterranean"]) {
          dietaryTagIds.push(createdDietaryTags["mediterranean"]);
          tagStats["diet:mediterranean"] = (tagStats["diet:mediterranean"] || 0) + 1;
        }
      }
      
      // Keto-friendly check (low carb, moderate/high protein)
      if (nutrition && nutrition.carbs < 15 && nutrition.protein >= 15) {
        if (createdDietaryTags["keto-friendly"]) {
          dietaryTagIds.push(createdDietaryTags["keto-friendly"]);
          tagStats["diet:keto-friendly"] = (tagStats["diet:keto-friendly"] || 0) + 1;
        }
      }

      // =============================================
      // BUILD INGREDIENT DATA
      // =============================================
      const ingredientData = [];
      if (details?.ingredients) {
        for (let idx = 0; idx < details.ingredients.length; idx++) {
          const ing = details.ingredients[idx];
          const ingredientId = await getOrCreateIngredient(ing.name, "OTHER");
          ingredientData.push({
            ingredientId,
            amount: parseFloat(ing.amount) || 0,
            unit: ing.unit || "",
            preparation: ing.preparation || null,
            orderIndex: idx,
          });
        }
      }

      // =============================================
      // CREATE RECIPE
      // =============================================
      await prisma.recipe.create({
        data: {
          slug,
          name: recipeData.name,
          description: recipeData.description,
          mealType: recipeData.mealType as any,
          category: recipeData.category,
          prepTimeMinutes: recipeData.prepTime || details?.prepTime || 15,
          cookTimeMinutes: recipeData.cookTime || details?.cookTime || 15,
          totalTimeMinutes: recipeData.totalTime || (recipeData.prepTime || 15) + (recipeData.cookTime || 15),
          servings: recipeData.servings || details?.servings || 4,
          difficulty: details?.difficulty === "Hard" ? "HARD" : details?.difficulty === "Medium" ? "MEDIUM" : "EASY",
          imageUrl: recipeData.imageUrl || null,
          healthBenefits: recipeData.healthBenefits,
          isKidFriendly: recipeData.isKidFriendly || false,
          isMakeAhead: recipeData.isMakeAhead || false,
          isOnePot: recipeData.isOnePot || false,
          isQuick: recipeData.isQuick || (recipeData.totalTime ? recipeData.totalTime <= 30 : false),
          isBudgetFriendly: false,

          // Ingredients
          ingredients: ingredientData.length > 0 ? {
            create: ingredientData,
          } : undefined,

          // Instructions
          instructions: details?.instructions ? {
            create: details.instructions.map((inst, idx) => ({
              stepNumber: idx + 1,
              instruction: inst,
            })),
          } : undefined,

          // Nutrition Info
          nutritionInfo: details?.nutrition ? {
            create: {
              calories: details.nutrition.calories || 0,
              protein: details.nutrition.protein || 0,
              carbohydrates: details.nutrition.carbs || 0,
              fiber: details.nutrition.fiber || 0,
              sugar: 0,
              fat: details.nutrition.fat || 0,
              saturatedFat: 0,
              cholesterol: 0,
              sodium: details.nutrition.sodium || 0,
              omega3: recipeData.hasOmega3 ? 1.5 : null,
            },
          } : undefined,

          // Health Tags
          healthTags: healthTagIds.length > 0 ? {
            create: [...new Set(healthTagIds)].map(tagId => ({
              healthTagId: tagId,
            })),
          } : undefined,

          // Dietary Tags
          dietaryTags: dietaryTagIds.length > 0 ? {
            create: [...new Set(dietaryTagIds)].map(tagId => ({
              dietaryTagId: tagId,
            })),
          } : undefined,

          // Tips
          tips: details?.tips ? {
            create: details.tips.map((tip, idx) => ({
              tipType: "PREP_TIP" as any,
              content: tip,
              orderIndex: idx,
            })),
          } : undefined,
        },
      });

      recipeCount++;
      if (recipeCount % 25 === 0) {
        console.log(`📝 Created ${recipeCount}/${allRecipes.length} recipes...`);
      }
    } catch (error) {
      console.error(`❌ Error creating recipe: ${recipeData.name}`, error);
    }
  }

  // =============================================
  // PRINT STATISTICS
  // =============================================
  console.log(`\n🎉 Seeding completed!`);
  console.log(`✅ Created ${recipeCount} recipes total`);
  console.log(`   - ${withDetails} recipes with full details (ingredients, instructions, nutrition)`);
  console.log(`   - ${withoutDetails} recipes without details`);
  
  console.log(`\n📊 Tag Statistics:`);
  console.log(`\n   HEALTH TAGS:`);
  const healthTagNames = healthTags.map(t => t.slug);
  for (const slug of healthTagNames) {
    const count = tagStats[slug] || 0;
    if (count > 0) {
      console.log(`   - ${slug}: ${count} recipes`);
    }
  }
  
  console.log(`\n   DIETARY TAGS:`);
  const dietaryTagNames = dietaryTags.map(t => t.slug);
  for (const slug of dietaryTagNames) {
    const count = tagStats[`diet:${slug}`] || 0;
    if (count > 0) {
      console.log(`   - ${slug}: ${count} recipes`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
