// ThriveMenu Type Definitions

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "BEVERAGE" | "DESSERT";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Recipe {
  id: string;
  slug: string;
  name: string;
  description: string;
  mealType: MealType;
  cuisine?: string;
  category: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  servingSize?: string;
  difficulty: Difficulty;
  imageUrl?: string;
  healthBenefits: string;
  isKidFriendly: boolean;
  isMakeAhead: boolean;
  isOnePot: boolean;
  isQuick: boolean;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  nutritionInfo?: NutritionInfo;
  healthTags?: HealthTag[];
  dietaryTags?: DietaryTag[];
}

export interface RecipeIngredient {
  id: string;
  ingredient: Ingredient;
  amount: number;
  unit: string;
  preparation?: string;
  notes?: string;
  isOptional: boolean;
  groupName?: string;
  orderIndex: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
}

export interface RecipeInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  tipText?: string;
  durationMinutes?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  fat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  omega3?: number;
  selenium?: number;
}

export interface HealthTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface DietaryTag {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  ageGroup: "INFANT" | "TODDLER" | "PRESCHOOL" | "CHILD" | "TEEN" | "ADULT";
  isVegetarian: boolean;
  allergies: string[];
  dislikes: string[];
}

export interface MealPlan {
  id: string;
  name?: string;
  startDate: Date;
  endDate: Date;
  items: MealPlanItem[];
}

export interface MealPlanItem {
  id: string;
  recipe: Recipe;
  date: Date;
  mealType: MealType;
  servings: number;
  isCompleted: boolean;
}

// Static data for recipes (will be migrated to DB later)
export interface StaticRecipe {
  number: number;
  name: string;
  description: string;
  mealType: MealType;
  category: string;
  healthBenefits: string;
  keyNutrients: string[];
  isKidFriendly?: boolean;
  isQuick?: boolean;
  hasOmega3?: boolean;
  hasHighFiber?: boolean;
  isAntiInflammatory?: boolean;
  hasSelenium?: boolean;
  isHeartHealthy?: boolean;
}

