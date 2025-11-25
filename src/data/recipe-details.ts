// ThriveMenu Recipe Details
// Full ingredients and instructions for recipes

export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
  preparation?: string;
}

export interface RecipeDetails {
  ingredients: Ingredient[];
  instructions: string[];
  tips?: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
}

// Recipe details keyed by recipe ID (slug)
export const recipeDetails: Record<string, RecipeDetails> = {
  // =============================================
  // BREAKFAST RECIPES
  // =============================================
  
  "golden-turmeric-oatmeal": {
    prepTime: 5,
    cookTime: 20,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "cup", name: "steel-cut oats" },
      { amount: "2", unit: "cups", name: "almond milk", preparation: "unsweetened" },
      { amount: "1", unit: "cup", name: "water" },
      { amount: "1", unit: "tsp", name: "turmeric", preparation: "ground" },
      { amount: "½", unit: "tsp", name: "cinnamon", preparation: "ground" },
      { amount: "⅛", unit: "tsp", name: "black pepper", preparation: "helps absorb turmeric" },
      { amount: "¼", unit: "cup", name: "walnuts", preparation: "chopped" },
      { amount: "½", unit: "cup", name: "mixed berries", preparation: "fresh or frozen" },
      { amount: "1", unit: "tbsp", name: "maple syrup", preparation: "optional" },
      { amount: "1", unit: "pinch", name: "salt" },
    ],
    instructions: [
      "In a medium saucepan, combine almond milk and water. Bring to a gentle boil over medium heat.",
      "Stir in the steel-cut oats, turmeric, cinnamon, black pepper, and salt.",
      "Reduce heat to low and simmer for 20-25 minutes, stirring occasionally, until oats are tender and creamy.",
      "If oatmeal becomes too thick, add a splash more almond milk to reach desired consistency.",
      "Remove from heat and let stand for 2 minutes to thicken slightly.",
      "Divide between two bowls and top with chopped walnuts and fresh berries.",
      "Drizzle with maple syrup if desired and serve warm.",
    ],
    tips: [
      "The black pepper helps your body absorb curcumin from the turmeric - don't skip it!",
      "For meal prep, make a batch and refrigerate. Reheat with a splash of milk.",
      "Take thyroid medication 30-60 minutes before eating for best absorption.",
    ],
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 45,
      fat: 12,
      fiber: 8,
      sodium: 95,
    },
  },

  "overnight-berry-oats": {
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "cup", name: "old-fashioned oats" },
      { amount: "1", unit: "cup", name: "almond milk", preparation: "unsweetened" },
      { amount: "½", unit: "cup", name: "Greek yogurt", preparation: "plain" },
      { amount: "2", unit: "tbsp", name: "chia seeds" },
      { amount: "1", unit: "tsp", name: "vanilla extract" },
      { amount: "1", unit: "tbsp", name: "honey or maple syrup" },
      { amount: "1", unit: "cup", name: "mixed berries", preparation: "divided" },
      { amount: "2", unit: "tbsp", name: "sliced almonds" },
    ],
    instructions: [
      "In a jar or container, combine oats, almond milk, Greek yogurt, chia seeds, vanilla, and sweetener.",
      "Stir well to combine, making sure there are no dry oats at the bottom.",
      "Gently fold in half of the berries.",
      "Cover and refrigerate overnight (at least 6 hours).",
      "In the morning, stir and add a splash of milk if too thick.",
      "Top with remaining berries and sliced almonds before serving.",
    ],
    tips: [
      "Make several jars on Sunday for grab-and-go breakfasts all week.",
      "The chia seeds add omega-3s and help thicken the oats naturally.",
      "Can be eaten cold or warmed in the microwave.",
    ],
    nutrition: {
      calories: 295,
      protein: 12,
      carbs: 42,
      fat: 9,
      fiber: 10,
      sodium: 75,
    },
  },

  "mediterranean-veggie-scramble": {
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { amount: "4", unit: "large", name: "eggs" },
      { amount: "2", unit: "tbsp", name: "milk", preparation: "any kind" },
      { amount: "1", unit: "tbsp", name: "olive oil" },
      { amount: "2", unit: "cups", name: "spinach", preparation: "fresh, packed" },
      { amount: "¼", unit: "cup", name: "sun-dried tomatoes", preparation: "chopped" },
      { amount: "2", unit: "tbsp", name: "Kalamata olives", preparation: "sliced" },
      { amount: "2", unit: "tbsp", name: "feta cheese", preparation: "crumbled" },
      { amount: "1", unit: "tsp", name: "dried oregano" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
      { amount: "2", unit: "slices", name: "whole grain toast", preparation: "for serving" },
    ],
    instructions: [
      "Whisk eggs and milk together in a bowl with a pinch of salt and pepper.",
      "Heat olive oil in a non-stick skillet over medium heat.",
      "Add spinach and cook for 1-2 minutes until wilted.",
      "Add sun-dried tomatoes and olives, stir to combine.",
      "Pour in egg mixture and let sit for 20 seconds without stirring.",
      "Using a spatula, gently push eggs from edges toward center, letting uncooked egg flow to edges.",
      "Continue until eggs are mostly set but still slightly glossy.",
      "Remove from heat, sprinkle with feta and oregano.",
      "Serve immediately with whole grain toast.",
    ],
    tips: [
      "Eggs are an excellent source of selenium, important for thyroid function.",
      "Don't overcook the eggs - they should be soft and creamy.",
      "Add a handful of fresh basil for extra Mediterranean flavor.",
    ],
    nutrition: {
      calories: 285,
      protein: 18,
      carbs: 12,
      fat: 19,
      fiber: 3,
      sodium: 420,
    },
  },

  "shakshuka-eggs-in-tomato-sauce": {
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "1", unit: "medium", name: "onion", preparation: "diced" },
      { amount: "1", unit: "large", name: "red bell pepper", preparation: "diced" },
      { amount: "3", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "1", unit: "28-oz can", name: "crushed tomatoes" },
      { amount: "1", unit: "tsp", name: "cumin", preparation: "ground" },
      { amount: "1", unit: "tsp", name: "paprika" },
      { amount: "½", unit: "tsp", name: "cayenne", preparation: "optional, to taste" },
      { amount: "6", unit: "large", name: "eggs" },
      { amount: "¼", unit: "cup", name: "fresh parsley", preparation: "chopped" },
      { amount: "¼", unit: "cup", name: "feta cheese", preparation: "crumbled, optional" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
      { amount: "", unit: "", name: "whole grain pita or bread", preparation: "for serving" },
    ],
    instructions: [
      "Heat olive oil in a large, deep skillet over medium heat.",
      "Add onion and bell pepper, cook for 5-7 minutes until softened.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Stir in crushed tomatoes, cumin, paprika, cayenne, salt, and pepper.",
      "Simmer for 10 minutes, stirring occasionally, until sauce thickens slightly.",
      "Make 6 wells in the sauce and crack an egg into each well.",
      "Cover and cook for 5-8 minutes until egg whites are set but yolks are still runny.",
      "Remove from heat, sprinkle with parsley and feta if using.",
      "Serve directly from the skillet with warm bread for dipping.",
    ],
    tips: [
      "This one-pan dish is perfect for family breakfasts.",
      "The lycopene in cooked tomatoes supports heart health.",
      "Adjust spice level based on kids' preferences.",
    ],
    nutrition: {
      calories: 245,
      protein: 14,
      carbs: 18,
      fat: 14,
      fiber: 4,
      sodium: 380,
    },
  },

  "green-goddess-smoothie": {
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "cup", name: "spinach", preparation: "fresh, packed" },
      { amount: "1", unit: "medium", name: "banana", preparation: "frozen for thickness" },
      { amount: "2", unit: "tbsp", name: "almond butter" },
      { amount: "1", unit: "cup", name: "almond milk", preparation: "unsweetened" },
      { amount: "½", unit: "tsp", name: "cinnamon" },
      { amount: "1", unit: "tbsp", name: "ground flaxseed", preparation: "optional" },
      { amount: "1", unit: "tsp", name: "honey", preparation: "optional" },
      { amount: "4-5", unit: "", name: "ice cubes", preparation: "if banana isn't frozen" },
    ],
    instructions: [
      "Add almond milk to blender first (helps blades spin smoothly).",
      "Add spinach and blend for 15-20 seconds until smooth.",
      "Add frozen banana, almond butter, cinnamon, and flaxseed.",
      "Blend on high for 45-60 seconds until completely smooth and creamy.",
      "Taste and add honey if you prefer it sweeter.",
      "Pour into a glass and enjoy immediately.",
    ],
    tips: [
      "Freeze ripe bananas for smoothies - they make it creamy without ice cream!",
      "The spinach adds iron without any 'green' taste.",
      "Great for busy mornings when you need quick energy.",
    ],
    nutrition: {
      calories: 310,
      protein: 9,
      carbs: 38,
      fat: 16,
      fiber: 6,
      sodium: 180,
    },
  },

  "greek-yogurt-parfait": {
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "cup", name: "Greek yogurt", preparation: "plain, non-fat or 2%" },
      { amount: "¼", unit: "cup", name: "granola", preparation: "low-sugar variety" },
      { amount: "½", unit: "cup", name: "mixed berries", preparation: "fresh or frozen/thawed" },
      { amount: "1", unit: "tbsp", name: "honey or maple syrup" },
      { amount: "1", unit: "tbsp", name: "chia seeds" },
      { amount: "1", unit: "tbsp", name: "sliced almonds" },
    ],
    instructions: [
      "In a glass or jar, add half of the Greek yogurt.",
      "Layer with half the berries and half the granola.",
      "Add remaining yogurt, then remaining berries and granola.",
      "Sprinkle with chia seeds and sliced almonds.",
      "Drizzle honey over the top.",
      "Serve immediately or cover and refrigerate for up to 24 hours.",
    ],
    tips: [
      "Greek yogurt has twice the protein of regular yogurt.",
      "The probiotics support gut health and immune function.",
      "Kids love building their own parfaits!",
    ],
    nutrition: {
      calories: 340,
      protein: 22,
      carbs: 42,
      fat: 10,
      fiber: 6,
      sodium: 85,
    },
  },

  // =============================================
  // LUNCH RECIPES
  // =============================================

  "classic-greek-salad": {
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { amount: "6", unit: "cups", name: "romaine lettuce", preparation: "chopped" },
      { amount: "1", unit: "large", name: "cucumber", preparation: "diced" },
      { amount: "2", unit: "medium", name: "tomatoes", preparation: "cut into wedges" },
      { amount: "½", unit: "medium", name: "red onion", preparation: "thinly sliced" },
      { amount: "½", unit: "cup", name: "Kalamata olives" },
      { amount: "½", unit: "cup", name: "feta cheese", preparation: "cubed or crumbled" },
      { amount: "2", unit: "tbsp", name: "olive oil", preparation: "extra virgin" },
      { amount: "1", unit: "tbsp", name: "red wine vinegar" },
      { amount: "1", unit: "tbsp", name: "lemon juice" },
      { amount: "1", unit: "tsp", name: "dried oregano" },
      { amount: "1", unit: "clove", name: "garlic", preparation: "minced" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
    ],
    instructions: [
      "In a large bowl, combine romaine, cucumber, tomatoes, red onion, and olives.",
      "In a small jar, combine olive oil, vinegar, lemon juice, oregano, garlic, salt, and pepper. Shake well.",
      "Pour dressing over salad and toss gently to coat.",
      "Top with feta cheese.",
      "Serve immediately as a side or add grilled chicken for a complete meal.",
    ],
    tips: [
      "Use high-quality extra virgin olive oil for the best heart-healthy benefits.",
      "The olives provide healthy fats that support brain function.",
      "Traditional Greek salad doesn't have lettuce - feel free to skip it!",
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 14,
      fat: 23,
      fiber: 4,
      sodium: 680,
    },
  },

  "salmon-nicoise-salad": {
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: "Medium",
    ingredients: [
      { amount: "2", unit: "6-oz", name: "salmon fillets" },
      { amount: "6", unit: "cups", name: "mixed greens" },
      { amount: "4", unit: "oz", name: "green beans", preparation: "trimmed, blanched" },
      { amount: "2", unit: "large", name: "eggs", preparation: "hard-boiled, quartered" },
      { amount: "8", unit: "", name: "cherry tomatoes", preparation: "halved" },
      { amount: "¼", unit: "cup", name: "Niçoise or Kalamata olives" },
      { amount: "4", unit: "small", name: "red potatoes", preparation: "cooked, quartered (optional)" },
      { amount: "2", unit: "tbsp", name: "olive oil", preparation: "for salmon" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
    ],
    instructions: [
      "Season salmon with salt and pepper. Heat oil in a skillet over medium-high heat.",
      "Cook salmon 4-5 minutes per side until cooked through. Let rest, then flake into large pieces.",
      "Blanch green beans in boiling water for 2-3 minutes, then plunge into ice water to stop cooking.",
      "Arrange mixed greens on two plates.",
      "Artfully arrange salmon, green beans, eggs, tomatoes, olives, and potatoes (if using) on top.",
      "Drizzle with Dijon vinaigrette (recipe below) and serve.",
    ],
    tips: [
      "This salad is an omega-3 powerhouse! Salmon supports heart and brain health.",
      "Make extra hard-boiled eggs for easy snacks throughout the week.",
      "Wild-caught salmon has higher omega-3 content than farmed.",
    ],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 18,
      fat: 28,
      fiber: 5,
      sodium: 520,
    },
  },

  "tuscan-white-bean-kale-soup": {
    prepTime: 15,
    cookTime: 25,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "1", unit: "medium", name: "onion", preparation: "diced" },
      { amount: "3", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "2", unit: "medium", name: "carrots", preparation: "diced" },
      { amount: "2", unit: "stalks", name: "celery", preparation: "diced" },
      { amount: "4", unit: "cups", name: "low-sodium chicken or vegetable broth" },
      { amount: "2", unit: "15-oz cans", name: "cannellini beans", preparation: "drained and rinsed" },
      { amount: "1", unit: "14-oz can", name: "diced tomatoes" },
      { amount: "4", unit: "cups", name: "kale", preparation: "chopped, stems removed" },
      { amount: "1", unit: "tsp", name: "Italian seasoning" },
      { amount: "½", unit: "tsp", name: "red pepper flakes", preparation: "optional" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
      { amount: "2", unit: "tbsp", name: "Parmesan cheese", preparation: "grated, for serving" },
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat.",
      "Add onion, carrots, and celery. Cook for 5-7 minutes until softened.",
      "Add garlic and cook 30 seconds until fragrant.",
      "Add broth, one can of beans (drained), tomatoes, Italian seasoning, and red pepper flakes.",
      "Mash the second can of beans with a fork and add to pot (this thickens the soup).",
      "Bring to a boil, then reduce heat and simmer 15 minutes.",
      "Add kale and cook another 5 minutes until wilted and tender.",
      "Season with salt and pepper to taste.",
      "Ladle into bowls and top with Parmesan cheese.",
    ],
    tips: [
      "White beans are cholesterol-lowering superstars thanks to their soluble fiber.",
      "This soup freezes beautifully - make a double batch!",
      "Kale adds iron and vitamin K for bone health.",
    ],
    nutrition: {
      calories: 220,
      protein: 11,
      carbs: 32,
      fat: 6,
      fiber: 9,
      sodium: 380,
    },
  },

  "chicken-shawarma-wrap": {
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      { amount: "1.5", unit: "lbs", name: "chicken breast or thighs", preparation: "sliced thin" },
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "2", unit: "tsp", name: "cumin", preparation: "ground" },
      { amount: "2", unit: "tsp", name: "paprika" },
      { amount: "1", unit: "tsp", name: "turmeric" },
      { amount: "1", unit: "tsp", name: "coriander", preparation: "ground" },
      { amount: "½", unit: "tsp", name: "cinnamon" },
      { amount: "4", unit: "large", name: "whole wheat wraps or pitas" },
      { amount: "1", unit: "cup", name: "shredded lettuce" },
      { amount: "1", unit: "medium", name: "tomato", preparation: "diced" },
      { amount: "½", unit: "cup", name: "pickled turnips or cucumber" },
      { amount: "¼", unit: "cup", name: "tahini sauce" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
    ],
    instructions: [
      "Mix cumin, paprika, turmeric, coriander, cinnamon, salt, and pepper in a bowl.",
      "Toss sliced chicken with olive oil and spice mixture. Marinate 15 minutes (or overnight).",
      "Heat a large skillet or grill pan over high heat.",
      "Cook chicken 3-4 minutes per side until cooked through with nice char marks.",
      "Let rest 3 minutes, then slice.",
      "Warm wraps in a dry pan or microwave.",
      "Layer lettuce, chicken, tomatoes, and pickled vegetables on each wrap.",
      "Drizzle with tahini sauce and roll up tightly.",
      "Slice in half diagonally and serve.",
    ],
    tips: [
      "The anti-inflammatory spices make this wrap extra healthy.",
      "Make extra chicken for salads and bowls throughout the week.",
      "Tahini adds calcium and healthy fats.",
    ],
    nutrition: {
      calories: 425,
      protein: 38,
      carbs: 32,
      fat: 16,
      fiber: 5,
      sodium: 580,
    },
  },

  "buddha-bowl": {
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    difficulty: "Medium",
    ingredients: [
      { amount: "1", unit: "cup", name: "quinoa", preparation: "cooked" },
      { amount: "1", unit: "15-oz can", name: "chickpeas", preparation: "drained, rinsed" },
      { amount: "1", unit: "medium", name: "sweet potato", preparation: "cubed" },
      { amount: "1", unit: "", name: "avocado", preparation: "sliced" },
      { amount: "2", unit: "cups", name: "mixed greens" },
      { amount: "1", unit: "cup", name: "shredded red cabbage" },
      { amount: "1", unit: "medium", name: "carrot", preparation: "julienned or grated" },
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "1", unit: "tsp", name: "cumin" },
      { amount: "1", unit: "tsp", name: "paprika" },
      { amount: "¼", unit: "cup", name: "tahini" },
      { amount: "2", unit: "tbsp", name: "lemon juice" },
      { amount: "2", unit: "tbsp", name: "water" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "Toss sweet potato cubes with 1 tbsp olive oil, salt, and pepper. Roast 20-25 minutes until tender.",
      "Toss chickpeas with remaining olive oil, cumin, paprika, salt. Roast alongside sweet potatoes for 20 minutes until crispy.",
      "Make tahini dressing: whisk tahini, lemon juice, water, and pinch of salt until smooth.",
      "Cook quinoa according to package directions.",
      "Divide greens between two bowls. Arrange quinoa, roasted sweet potato, crispy chickpeas, avocado, cabbage, and carrot in sections.",
      "Drizzle generously with tahini dressing.",
      "Season with additional salt and pepper if needed.",
    ],
    tips: [
      "This bowl has complete protein from quinoa and chickpeas combined.",
      "Prep components ahead for quick weekday lunches.",
      "The fiber content helps keep blood sugar stable.",
    ],
    nutrition: {
      calories: 520,
      protein: 18,
      carbs: 62,
      fat: 24,
      fiber: 16,
      sodium: 340,
    },
  },

  // =============================================
  // DINNER RECIPES
  // =============================================

  "lemon-herb-baked-salmon": {
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { amount: "4", unit: "6-oz", name: "salmon fillets", preparation: "skin-on or skinless" },
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "1", unit: "large", name: "lemon", preparation: "zested and juiced" },
      { amount: "3", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "2", unit: "tbsp", name: "fresh dill", preparation: "chopped" },
      { amount: "1", unit: "tbsp", name: "fresh parsley", preparation: "chopped" },
      { amount: "1", unit: "tsp", name: "Dijon mustard" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
      { amount: "", unit: "", name: "lemon slices", preparation: "for garnish" },
    ],
    instructions: [
      "Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.",
      "In a small bowl, whisk together olive oil, lemon juice, lemon zest, garlic, dill, parsley, and Dijon mustard.",
      "Place salmon fillets on prepared baking sheet. Season with salt and pepper.",
      "Spoon herb mixture evenly over each fillet.",
      "Top with lemon slices if desired.",
      "Bake for 12-15 minutes until salmon flakes easily with a fork.",
      "Let rest 2 minutes before serving.",
      "Serve with roasted vegetables or a fresh salad.",
    ],
    tips: [
      "Wild-caught salmon has the highest omega-3 content for heart and thyroid health.",
      "Don't overcook! Salmon should be slightly pink in the center.",
      "The selenium in salmon supports thyroid function.",
    ],
    nutrition: {
      calories: 340,
      protein: 36,
      carbs: 3,
      fat: 20,
      fiber: 0,
      sodium: 320,
    },
  },

  "turkey-taco-lettuce-wraps": {
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "lb", name: "ground turkey", preparation: "93% lean" },
      { amount: "1", unit: "tbsp", name: "olive oil" },
      { amount: "½", unit: "medium", name: "onion", preparation: "diced" },
      { amount: "2", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "2", unit: "tbsp", name: "taco seasoning", preparation: "low-sodium" },
      { amount: "½", unit: "cup", name: "salsa" },
      { amount: "1", unit: "head", name: "butter lettuce", preparation: "leaves separated" },
      { amount: "1", unit: "", name: "avocado", preparation: "diced" },
      { amount: "½", unit: "cup", name: "cherry tomatoes", preparation: "halved" },
      { amount: "¼", unit: "cup", name: "Greek yogurt", preparation: "as sour cream substitute" },
      { amount: "¼", unit: "cup", name: "cheese", preparation: "shredded, optional" },
      { amount: "2", unit: "tbsp", name: "fresh cilantro", preparation: "chopped" },
      { amount: "", unit: "", name: "lime wedges", preparation: "for serving" },
    ],
    instructions: [
      "Heat olive oil in a large skillet over medium-high heat.",
      "Add onion and cook 3-4 minutes until softened.",
      "Add garlic and cook 30 seconds.",
      "Add ground turkey, breaking it up with a spatula. Cook 5-7 minutes until no longer pink.",
      "Stir in taco seasoning and salsa. Simmer 3-4 minutes until flavors meld.",
      "Meanwhile, wash and dry lettuce leaves.",
      "Spoon turkey mixture into lettuce cups.",
      "Top with avocado, tomatoes, a dollop of Greek yogurt, cheese (if using), and cilantro.",
      "Squeeze lime over the top and serve.",
    ],
    tips: [
      "Kids love building their own lettuce wraps - set up a taco bar!",
      "Turkey is leaner than beef and the lettuce wraps cut carbs.",
      "Great for family dinner - everyone can customize their toppings.",
    ],
    nutrition: {
      calories: 295,
      protein: 28,
      carbs: 12,
      fat: 16,
      fiber: 4,
      sodium: 420,
    },
  },

  "chickpea-curry": {
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { amount: "2", unit: "tbsp", name: "coconut oil" },
      { amount: "1", unit: "medium", name: "onion", preparation: "diced" },
      { amount: "3", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "1", unit: "inch", name: "ginger", preparation: "grated" },
      { amount: "2", unit: "tbsp", name: "curry powder" },
      { amount: "1", unit: "tsp", name: "turmeric" },
      { amount: "1", unit: "tsp", name: "cumin" },
      { amount: "½", unit: "tsp", name: "cayenne", preparation: "optional" },
      { amount: "2", unit: "15-oz cans", name: "chickpeas", preparation: "drained and rinsed" },
      { amount: "1", unit: "14-oz can", name: "coconut milk" },
      { amount: "1", unit: "14-oz can", name: "diced tomatoes" },
      { amount: "4", unit: "cups", name: "spinach", preparation: "fresh" },
      { amount: "", unit: "", name: "salt", preparation: "to taste" },
      { amount: "", unit: "", name: "brown rice or naan", preparation: "for serving" },
      { amount: "¼", unit: "cup", name: "fresh cilantro", preparation: "for garnish" },
    ],
    instructions: [
      "Heat coconut oil in a large pot over medium heat.",
      "Add onion and cook 5 minutes until softened.",
      "Add garlic and ginger, cook 1 minute until fragrant.",
      "Stir in curry powder, turmeric, cumin, and cayenne. Toast spices for 30 seconds.",
      "Add chickpeas, coconut milk, and tomatoes. Stir to combine.",
      "Bring to a simmer and cook 15-20 minutes, stirring occasionally.",
      "Add spinach and stir until wilted, about 2 minutes.",
      "Season with salt to taste.",
      "Serve over brown rice or with warm naan bread.",
      "Garnish with fresh cilantro.",
    ],
    tips: [
      "The turmeric and ginger are powerfully anti-inflammatory.",
      "Chickpeas provide plant-based protein and fiber for blood sugar control.",
      "This freezes well for meal prep.",
    ],
    nutrition: {
      calories: 385,
      protein: 14,
      carbs: 42,
      fat: 20,
      fiber: 12,
      sodium: 340,
    },
  },

  "lentil-bolognese": {
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      { amount: "2", unit: "tbsp", name: "olive oil" },
      { amount: "1", unit: "medium", name: "onion", preparation: "finely diced" },
      { amount: "2", unit: "medium", name: "carrots", preparation: "finely diced" },
      { amount: "2", unit: "stalks", name: "celery", preparation: "finely diced" },
      { amount: "4", unit: "cloves", name: "garlic", preparation: "minced" },
      { amount: "1", unit: "cup", name: "red lentils", preparation: "rinsed" },
      { amount: "1", unit: "28-oz can", name: "crushed tomatoes" },
      { amount: "2", unit: "cups", name: "vegetable broth" },
      { amount: "2", unit: "tbsp", name: "tomato paste" },
      { amount: "1", unit: "tsp", name: "Italian seasoning" },
      { amount: "½", unit: "tsp", name: "red pepper flakes", preparation: "optional" },
      { amount: "12", unit: "oz", name: "whole wheat spaghetti" },
      { amount: "", unit: "", name: "salt and pepper", preparation: "to taste" },
      { amount: "¼", unit: "cup", name: "fresh basil", preparation: "chopped" },
      { amount: "", unit: "", name: "Parmesan cheese", preparation: "for serving" },
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat.",
      "Add onion, carrots, and celery (this is called soffritto). Cook 8-10 minutes until soft.",
      "Add garlic and cook 1 minute.",
      "Add lentils, crushed tomatoes, broth, tomato paste, Italian seasoning, and red pepper flakes.",
      "Bring to a boil, then reduce heat and simmer 25-30 minutes until lentils are tender.",
      "Meanwhile, cook pasta according to package directions. Reserve ½ cup pasta water before draining.",
      "Season sauce with salt and pepper. Add pasta water if sauce is too thick.",
      "Toss pasta with sauce or serve sauce over pasta.",
      "Top with fresh basil and Parmesan cheese.",
    ],
    tips: [
      "Red lentils break down and create a meaty texture - kids often can't tell it's meatless!",
      "Lentils are one of the best foods for lowering cholesterol.",
      "Make a double batch and freeze half for busy nights.",
    ],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 68,
      fat: 6,
      fiber: 14,
      sodium: 320,
    },
  },

  "baked-chicken-fingers": {
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { amount: "1.5", unit: "lbs", name: "chicken breast", preparation: "cut into strips" },
      { amount: "1", unit: "cup", name: "whole wheat breadcrumbs" },
      { amount: "¼", unit: "cup", name: "Parmesan cheese", preparation: "grated" },
      { amount: "1", unit: "tsp", name: "garlic powder" },
      { amount: "1", unit: "tsp", name: "paprika" },
      { amount: "½", unit: "tsp", name: "salt" },
      { amount: "¼", unit: "tsp", name: "black pepper" },
      { amount: "2", unit: "large", name: "eggs" },
      { amount: "2", unit: "tbsp", name: "Dijon mustard" },
      { amount: "", unit: "", name: "cooking spray" },
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Line a baking sheet with parchment and spray with cooking spray.",
      "In a shallow dish, combine breadcrumbs, Parmesan, garlic powder, paprika, salt, and pepper.",
      "In another dish, whisk together eggs and Dijon mustard.",
      "Dip each chicken strip in egg mixture, then coat in breadcrumb mixture, pressing to adhere.",
      "Place on prepared baking sheet, leaving space between pieces.",
      "Spray tops of chicken strips lightly with cooking spray.",
      "Bake 18-20 minutes, flipping halfway through, until golden and cooked through (165°F internal temp).",
      "Serve with honey mustard dipping sauce.",
    ],
    tips: [
      "Kids love these! Much healthier than fried chicken fingers.",
      "Baking instead of frying cuts the fat significantly.",
      "Great for meal prep - freeze before baking and cook from frozen (add 5 minutes).",
    ],
    nutrition: {
      calories: 290,
      protein: 38,
      carbs: 15,
      fat: 8,
      fiber: 2,
      sodium: 520,
    },
  },

  // =============================================
  // SNACK RECIPES
  // =============================================

  "apple-slices-almond-butter": {
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "medium", name: "apple", preparation: "sliced" },
      { amount: "2", unit: "tbsp", name: "almond butter" },
      { amount: "1", unit: "tsp", name: "honey", preparation: "optional" },
      { amount: "1", unit: "pinch", name: "cinnamon", preparation: "optional" },
    ],
    instructions: [
      "Wash and slice apple into wedges, removing core.",
      "Place almond butter in a small bowl.",
      "Drizzle honey over almond butter and sprinkle with cinnamon if desired.",
      "Dip apple slices in almond butter and enjoy!",
    ],
    tips: [
      "The protein and fat in almond butter helps stabilize blood sugar.",
      "Keeps you full longer than fruit alone.",
      "Great afternoon snack for the whole family.",
    ],
    nutrition: {
      calories: 280,
      protein: 7,
      carbs: 32,
      fat: 16,
      fiber: 6,
      sodium: 5,
    },
  },

  "hummus-vegetable-sticks": {
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      { amount: "½", unit: "cup", name: "hummus" },
      { amount: "1", unit: "large", name: "carrot", preparation: "cut into sticks" },
      { amount: "1", unit: "medium", name: "cucumber", preparation: "cut into sticks" },
      { amount: "1", unit: "", name: "bell pepper", preparation: "sliced" },
      { amount: "1", unit: "cup", name: "cherry tomatoes" },
      { amount: "1", unit: "tbsp", name: "olive oil", preparation: "optional drizzle" },
      { amount: "1", unit: "tsp", name: "paprika", preparation: "optional garnish" },
    ],
    instructions: [
      "Scoop hummus into a bowl or divide between two small containers.",
      "Drizzle with olive oil and sprinkle with paprika if desired.",
      "Arrange vegetable sticks and tomatoes around hummus for dipping.",
      "Store prepped vegetables in cold water in the fridge for up to 5 days.",
    ],
    tips: [
      "Chickpeas in hummus are great for cholesterol and blood sugar.",
      "Prep veggies on Sunday for quick healthy snacks all week.",
      "Kids love the crunchy, dippable format!",
    ],
    nutrition: {
      calories: 180,
      protein: 6,
      carbs: 22,
      fat: 8,
      fiber: 6,
      sodium: 280,
    },
  },

  "mixed-nuts-brazil": {
    prepTime: 1,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "8", unit: "", name: "almonds" },
      { amount: "4", unit: "", name: "walnut halves" },
      { amount: "2", unit: "", name: "Brazil nuts", preparation: "max - high in selenium!" },
      { amount: "4", unit: "", name: "cashews", preparation: "optional" },
    ],
    instructions: [
      "Combine nuts in a small bowl or portion into snack bags.",
      "Enjoy as an afternoon pick-me-up.",
      "Store in an airtight container for up to 2 weeks.",
    ],
    tips: [
      "Just 1-2 Brazil nuts provide your entire daily selenium needs for thyroid health.",
      "Don't exceed 2 Brazil nuts daily - too much selenium can be harmful.",
      "The healthy fats in nuts support heart health and keep you satisfied.",
    ],
    nutrition: {
      calories: 200,
      protein: 5,
      carbs: 6,
      fat: 18,
      fiber: 2,
      sodium: 0,
    },
  },

  "dark-chocolate-almonds": {
    prepTime: 1,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "oz", name: "dark chocolate", preparation: "70% cacao or higher" },
      { amount: "10", unit: "", name: "raw almonds" },
    ],
    instructions: [
      "Break chocolate into small pieces or squares.",
      "Enjoy alternating bites of chocolate and almonds.",
      "Savor slowly - this is meant to be enjoyed mindfully!",
    ],
    tips: [
      "Dark chocolate is rich in antioxidants and may help lower blood pressure.",
      "The higher the cacao percentage, the more health benefits.",
      "This satisfies sweet cravings without the blood sugar spike.",
    ],
    nutrition: {
      calories: 220,
      protein: 4,
      carbs: 16,
      fat: 16,
      fiber: 3,
      sodium: 5,
    },
  },

  "golden-milk": {
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      { amount: "1", unit: "cup", name: "almond milk", preparation: "unsweetened" },
      { amount: "1", unit: "tsp", name: "turmeric", preparation: "ground" },
      { amount: "½", unit: "tsp", name: "cinnamon" },
      { amount: "¼", unit: "tsp", name: "ginger", preparation: "ground or ½ tsp fresh grated" },
      { amount: "1", unit: "pinch", name: "black pepper", preparation: "helps absorption" },
      { amount: "1", unit: "tsp", name: "honey or maple syrup" },
      { amount: "½", unit: "tsp", name: "coconut oil", preparation: "optional" },
    ],
    instructions: [
      "Add almond milk to a small saucepan over medium heat.",
      "Whisk in turmeric, cinnamon, ginger, and black pepper.",
      "Heat until warm but not boiling, whisking occasionally (3-4 minutes).",
      "Remove from heat and stir in honey and coconut oil if using.",
      "Pour into a mug and enjoy warm.",
    ],
    tips: [
      "This is wonderfully anti-inflammatory - perfect for Graves' Disease.",
      "The black pepper increases turmeric absorption by 2000%!",
      "Great as an evening wind-down drink.",
    ],
    nutrition: {
      calories: 75,
      protein: 1,
      carbs: 10,
      fat: 4,
      fiber: 1,
      sodium: 180,
    },
  },
};

// Helper function to get recipe details by ID
export function getRecipeDetails(id: string): RecipeDetails | undefined {
  return recipeDetails[id];
}

// Get all recipe IDs that have full details
export function getRecipesWithDetails(): string[] {
  return Object.keys(recipeDetails);
}

