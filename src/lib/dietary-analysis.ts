// ThriveMenu Dietary Analysis System
// Comprehensive ingredient categorization for dietary filtering
//
// This module analyzes recipe ingredients to automatically determine
// which dietary tags apply to each recipe.

// =============================================
// GLUTEN-CONTAINING INGREDIENTS
// =============================================
export const GLUTEN_INGREDIENTS = new Set([
  // Grains
  "wheat", "wheat flour", "all-purpose flour", "flour", "bread flour", "cake flour",
  "whole wheat flour", "semolina", "durum", "spelt", "farro", "kamut", "triticale",
  "barley", "pearl barley", "rye", "rye flour",
  
  // Regular oats (unless certified GF)
  "oats", "rolled oats", "old-fashioned oats", "quick oats", "instant oats",
  "steel-cut oats", "oat bran", "oat flour",
  
  // Bread & Baked Goods
  "bread", "whole grain bread", "whole wheat bread", "white bread", "sourdough",
  "pita", "pita bread", "naan", "flatbread", "tortilla", "flour tortilla",
  "ciabatta", "baguette", "focaccia", "breadcrumbs", "panko", "croutons",
  
  // Pasta & Noodles
  "pasta", "spaghetti", "linguine", "fettuccine", "penne", "rigatoni",
  "macaroni", "lasagna", "orzo", "couscous", "egg noodles", "ramen",
  "udon", "lo mein noodles", "wonton wrappers",
  
  // Cereals & Processed
  "granola", "cereal", "wheat germ", "bulgur", "seitan", "vital wheat gluten",
  
  // Sauces that typically contain wheat
  "soy sauce", "teriyaki sauce", "hoisin sauce", "oyster sauce",
]);

// =============================================
// DAIRY-CONTAINING INGREDIENTS  
// =============================================
export const DAIRY_INGREDIENTS = new Set([
  // Milk
  "milk", "whole milk", "2% milk", "skim milk", "low-fat milk", "nonfat milk",
  "buttermilk", "evaporated milk", "condensed milk", "sweetened condensed milk",
  "cream", "heavy cream", "heavy whipping cream", "whipping cream",
  "half-and-half", "half and half", "light cream", "coffee cream",
  
  // Cheese
  "cheese", "cheddar", "cheddar cheese", "mozzarella", "mozzarella cheese",
  "parmesan", "parmesan cheese", "parmigiano-reggiano", "pecorino",
  "feta", "feta cheese", "goat cheese", "blue cheese", "gorgonzola",
  "brie", "camembert", "gruyere", "swiss cheese", "provolone",
  "ricotta", "ricotta cheese", "cottage cheese", "cream cheese",
  "mascarpone", "monterey jack", "colby", "american cheese",
  "queso fresco", "paneer", "halloumi",
  
  // Yogurt & Cultured
  "yogurt", "greek yogurt", "plain yogurt", "vanilla yogurt",
  "sour cream", "crème fraîche", "kefir", "labneh",
  
  // Butter & Fats
  "butter", "unsalted butter", "salted butter", "ghee", "clarified butter",
  
  // Ice cream & Frozen
  "ice cream", "frozen yogurt", "gelato",
  
  // Other
  "whey", "whey protein", "casein", "lactose", "curds",
]);

// =============================================
// MEAT INGREDIENTS (Non-pescatarian)
// =============================================
export const MEAT_INGREDIENTS = new Set([
  // Beef
  "beef", "steak", "ground beef", "beef chuck", "sirloin", "ribeye",
  "filet mignon", "flank steak", "brisket", "corned beef", "roast beef",
  "beef broth", "beef stock", "veal",
  
  // Pork
  "pork", "pork chop", "pork loin", "pork tenderloin", "pork shoulder",
  "ham", "bacon", "pancetta", "prosciutto", "chorizo", "sausage",
  "italian sausage", "pork sausage", "breakfast sausage", "kielbasa",
  "salami", "pepperoni", "mortadella", "hot dog", "bratwurst",
  "pulled pork", "carnitas", "ground pork", "pork belly",
  
  // Poultry
  "chicken", "chicken breast", "chicken thigh", "chicken thighs",
  "chicken drumstick", "chicken wing", "chicken tender",
  "rotisserie chicken", "ground chicken", "chicken broth", "chicken stock",
  "turkey", "ground turkey", "turkey breast", "turkey bacon", "turkey sausage",
  "duck", "duck breast", "cornish hen", "quail",
  
  // Lamb
  "lamb", "lamb chop", "ground lamb", "lamb leg", "rack of lamb",
  "lamb shoulder", "lamb shank",
  
  // Game & Other
  "venison", "bison", "rabbit", "goat", "organ meat", "liver",
]);

