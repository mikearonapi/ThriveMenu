"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Clock, Flame, Leaf, Fish, ChefHat } from "lucide-react";
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

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  prepTime?: number;
  totalTime?: number;
  keyNutrients: string[];
  isKidFriendly?: boolean;
  hasOmega3?: boolean;
  hasHighFiber?: boolean;
  isAntiInflammatory?: boolean;
  hasSelenium?: boolean;
  healthBenefits?: string;
  imageUrl?: string;
  mealType: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export default function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const displayImage = getRecipeImageUrl(recipe);

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

          {/* Health Badges - Bottom left */}
          <div className="absolute bottom-2 left-2 flex gap-1">
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
          </div>
        </div>

        {/* Content Section */}
        <div className="recipe-card-content flex flex-col flex-grow">
          {/* Category & Time Row */}
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--teal-600)' }}>
              {recipe.category}
            </span>
            {recipe.totalTime && (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium flex-shrink-0">
                <Clock className="w-3 h-3" />
                {recipe.totalTime}m
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-sm sm:text-[15px] font-semibold text-forest-900 leading-snug line-clamp-2 mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h3>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer Tags */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-cream-200 mt-auto">
            {recipe.isKidFriendly && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-terracotta-600 bg-terracotta-50 px-1.5 py-0.5 rounded-full">
                <ChefHat className="w-2.5 h-2.5" />
                Kid-friendly
              </span>
            )}
            {recipe.hasHighFiber && !recipe.isKidFriendly && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-sage-700 bg-sage-50 px-1.5 py-0.5 rounded-full">
                <Leaf className="w-2.5 h-2.5" />
                High Fiber
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
