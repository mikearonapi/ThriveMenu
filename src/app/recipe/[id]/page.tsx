"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  Sun,
  Moon,
  Cookie,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RatingStars from "@/components/recipe/RatingStars";

interface RecipeData {
  id: string;
  name: string;
  description: string;
  category: string;
  mealType: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings: number;
  difficulty?: string;
  imageUrl?: string;
  healthBenefits: string;
  isKidFriendly?: boolean;
  isQuick?: boolean;
  hasOmega3?: boolean;
  hasHighFiber?: boolean;
  isAntiInflammatory?: boolean;
  isHeartHealthy?: boolean;
  healthTags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  ingredients?: Array<{
    amount: number;
    unit: string;
    name: string;
    preparation?: string;
    notes?: string;
    isOptional?: boolean;
  }>;
  instructions?: Array<{
    stepNumber: number;
    instruction: string;
    tipText?: string;
    durationMinutes?: number;
  }>;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    sugar: number;
    fat: number;
    saturatedFat: number;
    cholesterol: number;
    sodium: number;
    omega3?: number;
  };
  tips?: Array<{
    tipType: string;
    content: string;
  }>;
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [servings, setServings] = useState(4);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [ratingData, setRatingData] = useState<{
    averageRating: number;
    totalRatings: number;
    userRating: number | null;
  } | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recipe from database
  useEffect(() => {
    async function fetchRecipe() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/recipes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setServings(data.servings || 4);
        } else {
          setRecipe(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setRecipe(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipe();
  }, [params.id]);

  // Check if recipe is favorited on mount
  useEffect(() => {
    if (isAuthenticated && recipe) {
      fetch(`/api/favorites/${recipe.id}`)
        .then((res) => res.json())
        .then((data) => setIsFavorited(data.isFavorited || false))
        .catch(() => {
          // Check favorites list instead
          fetch("/api/favorites")
            .then((res) => res.json())
            .then((data) => {
              const favoriteIds = data.favorites?.map((f: any) => f.recipeId) || [];
              setIsFavorited(favoriteIds.includes(recipe.id));
            })
            .catch(() => {});
        });
    }
  }, [recipe?.id, isAuthenticated]);

  // Fetch rating data on mount
  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch(`/api/recipes/${params.id}/ratings`);
        if (response.ok) {
          const data = await response.json();
          setRatingData({
            averageRating: data.averageRating || 0,
            totalRatings: data.totalRatings || 0,
            userRating: data.userRating || null,
          });
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    fetchRatings();
  }, [params.id, isAuthenticated]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Recipe Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find this recipe. Try browsing our collection.
          </p>
          <button onClick={() => router.push("/explore")} className="btn-primary">
            Explore Recipes
          </button>
        </div>
      </div>
    );
  }

  // Get ingredients and instructions from recipe data
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions?.map((inst) => inst.instruction) || [];
  const tips = recipe.tips?.map((tip) => tip.content) || [];

  const baseServings = recipe.servings || 4;

  // Fetch rating data on mount
  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch(`/api/recipes/${params.id}/ratings`);
        if (response.ok) {
          const data = await response.json();
          setRatingData({
            averageRating: data.averageRating || 0,
            totalRatings: data.totalRatings || 0,
            userRating: data.ratings?.find((r: any) => r.userId === "current")?.rating || null,
          });
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    fetchRatings();
  }, [params.id]);

  return (
    <div className="min-h-screen pb-24 style={{ backgroundColor: 'var(--cream-100)' }}">
      {/* Hero Image / Placeholder */}
      <div
        className="h-72 relative"
        style={{
          background: 'linear-gradient(135deg, var(--sage-200) 0%, var(--cream-200) 50%, var(--rose-100) 100%)',
        }}
      >
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-forest-900" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!isAuthenticated) {
                  setShowLoginPrompt(true);
                  return;
                }

                setIsFavoriting(true);
                try {
                  if (isFavorited) {
                    // Remove favorite
                    const response = await fetch(`/api/favorites?recipeId=${params.id}`, {
                      method: "DELETE",
                    });
                    if (response.ok) {
                      setIsFavorited(false);
                    }
                  } else {
                    // Add favorite
                    const response = await fetch("/api/favorites", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ recipeId: params.id }),
                    });
                    if (response.ok) {
                      setIsFavorited(true);
                    }
                  }
                } catch (error) {
                  console.error("Error toggling favorite:", error);
                } finally {
                  setIsFavoriting(false);
                }
              }}
              disabled={isFavoriting}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all",
                isFavorited
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-600",
                isFavoriting && "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {recipe.mealType === "BREAKFAST" ? (
            <Sun className="w-24 h-24 text-sage-200 opacity-50" />
          ) : recipe.mealType === "LUNCH" ? (
            <Sun className="w-24 h-24 text-sage-200 opacity-50" />
          ) : recipe.mealType === "DINNER" ? (
            <Moon className="w-24 h-24 text-sage-200 opacity-50" />
          ) : (
            <Cookie className="w-24 h-24 text-sage-200 opacity-50" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-8 style={{ backgroundColor: 'var(--cream-100)' }} rounded-t-[2rem] px-5 pt-6">
        {/* Title Section */}
        <div className="mb-6">
          <p className="text-sm text-sage-600 font-medium mb-1">
            {recipe.category}
          </p>
          <h1
            className="text-2xl font-medium text-forest-900 mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Meta Cards */}
        <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar -mx-5 px-5">
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-300">
            <Clock className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-forest-900">{recipe.totalTime || 25} min</p>
            <p className="text-xs text-gray-500">Total Time</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-300">
            <Users className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-forest-900">{recipe.servings || 4}</p>
            <p className="text-xs text-gray-500">Servings</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-300">
            <ChefHat className="w-5 h-5 text-[var(--sage-500)] mb-1" />
            <p className="text-sm font-medium text-forest-900">Easy</p>
            <p className="text-xs text-gray-500">Difficulty</p>
          </div>
        </div>

        {/* Health Benefits Card */}
        <div className="bg-gradient-to-br from-sage-50 rounded-2xl p-4 mb-6" style={{ background: 'linear-gradient(to bottom right, var(--sage-50), var(--forest-50))' }}>
          <h3 className="font-medium text-forest-700 mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Why It&apos;s Great for You
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {recipe.healthBenefits}
          </p>
          <div className="flex flex-wrap gap-2">
            {recipe.healthTags?.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white text-forest-700"
              >
                {tag.name}
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
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-terracotta-100 text-terracotta-700 flex items-center gap-1.5">
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
                ? "bg-sage-500 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            )}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "instructions"
                ? "bg-sage-500 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            )}
          >
            Instructions
          </button>
        </div>

        {/* Servings Adjuster */}
        {activeTab === "ingredients" && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-300">
            <span className="text-sm font-medium text-forest-900">
              Adjust Servings
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-forest-900">
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 rounded-full bg-sage-500 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Ingredients List */}
        {activeTab === "ingredients" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
            <ul className="space-y-3">
              {ingredients.map((ing: any, idx: number) => {
                // Calculate scaled amounts based on servings
                const scale = servings / baseServings;
                const amountValue = typeof ing.amount === 'number' ? ing.amount : parseFloat(String(ing.amount)) || 0;
                const scaledAmount = amountValue > 0 ? (amountValue * scale).toFixed(1) : '';
                
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-sage-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-forest-900">
                        {scaledAmount || ing.amount} {ing.unit}
                      </span>{" "}
                      <span className="text-gray-600">{ing.name}</span>
                      {ing.preparation && (
                        <span className="text-gray-500">, {ing.preparation}</span>
                      )}
                      {ing.notes && (
                        <span className="text-gray-400 text-sm"> ({ing.notes})</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {activeTab === "instructions" && (
          <div className="space-y-4 md:space-y-6">
            {instructions.length > 0 ? (
              instructions.map((instruction: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300"
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sage-500 text-white flex items-center justify-center flex-shrink-0 font-medium">
                      {idx + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      {instruction}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300 text-center text-gray-500">
                <p>Instructions coming soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Tips Card */}
        {tips.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-rose-50 rounded-2xl p-4" style={{ background: 'linear-gradient(to bottom right, var(--rose-50), var(--terracotta-50))' }}>
            <h3 className="font-medium text-terracotta-700 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Christine&apos;s Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-terracotta-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nutrition Card */}
        {recipe.nutrition && (
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
            <h3 className="font-medium text-forest-900 mb-3">Nutrition Per Serving</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="style={{ backgroundColor: 'var(--cream-100)' }} rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.calories || 0}</p>
                <p className="text-xs text-gray-500">Calories</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.protein || 0}g</p>
                <p className="text-xs text-gray-500">Protein</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.carbs || 0}g</p>
                <p className="text-xs text-gray-500">Carbs</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.fat || 0}g</p>
                <p className="text-xs text-gray-500">Fat</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.fiber || 0}g</p>
                <p className="text-xs text-gray-500">Fiber</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-2">
                <p className="text-lg font-semibold text-forest-900">{recipe.nutrition?.sodium || 0}mg</p>
                <p className="text-xs text-gray-500">Sodium</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 btn-primary flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            Start Cooking
          </button>
          <button className="w-14 h-14 rounded-xl bg-white border border-sage-200 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-sage-600" />
          </button>
        </div>

        {/* Rating Section */}
        <div className="mt-8 mb-4">
          <h3
            className="text-lg font-medium text-forest-900 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rate This Recipe
          </h3>
          {!isAuthenticated ? (
            <div className="bg-sage-50 rounded-xl p-4 border border-sage-200">
              <p className="text-sm text-gray-600 mb-3">
                Sign in to rate this recipe and help others discover great meals.
              </p>
              <button
                onClick={() => router.push(`/login?redirect=/recipe/${params.id}`)}
                className="text-sm text-sage-600 font-medium hover:text-sage-700 underline"
              >
                Sign in to rate
              </button>
            </div>
          ) : (
            <RatingStars
              recipeId={params.id as string}
              initialRating={ratingData?.userRating || null}
              averageRating={ratingData?.averageRating}
              totalRatings={ratingData?.totalRatings}
              interactive={true}
              onRatingChange={(rating) => {
                // Refresh rating data after rating
                fetch(`/api/recipes/${params.id}/ratings`)
                  .then((res) => res.json())
                  .then((data) => {
                    setRatingData({
                      averageRating: data.averageRating || 0,
                      totalRatings: data.totalRatings || 0,
                      userRating: rating,
                    });
                  });
              }}
            />
          )}
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                Sign in to save recipes
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to save your favorite recipes and access them anytime.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    router.push("/login");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-sage-500 text-white font-medium hover:bg-sage-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

