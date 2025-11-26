/**
 * Kid-Friendly Recipe Suggestions API Route
 * 
 * GET /api/recipes/suggest-kid-friendly
 * 
 * Returns recipes that are kid-friendly based on family member ages
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's family members
    const familyMembers = await prisma.familyMember.findMany({
      where: { userId },
    });

    // Determine if we need kid-friendly recipes
    const hasKids = familyMembers.some(
      (member) =>
        member.ageGroup === "CHILD" ||
        member.ageGroup === "PRESCHOOL" ||
        member.ageGroup === "TODDLER" ||
        member.ageGroup === "INFANT"
    );

    // Get kid-friendly recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        isKidFriendly: hasKids ? true : undefined,
        OR: hasKids
          ? [
              { isKidFriendly: true },
              {
                healthTags: {
                  some: {
                    healthTag: {
                      slug: "kid-friendly",
                    },
                  },
                },
              },
            ]
          : undefined,
      },
      include: {
        healthTags: { include: { healthTag: true } },
        dietaryTags: { include: { dietaryTag: true } },
      },
      take: 20,
    });

    return NextResponse.json({ recipes, hasKids });
  } catch (error) {
    console.error("Error fetching kid-friendly recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch kid-friendly recipes" },
      { status: 500 }
    );
  }
}

