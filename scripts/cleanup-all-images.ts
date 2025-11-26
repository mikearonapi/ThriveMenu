/**
 * Cleanup All Images from Vercel Blob
 * 
 * This script removes ALL images from Vercel Blob storage
 * to prepare for fresh image generation.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { list, del } from '@vercel/blob';

async function cleanupAllImages() {
  console.log('🧹 Starting Vercel Blob cleanup...\n');
  
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN not found in environment');
    process.exit(1);
  }
  
  let totalDeleted = 0;
  let cursor: string | undefined;
  
  do {
    // List blobs in batches
    const result = await list({
      token: blobToken,
      limit: 100,
      cursor,
    });
    
    const blobs = result.blobs;
    console.log(`📦 Found ${blobs.length} blobs in this batch`);
    
    // Delete each blob
    for (const blob of blobs) {
      try {
        await del(blob.url, { token: blobToken });
        totalDeleted++;
        
        if (totalDeleted % 25 === 0) {
          console.log(`🗑️  Deleted ${totalDeleted} images...`);
        }
      } catch (error) {
        console.error(`  ⚠️ Failed to delete ${blob.pathname}:`, error);
      }
    }
    
    cursor = result.cursor;
    
  } while (cursor);
  
  console.log(`\n✅ Cleanup complete!`);
  console.log(`   Total deleted: ${totalDeleted} images`);
}

cleanupAllImages().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});

