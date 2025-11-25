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
  Moon,
  Coffee,
} from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";
import HealthGoalCard from "@/components/health/HealthGoalCard";
import QuickFilterChip from "@/components/ui/QuickFilterChip";
import { breakfastRecipes, lunchRecipes, dinnerRecipes, snackRecipes } from "@/data/recipes";

// Get current meal suggestion based on time of day
function getCurrentMealSuggestion() {
  const hour = new Date().getHours();
  if (hour < 11) return { type: "BREAKFAST", label: "breakfast", icon: Sun, recipes: breakfastRecipes };
  if (hour < 15) return { type: "LUNCH", label: "lunch", icon: Sun, recipes: lunchRecipes };
  if (hour < 19) return { type: "DINNER", label: "dinner", icon: Moon, recipes: dinnerRecipes };
  return { type: "SNACK", label: "evening snack", icon: Coffee, recipes: snackRecipes };
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
    <div className="min-h-screen pb-24 bg-[var(--cream-100)]">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white pb-6 rounded-b-[2rem] shadow-sm border-b border-[var(--cream-200)]">
        <div className="px-5 pt-12 pb-4">
          {/* Greeting */}
          <div className="mb-6 animate-fade-in">
            <p className="text-[var(--sage-600)] text-sm font-medium mb-1 tracking-wide uppercase">
              {getTimeOfDay()}, Christine
            </p>
            <h1
              className="text-4xl font-medium text-[var(--forest-900)] leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What shall we
              <br />
              <span className="text-[var(--sage-600)] italic">cook today?</span>
            </h1>
          </div>

          {/* Current Meal Suggestion Card */}
          <div
            className="bg-[var(--forest-900)] rounded-2xl p-6 shadow-xl text-white animate-slide-up relative overflow-hidden group cursor-pointer"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Background Image Effect */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
               {/* We can put a dynamic image here if we want, for now a gradient is fine */}
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--sage-800)] to-black" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <currentMeal.icon className="w-5 h-5 text-[var(--sage-200)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--sage-200)] font-medium uppercase tracking-wider">
                    Featured for {currentMeal.label}
                  </p>
                </div>
              </div>
              
              <h2
                className="text-2xl font-medium mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {featuredRecipes[0]?.name || "Golden Turmeric Oatmeal"}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-[var(--sage-100)] mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  25 min
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[var(--rose-300)]" />
                  Heart Healthy
                </span>
              </div>

              <Link
                href={`/recipe/${featuredRecipes[0]?.id || "golden-turmeric-oatmeal"}`}
                className="w-full bg-white text-[var(--forest-900)] py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[var(--cream-100)] transition-colors"
              >
                <ChefHat className="w-4 h-4" />
                Start Cooking
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Health Goals Section */}
      <section className="px-5 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-xl font-medium text-[var(--forest-900)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Your Health Goals
          </h2>
          <Link
            href="/profile"
            className="text-xs font-medium text-[var(--sage-600)] flex items-center gap-1 hover:text-[var(--sage-800)] transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5 stagger-children snap-x">
          <div className="snap-start min-w-[240px]">
            <HealthGoalCard
              title="Omega-3s"
              subtitle="2x this week"
              progress={66}
              icon="🌊"
              color="sage"
            />
          </div>
          <div className="snap-start min-w-[240px]">
            <HealthGoalCard
              title="Daily Fiber"
              subtitle="25g target"
              progress={80}
              icon="🥬"
              color="forest"
            />
          </div>
          <div className="snap-start min-w-[240px]">
            <HealthGoalCard
              title="Heart Health"
              subtitle="On track"
              progress={90}
              icon="❤️"
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="px-5 pb-6">
        <h2 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider">Browse by Need</h2>
        <div className="flex flex-wrap gap-2">
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

      {/* Recipe Sections */}
      <RecipeSection title="Breakfast" recipes={breakfastRecipes} link="/explore?meal=breakfast" />
      <RecipeSection title="Lunch" recipes={lunchRecipes} link="/explore?meal=lunch" />
      <RecipeSection title="Dinner" recipes={dinnerRecipes} link="/explore?meal=dinner" />
      <RecipeSection title="Snacks" recipes={snackRecipes} link="/explore?meal=snack" />

      {/* Wellness Tip Card */}
      <section className="px-5 pb-8 pt-4">
        <div
          className="rounded-2xl p-6 relative overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          }}
        >
          <div className="relative z-10">
            <p className="text-xs font-bold text-[var(--sage-700)] mb-2 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Daily Tip
            </p>
            <p
              className="text-[var(--forest-900)] text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Take thyroid medication 30-60 min before eating. Avoid calcium-rich
              foods and soy near medication time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RecipeSection({ title, recipes, link }: { title: string; recipes: any[]; link: string }) {
  return (
    <section className="px-5 py-6 border-t border-[var(--cream-200)]">
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-2xl font-medium text-[var(--forest-900)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h2>
        <Link
          href={link}
          className="text-xs font-medium text-[var(--sage-600)] flex items-center gap-1 hover:text-[var(--sage-800)]"
        >
          See All ({recipes.length}) <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} compact />
        ))}
      </div>
    </section>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
