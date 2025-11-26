"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Users,
  ChefHat,
  Flame,
  Leaf,
  Fish,
  Star,
  Plus,
  Minus,
  Calendar,
  Sun,
  Moon,
  Cookie,
  Lightbulb,
  Loader2,
  DollarSign,
  Gauge,
  Wine,
  UtensilsCrossed,
  Scale,
  Snowflake,
  Flower2,
  CloudSun,
  AlertTriangle,
  ArrowRightLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RatingStars from "@/components/recipe/RatingStars";
import { getRecipeImage } from "@/lib/images";

interface Substitution {
  original: string;
  substitute: string;
  ratio?: string;
  notes?: string;
  forDairyFree?: boolean;
  forGlutenFree?: boolean;
  forVegan?: boolean;
  forNutFree?: boolean;
  forLowSodium?: boolean;
  forLowCarb?: boolean;
}

interface RecipeData {
  id: string;
  name: string;
  description: string;
  category: string;
  mealType: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  activeTime?: number;
  servings: number;
  servingSize?: string;
  minServings?: number;
  maxServings?: number;
  difficulty?: string;
  imageUrl?: string;
  healthBenefits: string;
  
  // Cost
  costPerServing?: number;
  costLevel?: 'BUDGET' | 'MEDIUM' | 'PREMIUM' | 'SPLURGE';
  
  // Equipment
  equipment?: string[];
  
  // Serving & Pairing
  servingSuggestions?: string;
  winePairing?: string;
  beveragePairing?: string;
  scalingNotes?: string;
  
  // Seasonal & Iodine
  seasonalAvailability?: string[];
  iodineLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  
  // Flags
  isKidFriendly?: boolean;
  isQuick?: boolean;
  isMakeAhead?: boolean;
  isOnePot?: boolean;
  isBudgetFriendly?: boolean;
  isFreezerFriendly?: boolean;
  hasOmega3?: boolean;
  hasHighFiber?: boolean;
  hasHighProtein?: boolean;
  isAntiInflammatory?: boolean;
  isHeartHealthy?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isKetoFriendly?: boolean;
  
  healthTags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  dietaryTags?: Array<{
    slug: string;
    name: string;
    icon?: string;
  }>;
  ingredients?: Array<{
    amount: number;
    unit: string;
    name: string;
    preparation?: string;
    notes?: string;
    isOptional?: boolean;
  }>;
  instructions?: Array<{
    stepNumber: number;
    instruction: string;
    tipText?: string;
    durationMinutes?: number;
  }>;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    netCarbs?: number;
    fiber: number;
    sugar: number;
    fat: number;
    saturatedFat: number;
    cholesterol: number;
    sodium: number;
    potassium?: number;
    iron?: number;
    calcium?: number;
    omega3?: number;
    glycemicIndex?: number;
    glycemicLoad?: number;
  };
  tips?: Array<{
    tipType: string;
    content: string;
  }>;
  substitutions?: Substitution[];
}

// Get season icon
function getSeasonIcon(season: string) {
  switch (season) {
    case 'SPRING': return <Flower2 className="w-4 h-4 text-pink-500" />;
    case 'SUMMER': return <Sun className="w-4 h-4 text-amber-500" />;
    case 'FALL': return <CloudSun className="w-4 h-4 text-orange-500" />;
    case 'WINTER': return <Snowflake className="w-4 h-4 text-blue-400" />;
    default: return <Calendar className="w-4 h-4 text-gray-400" />;
  }
}

// Get cost display
function getCostDisplay(level?: string, amount?: number) {
  const displays: Record<string, { text: string; color: string; label: string }> = {
    'BUDGET': { text: '$', color: 'text-green-600', label: 'Budget-friendly' },
    'MEDIUM': { text: '$$', color: 'text-amber-600', label: 'Moderate' },
    'PREMIUM': { text: '$$$', color: 'text-orange-600', label: 'Premium' },
    'SPLURGE': { text: '$$$$', color: 'text-red-600', label: 'Splurge' },
  };
  return displays[level || 'MEDIUM'] || displays['MEDIUM'];
}

