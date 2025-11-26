/**
 * Family Members API Route
 * 
 * GET /api/family-members - Get user's family members
 * POST /api/family-members - Create a new family member
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

    const familyMembers = await prisma.familyMember.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ familyMembers });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return NextResponse.json(
      { error: "Failed to fetch family members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, birthDate, ageGroup, isVegetarian, allergies, dislikes } = body;

    if (!name || !ageGroup) {
      return NextResponse.json(
        { error: "name and ageGroup are required" },
        { status: 400 }
      );
    }

    const familyMember = await prisma.familyMember.create({
      data: {
        userId,
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        ageGroup: ageGroup as any,
        isVegetarian: isVegetarian || false,
        allergies: allergies || [],
        dislikes: dislikes || [],
      },
    });

    return NextResponse.json({ familyMember }, { status: 201 });
  } catch (error) {
    console.error("Error creating family member:", error);
    return NextResponse.json(
      { error: "Failed to create family member" },
      { status: 500 }
    );
  }
}

