"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Clock, Star, Filter, Sun, Moon, Cookie, Zap, Calendar, Users, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import RecipeCard from "@/components/recipe/RecipeCard";
import { allRecipes, getRecipeById } from "@/data/recipes";
import { useAuth } from "@/hooks/useAuth";

const filterTabs = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snacks" },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "rating">("recent");
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-rose-500" />
          </div>
          <h1
            className="text-2xl font-medium text-forest-900 mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Sign in to save recipes
          </h1>
          <p className="text-gray-600 mb-6">
            Create an account to save your favorite recipes, rate dishes, and plan meals for your family.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl bg-sage-500 text-white font-medium hover:bg-sage-600 transition-colors mb-3"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/register")}
            className="w-full py-3 rounded-xl bg-white border-2 border-sage-500 text-sage-600 font-medium hover:bg-sage-50 transition-colors"
          >
            Create Account
          </button>
          <p className="mt-6 text-sm text-gray-500">
            Or{" "}
            <button
              onClick={() => router.push("/explore")}
              className="text-sage-600 font-medium underline"
            >
              continue browsing recipes
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Fetch user's favorites
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingFavorites(true);
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          const favoriteIds = data.favorites?.map((f: any) => f.recipeId) || [];
          const recipes = favoriteIds
            .map((id: string) => getRecipeById(id))
            .filter((r: any) => r !== null);
          setFavoriteRecipes(recipes);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
        })
        .finally(() => {
          setIsLoadingFavorites(false);
        });
    }
  }, [isAuthenticated]);

  const filteredFavorites =
    activeTab === "all"
      ? favoriteRecipes
      : favoriteRecipes.filter(
          (r) => r.mealType.toLowerCase() === activeTab
        );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-2xl font-medium text-forest-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Saved Recipes
          </h1>
          <div className="flex items-center gap-1 text-rose-500">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-medium">{favoriteRecipes.length}</span>
          </div>
        </div>
        <p className="text-gray-600">
          Your favorite recipes, all in one place
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-sage-500 text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-5 py-2 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredFavorites.length} saved recipes
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-transparent text-gray-600 outline-none cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name A-Z</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="px-5 py-4">
        {isLoadingFavorites ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 stagger-children">
            {filteredFavorites.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>

      {/* Recently Cooked Section */}
      {activeTab === "all" && favoriteRecipes.length > 0 && (
        <section className="px-5 py-6">
          <h2
            className="text-lg font-medium text-forest-900 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recently Cooked
          </h2>
          <div className="space-y-3">
            {favoriteRecipes.slice(0, 3).map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-300 flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-sage-100">
                  {recipe.mealType === "BREAKFAST" ? (
                    <Sun className="w-6 h-6 text-sage-600" />
                  ) : recipe.mealType === "LUNCH" ? (
                    <Sun className="w-6 h-6 text-sage-600" />
                  ) : recipe.mealType === "DINNER" ? (
                    <Moon className="w-6 h-6 text-sage-600" />
                  ) : (
                    <Cookie className="w-6 h-6 text-sage-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-forest-900 truncate">
                    {recipe.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cooked {idx === 0 ? "today" : idx === 1 ? "yesterday" : "3 days ago"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-terracotta-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= 4 ? "fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collection Suggestions */}
      <section className="px-5 py-4 mb-4">
        <h2
          className="text-lg font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Create a Collection
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Quick Weeknight Dinners", icon: Zap, count: 0 },
            { name: "Sunday Meal Prep", icon: Calendar, count: 0 },
            { name: "Kids' Favorites", icon: Sparkles, count: 0 },
            { name: "Date Night", icon: Heart, count: 0 },
          ].map((collection, idx) => {
            const Icon = collection.icon;
            return (
            <button
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 border-dashed text-left hover:border-sage-300 transition-all"
            >
              <Icon className="w-6 h-6 text-sage-600 mb-2" />
              <p className="font-medium text-forest-900 mt-2 text-sm">
                {collection.name}
              </p>
              <p className="text-xs text-gray-500">
                {collection.count} recipes
              </p>
            </button>
          );
          })}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
        <Heart className="w-10 h-10 text-rose-400" />
      </div>
      <h3
        className="text-lg font-medium text-forest-900 mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        No {activeTab === "all" ? "" : activeTab} favorites yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        Start exploring recipes and tap the heart to save your favorites here
      </p>
      <a href="/explore" className="btn-primary inline-flex items-center gap-2">
        Explore Recipes
      </a>
    </div>
  );
}

