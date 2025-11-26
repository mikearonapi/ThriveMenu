"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, Clock, Heart, Leaf, Fish, ChefHat, Sun, Moon, Cookie, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import RecipeCard from "@/components/recipe/RecipeCard";

const mealTabs = [
  { id: "all", label: "All", icon: null },
  { id: "breakfast", label: "Breakfast", icon: Sun },
  { id: "lunch", label: "Lunch", icon: Sun },
  { id: "dinner", label: "Dinner", icon: Moon },
  { id: "snack", label: "Snacks", icon: Cookie },
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
  const router = useRouter();
  const initialMeal = searchParams.get("meal") || "all";
  const addToPlanDate = searchParams.get("addToPlan");
  const addToPlanMealType = searchParams.get("mealType");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(initialMeal);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToPlan, setIsAddingToPlan] = useState<string | null>(null);
  const [showKidFriendlyFilter, setShowKidFriendlyFilter] = useState(false);
  const [mealCounts, setMealCounts] = useState<Record<string, number>>({
    all: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  });

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Fetch recipes from database
  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      try {
        const mealTypeMap: Record<string, string> = {
          breakfast: "BREAKFAST",
          lunch: "LUNCH",
          dinner: "DINNER",
          snack: "SNACK",
        };

        const mealType = selectedMeal !== "all" ? mealTypeMap[selectedMeal] : undefined;
        const searchParam = searchQuery.trim() || undefined;

        const url = new URL("/api/recipes", window.location.origin);
        if (mealType) url.searchParams.set("mealType", mealType);
        if (searchParam) url.searchParams.set("search", searchParam);
        if (showKidFriendlyFilter) url.searchParams.set("kidFriendly", "true");
        url.searchParams.set("limit", "100");

        const response = await fetch(url.toString());
        const data = await response.json();
        
        let filtered = data.recipes || [];

        // Client-side filtering for health filters
        if (activeFilters.length > 0) {
          filtered = filtered.filter((recipe: any) => {
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

        setRecipes(filtered);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [selectedMeal, searchQuery, activeFilters, showKidFriendlyFilter]);

  // Fetch meal counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [all, breakfast, lunch, dinner, snack] = await Promise.all([
          fetch("/api/recipes?limit=1").then((r) => r.json()),
          fetch("/api/recipes?mealType=BREAKFAST&limit=1").then((r) => r.json()),
          fetch("/api/recipes?mealType=LUNCH&limit=1").then((r) => r.json()),
          fetch("/api/recipes?mealType=DINNER&limit=1").then((r) => r.json()),
          fetch("/api/recipes?mealType=SNACK&limit=1").then((r) => r.json()),
        ]);

        setMealCounts({
          all: all.total || 0,
          breakfast: breakfast.total || 0,
          lunch: lunch.total || 0,
          dinner: dinner.total || 0,
          snack: snack.total || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }
    fetchCounts();
  }, []);

  const filteredRecipes = recipes;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Search & Filters Section */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--cream-200)' }}>
        <div className="container-app py-3">
          {/* Page Title */}
          <h1
            className="text-lg sm:text-xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
          >
            Explore Recipes
          </h1>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: 'var(--cream-200)', focusRing: 'var(--teal-500)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            )}
          </div>

          {/* Meal Type Tabs */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {mealTabs.map((tab) => {
              const Icon = tab.icon;
              const count = mealCounts[tab.id as keyof typeof mealCounts] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMeal(tab.id)}
                  className={cn(
                    "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1",
                    selectedMeal === tab.id
                      ? "text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                  style={selectedMeal === tab.id ? { backgroundColor: 'var(--teal-600)' } : {}}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {tab.label}
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container-app py-2.5">
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
              showFilters || activeFilters.length > 0
                ? "border"
                : "bg-white text-gray-600 border"
            )}
            style={(showFilters || activeFilters.length > 0) ? { 
              backgroundColor: 'var(--teal-50)', 
              color: 'var(--teal-700)',
              borderColor: 'var(--teal-200)'
            } : { borderColor: 'var(--cream-200)' }}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ backgroundColor: 'var(--teal-500)' }}>
                {activeFilters.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowKidFriendlyFilter(!showKidFriendlyFilter)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
              showKidFriendlyFilter
                ? "bg-terracotta-100 text-terracotta-700 border-terracotta-200"
                : "bg-white text-gray-600 hover:border-terracotta-300"
            )}
            style={!showKidFriendlyFilter ? { borderColor: 'var(--cream-200)' } : {}}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Kid-Friendly
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-1.5 mt-2 animate-slide-up">
            {healthFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                    isActive
                      ? "text-white"
                      : "bg-white text-gray-600 border"
                  )}
                  style={isActive ? { backgroundColor: 'var(--teal-600)' } : { borderColor: 'var(--cream-200)' }}
                >
                  <Icon className="w-3 h-3" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <p className="text-xs text-gray-500 mt-2">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="container-app pb-28">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3
              className="text-base font-medium mb-1"
              style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
            >
              No recipes found
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Try adjusting your filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilters([]);
                setSelectedMeal("all");
                setShowKidFriendlyFilter(false);
              }}
              className="text-sm font-medium px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
