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
    <div className="min-h-screen pb-24 bg-[var(--cream-100)]">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 bg-gradient-to-b from-[var(--sage-50)] to-[var(--cream-100)]">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-medium text-[var(--forest-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Meal Planning
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-[var(--sage-600)] font-medium text-sm">
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
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <span className="font-medium text-[var(--forest-800)]">
            {formatFullDate(weekDates[0])} - {formatFullDate(weekDates[6])}
          </span>
          <button
            onClick={nextWeek}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
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
                    ? "bg-[var(--sage-500)] text-white"
                    : "text-[var(--text-secondary)]"
                )}
              >
                <span className="text-xs font-medium">{formatDate(date)}</span>
                <span
                  className={cn(
                    "text-lg font-medium",
                    isToday && !isSelected && "text-[var(--sage-600)]"
                  )}
                >
                  {date.getDate()}
                </span>
                {hasPlannedMeals && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--sage-500)] mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Selected Day Meals */}
      <div className="px-5 py-4">
        <h2 className="text-lg font-medium text-[var(--forest-800)] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
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
            emoji="🌅"
            plannedRecipe={todaysMeals.breakfast}
          />

          {/* Lunch */}
          <MealSlot
            mealType="Lunch"
            emoji="☀️"
            plannedRecipe={todaysMeals.lunch}
          />

          {/* Dinner */}
          <MealSlot
            mealType="Dinner"
            emoji="🌙"
            plannedRecipe={todaysMeals.dinner}
          />

          {/* Snacks */}
          <MealSlot
            mealType="Snacks"
            emoji="🍎"
            plannedRecipe={undefined}
          />
        </div>
      </div>

      {/* Family Section */}
      <div className="px-5 py-4">
        <h2
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Planning for Family
        </h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { name: "Christine", emoji: "👩", dietary: "Graves-friendly" },
            { name: "Mike", emoji: "👨", dietary: "" },
            { name: "Daughter", emoji: "👧", dietary: "Age 6" },
            { name: "Son", emoji: "👦", dietary: "Age 4" },
            { name: "Baby", emoji: "👶", dietary: "6 months" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-[var(--cream-300)] min-w-[100px] text-center"
            >
              <span className="text-2xl">{member.emoji}</span>
              <p className="text-sm font-medium text-[var(--forest-800)] mt-1">
                {member.name}
              </p>
              {member.dietary && (
                <p className="text-xs text-[var(--text-muted)]">
                  {member.dietary}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-4">
        <div className="bg-gradient-to-br from-[var(--sage-100)] to-[var(--forest-100)] rounded-2xl p-5">
          <h3
            className="font-medium text-[var(--forest-800)] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            ✨ Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-xl p-3 text-left shadow-sm">
              <Calendar className="w-5 h-5 text-[var(--sage-600)] mb-2" />
              <p className="text-sm font-medium text-[var(--forest-800)]">
                Auto-Generate Week
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Based on health goals
              </p>
            </button>
            <button className="bg-white rounded-xl p-3 text-left shadow-sm">
              <ShoppingCart className="w-5 h-5 text-[var(--sage-600)] mb-2" />
              <p className="text-sm font-medium text-[var(--forest-800)]">
                Generate List
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Shopping for the week
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* This Week's Nutrition Summary */}
      <div className="px-5 py-4 mb-4">
        <h2
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
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
            icon="🐟"
          />
          <NutritionSummaryCard
            label="High Fiber"
            value="12"
            target="10+"
            color="forest"
            icon="🥬"
          />
          <NutritionSummaryCard
            label="Kid-Friendly"
            value="8"
            target="7"
            color="terracotta"
            icon="👧"
          />
        </div>
      </div>
    </div>
  );
}

function MealSlot({
  mealType,
  emoji,
  plannedRecipe,
}: {
  mealType: string;
  emoji: string;
  plannedRecipe?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--cream-300)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-sm font-medium text-[var(--sage-600)]">
              {mealType}
            </p>
            {plannedRecipe ? (
              <p className="text-[var(--forest-800)] font-medium">
                {plannedRecipe}
              </p>
            ) : (
              <p className="text-[var(--text-muted)] italic">No meal planned</p>
            )}
          </div>
        </div>
        {plannedRecipe ? (
          <button className="w-8 h-8 rounded-full bg-[var(--cream-100)] flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        ) : (
          <Link
            href={`/explore?meal=${mealType.toLowerCase()}`}
            className="w-10 h-10 rounded-full bg-[var(--sage-100)] flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-[var(--sage-600)]" />
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
  icon,
}: {
  label: string;
  value: string;
  target: string;
  color: "sage" | "forest" | "terracotta";
  icon: string;
}) {
  const colors = {
    sage: "bg-[var(--sage-50)] text-[var(--sage-700)]",
    forest: "bg-[var(--forest-50)] text-[var(--forest-700)]",
    terracotta: "bg-[var(--terracotta-50)] text-[var(--terracotta-700)]",
  };

  return (
    <div className={cn("rounded-xl p-3 text-center", colors[color])}>
      <span className="text-xl">{icon}</span>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-[10px] opacity-70">Target: {target}</p>
      <p className="text-xs font-medium mt-1">{label}</p>
    </div>
  );
}

