"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, Clock, Flame, Leaf, Fish, ChefHat, 
  DollarSign, Gauge, Snowflake, Sun, Flower2, CloudSun,
  AlertCircle, UtensilsCrossed
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getRecipeImage } from "@/lib/images";
import { useAuth } from "@/hooks/useAuth";

// Helper to get recipe image URL
function getRecipeImageUrl(recipe: any): string {
  if (recipe.imageUrl) {
    return recipe.imageUrl;
  }
  return getRecipeImage(recipe.name, recipe.category);
}

interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  netCarbs?: number;
  fat?: number;
  fiber?: number;
  glycemicIndex?: number;
  glycemicLoad?: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  prepTime?: number;
  totalTime?: number;
  keyNutrients?: string[];
  isKidFriendly?: boolean;
  hasOmega3?: boolean;
  hasHighFiber?: boolean;
  hasHighProtein?: boolean;
  isAntiInflammatory?: boolean;
  hasSelenium?: boolean;
  healthBenefits?: string;
  imageUrl?: string;
  mealType: string;
  
  // New fields
  costPerServing?: number;
  costLevel?: 'BUDGET' | 'MEDIUM' | 'PREMIUM' | 'SPLURGE';
  iodineLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  seasonalAvailability?: string[];
  equipment?: string[];
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isLowCarb?: boolean;
  isKetoFriendly?: boolean;
  nutrition?: Nutrition;
}

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
  showDetails?: boolean; // Show extended info like GI, cost
}

// Get season icon
function getSeasonIcon(season: string) {
  switch (season) {
    case 'SPRING': return <Flower2 className="w-3 h-3 text-pink-500" />;
    case 'SUMMER': return <Sun className="w-3 h-3 text-amber-500" />;
    case 'FALL': return <CloudSun className="w-3 h-3 text-orange-500" />;
    case 'WINTER': return <Snowflake className="w-3 h-3 text-blue-400" />;
    default: return null;
  }
}

// Get cost indicator
function getCostIndicator(level?: string) {
  switch (level) {
    case 'BUDGET': return { text: '$', color: 'text-green-600', bg: 'bg-green-50' };
    case 'MEDIUM': return { text: '$$', color: 'text-amber-600', bg: 'bg-amber-50' };
    case 'PREMIUM': return { text: '$$$', color: 'text-orange-600', bg: 'bg-orange-50' };
    case 'SPLURGE': return { text: '$$$$', color: 'text-red-600', bg: 'bg-red-50' };
    default: return { text: '$$', color: 'text-gray-500', bg: 'bg-gray-50' };
  }
}

// Get GI category
function getGICategory(gi?: number) {
  if (!gi) return null;
  if (gi <= 55) return { label: 'Low GI', color: 'text-green-600', bg: 'bg-green-50' };
  if (gi <= 69) return { label: 'Med GI', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: 'High GI', color: 'text-red-600', bg: 'bg-red-50' };
}

