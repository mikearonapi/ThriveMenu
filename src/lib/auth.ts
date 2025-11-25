// ThriveMenu Authentication Configuration
// Using NextAuth.js for user authentication

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

// Mock user database (will be replaced with Prisma later)
const mockUsers = [
  {
    id: "1",
    name: "Christine",
    email: "christine@thrivemenu.com",
    password: bcrypt.hashSync("thrive123", 10), // Default password for demo
    image: null,
    healthGoals: ["Graves-Friendly", "Heart-Healthy", "Blood-Sugar-Friendly"],
    familyMembers: [
      { id: "fm1", name: "Mike", role: "Spouse" },
      { id: "fm2", name: "Daughter", role: "Child", age: 6 },
      { id: "fm3", name: "Son", role: "Child", age: 4 },
      { id: "fm4", name: "Baby", role: "Child", age: 0.5 },
    ],
  },
  {
    id: "2",
    name: "Mike",
    email: "mike@thrivemenu.com",
    password: bcrypt.hashSync("thrive123", 10),
    image: null,
    healthGoals: [],
    familyMembers: [],
  },
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Keep JWT for now - can switch to database later
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper functions for auth
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

