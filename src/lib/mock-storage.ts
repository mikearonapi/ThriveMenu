/**
 * Shared Mock Storage
 * 
 * This file provides shared mock storage for development.
 * In production, this will be replaced with Prisma database queries.
 */

interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
}

interface Rating {
  id: string;
  userId: string;
  recipeId: string;
  rating: number;
  createdAt: Date;
}

// Shared mock storage (in-memory)
export const mockFavorites: Favorite[] = [];
export const mockRatings: Rating[] = [];

