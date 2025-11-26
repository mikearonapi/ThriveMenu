/**
 * Restore Image URLs Script
 * 
 * This script:
 * 1. Lists all blobs from Vercel Blob storage
 * 2. Extracts recipe names from blob pathnames
 * 3. Matches them to recipes in the database
 * 4. Updates the imageUrl field
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { list } from '@vercel/blob';

const prisma = new PrismaClient();

// Helper to extract recipe name/slug from blob pathname
function extractSlugFromPathname(pathname: string): string {
  // Pathnames are like: "recipes/cloxxxxxx-recipe-name.jpg" or "recipe-images/recipe-name.jpg"
  const filename = pathname.split('/').pop() || '';
  // Remove extension and any CUID prefix
  let slug = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  // If it starts with a CUID pattern (like cm3xxxxx-), extract the name part
  const cuidMatch = slug.match(/^[a-z0-9]{20,30}-(.+)$/i);
  if (cuidMatch) {
    slug = cuidMatch[1];
  }
  return slug.toLowerCase();
}

// Helper to slugify a recipe name for comparison
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function restoreImages() {
  console.log('🔍 Scanning Vercel Blob storage for recipe images...\n');

  // Get all blobs
  const allBlobs: any[] = [];
  let cursor: string | undefined;
  let batchCount = 0;
  
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs.push(...result.blobs);
    cursor = result.cursor;
    batchCount++;
    console.log(`   Fetched batch ${batchCount}: ${result.blobs.length} blobs`);
  } while (cursor);

  console.log(`\n📦 Found ${allBlobs.length} total blobs in storage\n`);

  // Filter to recipe images
  const recipeBlobs = allBlobs.filter(b => 
    b.pathname.startsWith('recipes/') || 
    b.pathname.startsWith('recipe-images/')
  );

  console.log(`🖼️  Found ${recipeBlobs.length} recipe image blobs\n`);

  // Get all recipes from database
  const recipes = await prisma.recipe.findMany({
    select: { id: true, name: true, slug: true, imageUrl: true }
  });

  console.log(`📋 Found ${recipes.length} recipes in database\n`);

  // Create lookup maps
  const recipeBySlug = new Map<string, typeof recipes[0]>();
  const recipeByName = new Map<string, typeof recipes[0]>();
  
  for (const recipe of recipes) {
    recipeBySlug.set(recipe.slug.toLowerCase(), recipe);
    recipeBySlug.set(slugify(recipe.name), recipe);
    recipeByName.set(recipe.name.toLowerCase(), recipe);
  }

  // Match blobs to recipes
  let matched = 0;
  let updated = 0;
  let alreadyHasImage = 0;
  let notFound: string[] = [];

  console.log('🔗 Matching blobs to recipes...\n');

  for (const blob of recipeBlobs) {
    const extractedSlug = extractSlugFromPathname(blob.pathname);
    
    // Try to find matching recipe
    let recipe = recipeBySlug.get(extractedSlug);
    
    if (!recipe) {
      // Try variations
      const variations = [
        extractedSlug,
        extractedSlug.replace(/-/g, ' '),
        extractedSlug.replace(/-/g, ''),
      ];
      
      for (const v of variations) {
        if (recipeByName.has(v)) {
          recipe = recipeByName.get(v);
          break;
        }
      }
    }

    if (recipe) {
      matched++;
      
      if (recipe.imageUrl && recipe.imageUrl.includes('blob.vercel-storage.com')) {
        alreadyHasImage++;
      } else {
        // Update the recipe with the blob URL
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl: blob.url }
        });
        updated++;
        console.log(`✅ Restored: "${recipe.name}" → ${blob.url.substring(0, 60)}...`);
      }
    } else {
      notFound.push(`${blob.pathname} (slug: ${extractedSlug})`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESTORATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Total blobs found: ${recipeBlobs.length}`);
  console.log(`   Matched to recipes: ${matched}`);
  console.log(`   Already had images: ${alreadyHasImage}`);
  console.log(`   Newly restored: ${updated}`);
  console.log(`   Could not match: ${notFound.length}`);
  
  if (notFound.length > 0 && notFound.length <= 20) {
    console.log('\n⚠️  Unmatched blobs:');
    notFound.forEach(n => console.log(`   - ${n}`));
  }

  // Final database check
  const finalCount = await prisma.recipe.count({ where: { imageUrl: { not: null } } });
  const totalRecipes = await prisma.recipe.count();
  
  console.log('\n📈 FINAL DATABASE STATUS');
  console.log('='.repeat(60));
  console.log(`   Total recipes: ${totalRecipes}`);
  console.log(`   With images: ${finalCount}`);
  console.log(`   Still need images: ${totalRecipes - finalCount}`);

  await prisma.$disconnect();
}

restoreImages().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});

