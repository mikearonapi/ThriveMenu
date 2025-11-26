import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { list, del } from '@vercel/blob';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function cleanupOrphanBlobs() {
  console.log("🔍 Finding orphan blob files...\n");

  // Get all blob URLs currently in the database
  const recipesWithImages = await prisma.recipe.findMany({
    where: { imageUrl: { not: null } },
    select: { imageUrl: true }
  });
  
  const usedUrls = new Set(recipesWithImages.map(r => r.imageUrl));
  console.log(`📊 Database has ${usedUrls.size} recipes with images\n`);

  // Get all blobs from Vercel Blob
  const allBlobs: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  const recipeBlobs = allBlobs.filter(b => b.pathname.startsWith('recipes/'));
  console.log(`📂 Vercel Blob has ${recipeBlobs.length} recipe images\n`);

  // Find orphans (blobs not used by any recipe)
  const orphanBlobs = recipeBlobs.filter(blob => !usedUrls.has(blob.url));
  
  console.log(`🗑️  Found ${orphanBlobs.length} orphan blobs to delete:\n`);
  
  if (orphanBlobs.length > 0) {
    for (const blob of orphanBlobs) {
      console.log(`   - ${blob.pathname}`);
    }
    
    console.log("\n🗑️  Deleting orphan blobs...");
    
    for (const blob of orphanBlobs) {
      try {
        await del(blob.url);
        console.log(`   ✅ Deleted: ${blob.pathname}`);
      } catch (error) {
        console.error(`   ❌ Failed to delete ${blob.pathname}:`, error);
      }
    }
    
    console.log(`\n✅ Cleanup complete! Deleted ${orphanBlobs.length} orphan blobs.`);
  } else {
    console.log("✅ No orphan blobs found - storage is clean!");
  }

  // Final count
  const finalBlobs = await list({ limit: 1 });
  console.log(`\n📊 Final Status:`);
  console.log(`   Recipes with images: ${usedUrls.size}`);
  console.log(`   Blobs after cleanup: ${recipeBlobs.length - orphanBlobs.length}`);
  
  await prisma.$disconnect();
}

cleanupOrphanBlobs().catch(console.error);

