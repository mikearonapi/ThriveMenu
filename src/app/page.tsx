"use client";

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
  ShieldCheck,
  Activity,
} from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";
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
  }, [currentMeal.type]);

  const featuredRecipe = currentMealRecipes[0];

  return (
    <div className="page-content" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Hero Section with Featured Recipe */}
      <section className="container-app pt-6 pb-4">
        {/* Featured Recipe Card */}
        {featuredRecipe && (
          <Link 
            href={`/recipe/${featuredRecipe.id}`}
            className="block group"
          >
            <div className="featured-card mx-auto">
              {/* Recipe Image */}
              <div className="featured-card-image">
                <Image
                  src={featuredRecipe.imageUrl || getRecipeImage(featuredRecipe.name, featuredRecipe.category)}
                  alt={featuredRecipe.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 640px) 100vw, 600px"
                />
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    background: 'linear-gradient(to top, rgba(30, 80, 80, 0.75), rgba(30, 80, 80, 0.2), transparent)' 
                  }} 
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {featuredRecipe.hasOmega3 && (
                    <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-md">
                      <Fish className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--forest-800)' }}>Omega-3</span>
                    </div>
                  )}
                  {featuredRecipe.isHeartHealthy && (
                    <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-md">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--forest-800)' }}>Heart Healthy</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <currentMeal.icon className="w-3.5 h-3.5" style={{ color: 'var(--teal-600)' }} />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--teal-600)' }}>
                    Featured for {currentMeal.label}
                  </span>
                </div>
                
                <h2
                  className="text-lg sm:text-xl font-semibold mb-2 leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
                >
                  {featuredRecipe.name}
                </h2>
                
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
                  {featuredRecipe.totalTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredRecipe.totalTime} min
                    </span>
                  )}
                  {featuredRecipe.isKidFriendly && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--terracotta-600)' }}>
                      <ChefHat className="w-3.5 h-3.5" />
                      Kid-friendly
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all" style={{ color: 'var(--teal-600)' }}>
                  <span>Start Cooking</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Nutrition Focus - The Three Pillars */}
      <section className="section container-app">
        <div className="mb-4">
          <h2
            className="text-xl sm:text-2xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
          >
            Recipes That Nourish
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">Every recipe supports your wellness journey</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Thyroid Support */}
          <div 
            className="rounded-xl p-3 sm:p-4 text-center"
            style={{ backgroundColor: 'var(--teal-50)', border: '1px solid var(--teal-100)' }}
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: 'var(--teal-100)' }}
            >
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--teal-600)' }} />
            </div>
            <h3 
              className="text-xs sm:text-sm font-semibold mb-0.5"
              style={{ color: 'var(--forest-900)' }}
            >
              Thyroid Support
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
              Anti-inflammatory & selenium-rich
            </p>
          </div>

          {/* Heart Protection */}
          <div 
            className="rounded-xl p-3 sm:p-4 text-center"
            style={{ backgroundColor: 'var(--rose-50)', border: '1px solid var(--rose-100)' }}
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: 'var(--rose-100)' }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--rose-500)' }} />
            </div>
            <h3 
              className="text-xs sm:text-sm font-semibold mb-0.5"
              style={{ color: 'var(--forest-900)' }}
            >
              Heart Health
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
              Omega-3s & low saturated fat
            </p>
          </div>

          {/* Blood Sugar Stability */}
          <div 
            className="rounded-xl p-3 sm:p-4 text-center"
            style={{ backgroundColor: 'var(--forest-50)', border: '1px solid var(--forest-100)' }}
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: 'var(--forest-100)' }}
            >
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--forest-600)' }} />
            </div>
            <h3 
              className="text-xs sm:text-sm font-semibold mb-0.5"
              style={{ color: 'var(--forest-900)' }}
            >
              Blood Sugar
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
              Low glycemic & fiber-rich
            </p>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="container-app pb-4">
        <h2 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          Browse by Need
        </h2>
        <div className="filter-chips">
          {quickFilters.map((filter) => (
            <QuickFilterChip
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              isActive={selectedFilter === filter.id}
              onClick={() =>
                setSelectedFilter(selectedFilter === filter.id ? null : filter.id)
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
      <section className="container-app section">
        <div
          className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--teal-50) 0%, var(--teal-100) 100%)",
            border: "1px solid var(--teal-200)",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--teal-200)' }}>
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--teal-700)' }} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--teal-700)' }}>
                Daily Wellness Tip
              </p>
            </div>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
            >
              Take thyroid medication 30-60 min before eating. Avoid calcium-rich
              foods and soy near medication time.
            </p>
          </div>
          {/* Decorative element */}
          <div 
            className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-20 blur-2xl" 
            style={{ backgroundColor: 'var(--teal-400)' }}
          />
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
  if (recipes.length === 0) return null;
  
  return (
    <section className="section" style={{ borderTop: '1px solid var(--cream-200)' }}>
      <div className="container-app">
        <div className="section-header">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--teal-100)' }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--teal-600)' }} />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-serif)", color: 'var(--forest-900)' }}
              >
                {title}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500">{recipes.length} recipes</p>
            </div>
          </div>
          <Link
            href={link}
            className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--teal-600)' }}
          >
            See All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="recipe-grid-home stagger-children">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
