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
 * 5. CREATE COMPREHENSIVE LOGS for future recovery
 * 
 * Output files:
 * - logs/image-generation-{timestamp}.json - Complete mapping file
 * - logs/image-generation-{timestamp}.log - Human-readable log
 * - logs/image-mappings-{timestamp}.csv - CSV export
 * 
 * Prerequisites:
 * - BLOB_READ_WRITE_TOKEN must be set in .env
 * - DATABASE_URL must be set in .env
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from "@prisma/client";
import { generateAndStoreRecipeImage } from "../src/lib/images";

// Ensure logs directory exists
const logsDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create timestamp for this run
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const jsonLogFile = path.join(logsDir, `image-generation-${timestamp}.json`);
const textLogFile = path.join(logsDir, `image-generation-${timestamp}.log`);
const csvFile = path.join(logsDir, `image-mappings-${timestamp}.csv`);

// Types for logging
interface ImageMapping {
  recipeId: string;
  recipeName: string;
  recipeSlug?: string;
  category: string;
  mealType?: string;
  imageUrl: string;
  generatedAt: string;
}

const imageMappings: ImageMapping[] = [];
const failedRecipes: Array<{ id: string; name: string; error: string }> = [];

// Helper to log to both console and file
function log(message: string) {
  console.log(message);
  fs.appendFileSync(textLogFile, message + '\n');
}

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
  log(`\n${'='.repeat(70)}`);
  log(`🖼️  RECIPE IMAGE GENERATION - ${new Date().toISOString()}`);
  log(`${'='.repeat(70)}\n`);
  
  // Check required environment variables
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    log("❌ ERROR: BLOB_READ_WRITE_TOKEN is not set in environment variables.");
    log("   Please set it in your .env.local or .env file.");
    log("   Get your token from: Vercel Dashboard → Your Project → Storage → Blob → Settings\n");
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URL) {
    log("❌ ERROR: DATABASE_URL is not set in environment variables.");
    log("   Please set it in your .env.local or .env file.\n");
    process.exit(1);
  }
  
  log("✅ Environment variables loaded");
  log(`📁 Logs will be saved to: ${logsDir}\n`);

  try {
    // Fetch all recipes from database with additional context for better image generation
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        mealType: true,
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
      orderBy: { name: "asc" },
    });

    log(`📋 Found ${recipes.length} recipes in database\n`);

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      updated: 0,
    };

    // Initialize run metadata
    const runMetadata = {
      startTime: new Date().toISOString(),
      totalRecipes: recipes.length,
      regenerateAll: process.env.REGENERATE_ALL === 'true',
    };

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const progress = `[${String(i + 1).padStart(3, ' ')}/${recipes.length}]`;

      // Skip if image already exists in Vercel Blob (unless regenerating)
      // Set REGENERATE_ALL=true in env to regenerate all images
      const shouldRegenerate = process.env.REGENERATE_ALL === 'true';
      if (!shouldRegenerate && recipe.imageUrl && recipe.imageUrl.includes("blob.vercel-storage.com")) {
        log(`${progress} ⏭️  Skipping ${recipe.name} - already has Vercel Blob image`);
        results.skipped++;
        
        // Still log the existing mapping
        imageMappings.push({
          recipeId: recipe.id,
          recipeName: recipe.name,
          recipeSlug: recipe.slug,
          category: recipe.category,
          mealType: recipe.mealType,
          imageUrl: recipe.imageUrl,
          generatedAt: 'existing',
        });
        continue;
      }

      try {
        log(`${progress} 🎨 Generating image for: ${recipe.name}`);

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

        // LOG THE MAPPING - Critical for future recovery
        const mapping: ImageMapping = {
          recipeId: recipe.id,
          recipeName: recipe.name,
          recipeSlug: recipe.slug,
          category: recipe.category,
          mealType: recipe.mealType,
          imageUrl: blobUrl,
          generatedAt: new Date().toISOString(),
        };
        imageMappings.push(mapping);

        log(`   ✅ Success: ${blobUrl}`);
        log(`   📝 MAPPING: "${recipe.name}" (${recipe.id}) → ${blobUrl}\n`);
        results.success++;
        results.updated++;

        // Save progress every 10 images
        if (results.success % 10 === 0) {
          saveProgress(runMetadata, results);
          log(`   💾 Progress saved (${results.success} images)\n`);
        }

        // Rate limiting - wait 7 seconds between requests to stay under 10 RPM limit
        // Gemini 2.0 Flash Preview Image Generation has 10 RPM limit on Tier 1
        if (i < recipes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 7000));
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        log(`   ❌ Failed: ${errorMsg}\n`);
        results.failed++;
        failedRecipes.push({ id: recipe.id, name: recipe.name, error: errorMsg });
        
        // If Vercel Blob upload fails, we still want to continue with other recipes
        // The error is logged, and we can retry later
      }
    }

    // Final save
    saveProgress(runMetadata, results, true);
    saveCsv();

    log(`\n${'='.repeat(70)}`);
    log(`📊 GENERATION COMPLETE`);
    log(`${'='.repeat(70)}`);
    log(`   ✅ Success: ${results.success}`);
    log(`   🔄 Updated: ${results.updated}`);
    log(`   ⏭️  Skipped: ${results.skipped}`);
    log(`   ❌ Failed: ${results.failed}`);
    log(`\n📁 Output Files:`);
    log(`   JSON: ${jsonLogFile}`);
    log(`   LOG:  ${textLogFile}`);
    log(`   CSV:  ${csvFile}`);
    log(`\n🎉 Image generation complete!`);
  } catch (error) {
    log(`Fatal error: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper to save progress
function saveProgress(metadata: any, results: any, final = false) {
  const data = {
    ...metadata,
    endTime: final ? new Date().toISOString() : undefined,
    mappings: imageMappings,
    failed: failedRecipes,
    summary: {
      total: metadata.totalRecipes,
      success: results.success,
      failed: results.failed,
      skipped: results.skipped,
      updated: results.updated,
      successRate: `${((results.success / metadata.totalRecipes) * 100).toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(jsonLogFile, JSON.stringify(data, null, 2));
}

// Helper to save CSV
function saveCsv() {
  const csvContent = [
    'recipe_id,recipe_name,recipe_slug,category,meal_type,image_url,generated_at',
    ...imageMappings.map(m => 
      `"${m.recipeId}","${m.recipeName.replace(/"/g, '""')}","${m.recipeSlug || ''}","${m.category}","${m.mealType || ''}","${m.imageUrl}","${m.generatedAt}"`
    )
  ].join('\n');
  fs.writeFileSync(csvFile, csvContent);
}

// Run the script
generateAllRecipeImages();

