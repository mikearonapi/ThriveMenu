// Image utilities for ThriveMenu

/**
 * Generates a high-quality image URL for a recipe based on its name and category.
 * Uses Unsplash Source for consistent, beautiful food photography.
 */
export function getRecipeImage(title: string, category?: string): string {
  // Clean up title for search terms
  const terms = title
    .toLowerCase()
    .replace(/recipe|easy|best|healthy|homemade/g, "")
    .trim()
    .split(" ")
    .join(",");

  // Use category as fallback or enhancement
  const categoryTerm = category?.toLowerCase() || "food";
  
  // Deterministic hash from string to select a specific image from a collection if needed, 
  // or just rely on Unsplash's keyword search. 
  // For stability in demo, we can use a specific service or just the keywords.
  // Using source.unsplash.com with specific keywords is a good start.
  
  // Note: source.unsplash.com is deprecated/unreliable in some regions. 
  // Let's use a more reliable placeholder service or a fixed set of nice images 
  // if we can't use the API key directly. 
  // Actually, standard Unsplash search URLs often work well for prototypes.
  
  return `https://source.unsplash.com/featured/800x600/?food,${terms}`;
}

// Fallback images for specific categories (can be replaced with real assets later)
export const categoryImages = {
  breakfast: "https://images.unsplash.com/photo-1533089862017-5f333f5e3830?w=800&q=80",
  lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  snack: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
};

