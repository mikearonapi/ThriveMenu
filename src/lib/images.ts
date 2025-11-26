/**
 * Image Generation & Storage for ThriveMenu
 * 
 * Uses Google Imagen 4.0 for realistic AI-generated recipe images
 * Imagen 4.0 provides the highest fidelity photorealistic food photography
 * Uses the :predict endpoint
 * Stores images in Vercel Blob Storage for optimal performance
 */

import { put } from '@vercel/blob';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBhzno0jb2UbP3P5fIxJ_eEAQynF2GNvrk";

/**
 * Generate recipe image using Google Imagen 4.0
 * Uses the :predict endpoint (NOT generateContent which doesn't support Imagen)
 * 
 * NOTE on Quotas (Tier 1):
 * - Imagen 4.0: ~70 images/day (High Quality)
 * - Gemini 2.0 Flash: ~10,000 images/day (Standard Quality)
 * 
 * We default to Imagen 4.0 for highest quality. If quota is hit,
 * the user should wait or we can implement a fallback in the future.
 */
async function generateImageWithImagen(
  recipeName: string, 
  category: string, 
  description?: string, 
  ingredients?: string[], 
  retries = 3
): Promise<Buffer> {
  // Create highly detailed, realistic prompt for Google Imagen 4.0
  const createDetailedPrompt = (name: string, cat: string, desc?: string, ingr?: string[]) => {
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
  };

  const prompt = createDetailedPrompt(recipeName, category, description, ingredients);
  
  console.log(`🎨 Imagen 4.0 generating: "${recipeName}"`);
  
  // Imagen 4.0 uses the :predict endpoint
  // Reference: https://ai.google.dev/api (Gen Media APIs section)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict?key=${GEMINI_API_KEY}`;

  const payload = {
    instances: [
      {
        prompt: prompt
      }
    ],
    parameters: {
      sampleCount: 1,
      // Imagen 4.0 specific parameters for quality
      aspectRatio: "1:1",
      safetySettings: [
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" }
      ]
    }
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`   ⏳ Retry ${attempt + 1}/${retries} for ${recipeName}`);
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Check specifically for quota issues
        if (response.status === 429 || errorText.includes('RESOURCE_EXHAUSTED') || errorText.includes('quota')) {
           throw new Error(`QUOTA_EXCEEDED: ${errorText}`);
        }
        
        throw new Error(`Imagen API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Imagen 4.0 returns: { predictions: [ { bytesBase64Encoded: "..." } ] }
      if (data.predictions && data.predictions.length > 0) {
        const prediction = data.predictions[0];
        if (prediction.bytesBase64Encoded) {
          console.log(`   ✅ Imagen 4.0 generated image for ${recipeName}`);
          return Buffer.from(prediction.bytesBase64Encoded, 'base64');
        }
        if (prediction.b64) {
           console.log(`   ✅ Imagen 4.0 generated image for ${recipeName}`);
           return Buffer.from(prediction.b64, 'base64');
        }
      }

      throw new Error('No image data received from Imagen API');
      
    } catch (err) {
      const error = err as Error;
      const errorMessage = error?.message || String(error);
      console.error(`   ❌ Attempt ${attempt + 1} failed:`, errorMessage);
      
      // Don't retry if we hit quota limits
      if (errorMessage.includes('QUOTA_EXCEEDED')) {
        throw error;
      }
      
      if (attempt === retries - 1) {
        throw new Error(`Imagen 4.0 failed after ${retries} attempts: ${errorMessage}`);
      }
    }
  }
  
  throw new Error(`Failed to generate image with Imagen 4.0 after ${retries} attempts`);
}

/**
 * Upload image to Vercel Blob Storage
 */
async function uploadToVercelBlob(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    // Convert Buffer to Uint8Array (which is a valid BlobPart) for Vercel Blob compatibility
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
 * Generate recipe image with Imagen 4.0 and store in Vercel Blob
 * ONLY uses Google AI image generation - NO external photo services
 */
export async function generateAndStoreRecipeImage(
  recipeId: string,
  recipeName: string,
  category: string,
  description?: string,
  ingredients?: string[]
): Promise<string> {
  try {
    console.log(`🎨 Generating AI image for: ${recipeName}`);
    
    // Step 1: Generate image with Imagen 4.0 ONLY
    const imageBuffer = await generateImageWithImagen(recipeName, category, description, ingredients);
    
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
  // Placeholder gradient for recipes without images
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
