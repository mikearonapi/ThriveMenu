/**
 * Generate All Recipe Images v2
 * 
 * This script generates images for ALL recipes using Google Imagen API
 * and stores them in Vercel Blob storage.
 * 
 * IMPORTANT: This creates comprehensive logs mapping recipe names to URLs
 * for future recovery if database issues occur.
 * 
 * Output files:
 * - logs/image-generation-{timestamp}.json - Complete mapping file
 * - logs/image-generation-{timestamp}.log - Human-readable log
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

// Ensure logs directory exists
const logsDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create timestamp for this run
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const jsonLogFile = path.join(logsDir, `image-generation-${timestamp}.json`);
const textLogFile = path.join(logsDir, `image-generation-${timestamp}.log`);

// Log structure for JSON file
interface ImageMapping {
  recipeId: string;
  recipeName: string;
  recipeSlug: string;
  category: string;
  mealType: string;
  imageUrl: string;
  blobPathname: string;
  generatedAt: string;
  prompt: string;
}

const imageMappings: ImageMapping[] = [];
let successCount = 0;
let failCount = 0;
const failedRecipes: Array<{ id: string; name: string; error: string }> = [];

// Helper to log to both console and file
function log(message: string) {
  console.log(message);
  fs.appendFileSync(textLogFile, message + '\n');
}

// Generate image using Google Imagen API
async function generateImage(recipeName: string, category: string, description: string): Promise<Buffer | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY not set');
  }

  const prompt = `Professional food photography of ${recipeName}. ${description}. 
    The dish should be beautifully plated on a clean, minimalist background.
    Natural lighting, shallow depth of field, appetizing presentation.
    Style: Clean, modern food blog photography. High quality, 8k.
    Category: ${category}`;

  const requestBody = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "4:3",
      safetyFilterLevel: "block_few",
      personGeneration: "dont_allow",
    },
  };

  const response = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0714418693'}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Imagen API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
    return Buffer.from(result.predictions[0].bytesBase64Encoded, 'base64');
  }

  return null;
}

// Alternative: Generate with Gemini if Imagen fails
async function generateWithGemini(recipeName: string, category: string): Promise<Buffer | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No API key available');
  }

  const prompt = `Create a beautiful, appetizing food photo of ${recipeName} (${category}). 
    Professional food photography style with natural lighting.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["image", "text"],
          responseMimeType: "text/plain",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.candidates?.[0]?.content?.parts) {
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }

  return null;
}

// Main generation function
async function generateAllImages() {
  log(`\n${'='.repeat(60)}`);
  log(`🖼️  RECIPE IMAGE GENERATION - ${new Date().toISOString()}`);
  log(`${'='.repeat(60)}\n`);

  // Fetch all recipes
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      category: true,
      mealType: true,
      imageUrl: true,
    },
    orderBy: { name: 'asc' },
  });

  log(`📋 Found ${recipes.length} recipes to process\n`);
  
  // Initialize JSON log
  const runMetadata = {
    startTime: new Date().toISOString(),
    totalRecipes: recipes.length,
    mappings: [] as ImageMapping[],
    failed: [] as Array<{ id: string; name: string; error: string }>,
  };

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    throw new Error('BLOB_READ_WRITE_TOKEN not set');
  }

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const progress = `[${String(i + 1).padStart(3, ' ')}/${recipes.length}]`;
    
    log(`${progress} Processing: ${recipe.name}`);
    
    try {
      // Generate image
      let imageBuffer: Buffer | null = null;
      let usedGenerator = 'imagen';
      
      // Try Imagen first, then fall back to Gemini
      try {
        imageBuffer = await generateImage(recipe.name, recipe.category, recipe.description);
      } catch (error) {
        log(`        ⚠️ Imagen failed, trying Gemini...`);
        usedGenerator = 'gemini';
        imageBuffer = await generateWithGemini(recipe.name, recipe.category);
      }

      if (!imageBuffer) {
        throw new Error('No image generated');
      }

      // Create filename with recipe info for easy identification
      const safeSlug = recipe.slug || recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `recipes/${safeSlug}-${recipe.id.slice(-8)}.jpg`;
      
      // Upload to Vercel Blob
      const blob = await put(filename, imageBuffer, {
        access: 'public',
        contentType: 'image/jpeg',
        token: blobToken,
      });

      // Update database
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { imageUrl: blob.url },
      });

      // Log mapping
      const mapping: ImageMapping = {
        recipeId: recipe.id,
        recipeName: recipe.name,
        recipeSlug: recipe.slug,
        category: recipe.category,
        mealType: recipe.mealType,
        imageUrl: blob.url,
        blobPathname: blob.pathname,
        generatedAt: new Date().toISOString(),
        prompt: `${recipe.name} - ${recipe.category}`,
      };
      
      imageMappings.push(mapping);
      successCount++;
      
      log(`        ✅ Success (${usedGenerator}): ${blob.pathname}`);
      log(`        URL: ${blob.url}`);
      
      // Save progress periodically
      if (successCount % 10 === 0) {
        fs.writeFileSync(jsonLogFile, JSON.stringify({
          ...runMetadata,
          mappings: imageMappings,
          failed: failedRecipes,
          successCount,
          failCount,
          lastUpdated: new Date().toISOString(),
        }, null, 2));
        log(`        📝 Progress saved (${successCount} images)`);
      }

      // Rate limiting - 2 second delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      failCount++;
      const errorMsg = error.message || 'Unknown error';
      failedRecipes.push({ id: recipe.id, name: recipe.name, error: errorMsg });
      log(`        ❌ Failed: ${errorMsg}`);
      
      // Continue to next recipe
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Final save
  const finalData = {
    ...runMetadata,
    endTime: new Date().toISOString(),
    mappings: imageMappings,
    failed: failedRecipes,
    summary: {
      total: recipes.length,
      success: successCount,
      failed: failCount,
      successRate: `${((successCount / recipes.length) * 100).toFixed(1)}%`,
    },
  };
  
  fs.writeFileSync(jsonLogFile, JSON.stringify(finalData, null, 2));
  
  log(`\n${'='.repeat(60)}`);
  log(`📊 GENERATION COMPLETE`);
  log(`${'='.repeat(60)}`);
  log(`✅ Success: ${successCount}`);
  log(`❌ Failed: ${failCount}`);
  log(`📁 JSON Log: ${jsonLogFile}`);
  log(`📄 Text Log: ${textLogFile}`);
  log(`${'='.repeat(60)}\n`);

  // Also create a simple CSV for easy reference
  const csvFile = path.join(logsDir, `image-mappings-${timestamp}.csv`);
  const csvContent = [
    'recipe_id,recipe_name,recipe_slug,category,meal_type,image_url,blob_pathname,generated_at',
    ...imageMappings.map(m => 
      `"${m.recipeId}","${m.recipeName.replace(/"/g, '""')}","${m.recipeSlug}","${m.category}","${m.mealType}","${m.imageUrl}","${m.blobPathname}","${m.generatedAt}"`
    )
  ].join('\n');
  fs.writeFileSync(csvFile, csvContent);
  log(`📊 CSV Export: ${csvFile}`);

  await prisma.$disconnect();
}

generateAllImages().catch(e => {
  console.error('❌ Fatal error:', e);
  process.exit(1);
});

