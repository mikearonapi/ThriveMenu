"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
  Calendar,
  Trash2,
  Sun,
  Moon,
  Cookie,
  Users,
  User,
  Baby,
  Sparkles,
  Fish,
  Leaf,
  Loader2,
  Clock,
  ChefHat,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Get week dates
function getWeekDates(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface MealPlanItem {
  id: string;
  recipeId: string;
  date: string;
  mealType: string;
  servings: number;
  recipe: {
    id: string;
    name: string;
    imageUrl?: string;
    mealType: string;
    healthTags?: Array<{ healthTag: { slug: string } }>;
  };
}

interface MealPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  items: MealPlanItem[];
}

export default function MealPlanPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingList, setIsGeneratingList] = useState(false);
  const weekDates = getWeekDates(currentDate);

  // Fetch meal plan for current week
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function fetchMealPlan() {
      setIsLoading(true);
      try {
        const startDate = weekDates[0].toISOString().split("T")[0];
        const endDate = weekDates[6].toISOString().split("T")[0];
        
        const response = await fetch(
          `/api/meal-plans?startDate=${startDate}&endDate=${endDate}`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Use the first meal plan or create a new one
          if (data.mealPlans && data.mealPlans.length > 0) {
            setMealPlan(data.mealPlans[0]);
          } else {
            // Create a new meal plan for this week
            const createResponse = await fetch("/api/meal-plans", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `Week of ${formatFullDate(weekDates[0])}`,
                startDate: weekDates[0].toISOString(),
                endDate: weekDates[6].toISOString(),
              }),
            });
            
            if (createResponse.ok) {
              const newPlan = await createResponse.json();
              setMealPlan(newPlan.mealPlan);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMealPlan();
  }, [weekDates, isAuthenticated]);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleAddMeal = (date: Date, mealType: string) => {
    router.push(`/explore?meal=${mealType.toLowerCase()}&addToPlan=${date.toISOString().split("T")[0]}&mealType=${mealType}`);
  };

  const handleRemoveMeal = async (date: Date, mealType: string) => {
    if (!mealPlan) return;

    try {
      const response = await fetch(
        `/api/meal-plans/items?mealPlanId=${mealPlan.id}&date=${date.toISOString()}&mealType=${mealType}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        // Refresh meal plan
        const refreshResponse = await fetch(`/api/meal-plans/${mealPlan.id}`);
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setMealPlan(data.mealPlan);
        }
      }
    } catch (error) {
      console.error("Error removing meal:", error);
    }
  };

  const handleGenerateShoppingList = async () => {
    if (!mealPlan) return;

    setIsGeneratingList(true);
    try {
      const response = await fetch("/api/shopping-lists/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealPlanId: mealPlan.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/shopping-list/${data.shoppingList.id}`);
      }
    } catch (error) {
      console.error("Error generating shopping list:", error);
    } finally {
      setIsGeneratingList(false);
    }
  };

  // Get meals for selected date
  const dateKey = selectedDate.toISOString().split("T")[0];
  const todaysMeals = mealPlan?.items
    .filter((item) => item.date.startsWith(dateKey))
    .reduce((acc, item) => {
      const type = item.mealType.toLowerCase();
      acc[type] = item.recipe.name;
      return acc;
    }, {} as Record<string, string>) || {};

  const getMealItem = (mealType: string) => {
    return mealPlan?.items.find(
      (item) =>
        item.date.startsWith(dateKey) &&
        item.mealType.toLowerCase() === mealType.toLowerCase()
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center px-5">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Sign In to Plan Meals
          </h1>
          <p className="text-gray-600 mb-6">
            Create meal plans and generate shopping lists for your family.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-cream-100">
      {/* Header */}
      <header className="px-5 sm:px-6 md:px-8 lg:px-12 pt-12 pb-6 bg-gradient-to-b from-sage-50 max-w-7xl mx-auto" style={{ background: 'linear-gradient(to bottom, var(--sage-50), var(--cream-100))' }}>
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-medium text-forest-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Meal Planning
          </h1>
          <button
            onClick={handleGenerateShoppingList}
            disabled={isGeneratingList || !mealPlan}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-sage-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingList ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            Shopping List
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevWeek}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium text-forest-900">
            {formatFullDate(weekDates[0])} - {formatFullDate(weekDates[6])}
          </span>
          <button
            onClick={nextWeek}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week Days */}
        <div className="flex justify-between md:gap-2">
          {weekDates.map((date, idx) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasPlannedMeals = mealPlan?.items.some(
              (item) => item.date.startsWith(date.toISOString().split("T")[0])
            );

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center py-2 px-2 md:px-3 md:py-3 rounded-xl transition-all flex-1 md:flex-none",
                  isSelected
                    ? "bg-sage-500 text-white"
                    : "text-gray-600"
                )}
              >
                <span className="text-xs md:text-sm font-medium">{formatDate(date)}</span>
                <span
                  className={cn(
                    "text-lg md:text-xl font-medium",
                    isToday && !isSelected && "text-sage-600"
                  )}
                >
                  {date.getDate()}
                </span>
                {hasPlannedMeals && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-500 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Selected Day Meals */}
      <div className="px-5 py-4">
        <h2 className="text-lg font-medium text-forest-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>

        <div className="space-y-4">
          {/* Breakfast */}
          <MealSlot
            mealType="BREAKFAST"
            icon={Sun}
            plannedItem={getMealItem("BREAKFAST")}
            onAdd={() => handleAddMeal(selectedDate, "BREAKFAST")}
            onRemove={() => handleRemoveMeal(selectedDate, "BREAKFAST")}
          />

          {/* Lunch */}
          <MealSlot
            mealType="LUNCH"
            icon={Sun}
            plannedItem={getMealItem("LUNCH")}
            onAdd={() => handleAddMeal(selectedDate, "LUNCH")}
            onRemove={() => handleRemoveMeal(selectedDate, "LUNCH")}
          />

          {/* Dinner */}
          <MealSlot
            mealType="DINNER"
            icon={Moon}
            plannedItem={getMealItem("DINNER")}
            onAdd={() => handleAddMeal(selectedDate, "DINNER")}
            onRemove={() => handleRemoveMeal(selectedDate, "DINNER")}
          />

          {/* Snacks */}
          <MealSlot
            mealType="SNACK"
            icon={Cookie}
            plannedItem={getMealItem("SNACK")}
            onAdd={() => handleAddMeal(selectedDate, "SNACK")}
            onRemove={() => handleRemoveMeal(selectedDate, "SNACK")}
          />
        </div>
      </div>

      {/* Family Section */}
      <div className="px-5 sm:px-6 md:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Planning for Family
          </h2>
          <Link
            href="/profile"
            className="text-sm text-sage-600 hover:text-sage-700"
          >
            Manage Family
          </Link>
        </div>
        <FamilyMembersDisplay />
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-4">
        <div className="bg-gradient-to-br from-sage-100 rounded-2xl p-5" style={{ background: 'linear-gradient(to bottom right, var(--sage-100), var(--forest-100))' }}>
          <h3
            className="font-medium text-forest-900 mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={async () => {
                if (!mealPlan) return;
                // Auto-generate meal plan based on health goals
                // This would use AI or algorithm to suggest recipes
                alert("Auto-generate feature coming soon! This will suggest recipes based on your health goals.");
              }}
              className="bg-white rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <Calendar className="w-5 h-5 text-sage-600 mb-2" />
              <p className="text-sm font-medium text-forest-900">
                Auto-Generate Week
              </p>
              <p className="text-xs text-gray-500">
                Based on health goals
              </p>
            </button>
            <button
              onClick={handleGenerateShoppingList}
              disabled={isGeneratingList || !mealPlan}
              className="bg-white rounded-xl p-3 text-left shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingList ? (
                <Loader2 className="w-5 h-5 text-sage-600 mb-2 animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5 text-sage-600 mb-2" />
              )}
              <p className="text-sm font-medium text-forest-900">
                Generate List
              </p>
              <p className="text-xs text-gray-500">
                Shopping for the week
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Meal Prep Suggestions */}
      {mealPlan && (
        <MealPrepSuggestions mealPlanId={mealPlan.id} />
      )}

      {/* This Week's Nutrition Summary */}
      {mealPlan && (
        <NutritionSummary mealPlan={mealPlan} />
      )}
    </div>
  );
}

