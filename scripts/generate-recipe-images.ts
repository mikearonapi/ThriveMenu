/**
 * Batch script to generate images for all recipes
 * 
 * Usage:
 *   npm run generate-images
 * 
 * This script will:
 * 1. Read all recipes from the data file
 * 2. Generate images using Gemini API
 * 3. Upload to Vercel Blob
 * 4. Update recipe data with blob URLs
 */

import { allRecipes } from "../src/data/recipes";
import { generateAndStoreRecipeImage } from "../src/lib/images";

async function generateAllRecipeImages() {
  console.log(`🚀 Starting image generation for ${allRecipes.length} recipes...\n`);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const progress = `[${i + 1}/${allRecipes.length}]`;

    try {
      console.log(`${progress} Generating image for: ${recipe.name}`);
      
      const blobUrl = await generateAndStoreRecipeImage(
        recipe.id,
        recipe.name,
        recipe.category
      );

      // In production, you would update the database here
      // For now, we'll just log the URL
      console.log(`   ✅ Success: ${blobUrl}\n`);
      results.success++;

      // Rate limiting - wait 1 second between requests to avoid API limits
      if (i < allRecipes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      results.failed++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`\n🎉 Image generation complete!`);
}

// Run the script
generateAllRecipeImages()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