// =============================================
// FISH & SEAFOOD INGREDIENTS
// =============================================
export const FISH_SEAFOOD_INGREDIENTS = new Set([
  // Fish
  "fish", "salmon", "wild salmon", "atlantic salmon", "sockeye salmon",
  "tuna", "ahi tuna", "yellowfin tuna", "canned tuna", "tuna steak",
  "cod", "pacific cod", "atlantic cod", "tilapia", "halibut",
  "sea bass", "bass", "trout", "rainbow trout", "sardines", "anchovies",
  "anchovy", "mackerel", "herring", "snapper", "red snapper", "grouper",
  "mahi mahi", "swordfish", "catfish", "flounder", "sole", "perch",
  "arctic char", "branzino", "white fish", "whitefish",
  
  // Shellfish
  "shrimp", "prawns", "lobster", "crab", "crab meat", "lump crab",
  "scallops", "sea scallops", "bay scallops", "clams", "mussels",
  "oysters", "calamari", "squid", "octopus", "crayfish", "crawfish",
  
  // Processed/Canned
  "smoked salmon", "lox", "fish sauce", "fish stock", "dashi",
  "bonito flakes", "anchovy paste", "worcestershire sauce",
]);

// =============================================
// EGG INGREDIENTS
// =============================================
export const EGG_INGREDIENTS = new Set([
  "egg", "eggs", "egg white", "egg whites", "egg yolk", "egg yolks",
  "large egg", "large eggs", "whole egg", "beaten egg", "scrambled eggs",
  "poached egg", "hard-boiled egg", "soft-boiled egg", "fried egg",
  "mayonnaise", "mayo", "aioli", "hollandaise",
]);

// =============================================
// NUT INGREDIENTS
// =============================================
export const NUT_INGREDIENTS = new Set([
  // Tree Nuts
  "almonds", "almond", "sliced almonds", "slivered almonds", "almond flour",
  "almond butter", "almond milk", "almond extract",
  "walnuts", "walnut", "chopped walnuts",
  "cashews", "cashew", "cashew butter", "cashew cream", "cashew milk",
  "pecans", "pecan", "chopped pecans",
  "pistachios", "pistachio",
  "hazelnuts", "hazelnut", "filberts",
  "macadamia nuts", "macadamia",
  "brazil nuts", "brazil nut",
  "pine nuts", "pignoli",
  "chestnuts", "chestnut",
  
  // Nut butters & products
  "nut butter", "mixed nuts", "nut flour",
  "praline", "marzipan", "almond paste", "frangipane",
  "nutella", "hazelnut spread",
]);

// =============================================
// SOY INGREDIENTS
// =============================================
export const SOY_INGREDIENTS = new Set([
  "soy", "soybeans", "soybean", "soy sauce", "soy milk", "soy protein",
  "tofu", "silken tofu", "firm tofu", "extra firm tofu", "soft tofu",
  "tempeh", "edamame", "miso", "miso paste", "white miso", "red miso",
  "soy flour", "soy lecithin", "soy oil", "soybean oil",
  "tamari", "teriyaki sauce", "hoisin sauce",
]);

// =============================================
// SHELLFISH INGREDIENTS (subset of seafood)
// =============================================
export const SHELLFISH_INGREDIENTS = new Set([
  "shrimp", "prawns", "lobster", "crab", "crab meat", "lump crab",
  "scallops", "sea scallops", "bay scallops", "clams", "mussels",
  "oysters", "crayfish", "crawfish", "langoustine",
]);

