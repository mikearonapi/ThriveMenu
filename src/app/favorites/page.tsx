"use client";

import { useState } from "react";
import { Heart, Clock, Star, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import RecipeCard from "@/components/recipe/RecipeCard";
import { breakfastRecipes, lunchRecipes, dinnerRecipes, snackRecipes } from "@/data/recipes";

// Sample favorites (would come from database/state)
const sampleFavorites = [
  breakfastRecipes[0], // Golden Turmeric Oatmeal
  breakfastRecipes[6], // Mediterranean Veggie Scramble
  lunchRecipes[1], // Salmon Nicoise
  lunchRecipes[29], // Buddha Bowl
  dinnerRecipes[0], // Lemon Herb Baked Salmon
  dinnerRecipes[10], // Chickpea Curry
  snackRecipes[0], // Apple with Almond Butter
];

const filterTabs = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snacks" },
];

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "rating">("recent");

  const filteredFavorites =
    activeTab === "all"
      ? sampleFavorites
      : sampleFavorites.filter(
          (r) => r.mealType.toLowerCase() === activeTab
        );

  return (
    <div className="min-h-screen pb-24 bg-[var(--cream-100)]">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-2xl font-medium text-[var(--forest-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Saved Recipes
          </h1>
          <div className="flex items-center gap-1 text-[var(--rose-500)]">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-medium">{sampleFavorites.length}</span>
          </div>
        </div>
        <p className="text-[var(--text-secondary)]">
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
                  ? "bg-[var(--sage-500)] text-white"
                  : "bg-white text-[var(--text-secondary)] border border-[var(--cream-300)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-5 py-2 flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          {filteredFavorites.length} saved recipes
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-transparent text-[var(--text-secondary)] outline-none cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name A-Z</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="px-5 py-4">
        {filteredFavorites.length > 0 ? (
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
      {activeTab === "all" && (
        <section className="px-5 py-6">
          <h2
            className="text-lg font-medium text-[var(--forest-800)] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recently Cooked
          </h2>
          <div className="space-y-3">
            {sampleFavorites.slice(0, 3).map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 shadow-sm border border-[var(--cream-300)] flex items-center gap-3"
              >
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--sage-100) 0%, var(--cream-200) 100%)`,
                  }}
                >
                  <span className="text-2xl">
                    {recipe.mealType === "BREAKFAST"
                      ? "🌅"
                      : recipe.mealType === "LUNCH"
                      ? "☀️"
                      : recipe.mealType === "DINNER"
                      ? "🌙"
                      : "🍎"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--forest-800)] truncate">
                    {recipe.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cooked {idx === 0 ? "today" : idx === 1 ? "yesterday" : "3 days ago"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[var(--terracotta-400)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= 4 ? "fill-current" : "text-[var(--cream-400)]"
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
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Create a Collection
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Quick Weeknight Dinners", icon: "⚡", count: 0 },
            { name: "Sunday Meal Prep", icon: "📅", count: 0 },
            { name: "Kids' Favorites", icon: "👧", count: 0 },
            { name: "Date Night", icon: "💕", count: 0 },
          ].map((collection, idx) => (
            <button
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-[var(--cream-300)] border-dashed text-left hover:border-[var(--sage-300)] transition-all"
            >
              <span className="text-2xl">{collection.icon}</span>
              <p className="font-medium text-[var(--forest-800)] mt-2 text-sm">
                {collection.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {collection.count} recipes
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-[var(--rose-100)] flex items-center justify-center mx-auto mb-4">
        <Heart className="w-10 h-10 text-[var(--rose-400)]" />
      </div>
      <h3
        className="text-lg font-medium text-[var(--forest-800)] mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        No {activeTab === "all" ? "" : activeTab} favorites yet
      </h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">
        Start exploring recipes and tap the heart to save your favorites here
      </p>
      <a href="/explore" className="btn-primary inline-flex items-center gap-2">
        Explore Recipes
      </a>
    </div>
  );
}

