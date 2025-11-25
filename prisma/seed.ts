import { PrismaClient } from "@prisma/client";
import { allRecipes } from "../src/data/recipes";
import { recipeDetails } from "../src/data/recipe-details";

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

  // Create health tags
  const healthTags = [
    { name: "Omega-3 Rich", slug: "omega-3-rich", description: "High in omega-3 fatty acids", color: "#87a878" },
    { name: "High Fiber", slug: "high-fiber", description: "Excellent source of dietary fiber", color: "#588873" },
    { name: "Heart Healthy", slug: "heart-healthy", description: "Supports cardiovascular health", color: "#d64545" },
    { name: "Anti-inflammatory", slug: "anti-inflammatory", description: "Reduces inflammation", color: "#c4846c" },
    { name: "Kid-Friendly", slug: "kid-friendly", description: "Great for children", color: "#aa6651" },
    { name: "Graves-Friendly", slug: "graves-friendly", description: "Suitable for Graves Disease", color: "#6a8a5c" },
    { name: "Cholesterol-Friendly", slug: "cholesterol-friendly", description: "Helps manage cholesterol", color: "#87a878" },
    { name: "Blood Sugar Balance", slug: "blood-sugar-balance", description: "Supports stable blood sugar", color: "#588873" },
  ];

  const createdHealthTags: Record<string, string> = {};
  for (const tag of healthTags) {
    const created = await prisma.healthTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    createdHealthTags[tag.slug] = created.id;
    console.log(`✅ Created health tag: ${tag.name}`);
  }

  // Create dietary tags
  const dietaryTags = [
    { name: "Gluten-Free", slug: "gluten-free", description: "Contains no gluten", icon: "GF" },
    { name: "Dairy-Free", slug: "dairy-free", description: "Contains no dairy", icon: "DF" },
    { name: "Vegetarian", slug: "vegetarian", description: "Suitable for vegetarians", icon: "V" },
    { name: "Vegan", slug: "vegan", description: "Suitable for vegans", icon: "VG" },
    { name: "Pescatarian", slug: "pescatarian", description: "Contains fish/seafood", icon: "P" },
  ];

  const createdDietaryTags: Record<string, string> = {};
  for (const tag of dietaryTags) {
    const created = await prisma.dietaryTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    createdDietaryTags[tag.slug] = created.id;
    console.log(`✅ Created dietary tag: ${tag.name}`);
  }

  // Create or update ingredients as we encounter them
  const ingredientCache: Record<string, string> = {};

  async function getOrCreateIngredient(name: string, category: string): Promise<string> {
    if (ingredientCache[name]) {
      return ingredientCache[name];
    }

    const slug = slugify(name);
    const ingredient = await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: {
        name,
        category: category as any, // Map to IngredientCategory enum
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
          { name: "Mike", ageGroup: "ADULT" },
          { name: "Daughter", ageGroup: "CHILD" },
          { name: "Son", ageGroup: "PRESCHOOL" },
          { name: "Baby", ageGroup: "INFANT" },
        ],
      },
    },
  });

  console.log(`✅ Created user: ${christine.name}`);

  // Create Recipes
  let recipeCount = 0;
  for (const recipeData of allRecipes) {
    const details = recipeDetails[recipeData.id];
    const slug = recipeData.id || slugify(recipeData.name);

    // Map health tags
    const healthTagIds: string[] = [];
    if (recipeData.hasOmega3) healthTagIds.push(createdHealthTags["omega-3-rich"]);
    if (recipeData.hasHighFiber) healthTagIds.push(createdHealthTags["high-fiber"]);
    if (recipeData.isHeartHealthy) healthTagIds.push(createdHealthTags["heart-healthy"]);
    if (recipeData.isAntiInflammatory) healthTagIds.push(createdHealthTags["anti-inflammatory"]);
    if (recipeData.isKidFriendly) healthTagIds.push(createdHealthTags["kid-friendly"]);
    if (recipeData.healthBenefits.toLowerCase().includes("graves")) {
      healthTagIds.push(createdHealthTags["graves-friendly"]);
    }
    if (recipeData.healthBenefits.toLowerCase().includes("cholesterol")) {
      healthTagIds.push(createdHealthTags["cholesterol-friendly"]);
    }

    // Create recipe
    const recipe = await prisma.recipe.create({
      data: {
        slug,
        name: recipeData.name,
        description: recipeData.description,
        mealType: recipeData.mealType as any,
        category: recipeData.category,
        prepTimeMinutes: recipeData.prepTime || details?.prepTime || 15,
        cookTimeMinutes: recipeData.cookTime || details?.cookTime || 15,
        totalTimeMinutes: recipeData.totalTime || (recipeData.prepTime || 15) + (recipeData.cookTime || 15),
        imageUrl: null, // Will be populated when images are generated and stored in Vercel Blob
        servings: recipeData.servings || details?.servings || 4,
        difficulty: details?.difficulty === "Hard" ? "HARD" : details?.difficulty === "Medium" ? "MEDIUM" : "EASY",
        imageUrl: recipeData.imageUrl,
        healthBenefits: recipeData.healthBenefits,
        isKidFriendly: recipeData.isKidFriendly || false,
        isMakeAhead: recipeData.isMakeAhead || false,
        isOnePot: recipeData.isOnePot || false,
        isQuick: recipeData.isQuick || (recipeData.totalTime ? recipeData.totalTime <= 30 : false),
        isBudgetFriendly: false, // Could be inferred later

        // Ingredients - create ingredients first, then link
        ingredients: {
          create: await (async () => {
            const ingredientData = [];
            for (let idx = 0; idx < (details?.ingredients || []).length; idx++) {
              const ing = details!.ingredients[idx];
              const ingredientId = await getOrCreateIngredient(ing.name, "OTHER");
              ingredientData.push({
                ingredientId,
                amount: parseFloat(ing.amount) || 0,
                unit: ing.unit,
                preparation: ing.preparation,
                orderIndex: idx,
              });
            }
            return ingredientData;
          })(),
        },

        // Instructions
        instructions: {
          create: details?.instructions.map((inst, idx) => ({
            stepNumber: idx + 1,
            instruction: inst,
          })) || [],
        },

        // Nutrition Info
        nutritionInfo: details?.nutrition ? {
          create: {
            calories: details.nutrition.calories,
            protein: details.nutrition.protein,
            carbohydrates: details.nutrition.carbs,
            fiber: details.nutrition.fiber,
            sugar: 0, // Required field - not in source data yet
            fat: details.nutrition.fat,
            saturatedFat: 0, // Would need actual data
            cholesterol: 0,
            sodium: details.nutrition.sodium || 0,
            omega3: recipeData.hasOmega3 ? 1.5 : null, // Estimate
          },
        } : undefined,

        // Health Tags
        healthTags: {
          create: healthTagIds.map(tagId => ({
            healthTagId: tagId,
          })),
        },

        // Tips
        tips: details?.tips ? {
          create: details.tips.map((tip, idx) => ({
            tipType: "PREP_TIP",
            content: tip,
            orderIndex: idx,
          })),
        } : undefined,
      },
    });

    recipeCount++;
    if (recipeCount % 10 === 0) {
      console.log(`📝 Created ${recipeCount} recipes...`);
    }
  }

  console.log(`✅ Created ${recipeCount} recipes total`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