// =============================================
// NIGHTSHADE INGREDIENTS
// =============================================
export const NIGHTSHADE_INGREDIENTS = new Set([
  "tomato", "tomatoes", "cherry tomatoes", "grape tomatoes", "roma tomatoes",
  "sun-dried tomatoes", "sundried tomatoes", "tomato paste", "tomato sauce",
  "crushed tomatoes", "diced tomatoes", "tomato puree", "marinara",
  "potato", "potatoes", "sweet potato", "russet potato", "yukon gold",
  "red potato", "fingerling potato", "potato starch",
  "bell pepper", "bell peppers", "red bell pepper", "green bell pepper",
  "yellow bell pepper", "orange bell pepper", "roasted red pepper",
  "jalapeño", "jalapeno", "serrano", "poblano", "chipotle", "ancho chile",
  "cayenne", "cayenne pepper", "chili powder", "red pepper flakes",
  "crushed red pepper", "paprika", "smoked paprika", "hungarian paprika",
  "eggplant", "aubergine",
  "goji berries", "peppers", "hot sauce", "sriracha", "tabasco",
]);

// =============================================
// HIGH FODMAP INGREDIENTS
// =============================================
export const HIGH_FODMAP_INGREDIENTS = new Set([
  // Fruits
  "apple", "apples", "pear", "pears", "mango", "mangoes", "watermelon",
  "cherries", "peach", "peaches", "plum", "plums", "nectarine",
  "dried fruit", "raisins", "dates", "prunes", "apricots",
  
  // Vegetables
  "garlic", "onion", "onions", "shallot", "shallots", "leek", "leeks",
  "asparagus", "artichoke", "artichokes", "cauliflower",
  "mushrooms", "button mushrooms", "cremini mushrooms", "shiitake",
  
  // Legumes
  "beans", "black beans", "kidney beans", "navy beans", "pinto beans",
  "chickpeas", "garbanzo beans", "lentils", "split peas",
  
  // Dairy
  "milk", "ice cream", "soft cheese", "ricotta", "cottage cheese",
  
  // Grains
  "wheat", "rye", "barley",
  
  // Sweeteners
  "honey", "high fructose corn syrup", "agave", "sorbitol", "mannitol",
  "xylitol", "maltitol",
]);

// =============================================
// ANALYSIS FUNCTIONS
// =============================================

/**
 * Normalize ingredient name for comparison
 */
export function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars except hyphens
    .replace(/\s+/g, " ")     // Normalize spaces
    .trim();
}

/**
 * Check if an ingredient contains any item from a set
 */
export function containsAny(ingredientName: string, ingredientSet: Set<string>): boolean {
  const normalized = normalizeIngredient(ingredientName);
  
  // Direct match
  if (ingredientSet.has(normalized)) return true;
  
  // Check if any set item is contained in the ingredient name
  for (const item of ingredientSet) {
    if (normalized.includes(item) || item.includes(normalized)) {
      return true;
    }
  }
  
  // Check word boundaries for more precise matching
  const words = normalized.split(" ");
  for (const word of words) {
    if (ingredientSet.has(word)) return true;
  }
  
  return false;
}

/**
 * Analyze a list of ingredients and return dietary classifications
 */
export interface DietaryAnalysis {
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isPescatarian: boolean;
  isEggFree: boolean;
  isNutFree: boolean;
  isSoyFree: boolean;
  isShellFishFree: boolean;
  isNightShadeFree: boolean;
  isLowFodmap: boolean;
  
  // Ingredient flags found
  containsGluten: boolean;
  containsDairy: boolean;
  containsMeat: boolean;
  containsSeafood: boolean;
  containsEggs: boolean;
  containsNuts: boolean;
  containsSoy: boolean;
  containsShellfish: boolean;
  containsNightshades: boolean;
  containsHighFodmap: boolean;
}

