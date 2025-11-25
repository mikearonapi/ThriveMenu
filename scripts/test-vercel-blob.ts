/**
 * Test script to verify Vercel Blob is configured correctly
 * 
 * Usage:
 *   npm run test-blob
 * 
 * This will test:
 * 1. Vercel Blob token is set
 * 2. Can upload a test image
 * 3. Can retrieve the uploaded image URL
 */

import { put } from '@vercel/blob';

async function testVercelBlob() {
  console.log('🧪 Testing Vercel Blob Configuration...\n');

  // Check if token is set
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not set in environment variables');
    console.log('\n📝 To fix this:');
    console.log('   1. Go to Vercel Dashboard → Your Project → Storage → Blob');
    console.log('   2. Click "Settings" → Copy the "Read/Write Token"');
    console.log('   3. Add it to your .env file: BLOB_READ_WRITE_TOKEN=your-token-here');
    process.exit(1);
  }

  console.log('✅ BLOB_READ_WRITE_TOKEN is set\n');

  // Create a simple test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  try {
    console.log('📤 Uploading test image to Vercel Blob...');
    const blob = await put('test/test-image.png', testImageBuffer, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: false,
    });

    console.log('✅ Upload successful!');
    console.log(`   URL: ${blob.url}`);
    console.log(`   Size: ${blob.size} bytes`);
    console.log(`   Uploaded: ${blob.uploadedAt}\n`);

    console.log('🎉 Vercel Blob is configured correctly!');
    console.log('\n💡 You can now generate recipe images using:');
    console.log('   npm run generate-images');
  } catch (error) {
    console.error('❌ Upload failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Verify your BLOB_READ_WRITE_TOKEN is correct');
    console.log('   2. Check that Blob Storage is enabled in your Vercel project');
    console.log('   3. Ensure you have the correct permissions');
    process.exit(1);
  }
}

testVercelBlob();

