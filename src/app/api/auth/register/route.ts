/**
 * User Registration API Route
 * 
 * POST /api/auth/register
 * 
 * Creates a new user account with email and password
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Mock user storage (will be replaced with Prisma when database is connected)
const mockUsers: Array<{
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}> = [
  {
    id: "1",
    email: "christine@thrivemenu.com",
    name: "Christine",
    password: bcrypt.hashSync("thrive123", 10),
    createdAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(mockUsers.length + 1),
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