export function analyzeIngredients(ingredients: Array<{ name: string }>): DietaryAnalysis {
  let containsGluten = false;
  let containsDairy = false;
  let containsMeat = false;
  let containsSeafood = false;
  let containsEggs = false;
  let containsNuts = false;
  let containsSoy = false;
  let containsShellfish = false;
  let containsNightshades = false;
  let containsHighFodmap = false;

  for (const ing of ingredients) {
    const name = ing.name;
    
    if (containsAny(name, GLUTEN_INGREDIENTS)) containsGluten = true;
    if (containsAny(name, DAIRY_INGREDIENTS)) containsDairy = true;
    if (containsAny(name, MEAT_INGREDIENTS)) containsMeat = true;
    if (containsAny(name, FISH_SEAFOOD_INGREDIENTS)) containsSeafood = true;
    if (containsAny(name, EGG_INGREDIENTS)) containsEggs = true;
    if (containsAny(name, NUT_INGREDIENTS)) containsNuts = true;
    if (containsAny(name, SOY_INGREDIENTS)) containsSoy = true;
    if (containsAny(name, SHELLFISH_INGREDIENTS)) containsShellfish = true;
    if (containsAny(name, NIGHTSHADE_INGREDIENTS)) containsNightshades = true;
    if (containsAny(name, HIGH_FODMAP_INGREDIENTS)) containsHighFodmap = true;
  }

  return {
    // Dietary classifications
    isGlutenFree: !containsGluten,
    isDairyFree: !containsDairy,
    isVegetarian: !containsMeat && !containsSeafood,
    isVegan: !containsMeat && !containsSeafood && !containsDairy && !containsEggs,
    isPescatarian: !containsMeat && containsSeafood,
    isEggFree: !containsEggs,
    isNutFree: !containsNuts,
    isSoyFree: !containsSoy,
    isShellFishFree: !containsShellfish,
    isNightShadeFree: !containsNightshades,
    isLowFodmap: !containsHighFodmap,
    
    // Raw flags
    containsGluten,
    containsDairy,
    containsMeat,
    containsSeafood,
    containsEggs,
    containsNuts,
    containsSoy,
    containsShellfish,
    containsNightshades,
    containsHighFodmap,
  };
}

// =============================================
// NUTRITION-BASED ANALYSIS
// =============================================

export interface NutritionAnalysis {
  isLowSaturatedFat: boolean;     // < 3g per serving
  isLowSodium: boolean;           // < 600mg per serving
  isLowCarb: boolean;             // < 20g per serving
  isHighProtein: boolean;         // > 20g per serving
  isHighFiber: boolean;           // > 5g per serving
  isLowCalorie: boolean;          // < 300 calories per serving
  isLowSugar: boolean;            // < 6g per serving
  isHeartHealthy: boolean;        // Low sat fat, low sodium, high fiber
  isBloodSugarFriendly: boolean;  // Low carb, high fiber, low sugar
}

export function analyzeNutrition(nutrition: {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  saturatedFat?: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
} | null | undefined): NutritionAnalysis {
  if (!nutrition) {
    // Default to false when no nutrition data
    return {
      isLowSaturatedFat: false,
      isLowSodium: false,
      isLowCarb: false,
      isHighProtein: false,
      isHighFiber: false,
      isLowCalorie: false,
      isLowSugar: false,
      isHeartHealthy: false,
      isBloodSugarFriendly: false,
    };
  }

  const isLowSaturatedFat = (nutrition.saturatedFat ?? 0) < 3;
  const isLowSodium = (nutrition.sodium ?? 0) < 600;
  const isLowCarb = (nutrition.carbs ?? 100) < 20;
  const isHighProtein = (nutrition.protein ?? 0) >= 20;
  const isHighFiber = (nutrition.fiber ?? 0) >= 5;
  const isLowCalorie = (nutrition.calories ?? 500) < 300;
  const isLowSugar = (nutrition.sugar ?? 0) < 6;
  
  // Composite health scores
  const isHeartHealthy = isLowSaturatedFat && isLowSodium && isHighFiber;
  const isBloodSugarFriendly = isLowCarb && isHighFiber && isLowSugar;

  return {
    isLowSaturatedFat,
    isLowSodium,
    isLowCarb,
    isHighProtein,
    isHighFiber,
    isLowCalorie,
    isLowSugar,
    isHeartHealthy,
    isBloodSugarFriendly,
  };
}

