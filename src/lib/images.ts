/**
 * Image Generation & Storage for ThriveMenu
 * 
 * Uses Google Gemini API for image generation
 * Stores images in Vercel Blob Storage for optimal performance
 */

import { put } from '@vercel/blob';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyA7bGzbb2N5mKPPGuSwrbA4u3s7a6Pn_zM";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate recipe image using Gemini API
 * Note: Gemini doesn't have direct image generation, so we'll use a workaround
 * For now, we'll use Unsplash as placeholder until we integrate DALL-E or similar
 */
async function generateImageWithGemini(recipeName: string, category: string): Promise<Buffer> {
  // Gemini doesn't have image generation API yet
  // We'll use Unsplash API or fallback to DALL-E/Stable Diffusion
  // For now, fetch from Unsplash as placeholder
  
  const searchQuery = encodeURIComponent(`${recipeName} ${category} food`);
  const unsplashUrl = `https://source.unsplash.com/1024x1024/?${searchQuery}`;
  
  try {
    const response = await fetch(unsplashUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

/**
 * Upload image to Vercel Blob Storage
 */
async function uploadToVercelBlob(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    // Convert Buffer to Blob for Vercel Blob Storage
    const blob = await put(filename, imageBuffer as any, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw error;
  }
}

/**
 * Generate recipe image and store in Vercel Blob
 * This is the main function to use for generating recipe images
 * 
 * @param recipeId - Unique recipe identifier
 * @param recipeName - Name of the recipe
 * @param category - Recipe category
 * @returns Promise<string> - Vercel Blob URL
 */
export async function generateAndStoreRecipeImage(
  recipeId: string,
  recipeName: string,
  category: string
): Promise<string> {
  try {
    // Step 1: Generate/fetch image
    console.log(`Generating image for: ${recipeName}`);
    const imageBuffer = await generateImageWithGemini(recipeName, category);
    
    // Step 2: Upload to Vercel Blob
    const filename = `recipes/${recipeId}.jpg`;
    console.log(`Uploading to Vercel Blob: ${filename}`);
    const blobUrl = await uploadToVercelBlob(imageBuffer, filename);
    
    console.log(`✅ Image stored at: ${blobUrl}`);
    return blobUrl;
  } catch (error) {
    console.error(`Error generating/storing image for ${recipeName}:`, error);
    // Fallback to Unsplash URL
    return getRecipeImage(recipeName, category);
  }
}

/**
 * Get recipe image URL (fallback/placeholder)
 * Currently uses Unsplash, will be replaced with Vercel Blob URLs in production
 */
export function getRecipeImage(recipeName: string, category: string): string {
  const searchQuery = encodeURIComponent(`${recipeName} ${category} food`);
  return `https://source.unsplash.com/800x600/?${searchQuery}`;
}

/**
 * Check if image URL is from Vercel Blob
 */
export function isVercelBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com') || url.includes('vercel-storage.com');
}

/**
 * Get image dimensions for Next.js Image component
 */
export function getImageDimensions(url: string): { width: number; height: number } {
  // Default dimensions for recipe images
  // In production, fetch actual dimensions from Vercel Blob metadata
  return { width: 800, height: 600 };
}
