"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function CholesterolFriendlyPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/health/cholesterol-friendly");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data.recipes || []);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-cream-100">
      {/* Header */}
      <header className="px-5 sm:px-6 md:px-8 lg:px-12 pt-12 pb-6 bg-gradient-to-b from-sage-50 to-cream-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1
              className="text-2xl font-medium text-forest-900 flex items-center gap-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <Heart className="w-6 h-6 text-rose-500" />
              Heart-Healthy Recipes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Low cholesterol, heart-healthy options
            </p>
          </div>
        </div>
      </header>

      {/* Recipes */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe: any) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

