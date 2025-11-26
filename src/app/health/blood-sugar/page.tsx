"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf, Info } from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function BloodSugarPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/health/blood-sugar");
        if (response.ok) {
          const data = await response.json();
          setData(data);
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
    <div className="min-h-screen pb-24 bg-cream-100">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 bg-gradient-to-b from-sage-50 to-cream-100">
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
              <Leaf className="w-6 h-6 text-green-600" />
              Blood Sugar Balance
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Recipes and tips for stable blood sugar
            </p>
          </div>
        </div>
      </header>

      {/* Tips */}
      {data?.tips && (
        <div className="px-5 py-4 space-y-3">
          {data.tips.map((tip: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <h3 className="font-medium text-forest-900 mb-1 flex items-center gap-2">
                <Info className="w-4 h-4 text-sage-600" />
                {tip.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
              <p className="text-xs text-sage-600 italic">Example: {tip.example}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recipes */}
      {data?.recipes && data.recipes.length > 0 && (
        <div className="px-5 py-4">
          <h2
            className="text-lg font-medium text-forest-900 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Blood Sugar-Friendly Recipes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