export default function RecipeCard({ recipe, compact = false, showDetails = false }: RecipeCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const displayImage = getRecipeImageUrl(recipe);
  const costInfo = getCostIndicator(recipe.costLevel);
  const giInfo = getGICategory(recipe.nutrition?.glycemicIndex);

  // Check if recipe is favorited on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/api/favorites/${recipe.id}`)
        .then((res) => res.json())
        .then((data) => setIsFavorited(data.isFavorited || false))
        .catch(() => {});
    }
  }, [recipe.id, isAuthenticated]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push("/login?redirect=/recipe/" + recipe.id);
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites?recipeId=${recipe.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: recipe.id }),
        });
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="block h-full group">
      <article className="recipe-card h-full flex flex-col">
        {/* Image Section - Fixed height based on design system */}
        <div className={cn(
          "recipe-card-image bg-cream-100",
          compact && "recipe-card-compact"
        )}>
          <Image
            src={displayImage}
            alt={recipe.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            quality={80}
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10",
              isFavorited
                ? "bg-rose-500 text-white shadow-md"
                : "bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-rose-500 shadow-sm",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            title={isAuthenticated ? (isFavorited ? "Remove from favorites" : "Save to favorites") : "Sign in to save"}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isFavorited && "fill-current"
              )}
            />
          </button>

          {/* Cost Badge - Top Left */}
          {recipe.costLevel && (
            <div 
              className={cn(
                "absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm",
                costInfo.bg, costInfo.color
              )}
              title={`Cost per serving: $${recipe.costPerServing?.toFixed(2) || 'N/A'}`}
            >
              {costInfo.text}
            </div>
          )}

          {/* Health Badges - Bottom left */}
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            {recipe.iodineLevel === 'LOW' && (
              <div 
                className="w-6 h-6 rounded-full bg-green-500/90 backdrop-blur-sm flex items-center justify-center shadow-sm" 
                title="Low Iodine - Graves Friendly"
              >
                <span className="text-white text-[8px] font-bold">I↓</span>
              </div>
            )}
            {recipe.isAntiInflammatory && (
              <div 
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm" 
                title="Anti-inflammatory"
              >
                <Flame className="w-3 h-3 text-terracotta-600" />
              </div>
            )}
            {recipe.hasOmega3 && (
              <div 
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm" 
                title="Omega-3 Rich"
              >
                <Fish className="w-3 h-3" style={{ color: 'var(--teal-600)' }} />
              </div>
            )}
            {recipe.iodineLevel === 'HIGH' && (
              <div 
                className="w-6 h-6 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center shadow-sm" 
                title="High Iodine - Limit for Graves"
              >
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Season indicators - Bottom right */}
          {recipe.seasonalAvailability && recipe.seasonalAvailability.length > 0 && 
           !recipe.seasonalAvailability.includes('ALL_YEAR') && (
            <div className="absolute bottom-2 right-2 flex gap-0.5">
              {recipe.seasonalAvailability.slice(0, 2).map((season) => (
                <div 
                  key={season}
                  className="w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                  title={`Best in ${season.toLowerCase()}`}
                >
                  {getSeasonIcon(season)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="recipe-card-content flex flex-col flex-grow">
          {/* Category & Time Row */}
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--teal-600)' }}>
              {recipe.category}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {recipe.totalTime && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                  <Clock className="w-3 h-3" />
                  {recipe.totalTime}m
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-sm sm:text-[15px] font-semibold text-forest-900 leading-snug line-clamp-2 mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h3>

          {/* Nutrition Quick View (when showDetails) */}
          {showDetails && recipe.nutrition && (
            <div className="flex items-center gap-2 mb-2 text-[9px] text-gray-600">
              {recipe.nutrition.calories && (
                <span>{recipe.nutrition.calories} cal</span>
              )}
              {recipe.nutrition.protein && (
                <span className="text-emerald-600">{recipe.nutrition.protein}g protein</span>
              )}
              {recipe.nutrition.netCarbs !== undefined && (
                <span className="text-blue-600">{recipe.nutrition.netCarbs}g net carbs</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer Tags */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-cream-200 mt-auto flex-wrap">
            {/* GI Badge */}
            {giInfo && (
              <span className={cn(
                "inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                giInfo.bg, giInfo.color
              )}>
                <Gauge className="w-2.5 h-2.5" />
                {giInfo.label}
              </span>
            )}
            
            {/* Dietary tags */}
            {recipe.isGlutenFree && (
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                GF
              </span>
            )}
            {recipe.isDairyFree && (
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                DF
              </span>
            )}
            {recipe.isVegan && (
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                🌱
              </span>
            )}
            {recipe.isKetoFriendly && (
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full">
                Keto
              </span>
            )}
            
            {/* Original tags */}
            {recipe.isKidFriendly && !recipe.isVegan && !recipe.isKetoFriendly && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-terracotta-600 bg-terracotta-50 px-1.5 py-0.5 rounded-full">
                <ChefHat className="w-2.5 h-2.5" />
                Kids
              </span>
            )}
            {recipe.hasHighFiber && !recipe.isKidFriendly && !giInfo && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-sage-700 bg-sage-50 px-1.5 py-0.5 rounded-full">
                <Leaf className="w-2.5 h-2.5" />
                Fiber
              </span>
            )}
            {recipe.hasHighProtein && !recipe.hasHighFiber && !giInfo && (
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full">
                💪
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
