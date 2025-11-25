/**
 * Image Generation API Route
 * 
 * POST /api/images/generate
 * 
 * Generates recipe images and stores them in Vercel Blob
 * 
 * Request body:
 * {
 *   recipeId: string;
 *   recipeName: string;
 *   category: string;
 * }
 * 
 * Response:
 * {
 *   success: boolean;
 *   imageUrl: string; // Vercel Blob URL
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreRecipeImage } from "@/lib/images";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId, recipeName, category } = body;

    if (!recipeId || !recipeName || !category) {
      return NextResponse.json(
        { error: "recipeId, recipeName, and category are required" },
        { status: 400 }
      );
    }

    // Generate and store image in Vercel Blob
    const imageUrl = await generateAndStoreRecipeImage(recipeId, recipeName, category);

    // Update the recipe in the database with the Vercel Blob URL
    try {
      await prisma.recipe.update({
        where: { id: recipeId },
        data: { imageUrl },
      });
      console.log(`✅ Updated recipe ${recipeId} with image URL: ${imageUrl}`);
    } catch (dbError) {
      console.error(`⚠️ Failed to update database for recipe ${recipeId}:`, dbError);
      // Continue even if DB update fails - image is still stored in Blob
    }

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Error in image generation API:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
