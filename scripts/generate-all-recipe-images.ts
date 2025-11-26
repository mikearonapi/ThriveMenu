/**
 * Batch script to generate images for all recipes and update database
 * 
 * Usage:
 *   npm run generate-images
 * 
 * This script will:
 * 1. Fetch all recipes from the database
 * 2. Generate/fetch high-quality food images
 * 3. Upload to Vercel Blob Storage
 * 4. Update database with Vercel Blob URLs
 * 
 * Prerequisites:
 * - BLOB_READ_WRITE_TOKEN must be set in .env
 * - DATABASE_URL must be set in .env
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from "@prisma/client";
import { generateAndStoreRecipeImage } from "../src/lib/images";

// Initialize Prisma with explicit connection for the script
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['info', 'warn', 'error'],
});

async function generateAllRecipeImages() {
  console.log("🚀 Starting batch image generation for all recipes...\n");
  
  // Check required environment variables
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ ERROR: BLOB_READ_WRITE_TOKEN is not set in environment variables.");
    console.error("   Please set it in your .env.local or .env file.");
    console.error("   Get your token from: Vercel Dashboard → Your Project → Storage → Blob → Settings\n");
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is not set in environment variables.");
    console.error("   Please set it in your .env.local or .env file.\n");
    process.exit(1);
  }
  
  console.log("✅ Environment variables loaded\n");

  try {
    // Fetch all recipes from database with additional context for better image generation
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        imageUrl: true,
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true,
              },
            },
          },
        },
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

      // Skip if image already exists in Vercel Blob (unless regenerating)
      // Set REGENERATE_ALL=true in env to regenerate all images
      const shouldRegenerate = process.env.REGENERATE_ALL === 'true';
      if (!shouldRegenerate && recipe.imageUrl && recipe.imageUrl.includes("blob.vercel-storage.com")) {
        console.log(`${progress} ⏭️  Skipping ${recipe.name} - already has Vercel Blob image`);
        results.skipped++;
        continue;
      }

      try {
        console.log(`${progress} 🎨 Generating image for: ${recipe.name}`);

        // Generate and store image in Vercel Blob with recipe context
        const ingredientNames = recipe.ingredients?.map(ri => ri.ingredient.name).slice(0, 5) || [];
        
        const blobUrl = await generateAndStoreRecipeImage(
          recipe.id,
          recipe.name,
          recipe.category,
          recipe.description,
          ingredientNames
        );

        // Update database with Vercel Blob URL
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl: blobUrl },
        });

        console.log(`   ✅ Success: ${blobUrl}\n`);
        results.success++;
        results.updated++;

        // Rate limiting - wait 7 seconds between requests to stay under 10 RPM limit
        // Gemini 2.0 Flash Preview Image Generation has 10 RPM limit on Tier 1
        if (i < recipes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 7000));
        }
      } catch (error) {
        console.error(
          `   ❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}\n`
        );
        results.failed++;
        
        // If Vercel Blob upload fails, we still want to continue with other recipes
        // The error is logged, and we can retry later
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

