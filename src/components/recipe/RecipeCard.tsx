"use client";

import Link from "next/link";
import { Heart, Clock, Flame, Leaf, Fish, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getRecipeImage } from "@/lib/images";

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
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Use provided image or generate one from the recipe title
  const displayImage = recipe.imageUrl || getRecipeImage(recipe.name, recipe.category);

  return (
    <Link href={`/recipe/${recipe.id}`} className="block h-full">
      <article
        className={cn(
          "bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--cream-200)] hover:shadow-md transition-all duration-300 h-full flex flex-col",
          compact ? "max-w-[200px]" : "w-full"
        )}
      >
        {/* Image Section */}
        <div className={cn("relative overflow-hidden bg-[var(--cream-100)]", compact ? "h-32" : "h-48")}>
          <img
            src={displayImage}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay Gradient for Text Readability if we had text over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-sm",
              isFavorited
                ? "bg-[var(--rose-500)] text-white"
                : "bg-white/80 text-[var(--text-muted)] hover:bg-white hover:text-[var(--rose-500)]"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isFavorited && "fill-current"
              )}
            />
          </button>

          {/* Health Badges - Quick Glance */}
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {recipe.isAntiInflammatory && (
              <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-[var(--terracotta-600)]" title="Anti-inflammatory">
                <Flame className="w-3.5 h-3.5" />
              </div>
            )}
            {recipe.hasOmega3 && (
              <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-[var(--sage-600)]" title="Omega-3 Rich">
                <Fish className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category & Time */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] uppercase tracking-wider text-[var(--sage-600)] font-semibold truncate max-w-[60%]">
              {recipe.category}
            </p>
            {recipe.totalTime && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-medium">
                <Clock className="w-3 h-3" />
                {recipe.totalTime}m
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-[15px] font-medium text-[var(--forest-900)] leading-snug mb-2 line-clamp-2 font-serif"
          >
            {recipe.name}
          </h3>

          {/* Spacer to push content down */}
          <div className="flex-grow" />

          {/* Footer Info */}
          <div className="flex items-center gap-2 pt-3 border-t border-[var(--cream-100)] mt-1">
            {recipe.isKidFriendly && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--terracotta-600)] bg-[var(--terracotta-50)] px-2 py-0.5 rounded-full">
                <ChefHat className="w-3 h-3" />
                Kid-friendly
              </span>
            )}
            {recipe.hasHighFiber && !recipe.isKidFriendly && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--sage-700)] bg-[var(--sage-50)] px-2 py-0.5 rounded-full">
                <Leaf className="w-3 h-3" />
                High Fiber
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
