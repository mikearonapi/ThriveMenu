"use client";

// Enable dynamic rendering for home page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Heart,
  Clock,
  ChefHat,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Cookie,
  Salad,
  Fish,
  TrendingUp,
} from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";
import HealthGoalCard from "@/components/health/HealthGoalCard";
import QuickFilterChip from "@/components/ui/QuickFilterChip";
import { getRecipeImage } from "@/lib/images";

// Get current meal suggestion based on time of day
function getCurrentMealSuggestion() {
  const hour = new Date().getHours();
  if (hour < 11) return { type: "BREAKFAST", label: "breakfast", icon: Sun };
  if (hour < 15) return { type: "LUNCH", label: "lunch", icon: Salad };
  if (hour < 19) return { type: "DINNER", label: "dinner", icon: Moon };
  return { type: "SNACK", label: "evening snack", icon: Cookie };
}

export default function HomePage() {
  const currentMeal = getCurrentMealSuggestion();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [breakfastRecipes, setBreakfastRecipes] = useState<any[]>([]);
  const [lunchRecipes, setLunchRecipes] = useState<any[]>([]);
  const [dinnerRecipes, setDinnerRecipes] = useState<any[]>([]);
  const [snackRecipes, setSnackRecipes] = useState<any[]>([]);
  const [currentMealRecipes, setCurrentMealRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const quickFilters = [
    { id: "quick", label: "Under 30 min", icon: Clock },
    { id: "heart", label: "Heart Healthy", icon: Heart },
    { id: "kid", label: "Kid-Friendly", icon: Sparkles },
    { id: "omega3", label: "Omega-3 Rich", icon: Leaf },
  ];

  // Fetch recipes from database
  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      try {
        const [breakfast, lunch, dinner, snack] = await Promise.all([
          fetch("/api/recipes?mealType=BREAKFAST&limit=6").then((r) => r.json()),
          fetch("/api/recipes?mealType=LUNCH&limit=6").then((r) => r.json()),
          fetch("/api/recipes?mealType=DINNER&limit=6").then((r) => r.json()),
          fetch("/api/recipes?mealType=SNACK&limit=6").then((r) => r.json()),
        ]);

        setBreakfastRecipes(breakfast.recipes || []);
        setLunchRecipes(lunch.recipes || []);
        setDinnerRecipes(dinner.recipes || []);
        setSnackRecipes(snack.recipes || []);

        // Set current meal recipes
        const mealTypeMap: Record<string, any[]> = {
          BREAKFAST: breakfast.recipes || [],
          LUNCH: lunch.recipes || [],
          DINNER: dinner.recipes || [],
          SNACK: snack.recipes || [],
        };
        setCurrentMealRecipes(mealTypeMap[currentMeal.type] || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Get featured recipe
  const featuredRecipe = currentMealRecipes[0];

  return (
    <div className="min-h-screen pb-24 w-full" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Hero Section with Featured Recipe */}
      <header className="relative overflow-hidden w-full">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" style={{ background: 'linear-gradient(to bottom, white, var(--cream-50), var(--cream-100))' }} />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50c0-13.8 11.2-25 25-25s25 11.2 25 25-11.2 25-25 25c0 13.8-11.2 25-25 25s-25-11.2-25-25 11.2-25 25-25c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25c13.8 0 25 11.2 25 25s-11.2 25-25 25' fill='%2387a878' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-5 sm:px-6 md:px-8 lg:px-12 pt-8 pb-8 max-w-7xl mx-auto">
          {/* Greeting */}
          <div className="mb-8 animate-fade-in">
            <p className="text-sage-600 text-xs sm:text-sm font-semibold mb-2 tracking-wider uppercase">
              {getTimeOfDay()}, Christine
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--forest-900)] leading-tight mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What shall we
              <br />
              <span className="text-sage-600 italic font-normal">cook today?</span>
            </h1>
          </div>

          {/* Featured Recipe Card - Premium Design */}
          {featuredRecipe && (
            <Link 
              href={`/recipe/${featuredRecipe.id}`}
              className="block group max-w-4xl mx-auto"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/50 bg-white">
                {/* Recipe Image */}
                <div className="relative h-[280px] sm:h-[320px] md:h-[400px] lg:h-[450px] overflow-hidden" style={{ position: 'relative', backgroundColor: 'var(--cream-200)' }}>
                  <Image
                    src={featuredRecipe.imageUrl || getRecipeImage(featuredRecipe.name, featuredRecipe.category)}
                    alt={featuredRecipe.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(38, 61, 52, 0.8), rgba(38, 61, 52, 0.2), transparent)' }} />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {featuredRecipe.hasOmega3 && (
                      <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
                        <Fish className="w-4 h-4 text-sage-600" />
                        <span className="text-xs font-semibold text-forest-800">Omega-3</span>
                      </div>
                    )}
                    {featuredRecipe.isHeartHealthy && (
                      <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-semibold text-forest-800">Heart Healthy</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <currentMeal.icon className="w-4 h-4 text-sage-600" />
                    <span className="text-xs font-semibold text-sage-600 uppercase tracking-wider">
                      Featured for {currentMeal.label}
                    </span>
                  </div>
                  
                  <h2
                    className="text-2xl font-semibold text-forest-900 mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {featuredRecipe.name}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                    {featuredRecipe.totalTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredRecipe.totalTime} min
                      </span>
                    )}
                    {featuredRecipe.isKidFriendly && (
                      <span className="flex items-center gap-1.5 text-terracotta-600">
                        <ChefHat className="w-4 h-4" />
                        Kid-friendly
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sage-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Start Cooking</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Health Goals Section */}
      <section className="px-5 py-8 -mt-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-semibold text-forest-900 mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Your Health Goals
            </h2>
            <p className="text-sm text-gray-500">Track your progress</p>
          </div>
          <Link
            href="/profile"
            className="text-xs font-semibold text-sage-600 flex items-center gap-1 hover:text-sage-800 transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5 snap-x snap-mandatory">
          <div className="snap-start flex-shrink-0">
            <HealthGoalCard
              title="Omega-3s"
              subtitle="2x this week"
              progress={66}
              icon={<Fish className="w-6 h-6" />}
              color="sage"
            />
          </div>
          <div className="snap-start flex-shrink-0">
            <HealthGoalCard
              title="Daily Fiber"
              subtitle="25g target"
              progress={80}
              icon={<Leaf className="w-6 h-6" />}
              color="forest"
            />
          </div>
          <div className="snap-start flex-shrink-0">
            <HealthGoalCard
              title="Heart Health"
              subtitle="On track"
              progress={90}
              icon={<Heart className="w-6 h-6" />}
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="px-5 pb-6">
        <h2 
          className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider"
        >
          Browse by Need
        </h2>
        <div className="flex flex-wrap gap-2.5">
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
      {!isLoading && (
        <>
          <RecipeSection 
            title="Breakfast" 
            icon={Sun}
            recipes={breakfastRecipes} 
            link="/explore?meal=breakfast" 
          />
          <RecipeSection 
            title="Lunch" 
            icon={Salad}
            recipes={lunchRecipes} 
            link="/explore?meal=lunch" 
          />
          <RecipeSection 
            title="Dinner" 
            icon={Moon}
            recipes={dinnerRecipes} 
            link="/explore?meal=dinner" 
          />
          <RecipeSection 
            title="Snacks & Beverages" 
            icon={Cookie}
            recipes={snackRecipes} 
            link="/explore?meal=snack" 
          />
        </>
      )}

      {/* Wellness Tip Card */}
      <section className="px-5 pb-8 pt-6">
        <div
          className="rounded-3xl p-6 relative overflow-hidden shadow-lg border border-sage-200"
          style={{
            background: "linear-gradient(135deg, var(--sage-50) 0%, var(--forest-50) 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sage-200 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sage-700" />
              </div>
              <p className="text-xs font-bold text-sage-700 uppercase tracking-wider">
                Daily Tip for Graves&apos; Disease
              </p>
            </div>
            <p
              className="text-forest-900 text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Take thyroid medication 30-60 min before eating. Avoid calcium-rich
              foods and soy near medication time.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-sage-200 opacity-20 blur-2xl" />
        </div>
      </section>
    </div>
  );
}

function RecipeSection({ 
  title, 
  icon: Icon, 
  recipes, 
  link 
}: { 
  title: string; 
  icon: typeof Sun;
  recipes: any[]; 
  link: string;
}) {
  return (
    <section className="px-5 py-6 border-t" style={{ borderColor: 'var(--cream-200)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <h2
              className="text-2xl font-semibold text-forest-900"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{recipes.length} recipes</p>
          </div>
        </div>
        <Link
          href={link}
          className="text-xs font-semibold text-sage-600 flex items-center gap-1 hover:text-sage-800 transition-colors"
        >
          See All <ArrowRight className="w-3 h-3" />
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
