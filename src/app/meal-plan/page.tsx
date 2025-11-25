"use client";

import { useState } from "react";
import Link from "next/link";
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

// Sample meal plan data
const sampleMealPlan: Record<string, { breakfast?: string; lunch?: string; dinner?: string }> = {
  "2024-11-25": {
    breakfast: "Golden Turmeric Oatmeal",
    lunch: "Mediterranean Quinoa Salad",
    dinner: "Lemon Herb Baked Salmon",
  },
  "2024-11-26": {
    breakfast: "Greek Yogurt Parfait",
    lunch: "Tuscan White Bean & Kale Soup",
    dinner: "Greek Chicken with Roasted Vegetables",
  },
  "2024-11-27": {
    breakfast: "Avocado Toast with Poached Egg",
    lunch: "Buddha Bowl",
    dinner: "Chickpea Curry",
  },
};

export default function MealPlanPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDates = getWeekDates(currentDate);

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

  const dateKey = selectedDate.toISOString().split("T")[0];
  const todaysMeals = sampleMealPlan[dateKey] || {};

  return (
    <div className="min-h-screen pb-24 style={{ backgroundColor: 'var(--cream-100)' }}">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 bg-gradient-to-b from-sage-50" style={{ background: 'linear-gradient(to bottom, var(--sage-50), var(--cream-100))' }}>
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-medium text-forest-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Meal Planning
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-sage-600 font-medium text-sm">
            <ShoppingCart className="w-4 h-4" />
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
        <div className="flex justify-between">
          {weekDates.map((date, idx) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasPlannedMeals = sampleMealPlan[date.toISOString().split("T")[0]];

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-xl transition-all",
                  isSelected
                    ? "bg-sage-500 text-white"
                    : "text-gray-600"
                )}
              >
                <span className="text-xs font-medium">{formatDate(date)}</span>
                <span
                  className={cn(
                    "text-lg font-medium",
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
            mealType="Breakfast"
            icon={Sun}
            plannedRecipe={todaysMeals.breakfast}
          />

          {/* Lunch */}
          <MealSlot
            mealType="Lunch"
            icon={Sun}
            plannedRecipe={todaysMeals.lunch}
          />

          {/* Dinner */}
          <MealSlot
            mealType="Dinner"
            icon={Moon}
            plannedRecipe={todaysMeals.dinner}
          />

          {/* Snacks */}
          <MealSlot
            mealType="Snacks"
            icon={Cookie}
            plannedRecipe={undefined}
          />
        </div>
      </div>

      {/* Family Section */}
      <div className="px-5 py-4">
        <h2
          className="text-lg font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Planning for Family
        </h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { name: "Christine", icon: User, dietary: "Graves-friendly" },
            { name: "Mike", icon: User, dietary: "" },
            { name: "Daughter", icon: Sparkles, dietary: "Age 6" },
            { name: "Son", icon: Sparkles, dietary: "Age 4" },
            { name: "Baby", icon: Baby, dietary: "6 months" },
          ].map((member, idx) => {
            const Icon = member.icon;
            return (
            <div
              key={idx}
              className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-gray-300 min-w-[100px] text-center"
            >
              <Icon className="w-6 h-6 text-sage-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-forest-900 mt-1">
                {member.name}
              </p>
              {member.dietary && (
                <p className="text-xs text-gray-500">
                  {member.dietary}
                </p>
              )}
            </div>
          );
          })}
        </div>
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
            <button className="bg-white rounded-xl p-3 text-left shadow-sm">
              <Calendar className="w-5 h-5 text-sage-600 mb-2" />
              <p className="text-sm font-medium text-forest-900">
                Auto-Generate Week
              </p>
              <p className="text-xs text-gray-500">
                Based on health goals
              </p>
            </button>
            <button className="bg-white rounded-xl p-3 text-left shadow-sm">
              <ShoppingCart className="w-5 h-5 text-sage-600 mb-2" />
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

      {/* This Week's Nutrition Summary */}
      <div className="px-5 py-4 mb-4">
        <h2
          className="text-lg font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          This Week&apos;s Nutrition
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <NutritionSummaryCard
            label="Omega-3 Meals"
            value="4"
            target="2-3"
            color="sage"
            icon={Fish}
          />
          <NutritionSummaryCard
            label="High Fiber"
            value="12"
            target="10+"
            color="forest"
            icon={Leaf}
          />
          <NutritionSummaryCard
            label="Kid-Friendly"
            value="8"
            target="7"
            color="terracotta"
            icon={Sparkles}
          />
        </div>
      </div>
    </div>
  );
}

function MealSlot({
  mealType,
  icon: Icon,
  plannedRecipe,
}: {
  mealType: string;
  icon: any;
  plannedRecipe?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-sage-600" />
          <div>
            <p className="text-sm font-medium text-sage-600">
              {mealType}
            </p>
            {plannedRecipe ? (
              <p className="text-forest-900 font-medium">
                {plannedRecipe}
              </p>
            ) : (
              <p className="text-gray-500 italic">No meal planned</p>
            )}
          </div>
        </div>
        {plannedRecipe ? (
          <button className="w-8 h-8 rounded-full style={{ backgroundColor: 'var(--cream-100)' }} flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        ) : (
          <Link
            href={`/explore?meal=${mealType.toLowerCase()}`}
            className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-sage-600" />
          </Link>
        )}
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