// Family Members Display Component
function FamilyMembersDisplay() {
  const { isAuthenticated } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/family-members")
        .then((res) => res.json())
        .then((data) => setFamilyMembers(data.familyMembers || []))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  if (familyMembers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        <p>Add family members in your profile to see them here</p>
      </div>
    );
  }

  const getIcon = (ageGroup: string) => {
    switch (ageGroup) {
      case "INFANT":
        return Baby;
      case "PRESCHOOL":
      case "CHILD":
        return Sparkles;
      default:
        return User;
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 md:flex-wrap md:overflow-x-visible">
      {familyMembers.map((member) => {
        const Icon = getIcon(member.ageGroup);
        return (
          <div
            key={member.id}
            className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-gray-300 min-w-[100px] text-center"
          >
            <Icon className="w-6 h-6 text-sage-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-forest-900 mt-1">
              {member.name}
            </p>
            <p className="text-xs text-gray-500">
              {member.ageGroup === "INFANT" ? "Infant" :
               member.ageGroup === "PRESCHOOL" ? "Preschool" :
               member.ageGroup === "CHILD" ? "Child" :
               member.ageGroup === "ADULT" ? "Adult" : member.ageGroup}
            </p>
            {member.isVegetarian && (
              <p className="text-xs text-sage-600 mt-1">Vegetarian</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MealSlot({
  mealType,
  icon: Icon,
  plannedItem,
  onAdd,
  onRemove,
}: {
  mealType: string;
  icon: any;
  plannedItem?: MealPlanItem;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const mealTypeLabel = mealType.charAt(0) + mealType.slice(1).toLowerCase();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon className="w-6 h-6 text-sage-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sage-600">
              {mealTypeLabel}
            </p>
            {plannedItem ? (
              <div>
                <Link
                  href={`/recipe/${plannedItem.recipe.id}`}
                  className="text-forest-900 font-medium hover:text-sage-600 transition-colors block truncate"
                >
                  {plannedItem.recipe.name}
                </Link>
                {plannedItem.servings && (
                  <p className="text-xs text-gray-500 mt-1">
                    {plannedItem.servings} serving{plannedItem.servings !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No meal planned</p>
            )}
          </div>
        </div>
        {plannedItem ? (
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        ) : (
          <button
            onClick={onAdd}
            className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center hover:bg-sage-200 transition-colors flex-shrink-0"
          >
            <Plus className="w-5 h-5 text-sage-600" />
          </button>
        )}
      </div>
    </div>
  );
}

// Nutrition Summary Component
function NutritionSummary({ mealPlan }: { mealPlan: MealPlan }) {
  const [summary, setSummary] = useState({
    omega3Meals: 0,
    highFiberMeals: 0,
    kidFriendlyMeals: 0,
  });
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate nutrition summary from meal plan items
    let omega3 = 0;
    let highFiber = 0;
    let kidFriendly = 0;

    mealPlan.items.forEach((item) => {
      const tags = item.recipe.healthTags?.map((t) => t.healthTag.slug) || [];
      if (tags.includes("omega-3-rich")) omega3++;
      if (tags.includes("high-fiber")) highFiber++;
      if (tags.includes("kid-friendly")) kidFriendly++;
    });

    setSummary({
      omega3Meals: omega3,
      highFiberMeals: highFiber,
      kidFriendlyMeals: kidFriendly,
    });

    // Fetch detailed nutrition summary
    async function fetchNutritionSummary() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/health/nutrition-summary?mealPlanId=${mealPlan.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setNutritionData(data);
        }
      } catch (error) {
        console.error("Error fetching nutrition summary:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNutritionSummary();
  }, [mealPlan]);

  return (
    <div className="px-5 sm:px-6 md:px-8 lg:px-12 py-4 mb-4 max-w-7xl mx-auto">
      <h2
        className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900 mb-4 md:mb-6"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        This Week&apos;s Nutrition
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
        <NutritionSummaryCard
          label="Omega-3 Meals"
          value={summary.omega3Meals.toString()}
          target="2-3"
          color="sage"
          icon={Fish}
        />
        <NutritionSummaryCard
          label="High Fiber"
          value={summary.highFiberMeals.toString()}
          target="10+"
          color="forest"
          icon={Leaf}
        />
        <NutritionSummaryCard
          label="Kid-Friendly"
          value={summary.kidFriendlyMeals.toString()}
          target="7"
          color="terracotta"
          icon={Sparkles}
        />
      </div>
      {nutritionData && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-forest-900 mb-3">
            Daily Averages
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Calories</p>
              <p className="text-lg font-medium text-forest-900">
                {nutritionData.averages.calories}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Protein</p>
              <p className="text-lg font-medium text-forest-900">
                {nutritionData.averages.protein}g
              </p>
            </div>
            <div>
              <p className="text-gray-600">Fiber</p>
              <p className="text-lg font-medium text-forest-900">
                {nutritionData.averages.fiber}g
              </p>
            </div>
            <div>
              <p className="text-gray-600">Omega-3</p>
              <p className="text-lg font-medium text-forest-900">
                {nutritionData.averages.omega3}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Meal Prep Suggestions Component
function MealPrepSuggestions({ mealPlanId }: { mealPlanId: string }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSuggestions() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/meal-plans/suggest-meal-prep?mealPlanId=${mealPlanId}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error("Error fetching meal prep suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [mealPlanId]);

  if (isLoading || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="px-5 sm:px-6 md:px-8 lg:px-12 py-4 mb-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-sage-600" />
        <h2
          className="text-lg font-medium text-forest-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Meal Prep Tips
        </h2>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-3">
              {suggestion.type === "MAKE_AHEAD" && (
                <ChefHat className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
              )}
              {suggestion.type === "BATCH_COOKING" && (
                <Clock className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
              )}
              {suggestion.type === "QUICK_PREP" && (
                <Clock className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-forest-900 text-sm mb-1">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {suggestion.description}
                </p>
                {suggestion.recipes && suggestion.recipes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestion.recipes.slice(0, 3).map((recipe: any) => (
                      <Link
                        key={recipe.id}
                        href={`/recipe/${recipe.id}`}
                        className="text-xs px-2 py-1 bg-cream-100 text-forest-800 rounded-full hover:bg-cream-200 transition-colors"
                      >
                        {recipe.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutritionSummaryCard({
  label,
  value,
  target,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  target: string;
  color: "sage" | "forest" | "terracotta";
  icon: any;
}) {
  const colors = {
    sage: "bg-sage-50 text-sage-700",
    forest: "bg-forest-50 text-forest-700",
    terracotta: "bg-terracotta-50 text-terracotta-700",
  };

  return (
    <div className={cn("rounded-xl p-3 text-center", colors[color])}>
      <Icon className="w-6 h-6 mx-auto mb-1" />
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-[10px] opacity-70">Target: {target}</p>
      <p className="text-xs font-medium mt-1">{label}</p>
    </div>
  );
}

