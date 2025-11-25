"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Users,
  ChefHat,
  Flame,
  Leaf,
  Fish,
  Star,
  Plus,
  Minus,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecipeById } from "@/data/recipes";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [servings, setServings] = useState(4);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");

  const recipe = getRecipeById(params.id as string);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-6xl mb-4">🍽️</p>
          <h1 className="text-2xl font-medium text-[var(--forest-800)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Recipe Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            We couldn&apos;t find this recipe. Try browsing our collection.
          </p>
          <button onClick={() => router.push("/explore")} className="btn-primary">
            Explore Recipes
          </button>
        </div>
      </div>
    );
  }

  // Placeholder ingredients (would come from database)
  const placeholderIngredients = [
    { amount: "1", unit: "cup", name: "steel-cut oats", preparation: "" },
    { amount: "2", unit: "cups", name: "almond milk", preparation: "" },
    { amount: "1", unit: "tsp", name: "turmeric", preparation: "ground" },
    { amount: "½", unit: "tsp", name: "cinnamon", preparation: "ground" },
    { amount: "¼", unit: "cup", name: "walnuts", preparation: "chopped" },
    { amount: "½", unit: "cup", name: "mixed berries", preparation: "fresh or frozen" },
    { amount: "1", unit: "tbsp", name: "maple syrup", preparation: "optional" },
  ];

  // Placeholder instructions
  const placeholderInstructions = [
    "Bring almond milk to a gentle boil in a medium saucepan over medium heat.",
    "Add steel-cut oats, turmeric, and cinnamon. Stir to combine.",
    "Reduce heat to low and simmer for 20-25 minutes, stirring occasionally, until oats are tender and creamy.",
    "Remove from heat and let stand for 2 minutes to thicken slightly.",
    "Divide between bowls and top with walnuts, berries, and a drizzle of maple syrup if desired.",
    "Serve warm and enjoy!",
  ];

  return (
    <div className="min-h-screen pb-24 bg-[var(--cream-100)]">
      {/* Hero Image / Placeholder */}
      <div
        className="h-72 relative"
        style={{
          background: `linear-gradient(135deg, var(--sage-200) 0%, var(--cream-200) 50%, var(--rose-100) 100%)`,
        }}
      >
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--forest-800)]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all",
                isFavorited
                  ? "bg-[var(--rose-500)] text-white"
                  : "bg-white/90 backdrop-blur-sm text-[var(--text-secondary)]"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Category Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-50">
            {recipe.mealType === "BREAKFAST" ? "🌅" : recipe.mealType === "LUNCH" ? "☀️" : recipe.mealType === "DINNER" ? "🌙" : "🍎"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-8 bg-[var(--cream-100)] rounded-t-[2rem] px-5 pt-6">
        {/* Title Section */}
        <div className="mb-6">
          <p className="text-sm text-[var(--sage-600)] font-medium mb-1">
            {recipe.category}
          </p>
          <h1
            className="text-2xl font-medium text-[var(--forest-800)] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Meta Cards */}
        <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar -mx-5 px-5">
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-[var(--cream-300)]">
            <Clock className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-[var(--forest-800)]">{recipe.totalTime || 25} min</p>
            <p className="text-xs text-[var(--text-muted)]">Total Time</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-[var(--cream-300)]">
            <Users className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-[var(--forest-800)]">{recipe.servings || 4}</p>
            <p className="text-xs text-[var(--text-muted)]">Servings</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-[var(--cream-300)]">
            <ChefHat className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-[var(--forest-800)]">Easy</p>
            <p className="text-xs text-[var(--text-muted)]">Difficulty</p>
          </div>
        </div>

        {/* Health Benefits Card */}
        <div className="bg-gradient-to-br from-[var(--sage-50)] to-[var(--forest-50)] rounded-2xl p-4 mb-6">
          <h3 className="font-medium text-[var(--forest-700)] mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Why It&apos;s Great for You
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {recipe.healthBenefits}
          </p>
          <div className="flex flex-wrap gap-2">
            {recipe.keyNutrients.map((nutrient, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[var(--forest-700)]"
              >
                {nutrient}
              </span>
            ))}
          </div>
        </div>

        {/* Health Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.hasOmega3 && (
            <span className="health-badge heart-healthy">
              <Fish className="w-4 h-4" />
              Omega-3 Rich
            </span>
          )}
          {recipe.isAntiInflammatory && (
            <span className="health-badge thyroid-friendly">
              <Flame className="w-4 h-4" />
              Anti-inflammatory
            </span>
          )}
          {recipe.hasHighFiber && (
            <span className="health-badge blood-sugar">
              <Leaf className="w-4 h-4" />
              High Fiber
            </span>
          )}
          {recipe.isKidFriendly && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--terracotta-100)] text-[var(--terracotta-700)] flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              Kid-Friendly
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "ingredients"
                ? "bg-[var(--sage-500)] text-white"
                : "bg-white text-[var(--text-secondary)] border border-[var(--cream-300)]"
            )}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "instructions"
                ? "bg-[var(--sage-500)] text-white"
                : "bg-white text-[var(--text-secondary)] border border-[var(--cream-300)]"
            )}
          >
            Instructions
          </button>
        </div>

        {/* Servings Adjuster */}
        {activeTab === "ingredients" && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-4 shadow-sm border border-[var(--cream-300)]">
            <span className="text-sm font-medium text-[var(--forest-800)]">
              Adjust Servings
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 rounded-full bg-[var(--cream-200)] flex items-center justify-center"
              >
                <Minus className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <span className="w-8 text-center font-medium text-[var(--forest-800)]">
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 rounded-full bg-[var(--sage-500)] flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Ingredients List */}
        {activeTab === "ingredients" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--cream-300)]">
            <ul className="space-y-3">
              {placeholderIngredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--sage-300)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium text-[var(--forest-800)]">
                      {ing.amount} {ing.unit}
                    </span>{" "}
                    <span className="text-[var(--text-secondary)]">{ing.name}</span>
                    {ing.preparation && (
                      <span className="text-[var(--text-muted)]">, {ing.preparation}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {activeTab === "instructions" && (
          <div className="space-y-4">
            {placeholderInstructions.map((instruction, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--cream-300)]"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--sage-500)] text-white flex items-center justify-center flex-shrink-0 font-medium">
                    {idx + 1}
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed pt-1">
                    {instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tip Card */}
        <div className="mt-6 bg-gradient-to-br from-[var(--rose-50)] to-[var(--terracotta-50)] rounded-2xl p-4">
          <h3 className="font-medium text-[var(--terracotta-700)] mb-2 flex items-center gap-2">
            💡 Christine&apos;s Tip
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            For Graves&apos; Disease: The turmeric in this recipe is wonderfully anti-inflammatory.
            Remember to take your thyroid medication 30-60 minutes before eating.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 btn-primary flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            Start Cooking
          </button>
          <button className="w-14 h-14 rounded-xl bg-white border border-[var(--sage-200)] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[var(--sage-600)]" />
          </button>
        </div>

        {/* Rating Section */}
        <div className="mt-8 mb-4">
          <h3
            className="text-lg font-medium text-[var(--forest-800)] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rate This Recipe
          </h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Star
                  className={cn(
                    "w-7 h-7",
                    star <= 3 ? "text-[var(--terracotta-400)] fill-current" : "text-[var(--cream-400)]"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

