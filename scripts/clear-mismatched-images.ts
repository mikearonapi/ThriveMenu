import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function clearMismatchedImages() {
  console.log("🔍 Finding mismatched images (old mapping)...\n");

  // The old wrongly-mapped images have CUIDs starting with 'cmif4l' (from original seeding)
  // The new correctly-generated images have CUIDs starting with 'cmifc5' or 'cmifc6' (from today)
  
  // Find recipes with old blob URLs (the mismatched ones)
  const recipesWithOldImages = await prisma.recipe.findMany({
    where: {
      imageUrl: {
        contains: 'cmif4l'  // Old CUID prefix from original seeding
      }
    },
    select: {
      id: true,
      name: true,
      imageUrl: true
    }
  });

  console.log(`📊 Found ${recipesWithOldImages.length} recipes with mismatched images\n`);
  
  if (recipesWithOldImages.length === 0) {
    console.log("✅ No mismatched images found!");
    await prisma.$disconnect();
    return;
  }

  // Show sample of what we're clearing
  console.log("Sample of mismatched recipes:");
  recipesWithOldImages.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i+1}. ${r.name}`);
  });
  if (recipesWithOldImages.length > 10) {
    console.log(`  ... and ${recipesWithOldImages.length - 10} more\n`);
  }

  // Clear the imageUrl for these recipes
  console.log("🗑️  Clearing mismatched image URLs...");
  
  const result = await prisma.recipe.updateMany({
    where: {
      imageUrl: {
        contains: 'cmif4l'
      }
    },
    data: {
      imageUrl: null
    }
  });

  console.log(`✅ Cleared ${result.count} mismatched image URLs\n`);

  // Verify
  const withImages = await prisma.recipe.count({ where: { imageUrl: { not: null } } });
  const total = await prisma.recipe.count();
  
  console.log("📊 Current Status:");
  console.log(`   Total recipes: ${total}`);
  console.log(`   With correct images: ${withImages}`);
  console.log(`   Need regeneration: ${total - withImages}`);

  await prisma.$disconnect();
}

clearMismatchedImages().catch(console.error);

