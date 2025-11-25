/**
 * Meal Plans API Route
 * 
 * GET /api/meal-plans - Get user's meal plans
 * POST /api/meal-plans - Create a new meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      userId: session.user.id,
    };

    if (startDate && endDate) {
      where.OR = [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ];
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where,
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                mealType: true,
                prepTimeMinutes: true,
                totalTimeMinutes: true,
              },
            },
          },
          orderBy: [
            { date: "asc" },
            { mealType: "asc" },
          ],
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        name: name || `Week of ${new Date(startDate).toLocaleDateString()}`,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ mealPlan }, { status: 201 });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

