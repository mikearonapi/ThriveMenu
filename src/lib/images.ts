/**
 * Image Generation & Storage for ThriveMenu
 * 
 * Uses Google Gemini 2.0 Flash Preview Image Generation for AI-generated recipe images
 * This model has 10,000 images/day limit (vs Imagen 4's 70/day)
 * Stores images in Vercel Blob Storage for optimal performance
 */

import { put } from '@vercel/blob';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBhzno0jb2UbP3P5fIxJ_eEAQynF2GNvrk";

/**
 * Generate recipe image using Gemini 2.0 Flash Preview Image Generation
 * Uses the generateContent endpoint with responseModalities: ["IMAGE"]
 * 10,000 images/day limit on Tier 1 (vs Imagen 4's 70/day)
 */
async function generateImageWithGemini(
  recipeName: string, 
  category: string, 
  description?: string, 
  ingredients?: string[], 
  retries = 3
): Promise<Buffer> {
  // Create highly detailed, realistic prompt for food photography
  const createDetailedPrompt = (name: string, cat: string, desc?: string, ingr?: string[]) => {
    const dishDetails = desc ? `, ${desc}` : '';
    const ingredientList = ingr && ingr.length > 0 ? `, featuring ${ingr.slice(0, 4).join(', ')}` : '';
    
    // Category-specific styling
    let platingStyle = '';
    if (cat.toLowerCase().includes('breakfast')) platingStyle = 'served on a rustic wooden breakfast table with soft morning light';
    else if (cat.toLowerCase().includes('salad')) platingStyle = 'in a white ceramic bowl with fresh herbs garnish';
    else if (cat.toLowerCase().includes('seafood')) platingStyle = 'elegantly plated on white porcelain with lemon garnish';
    else if (cat.toLowerCase().includes('soup')) platingStyle = 'in a ceramic soup bowl with visible steam and herbs';
    else if (cat.toLowerCase().includes('oat') || cat.toLowerCase().includes('grain')) platingStyle = 'in a ceramic breakfast bowl with wooden spoon nearby';
    else if (cat.toLowerCase().includes('dessert') || cat.toLowerCase().includes('sweet')) platingStyle = 'on marble surface with elegant presentation';
    else if (cat.toLowerCase().includes('snack') || cat.toLowerCase().includes('kid')) platingStyle = 'on a colorful plate with fun presentation';
    else platingStyle = 'beautifully plated with professional food styling';
    
    return `Professional food photography of ${name}${ingredientList}${dishDetails}, ${platingStyle}. Studio lighting, shallow depth of field, food magazine quality, appetizing presentation, vibrant natural colors, high resolution photography. No text or watermarks.`;
  };

  const prompt = createDetailedPrompt(recipeName, category, description, ingredients);
  
  console.log(`🎨 Gemini 2.0 Flash generating: "${recipeName}"`);
  
  // Gemini 2.0 Flash Experimental Image Generation
  // Uses generateContent with responseModalities: ["IMAGE", "TEXT"]
  // Reference: https://ai.google.dev/gemini-api/docs/image-generation
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"]
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
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Gemini returns: { candidates: [{ content: { parts: [{ inlineData: { data: "base64...", mimeType: "image/jpeg" } }] } }] }
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              console.log(`   ✅ Gemini 2.0 Flash generated image for ${recipeName}`);
              return Buffer.from(part.inlineData.data, 'base64');
            }
          }
        }
      }

      throw new Error('No image data received from Gemini API');
      
    } catch (err) {
      const error = err as Error;
      const errorMessage = error?.message || String(error);
      console.error(`   ❌ Attempt ${attempt + 1} failed:`, errorMessage);
      
      // If quota exceeded, don't retry - throw immediately
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error(`Quota exceeded: ${errorMessage}`);
      }
      
      if (attempt === retries - 1) {
        throw new Error(`Gemini 2.0 Flash failed after ${retries} attempts: ${errorMessage}`);
      }
    }
  }
  
  throw new Error(`Failed to generate image with Gemini 2.0 Flash after ${retries} attempts`);
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
 * Generate recipe image with Gemini 2.0 Flash and store in Vercel Blob
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
    
    // Step 1: Generate image with Gemini 2.0 Flash
    const imageBuffer = await generateImageWithGemini(recipeName, category, description, ingredients);
    
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
