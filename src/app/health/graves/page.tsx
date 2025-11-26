"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Leaf, Fish, Info } from "lucide-react";
import Link from "next/link";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function GravesGuidelinesPage() {
  const router = useRouter();
  const [guidelines, setGuidelines] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [guidelinesRes, recipesRes] = await Promise.all([
          fetch("/api/health/graves-guidelines"),
          fetch("/api/recipes?healthFilter=selenium-rich&healthFilter=anti-inflammatory"),
        ]);

        if (guidelinesRes.ok) {
          const guidelinesData = await guidelinesRes.json();
          setGuidelines(guidelinesData);
        }

        if (recipesRes.ok) {
          const recipesData = await recipesRes.json();
          setRecipes(recipesData.recipes || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
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
              className="text-2xl font-medium text-forest-900"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Graves Disease Guidelines
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Nutritional support for thyroid health
            </p>
          </div>
        </div>
      </header>

      {/* Guidelines */}
      {guidelines && (
        <div className="px-5 sm:px-6 md:px-8 lg:px-12 py-4 max-w-4xl mx-auto space-y-4 md:space-y-6">
          {guidelines.keyPrinciples.map((principle: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <h3 className="font-medium text-forest-900 mb-2 flex items-center gap-2">
                {principle.title === "Selenium-Rich Foods" && <Fish className="w-5 h-5 text-sage-600" />}
                {principle.title === "Anti-Inflammatory Foods" && <Leaf className="w-5 h-5 text-green-600" />}
                {principle.title.includes("Calcium") && <Heart className="w-5 h-5 text-blue-600" />}
                {!principle.title.includes("Selenium") && !principle.title.includes("Anti-Inflammatory") && !principle.title.includes("Calcium") && <Info className="w-5 h-5 text-gray-600" />}
                {principle.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {principle.foods.map((food: string, foodIdx: number) => (
                  <span
                    key={foodIdx}
                    className="px-2 py-1 bg-cream-100 text-forest-800 text-xs rounded-full"
                  >
                    {food}
                  </span>
                ))}
              </div>
              {principle.tip && (
                <p className="text-xs text-sage-600 mt-2 italic">{principle.tip}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommended Recipes */}
      {recipes.length > 0 && (
        <div className="px-5 sm:px-6 md:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900 mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recommended Recipes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {recipes.slice(0, 6).map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

