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

    // Generate and store image
    const imageUrl = await generateAndStoreRecipeImage(recipeId, recipeName, category);

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
