"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Heart,
  Clock,
  ChefHat,
  Sparkles,
  ArrowRight,
  Sun,
  Salad,
  Moon,
  Cookie,
} from "lucide-react";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { HealthGoalCard } from "@/components/health/HealthGoalCard";
import { QuickFilterChip } from "@/components/ui/QuickFilterChip";
import { breakfastRecipes, lunchRecipes, dinnerRecipes, snackRecipes } from "@/data/recipes";

// Get current meal suggestion based on time of day
function getCurrentMealSuggestion() {
  const hour = new Date().getHours();
  if (hour < 11) return { type: "BREAKFAST", label: "breakfast", icon: Sun, recipes: breakfastRecipes };
  if (hour < 15) return { type: "LUNCH", label: "lunch", icon: Salad, recipes: lunchRecipes };
  if (hour < 19) return { type: "DINNER", label: "dinner", icon: Moon, recipes: dinnerRecipes };
  return { type: "SNACK", label: "evening snack", icon: Cookie, recipes: snackRecipes };
}

export default function HomePage() {
  const currentMeal = getCurrentMealSuggestion();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const quickFilters = [
    { id: "quick", label: "Under 30 min", icon: Clock },
    { id: "heart", label: "Heart Healthy", icon: Heart },
    { id: "kid", label: "Kid-Friendly", icon: Sparkles },
    { id: "omega3", label: "Omega-3 Rich", icon: Leaf },
  ];

  // Get a few featured recipes for the current meal
  const featuredRecipes = currentMeal.recipes.slice(0, 6);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Decorative Background */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: "var(--gradient-hero)",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10c5.5 0 10 4.5 10 10s-4.5 10-10 10' fill='%2387a878' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-5 pt-12 pb-8">
          {/* Greeting */}
          <div className="mb-6 animate-fade-in">
            <p className="text-[var(--sage-600)] text-sm font-medium mb-1">
              Good {getTimeOfDay()}, Christine ✨
            </p>
            <h1
              className="text-3xl font-medium text-[var(--forest-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What shall we
              <br />
              cook today?
            </h1>
          </div>

          {/* Current Meal Suggestion Card */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--sage-100)] flex items-center justify-center">
                <currentMeal.icon className="w-5 h-5 text-[var(--sage-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Perfect for {currentMeal.label}
                </p>
                <p
                  className="text-lg font-medium text-[var(--forest-800)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {featuredRecipes[0]?.name || "Golden Turmeric Oatmeal"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                25 min
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-[var(--rose-400)]" />
                Anti-inflammatory
              </span>
            </div>
            <Link
              href={`/recipe/${featuredRecipes[0]?.id || "golden-turmeric-oatmeal"}`}
              className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              Let&apos;s Cook This
            </Link>
          </div>
        </div>
      </header>

      {/* Health Goals Section */}
      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-medium text-[var(--forest-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Your Health Goals
          </h2>
          <Link
            href="/health"
            className="text-sm text-[var(--sage-600)] font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5 stagger-children">
          <HealthGoalCard
            title="Omega-3s"
            subtitle="2x this week"
            progress={66}
            icon="🐟"
            color="sage"
          />
          <HealthGoalCard
            title="Fiber"
            subtitle="25g daily"
            progress={80}
            icon="🥬"
            color="forest"
          />
          <HealthGoalCard
            title="Heart Health"
            subtitle="On track"
            progress={90}
            icon="❤️"
            color="rose"
          />
        </div>
      </section>

      {/* Quick Filters */}
      <section className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
          {quickFilters.map((filter) => (
            <QuickFilterChip
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              isActive={selectedFilter === filter.id}
              onClick={() =>
                setSelectedFilter(
                  selectedFilter === filter.id ? null : filter.id
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Breakfast Recipes */}
      <section className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌅</span>
            <h2
              className="text-xl font-medium text-[var(--forest-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Breakfast
            </h2>
          </div>
          <Link
            href="/explore?meal=breakfast"
            className="text-sm text-[var(--sage-600)] font-medium"
          >
            See All {breakfastRecipes.length}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 stagger-children">
          {breakfastRecipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </section>

      {/* Lunch Recipes */}
      <section className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <h2
              className="text-xl font-medium text-[var(--forest-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Lunch
            </h2>
          </div>
          <Link
            href="/explore?meal=lunch"
            className="text-sm text-[var(--sage-600)] font-medium"
          >
            See All {lunchRecipes.length}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 stagger-children">
          {lunchRecipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </section>

      {/* Dinner Recipes */}
      <section className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h2
              className="text-xl font-medium text-[var(--forest-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Dinner
            </h2>
          </div>
          <Link
            href="/explore?meal=dinner"
            className="text-sm text-[var(--sage-600)] font-medium"
          >
            See All {dinnerRecipes.length}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 stagger-children">
          {dinnerRecipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </section>

      {/* Snacks Section */}
      <section className="px-5 py-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍎</span>
            <h2
              className="text-xl font-medium text-[var(--forest-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Snacks & Beverages
            </h2>
          </div>
          <Link
            href="/explore?meal=snack"
            className="text-sm text-[var(--sage-600)] font-medium"
          >
            See All {snackRecipes.length}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 stagger-children">
          {snackRecipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </section>

      {/* Wellness Tip Card */}
      <section className="px-5 pb-8">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--sage-100) 0%, var(--forest-100) 100%)",
          }}
        >
          <div className="relative z-10">
            <p className="text-sm font-medium text-[var(--sage-700)] mb-1">
              💚 Daily Tip for Graves&apos; Disease
            </p>
            <p
              className="text-[var(--forest-800)] text-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Take thyroid medication 30-60 min before eating. Avoid calcium-rich
              foods and soy near medication time.
            </p>
          </div>
          <div
            className="absolute -right-4 -bottom-4 text-8xl opacity-10"
            aria-hidden
          >
            🌿
          </div>
        </div>
      </section>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