// =============================================
// COMBINED ANALYSIS
// =============================================

export interface FullRecipeAnalysis extends DietaryAnalysis, NutritionAnalysis {
  dietaryTagSlugs: string[];
  healthTagSlugs: string[];
}

export function analyzeRecipe(
  ingredients: Array<{ name: string }>,
  nutrition: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    saturatedFat?: number;
    fiber?: number;
    sodium?: number;
    sugar?: number;
  } | null | undefined,
  recipeFlags?: {
    hasOmega3?: boolean;
    hasHighFiber?: boolean;
    isHeartHealthy?: boolean;
    isAntiInflammatory?: boolean;
    isKidFriendly?: boolean;
    hasSelenium?: boolean;
  }
): FullRecipeAnalysis {
  const dietary = analyzeIngredients(ingredients);
  const nutritionAnalysis = analyzeNutrition(nutrition);
  
  // Build dietary tag slugs
  const dietaryTagSlugs: string[] = [];
  if (dietary.isGlutenFree) dietaryTagSlugs.push("gluten-free");
  if (dietary.isDairyFree) dietaryTagSlugs.push("dairy-free");
  if (dietary.isVegetarian) dietaryTagSlugs.push("vegetarian");
  if (dietary.isVegan) dietaryTagSlugs.push("vegan");
  if (dietary.isPescatarian && dietary.containsSeafood) dietaryTagSlugs.push("pescatarian");
  if (dietary.isEggFree) dietaryTagSlugs.push("egg-free");
  if (dietary.isNutFree) dietaryTagSlugs.push("nut-free");
  if (dietary.isSoyFree) dietaryTagSlugs.push("soy-free");
  if (dietary.isShellFishFree) dietaryTagSlugs.push("shellfish-free");
  if (dietary.isNightShadeFree) dietaryTagSlugs.push("nightshade-free");
  if (dietary.isLowFodmap) dietaryTagSlugs.push("low-fodmap");
  
  // Build health tag slugs based on nutrition
  const healthTagSlugs: string[] = [];
  if (nutritionAnalysis.isLowSaturatedFat) healthTagSlugs.push("low-saturated-fat");
  if (nutritionAnalysis.isLowSodium) healthTagSlugs.push("low-sodium");
  if (nutritionAnalysis.isLowCarb) healthTagSlugs.push("low-carb");
  if (nutritionAnalysis.isHighProtein) healthTagSlugs.push("high-protein");
  if (nutritionAnalysis.isHighFiber || recipeFlags?.hasHighFiber) healthTagSlugs.push("high-fiber");
  if (nutritionAnalysis.isLowCalorie) healthTagSlugs.push("low-calorie");
  
  // Add recipe flag-based health tags
  if (recipeFlags?.hasOmega3) healthTagSlugs.push("omega-3-rich");
  if (recipeFlags?.isHeartHealthy || nutritionAnalysis.isHeartHealthy) healthTagSlugs.push("heart-healthy");
  if (recipeFlags?.isAntiInflammatory) healthTagSlugs.push("anti-inflammatory");
  if (recipeFlags?.isKidFriendly) healthTagSlugs.push("kid-friendly");
  if (recipeFlags?.hasSelenium) healthTagSlugs.push("selenium-rich");
  if (nutritionAnalysis.isBloodSugarFriendly) healthTagSlugs.push("blood-sugar-balance");
  
  return {
    ...dietary,
    ...nutritionAnalysis,
    dietaryTagSlugs: [...new Set(dietaryTagSlugs)], // Remove duplicates
    healthTagSlugs: [...new Set(healthTagSlugs)],   // Remove duplicates
  };
}

