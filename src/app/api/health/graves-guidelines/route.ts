/**
 * Graves Disease Dietary Guidelines API Route
 * 
 * GET /api/health/graves-guidelines
 * 
 * Returns dietary guidelines and tips for Graves Disease
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const guidelines = {
      title: "Graves Disease Dietary Guidelines",
      description: "Nutritional recommendations to support thyroid health",
      keyPrinciples: [
        {
          title: "Selenium-Rich Foods",
          description: "Essential for thyroid function and hormone conversion",
          foods: ["Brazil nuts", "Tuna", "Salmon", "Eggs", "Sunflower seeds"],
          tip: "Aim for 200-400 mcg of selenium daily",
        },
        {
          title: "Anti-Inflammatory Foods",
          description: "Reduce inflammation that can worsen symptoms",
          foods: ["Fatty fish", "Leafy greens", "Berries", "Turmeric", "Ginger"],
          tip: "Focus on omega-3 rich foods and colorful vegetables",
        },
        {
          title: "Calcium & Vitamin D",
          description: "Important for bone health, especially with hyperthyroidism",
          foods: ["Dairy products", "Fortified plant milks", "Leafy greens", "Salmon"],
          tip: "Consider supplements if dietary intake is insufficient",
        },
        {
          title: "Avoid Goitrogens (Raw)",
          description: "Cook cruciferous vegetables to reduce goitrogenic effects",
          foods: ["Broccoli", "Cabbage", "Cauliflower", "Kale", "Brussels sprouts"],
          tip: "Cooking significantly reduces goitrogenic compounds",
        },
        {
          title: "Limit Iodine",
          description: "Avoid excessive iodine which can worsen symptoms",
          foods: ["Seaweed", "Iodized salt", "Shellfish"],
          tip: "Use non-iodized salt and limit high-iodine foods",
        },
      ],
      mealPlanningTips: [
        "Plan meals rich in selenium and omega-3s",
        "Include anti-inflammatory spices like turmeric",
        "Ensure adequate calcium intake daily",
        "Cook all cruciferous vegetables",
        "Stay hydrated with water and herbal teas",
      ],
      recipeTags: [
        "selenium-rich",
        "anti-inflammatory",
        "omega-3-rich",
        "heart-healthy",
        "high-calcium",
      ],
    };

    return NextResponse.json(guidelines);
  } catch (error) {
    console.error("Error fetching Graves guidelines:", error);
    return NextResponse.json(
      { error: "Failed to fetch guidelines" },
      { status: 500 }
    );
  }
}

