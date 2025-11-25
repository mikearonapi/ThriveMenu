"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, Clock, Heart, Leaf, Fish, ChefHat, Sun, Moon, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import RecipeCard from "@/components/recipe/RecipeCard";
import {
  allRecipes,
  breakfastRecipes,
  lunchRecipes,
  dinnerRecipes,
  snackRecipes,
  searchRecipes,
} from "@/data/recipes";

const mealTabs = [
  { id: "all", label: "All", count: allRecipes.length, icon: null },
  { id: "breakfast", label: "Breakfast", count: breakfastRecipes.length, icon: Sun },
  { id: "lunch", label: "Lunch", count: lunchRecipes.length, icon: Sun },
  { id: "dinner", label: "Dinner", count: dinnerRecipes.length, icon: Moon },
  { id: "snack", label: "Snacks", count: snackRecipes.length, icon: Cookie },
];

const healthFilters = [
  { id: "omega3", label: "Omega-3 Rich", icon: Fish },
  { id: "fiber", label: "High Fiber", icon: Leaf },
  { id: "quick", label: "Under 30 min", icon: Clock },
  { id: "kidFriendly", label: "Kid-Friendly", icon: ChefHat },
  { id: "heartHealthy", label: "Heart Healthy", icon: Heart },
];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialMeal = searchParams.get("meal") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(initialMeal);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredRecipes = useMemo(() => {
    let recipes = allRecipes;

    // Filter by meal type
    if (selectedMeal !== "all") {
      const mealTypeMap: Record<string, string> = {
        breakfast: "BREAKFAST",
        lunch: "LUNCH",
        dinner: "DINNER",
        snack: "SNACK",
      };
      recipes = recipes.filter((r) => r.mealType === mealTypeMap[selectedMeal]);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      recipes = searchRecipes(searchQuery).filter((r) =>
        selectedMeal === "all"
          ? true
          : r.mealType ===
            { breakfast: "BREAKFAST", lunch: "LUNCH", dinner: "DINNER", snack: "SNACK" }[
              selectedMeal
            ]
      );
    }

    // Filter by health filters
    if (activeFilters.length > 0) {
      recipes = recipes.filter((recipe) => {
        return activeFilters.every((filter) => {
          switch (filter) {
            case "omega3":
              return recipe.hasOmega3;
            case "fiber":
              return recipe.hasHighFiber;
            case "quick":
              return recipe.isQuick || (recipe.totalTime && recipe.totalTime <= 30);
            case "kidFriendly":
              return recipe.isKidFriendly;
            case "heartHealthy":
              return recipe.isHeartHealthy || recipe.hasHighFiber;
            default:
              return true;
          }
        });
      });
    }

    return recipes;
  }, [selectedMeal, searchQuery, activeFilters]);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-5 pt-4 pb-4 border-b border-gray-200">
        <h1
          className="text-2xl font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Explore Recipes
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Meal Type Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
          {mealTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedMeal(tab.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                  selectedMeal === tab.id
                    ? "bg-sage-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
                <span className="opacity-70">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Filter Toggle */}
      <div className="px-5 py-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            showFilters || activeFilters.length > 0
              ? "bg-sage-100 text-sage-700"
              : "bg-white text-gray-600 border border-gray-200"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-sage-500 text-white text-xs flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3 animate-slide-up">
            {healthFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "bg-sage-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-5 py-2">
        <p className="text-sm text-gray-600">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="px-5 pb-8">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 stagger-children">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3
              className="text-lg font-medium text-forest-900 mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              No recipes found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilters([]);
                setSelectedMeal("all");
              }}
              className="btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