// Get GI category
function getGICategory(gi?: number) {
  if (!gi) return null;
  if (gi <= 55) return { label: 'Low GI', color: 'text-green-600', bg: 'bg-green-50', desc: 'Slow blood sugar rise' };
  if (gi <= 69) return { label: 'Medium GI', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Moderate impact' };
  return { label: 'High GI', color: 'text-red-600', bg: 'bg-red-50', desc: 'Quick blood sugar spike' };
}

// Get iodine display
function getIodineDisplay(level?: string) {
  const displays: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string }> = {
    'LOW': { icon: '✓', color: 'text-green-600', label: 'Low Iodine', desc: 'Safe for Graves disease' },
    'MODERATE': { icon: '—', color: 'text-amber-600', label: 'Moderate Iodine', desc: 'Normal iodine content' },
    'HIGH': { icon: '!', color: 'text-red-600', label: 'High Iodine', desc: 'Limit for Graves disease' },
  };
  return displays[level || 'MODERATE'];
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [servings, setServings] = useState(4);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "nutrition">("ingredients");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [ratingData, setRatingData] = useState<{
    averageRating: number;
    totalRatings: number;
    userRating: number | null;
  } | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recipe from database
  useEffect(() => {
    async function fetchRecipe() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/recipes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setServings(data.servings || 4);
        } else {
          setRecipe(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setRecipe(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipe();
  }, [params.id]);

  // Check if recipe is favorited on mount
  useEffect(() => {
    if (isAuthenticated && recipe) {
      fetch(`/api/favorites/${recipe.id}`)
        .then((res) => res.json())
        .then((data) => setIsFavorited(data.isFavorited || false))
        .catch(() => {
          fetch("/api/favorites")
            .then((res) => res.json())
            .then((data) => {
              const favoriteIds = data.favorites?.map((f: any) => f.recipeId) || [];
              setIsFavorited(favoriteIds.includes(recipe.id));
            })
            .catch(() => {});
        });
    }
  }, [recipe?.id, isAuthenticated]);

  // Fetch rating data on mount
  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch(`/api/recipes/${params.id}/ratings`);
        if (response.ok) {
          const data = await response.json();
          setRatingData({
            averageRating: data.averageRating || 0,
            totalRatings: data.totalRatings || 0,
            userRating: data.userRating || null,
          });
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    fetchRatings();
  }, [params.id, isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-sage-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Recipe Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find this recipe. Try browsing our collection.
          </p>
          <button onClick={() => router.push("/explore")} className="btn-primary">
            Explore Recipes
          </button>
        </div>
      </div>
    );
  }

  // Get ingredients and instructions from recipe data
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions?.map((inst) => inst.instruction) || [];
  const tips = recipe.tips?.map((tip) => tip.content) || [];
  const baseServings = recipe.servings || 4;
  const displayImage = recipe.imageUrl || getRecipeImage(recipe.name, recipe.category);
  const costInfo = getCostDisplay(recipe.costLevel, recipe.costPerServing);
  const giInfo = getGICategory(recipe.nutrition?.glycemicIndex);
  const iodineInfo = getIodineDisplay(recipe.iodineLevel);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Hero Image */}
      <div className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem]">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={recipe.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, var(--sage-200) 0%, var(--cream-200) 50%, var(--rose-100) 100%)',
            }}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-forest-900" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!isAuthenticated) {
                  setShowLoginPrompt(true);
                  return;
                }

                setIsFavoriting(true);
                try {
                  if (isFavorited) {
                    const response = await fetch(`/api/favorites?recipeId=${params.id}`, {
                      method: "DELETE",
                    });
                    if (response.ok) {
                      setIsFavorited(false);
                    }
                  } else {
                    const response = await fetch("/api/favorites", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ recipeId: params.id }),
                    });
                    if (response.ok) {
                      setIsFavorited(true);
                    }
                  }
                } catch (error) {
                  console.error("Error toggling favorite:", error);
                } finally {
                  setIsFavoriting(false);
                }
              }}
              disabled={isFavoriting}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all",
                isFavorited
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white",
                isFavoriting && "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category Icon (fallback when no image) */}
        {!displayImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            {recipe.mealType === "BREAKFAST" ? (
              <Sun className="w-24 h-24 text-sage-300 opacity-50" />
            ) : recipe.mealType === "DINNER" ? (
              <Moon className="w-24 h-24 text-sage-300 opacity-50" />
            ) : (
              <Cookie className="w-24 h-24 text-sage-300 opacity-50" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-8 bg-cream-100 rounded-t-[2rem] px-5 pt-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--cream-100)' }}>
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium" style={{ color: 'var(--teal-600)' }}>
              {recipe.category}
            </p>
            {recipe.costLevel && (
              <span className={cn("text-sm font-bold", costInfo.color)} title={`$${recipe.costPerServing?.toFixed(2) || 'N/A'} per serving`}>
                {costInfo.text}
              </span>
            )}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-medium text-forest-900 mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {recipe.name}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Meta Cards */}
        <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar -mx-5 px-5">
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-200">
            <Clock className="w-5 h-5 mb-1" style={{ color: 'var(--teal-500)' }} />
            <p className="text-sm font-medium text-forest-900">{recipe.totalTime || 25} min</p>
            <p className="text-xs text-gray-500">Total Time</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-200">
            <Users className="w-5 h-5 mb-1" style={{ color: 'var(--teal-500)' }} />
            <p className="text-sm font-medium text-forest-900">{recipe.servings || 4}</p>
            <p className="text-xs text-gray-500">Servings</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-200">
            <ChefHat className="w-5 h-5 mb-1" style={{ color: 'var(--teal-500)' }} />
            <p className="text-sm font-medium text-forest-900">{recipe.difficulty || "Easy"}</p>
            <p className="text-xs text-gray-500">Difficulty</p>
          </div>
          {recipe.costPerServing && (
            <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-200">
              <DollarSign className="w-5 h-5 mb-1" style={{ color: 'var(--teal-500)' }} />
              <p className="text-sm font-medium text-forest-900">${recipe.costPerServing.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Per Serving</p>
            </div>
          )}
          {giInfo && (
            <div className="flex-shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-200">
              <Gauge className="w-5 h-5 mb-1" style={{ color: 'var(--teal-500)' }} />
              <p className={cn("text-sm font-medium", giInfo.color)}>{recipe.nutrition?.glycemicIndex}</p>
              <p className="text-xs text-gray-500">{giInfo.label}</p>
            </div>
          )}
        </div>

        {/* Iodine Warning/Info (important for Graves) */}
        {recipe.iodineLevel && recipe.iodineLevel !== 'MODERATE' && (
          <div className={cn(
            "rounded-xl p-3 mb-4 flex items-start gap-3",
            recipe.iodineLevel === 'LOW' ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
          )}>
            {recipe.iodineLevel === 'LOW' ? (
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={cn("text-sm font-medium", iodineInfo.color)}>{iodineInfo.label}</p>
              <p className="text-xs text-gray-600">{iodineInfo.desc}</p>
            </div>
          </div>
        )}

        {/* Health Benefits Card */}
        {recipe.healthBenefits && (
          <div className="rounded-2xl p-4 mb-6 border border-sage-200" style={{ background: 'linear-gradient(to bottom right, var(--sage-50), var(--forest-50))' }}>
            <h3 className="font-medium text-forest-700 mb-2 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Why It&apos;s Great for You
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {recipe.healthBenefits}
            </p>
            {recipe.healthTags && recipe.healthTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.healthTags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white text-forest-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Health & Dietary Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.isGlutenFree && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">
              🌾 Gluten-Free
            </span>
          )}
          {recipe.isDairyFree && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
              🥛 Dairy-Free
            </span>
          )}
          {recipe.isVegan && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
              🌱 Vegan
            </span>
          )}
          {recipe.isVegetarian && !recipe.isVegan && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
              🥬 Vegetarian
            </span>
          )}
          {recipe.isKetoFriendly && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700">
              🥑 Keto
            </span>
          )}
          {recipe.hasOmega3 && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-sage-100 text-sage-700 flex items-center gap-1.5">
              <Fish className="w-4 h-4" />
              Omega-3 Rich
            </span>
          )}
          {recipe.isAntiInflammatory && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-terracotta-100 text-terracotta-700 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              Anti-inflammatory
            </span>
          )}
          {recipe.hasHighFiber && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-forest-100 text-forest-700 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" />
              High Fiber
            </span>
          )}
          {recipe.isKidFriendly && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-terracotta-100 text-terracotta-700 flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              Kid-Friendly
            </span>
          )}
        </div>

        {/* Equipment Needed */}
        {recipe.equipment && recipe.equipment.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-cream-200">
            <h3 className="font-medium text-forest-900 mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" style={{ color: 'var(--teal-500)' }} />
              Equipment Needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.equipment.map((equip, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {equip.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "ingredients"
                ? "text-white"
                : "bg-white text-gray-600 border border-cream-200"
            )}
            style={activeTab === "ingredients" ? { backgroundColor: 'var(--teal-600)' } : {}}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "instructions"
                ? "text-white"
                : "bg-white text-gray-600 border border-cream-200"
            )}
            style={activeTab === "instructions" ? { backgroundColor: 'var(--teal-600)' } : {}}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
              activeTab === "nutrition"
                ? "text-white"
                : "bg-white text-gray-600 border border-cream-200"
            )}
            style={activeTab === "nutrition" ? { backgroundColor: 'var(--teal-600)' } : {}}
          >
            Nutrition
          </button>
        </div>

        {/* Servings Adjuster */}
        {activeTab === "ingredients" && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-4 shadow-sm border border-cream-200">
            <span className="text-sm font-medium text-forest-900">
              Adjust Servings
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings(Math.max(recipe.minServings || 1, servings - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-forest-900">
                {servings}
              </span>
              <button
                onClick={() => setServings(Math.min(recipe.maxServings || 20, servings + 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--teal-500)' }}
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Ingredients List */}
        {activeTab === "ingredients" && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              {ingredients.length > 0 ? (
                <ul className="space-y-3">
                  {ingredients.map((ing: any, idx: number) => {
                    const scale = servings / baseServings;
                    const amountValue = typeof ing.amount === 'number' ? ing.amount : parseFloat(String(ing.amount)) || 0;
                    const scaledAmount = amountValue > 0 ? (amountValue * scale).toFixed(1).replace(/\.0$/, '') : '';
                    
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" style={{ borderColor: 'var(--teal-300)' }} />
                        <div className="flex-1">
                          <span className="font-medium text-forest-900">
                            {scaledAmount || ing.amount} {ing.unit}
                          </span>{" "}
                          <span className="text-gray-600">{ing.name}</span>
                          {ing.preparation && (
                            <span className="text-gray-500">, {ing.preparation}</span>
                          )}
                          {ing.notes && (
                            <span className="text-gray-400 text-sm"> ({ing.notes})</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">Ingredients coming soon!</p>
              )}
            </div>

            {/* Scaling Notes */}
            {recipe.scalingNotes && (
              <div className="mt-4 rounded-xl p-3 bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Scaling Notes
                </h4>
                <p className="text-xs text-blue-700">{recipe.scalingNotes}</p>
              </div>
            )}

            {/* Substitutions */}
            {recipe.substitutions && recipe.substitutions.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowSubstitutions(!showSubstitutions)}
                  className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-cream-200"
                >
                  <span className="text-sm font-medium text-forest-900 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" style={{ color: 'var(--teal-500)' }} />
                    Ingredient Substitutions ({recipe.substitutions.length})
                  </span>
                  <Plus className={cn("w-4 h-4 text-gray-400 transition-transform", showSubstitutions && "rotate-45")} />
                </button>
                
                {showSubstitutions && (
                  <div className="mt-2 bg-white rounded-xl p-4 shadow-sm border border-cream-200 space-y-3">
                    {recipe.substitutions.map((sub, idx) => (
                      <div key={idx} className="pb-3 border-b border-cream-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">{sub.original}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-forest-900">{sub.substitute}</span>
                        </div>
                        {sub.ratio && (
                          <p className="text-xs text-gray-500 mt-1">Ratio: {sub.ratio}</p>
                        )}
                        {sub.notes && (
                          <p className="text-xs text-gray-500 mt-1">{sub.notes}</p>
                        )}
                        <div className="flex gap-1 mt-1">
                          {sub.forDairyFree && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">DF</span>}
                          {sub.forGlutenFree && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">GF</span>}
                          {sub.forVegan && <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded">V</span>}
                          {sub.forLowCarb && <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">LC</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Instructions */}
        {activeTab === "instructions" && (
          <div className="space-y-4">
            {instructions.length > 0 ? (
              instructions.map((instruction: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200"
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 font-medium" style={{ backgroundColor: 'var(--teal-500)' }}>
                      {idx + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      {instruction}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200 text-center text-gray-500">
                <p>Instructions coming soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === "nutrition" && recipe.nutrition && (
          <div className="space-y-4">
            {/* Main Macros */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              <h3 className="font-medium text-forest-900 mb-3">Per Serving</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--cream-100)' }}>
                  <p className="text-2xl font-bold text-forest-900">{recipe.nutrition.calories}</p>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--cream-100)' }}>
                  <p className="text-2xl font-bold text-emerald-600">{recipe.nutrition.protein}g</p>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--cream-100)' }}>
                  <p className="text-2xl font-bold text-blue-600">{recipe.nutrition.netCarbs || (recipe.nutrition.carbs - recipe.nutrition.fiber).toFixed(0)}g</p>
                  <p className="text-xs text-gray-500">Net Carbs</p>
                </div>
              </div>
            </div>

            {/* Detailed Nutrition */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              <h3 className="font-medium text-forest-900 mb-3">Full Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Total Carbs</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Fiber</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.fiber}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.sugar}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Total Fat</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.fat}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600 pl-4">Saturated Fat</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.saturatedFat}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Cholesterol</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.cholesterol}mg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-gray-600">Sodium</span>
                  <span className="font-medium text-forest-900">{recipe.nutrition.sodium}mg</span>
                </div>
                {recipe.nutrition.potassium && (
                  <div className="flex justify-between py-2 border-b border-cream-100">
                    <span className="text-gray-600">Potassium</span>
                    <span className="font-medium text-forest-900">{recipe.nutrition.potassium}mg</span>
                  </div>
                )}
                {recipe.nutrition.iron && (
                  <div className="flex justify-between py-2 border-b border-cream-100">
                    <span className="text-gray-600">Iron</span>
                    <span className="font-medium text-forest-900">{recipe.nutrition.iron}mg</span>
                  </div>
                )}
                {recipe.nutrition.calcium && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Calcium</span>
                    <span className="font-medium text-forest-900">{recipe.nutrition.calcium}mg</span>
                  </div>
                )}
              </div>
            </div>

            {/* Glycemic Info */}
            {giInfo && (
              <div className={cn("rounded-2xl p-4 border", giInfo.bg, giInfo.color === 'text-green-600' ? 'border-green-200' : giInfo.color === 'text-amber-600' ? 'border-amber-200' : 'border-red-200')}>
                <h3 className={cn("font-medium mb-2 flex items-center gap-2", giInfo.color)}>
                  <Gauge className="w-4 h-4" />
                  Glycemic Impact
                </h3>
                <div className="flex gap-4">
                  <div>
                    <p className={cn("text-2xl font-bold", giInfo.color)}>{recipe.nutrition.glycemicIndex}</p>
                    <p className="text-xs text-gray-600">GI Score</p>
                  </div>
                  {recipe.nutrition.glycemicLoad && (
                    <div>
                      <p className={cn("text-2xl font-bold", giInfo.color)}>{recipe.nutrition.glycemicLoad.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">GL Score</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">{giInfo.desc}</p>
              </div>
            )}
          </div>
        )}

        {/* Tips Card */}
        {tips.length > 0 && (
          <div className="mt-6 rounded-2xl p-4 border border-terracotta-200" style={{ background: 'linear-gradient(to bottom right, var(--rose-50), var(--terracotta-50))' }}>
            <h3 className="font-medium text-terracotta-700 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Christine&apos;s Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-terracotta-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Serving Suggestions & Wine Pairing */}
        {(recipe.servingSuggestions || recipe.winePairing) && (
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
            {recipe.servingSuggestions && (
              <div className="mb-4">
                <h3 className="font-medium text-forest-900 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" style={{ color: 'var(--teal-500)' }} />
                  Serving Suggestions
                </h3>
                <p className="text-sm text-gray-600">{recipe.servingSuggestions}</p>
              </div>
            )}
            {recipe.winePairing && (
              <div className={recipe.servingSuggestions ? "pt-4 border-t border-cream-100" : ""}>
                <h3 className="font-medium text-forest-900 mb-2 flex items-center gap-2">
                  <Wine className="w-4 h-4" style={{ color: 'var(--teal-500)' }} />
                  Pairing Suggestions
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Wine:</span> {recipe.winePairing}
                </p>
                {recipe.beveragePairing && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Non-alcoholic:</span> {recipe.beveragePairing}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Seasonal Availability */}
        {recipe.seasonalAvailability && recipe.seasonalAvailability.length > 0 && !recipe.seasonalAvailability.includes('ALL_YEAR') && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-cream-200">
            <h3 className="font-medium text-forest-900 mb-2">Best Seasons</h3>
            <div className="flex gap-2">
              {recipe.seasonalAvailability.map((season) => (
                <span key={season} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                  {getSeasonIcon(season)}
                  {season.charAt(0) + season.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 btn-primary flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            Start Cooking
          </button>
          <button className="w-14 h-14 rounded-xl bg-white flex items-center justify-center transition-colors" style={{ border: '1px solid var(--teal-200)' }}>
            <Calendar className="w-5 h-5" style={{ color: 'var(--teal-600)' }} />
          </button>
        </div>

        {/* Rating Section */}
        <div className="mt-8 mb-4">
          <h3
            className="text-lg font-medium text-forest-900 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rate This Recipe
          </h3>
          {!isAuthenticated ? (
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--teal-50)', border: '1px solid var(--teal-200)' }}>
              <p className="text-sm text-gray-600 mb-3">
                Sign in to rate this recipe and help others discover great meals.
              </p>
              <button
                onClick={() => router.push(`/login?redirect=/recipe/${params.id}`)}
                className="text-sm font-medium underline" style={{ color: 'var(--teal-600)' }}
              >
                Sign in to rate
              </button>
            </div>
          ) : (
            <RatingStars
              recipeId={params.id as string}
              initialRating={ratingData?.userRating || null}
              averageRating={ratingData?.averageRating}
              totalRatings={ratingData?.totalRatings}
              interactive={true}
              onRatingChange={(rating) => {
                fetch(`/api/recipes/${params.id}/ratings`)
                  .then((res) => res.json())
                  .then((data) => {
                    setRatingData({
                      averageRating: data.averageRating || 0,
                      totalRatings: data.totalRatings || 0,
                      userRating: rating,
                    });
                  });
              }}
            />
          )}
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                Sign in to save recipes
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to save your favorite recipes and access them anytime.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    router.push("/login");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium transition-colors"
                  style={{ backgroundColor: 'var(--teal-500)' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
