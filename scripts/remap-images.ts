import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { list } from '@vercel/blob';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Recipe names that had images (from log file)
const recipesWithImages = fs.readFileSync('/tmp/recipes_with_images_unique.txt', 'utf-8')
  .split('\n')
  .filter(n => n.trim())
  .map(n => n.trim());

async function remapImages() {
  console.log(`📋 Found ${recipesWithImages.length} recipe names with existing images\n`);

  // Get all blobs sorted by pathname (which contains CUID, giving us creation order)
  const allBlobs: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // Sort blobs by pathname (CUIDs are time-based, so this gives creation order)
  const sortedBlobs = allBlobs
    .filter(b => b.pathname.startsWith('recipes/'))
    .sort((a, b) => a.pathname.localeCompare(b.pathname));

  console.log(`📂 Found ${sortedBlobs.length} recipe images in Vercel Blob\n`);

  // If counts match reasonably, we can map them
  if (sortedBlobs.length >= recipesWithImages.length) {
    console.log("✅ Blob count matches or exceeds recipe count - attempting to map\n");
    
    let mapped = 0;
    let notFound = 0;
    
    for (let i = 0; i < recipesWithImages.length && i < sortedBlobs.length; i++) {
      const recipeName = recipesWithImages[i];
      const blobUrl = sortedBlobs[i].url;
      
      // Find recipe in database by name
      const recipe = await prisma.recipe.findFirst({
        where: { name: recipeName }
      });
      
      if (recipe) {
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl: blobUrl }
        });
        mapped++;
        if (mapped <= 10 || mapped % 20 === 0) {
          console.log(`✅ Mapped: "${recipeName}" → ${blobUrl.substring(0, 60)}...`);
        }
      } else {
        notFound++;
        console.log(`⚠️ Recipe not found in DB: "${recipeName}"`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Mapped: ${mapped}`);
    console.log(`   ⚠️ Not found: ${notFound}`);
  } else {
    console.log("❌ Blob count doesn't match recipe count - manual review needed");
  }
  
  // Check how many recipes now have images
  const withImages = await prisma.recipe.count({ where: { imageUrl: { not: null } } });
  const total = await prisma.recipe.count();
  console.log(`\n📈 Database Status:`);
  console.log(`   Total recipes: ${total}`);
  console.log(`   With images: ${withImages}`);
  console.log(`   Need images: ${total - withImages}`);
  
  await prisma.$disconnect();
}

remapImages().catch(console.error);

