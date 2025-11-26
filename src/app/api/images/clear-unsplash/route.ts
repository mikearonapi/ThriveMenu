/**
 * API to clear all Unsplash/non-Google images from database
 * This ensures we only use Google Imagen 4.0 generated images
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Clearing all non-Google AI image URLs...');
    
    // Find all recipes with non-Vercel Blob images
    const recipesToClear = await prisma.recipe.findMany({
      where: { 
        AND: [
          { imageUrl: { not: null } },
          { imageUrl: { not: { contains: 'blob.vercel-storage.com' } } }
        ]
      },
      select: { id: true, name: true, imageUrl: true }
    });
    
    console.log(`Found ${recipesToClear.length} recipes with non-Google images`);
    
    if (recipesToClear.length > 0) {
      // Clear all non-Google AI images
      const result = await prisma.recipe.updateMany({
        where: { 
          AND: [
            { imageUrl: { not: null } },
            { imageUrl: { not: { contains: 'blob.vercel-storage.com' } } }
          ]
        },
        data: { imageUrl: null }
      });
      
      console.log(`✅ Cleared ${result.count} Unsplash/external image URLs`);
    }
    
    // Get final status
    const total = await prisma.recipe.count();
    const withGoogleImages = await prisma.recipe.count({
      where: { 
        imageUrl: { 
          contains: 'blob.vercel-storage.com' 
        } 
      }
    });
    const readyForGeneration = await prisma.recipe.count({
      where: { imageUrl: null }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Cleared all non-Google AI images',
      cleared: recipesToClear.length,
      status: {
        totalRecipes: total,
        googleAIImages: withGoogleImages,
        readyForGeneration: readyForGeneration
      }
    });
    
  } catch (error) {
    console.error('Error clearing images:', error);
    return NextResponse.json(
      { 
        error: "Failed to clear images",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
