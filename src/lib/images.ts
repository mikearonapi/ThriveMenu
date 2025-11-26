/**
 * Image Generation & Storage for ThriveMenu
 * 
 * Strategy:
 * 1. Primary: Google Imagen 4.0 (Highest Fidelity) - ~70 images/day limit
 * 2. Fallback: Google Gemini 2.0 Flash (High Speed/Quota) - ~10,000 images/day limit
 * 
 * This ensures we always get the best possible image, but never fail due to quotas.
 */

import { put } from '@vercel/blob';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing. Image generation will fail.");
}

/**
 * Generate prompt for image generation
 */
function createDetailedPrompt(name: string, cat: string, desc?: string, ingr?: string[]): string {
  const dishDetails = desc ? `, ${desc}` : '';
  const ingredientList = ingr && ingr.length > 0 ? `, featuring ${ingr.slice(0, 4).join(', ')}` : '';
  
  // Category-specific styling for premium food photography
  let platingStyle = '';
  if (cat.toLowerCase().includes('breakfast')) platingStyle = 'served on a rustic wooden breakfast table with soft natural morning light, 45-degree angle';
  else if (cat.toLowerCase().includes('salad')) platingStyle = 'in a hand-thrown ceramic bowl with fresh herbs garnish, macro detail, crisp textures';
  else if (cat.toLowerCase().includes('seafood')) platingStyle = 'elegantly plated on white porcelain with lemon garnish, bright airy lighting';
  else if (cat.toLowerCase().includes('soup')) platingStyle = 'in a artisan ceramic soup bowl with visible steam and herbs, cozy atmosphere';
  else if (cat.toLowerCase().includes('oat') || cat.toLowerCase().includes('grain')) platingStyle = 'in a ceramic breakfast bowl with wooden spoon nearby, soft depth of field';
  else if (cat.toLowerCase().includes('dessert') || cat.toLowerCase().includes('sweet')) platingStyle = 'on marble surface with elegant plating, dramatic side lighting';
  else platingStyle = 'beautifully plated with professional food styling, Michelin star presentation';
  
  return `Professional food photography of ${name}${ingredientList}${dishDetails}, ${platingStyle}. Shot on Phase One XF IQ4, 100mm macro lens, studio lighting, shallow depth of field, appetizing presentation, vibrant natural colors, 8k resolution, ultra-realistic textures. No text, no watermarks.`;
}

/**
 * Generate image using Imagen 4.0 (Primary)
 */
async function generateWithImagen4(prompt: string): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict?key=${GEMINI_API_KEY}`;
  const payload = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "1:1",
      safetySettings: [
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" }
      ]
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429 || errorText.includes('RESOURCE_EXHAUSTED') || errorText.includes('quota')) {
       throw new Error(`QUOTA_EXCEEDED: ${errorText}`);
    }
    throw new Error(`Imagen API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  if (data.predictions?.[0]?.bytesBase64Encoded) {
    return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
  }
  if (data.predictions?.[0]?.b64) {
    return Buffer.from(data.predictions[0].b64, 'base64');
  }
  throw new Error('No image data received from Imagen API');
}

/**
 * Generate image using Gemini 2.0 Flash (Fallback)
 */
async function generateWithGeminiFlash(prompt: string): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"]
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Flash API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }
  throw new Error('No image data received from Gemini Flash API');
}

/**
 * Main Generation Function with Fallback Logic
 */
async function generateImageWithFallback(
  recipeName: string, 
  category: string, 
  description?: string, 
  ingredients?: string[], 
  retries = 3
): Promise<Buffer> {
  const prompt = createDetailedPrompt(recipeName, category, description, ingredients);
  
  // Try Imagen 4.0 first (Primary)
  try {
    console.log(`🎨 Generating with Imagen 4.0 (Primary): "${recipeName}"`);
    return await generateWithImagen4(prompt);
  } catch (error: any) {
    const isQuotaError = error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('429');
    
    if (isQuotaError) {
      console.warn(`⚠️ Imagen 4.0 quota exceeded. Switching to Gemini 2.0 Flash (Fallback)...`);
      try {
        console.log(`🎨 Generating with Gemini 2.0 Flash (Fallback): "${recipeName}"`);
        return await generateWithGeminiFlash(prompt);
      } catch (fallbackError: any) {
        console.error(`❌ Fallback generation failed:`, fallbackError);
        throw fallbackError;
      }
    }
    
    // For non-quota errors, retry logic could be applied here if needed, 
    // but currently we throw to avoid masking real issues.
    console.error(`❌ Imagen 4.0 failed:`, error);
    throw error;
  }
}

/**
 * Upload image to Vercel Blob Storage
 */
async function uploadToVercelBlob(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    const uint8Array = new Uint8Array(imageBuffer.length);
    for (let i = 0; i < imageBuffer.length; i++) {
      uint8Array[i] = imageBuffer[i];
    }
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    
    const result = await put(filename, blob, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    });
    return result.url;
  } catch (err) {
    const error = err as Error;
    console.error('Error uploading to Vercel Blob:', error);
    throw error;
  }
}

/**
 * Generate recipe image and store in Vercel Blob
 * Uses Imagen 4.0 with automatic fallback to Gemini 2.0 Flash
 */
export async function generateAndStoreRecipeImage(
  recipeId: string,
  recipeName: string,
  category: string,
  description?: string,
  ingredients?: string[]
): Promise<string> {
  try {
    console.log(`🚀 Starting image generation pipeline for: ${recipeName}`);
    
    // Step 1: Generate image (with fallback)
    const imageBuffer = await generateImageWithFallback(recipeName, category, description, ingredients);
    
    // Step 2: Upload to Vercel Blob
    const filename = `recipes/${recipeId}.jpg`;
    console.log(`   📤 Uploading to Vercel Blob: ${filename}`);
    const blobUrl = await uploadToVercelBlob(imageBuffer, filename);
    
    console.log(`   ✅ SUCCESS: ${blobUrl}`);
    return blobUrl;
  } catch (err) {
    const error = err as Error;
    const errorMessage = error?.message || String(error);
    console.error(`❌ FAILED for ${recipeName}:`, errorMessage);
    throw error;
  }
}

/**
 * Get recipe image URL (fallback only for display when no DB image exists)
 */
export function getRecipeImage(recipeName: string, category: string): string {
  const seed = recipeName.toLowerCase().replace(/\s+/g, '-');
  return `/api/placeholder?name=${encodeURIComponent(recipeName)}&seed=${seed}`;
}

/**
 * Check if image URL is from Vercel Blob
 */
export function isVercelBlobUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('blob.vercel-storage.com') || url.includes('vercel-storage.com');
}

/**
 * Get image dimensions for Next.js Image component
 */
export function getImageDimensions(url: string): { width: number; height: number } {
  return { width: 800, height: 600 };
}

/**
 * Get recipe image URL with Vercel Blob priority
 */
export function getRecipeImageUrl(recipe: { imageUrl?: string | null; name: string; category: string }): string {
  if (recipe.imageUrl && recipe.imageUrl.trim()) {
    return recipe.imageUrl;
  }
  return getRecipeImage(recipe.name, recipe.category);
}
