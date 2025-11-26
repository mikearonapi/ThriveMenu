/**
 * API to check Google Imagen 4.0 generation status
 * Shows how many recipes have Google AI generated images vs need generation
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const total = await prisma.recipe.count();
    
    const withGoogleImages = await prisma.recipe.count({
      where: { 
        imageUrl: { 
          contains: 'blob.vercel-storage.com' 
        } 
      }
    });
    
    const withUnsplash = await prisma.recipe.count({
      where: { 
        OR: [
          { imageUrl: { contains: 'unsplash' } },
          { imageUrl: { contains: 'pexels' } }
        ]
      }
    });
    
    const withoutImages = await prisma.recipe.count({
      where: { imageUrl: null }
    });
    
    const sampleRecipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
      take: 10,
    });
    
    return NextResponse.json({
      totalRecipes: total,
      googleAIImages: withGoogleImages,
      unsplashImages: withUnsplash,
      withoutImages: withoutImages,
      percentComplete: Math.round((withGoogleImages / total) * 100),
      sampleRecipes: sampleRecipes.map(r => ({
        name: r.name,
        hasGoogleImage: r.imageUrl?.includes('blob.vercel-storage.com') || false,
        hasUnsplashImage: r.imageUrl?.includes('unsplash') || r.imageUrl?.includes('pexels') || false,
        imageUrl: r.imageUrl
      }))
    });
    
  } catch (error) {
    console.error('Error checking image status:', error);
    return NextResponse.json(
      { 
        error: "Failed to check status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
