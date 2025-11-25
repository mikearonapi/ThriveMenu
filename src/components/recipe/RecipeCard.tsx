"use client";

import Link from "next/link";
import { Heart, Clock, Flame, Leaf, Fish, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

// Generate a beautiful gradient placeholder based on meal type
function getPlaceholderGradient(mealType: string): string {
  const gradients: Record<string, string> = {
    BREAKFAST: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    LUNCH: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    DINNER: "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
    SNACK: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    BEVERAGE: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
  };
  return gradients[mealType] || gradients.LUNCH;
}

// Get an emoji based on category
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    "Oats & Grains": "🥣",
    "Eggs & Savory": "🍳",
    "Smoothies & Bowls": "🥤",
    "Yogurt & Parfaits": "🫐",
    "Pancakes, Waffles & Toast": "🥞",
    "Quick & Simple": "⚡",
    "Salads": "🥗",
    "Soups": "🍲",
    "Sandwiches & Wraps": "🥪",
    "Bowls": "🍜",
    "Light & Quick": "🥒",
    "Family Favorites": "👨‍👩‍👧‍👦",
    "Seafood": "🐟",
    "Poultry": "🍗",
    "Vegetarian & Plant-Based": "🌱",
    "Beef & Pork": "🥩",
    "One-Pot & Sheet Pan": "🍳",
    "Soups & Stews": "🥘",
    "Pasta & Grains": "🍝",
    "Global Flavors": "🌍",
    "Special Occasion": "✨",
    "Quick Grab Snacks": "🍎",
    "Sweet Treats": "🍫",
    "Savory Snacks": "🥜",
    "On-The-Go": "🏃",
    "Beverages": "🍵",
    "Snacks to Share": "👨‍👩‍👧‍👦",
  };
  return emojiMap[category] || "🍽️";
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !recipe.imageUrl || imageError;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <article
        className={cn(
          "recipe-card bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--cream-300)]",
          compact ? "h-auto" : "h-full"
        )}
      >
        {/* Image Section */}
        <div
          className={cn(
            "relative overflow-hidden",
            compact ? "h-28" : "h-40"
          )}
          style={{
            background: showPlaceholder
              ? getPlaceholderGradient(recipe.mealType)
              : undefined,
          }}
        >
          {showPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-70">
                {getCategoryEmoji(recipe.category)}
              </span>
            </div>
          ) : (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover recipe-image"
              onError={() => setImageError(true)}
            />
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              isFavorited
                ? "bg-[var(--rose-500)] text-white"
                : "bg-white/90 text-[var(--text-muted)] hover:text-[var(--rose-500)]"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isFavorited && "fill-current"
              )}
            />
          </button>

          {/* Quick Badges */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {recipe.hasOmega3 && (
              <span className="nutrient-tag omega3" title="Rich in Omega-3">
                <Fish className="w-3 h-3" />
              </span>
            )}
            {recipe.hasHighFiber && (
              <span className="nutrient-tag fiber" title="High Fiber">
                <Leaf className="w-3 h-3" />
              </span>
            )}
            {recipe.isAntiInflammatory && (
              <span
                className="nutrient-tag bg-[var(--terracotta-100)] text-[var(--terracotta-700)]"
                title="Anti-inflammatory"
              >
                <Flame className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={cn("p-3", compact ? "pb-3" : "p-4")}>
          {/* Category */}
          <p className="text-xs text-[var(--sage-600)] font-medium mb-1 truncate">
            {recipe.category}
          </p>

          {/* Title */}
          <h3
            className={cn(
              "font-medium text-[var(--forest-800)] line-clamp-2 mb-2",
              compact ? "text-sm" : "text-base"
            )}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            {recipe.totalTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recipe.totalTime} min
              </span>
            )}
            {recipe.isKidFriendly && (
              <span className="flex items-center gap-1 text-[var(--terracotta-500)]">
                <ChefHat className="w-3 h-3" />
                Kid-friendly
              </span>
            )}
          </div>

          {/* Key Nutrients */}
          {!compact && recipe.keyNutrients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {recipe.keyNutrients.slice(0, 3).map((nutrient, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--cream-200)] text-[var(--text-secondary)]"
                >
                  {nutrient}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

