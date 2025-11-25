/**
 * Batch script to generate images for all recipes and update database
 * 
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/generate-all-recipe-images.ts
 * 
 * This script will:
 * 1. Fetch all recipes from the database
 * 2. Generate images using Gemini API (or Unsplash placeholder)
 * 3. Upload to Vercel Blob
 * 4. Update database with Vercel Blob URLs
 */

import { PrismaClient } from "@prisma/client";
import { generateAndStoreRecipeImage } from "../src/lib/images";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
    },
  },
});

async function generateAllRecipeImages() {
  console.log("🚀 Starting batch image generation for all recipes...\n");

  try {
    // Fetch all recipes from database
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        imageUrl: true,
      },
      orderBy: { createdAt: "asc" },
    });

    console.log(`📋 Found ${recipes.length} recipes in database\n`);

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      updated: 0,
    };

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const progress = `[${i + 1}/${recipes.length}]`;

      // Skip if image already exists (unless you want to regenerate)
      if (recipe.imageUrl && recipe.imageUrl.includes("blob.vercel-storage.com")) {
        console.log(`${progress} ⏭️  Skipping ${recipe.name} - already has Vercel Blob image`);
        results.skipped++;
        continue;
      }

      try {
        console.log(`${progress} 🎨 Generating image for: ${recipe.name}`);

        // Generate and store image in Vercel Blob
        const blobUrl = await generateAndStoreRecipeImage(
          recipe.id,
          recipe.name,
          recipe.category
        );

        // Update database with Vercel Blob URL
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl: blobUrl },
        });

        console.log(`   ✅ Success: ${blobUrl}\n`);
        results.success++;
        results.updated++;

        // Rate limiting - wait 1 second between requests to avoid API limits
        if (i < recipes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(
          `   ❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}\n`
        );
        results.failed++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   🔄 Updated: ${results.updated}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`\n🎉 Image generation complete!`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateAllRecipeImages();

