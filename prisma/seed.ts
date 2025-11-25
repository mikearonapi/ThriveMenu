import { PrismaClient } from "@prisma/client";
import { allRecipes } from "../src/data/recipes";
import { recipeDetails } from "../src/data/recipe-details";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create default user (Christine)
  const christine = await prisma.user.upsert({
    where: { email: "christine@thrivemenu.com" },
    update: {},
    create: {
      email: "christine@thrivemenu.com",
      name: "Christine",
      password: "$2a$10$thrive123hashedplaceholder", // In real app, use bcrypt
      preferences: {
        create: {
          healthGoals: ["Graves Disease", "High Cholesterol", "Blood Sugar Balance"],
          dietaryRestrictions: [],
          favoriteCuisines: ["Mediterranean"],
        },
      },
      familyMembers: {
        create: [
          { name: "Mike", age: 35, dietaryNotes: "Husband" },
          { name: "Daughter", age: 6, dietaryNotes: "Picky eater" },
          { name: "Son", age: 4, dietaryNotes: "No spicy foods" },
          { name: "Baby", age: 0, dietaryNotes: "Starting solids" },
        ],
      },
    },
  });

  console.log(`Created user: ${christine.name}`);

  // Create Recipes
  for (const recipeData of allRecipes) {
    const details = recipeDetails[recipeData.id];
    
    // Map health tags
    const healthTags = [];
    if (recipeData.isHeartHealthy) healthTags.push("Heart-Healthy");
    if (recipeData.isAntiInflammatory) healthTags.push("Anti-inflammatory");
    if (recipeData.hasOmega3) healthTags.push("Omega-3 Rich");
    if (recipeData.hasHighFiber) healthTags.push("High Fiber");
    if (recipeData.isKidFriendly) healthTags.push("Kid-Friendly");
    if (recipeData.healthBenefits.includes("Graves")) healthTags.push("Graves-Friendly");

    const recipe = await prisma.recipe.create({
      data: {
        id: recipeData.id,
        title: recipeData.name,
        description: recipeData.description,
        imageUrl: recipeData.imageUrl, // In real app, this would be the Unsplash URL
        prepTime: recipeData.prepTime || details?.prepTime || 15,
        cookTime: recipeData.cookTime || details?.cookTime || 15,
        servings: recipeData.servings || details?.servings || 4,
        difficulty: details?.difficulty || "Easy",
        mealType: [recipeData.mealType], // Array in schema
        healthTags: healthTags,
        cuisine: "General", // Could infer from name
        
        // Ingredients
        ingredients: {
          create: details?.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.amount,
            unit: ing.unit,
            notes: ing.preparation,
          })) || [],
        },

        // Instructions
        instructions: {
          create: details?.instructions.map((inst, idx) => ({
            stepNumber: idx + 1,
            description: inst,
          })) || [],
        },

        // Nutrition
        nutritionInfo: details?.nutrition ? {
          create: {
            calories: details.nutrition.calories,
            protein: details.nutrition.protein,
            carbs: details.nutrition.carbs,
            fat: details.nutrition.fat,
            fiber: details.nutrition.fiber,
            sodium: details.nutrition.sodium,
          }
        } : undefined,
      },
    });
    console.log(`Created recipe: ${recipe.title}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

