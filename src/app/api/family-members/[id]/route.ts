/**
 * Family Member API Route
 * 
 * PUT /api/family-members/[id] - Update a family member
 * DELETE /api/family-members/[id] - Delete a family member
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, birthDate, ageGroup, isVegetarian, allergies, dislikes } = body;

    const familyMember = await prisma.familyMember.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!familyMember) {
      return NextResponse.json(
        { error: "Family member not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.familyMember.update({
      where: { id: params.id },
      data: {
        name: name ?? familyMember.name,
        birthDate: birthDate ? new Date(birthDate) : familyMember.birthDate,
        ageGroup: ageGroup ? (ageGroup as any) : familyMember.ageGroup,
        isVegetarian: isVegetarian ?? familyMember.isVegetarian,
        allergies: allergies ?? familyMember.allergies,
        dislikes: dislikes ?? familyMember.dislikes,
      },
    });

    return NextResponse.json({ familyMember: updated });
  } catch (error) {
    console.error("Error updating family member:", error);
    return NextResponse.json(
      { error: "Failed to update family member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const familyMember = await prisma.familyMember.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!familyMember) {
      return NextResponse.json(
        { error: "Family member not found" },
        { status: 404 }
      );
    }

    await prisma.familyMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting family member:", error);
    return NextResponse.json(
      { error: "Failed to delete family member" },
      { status: 500 }
    );
  }
}

