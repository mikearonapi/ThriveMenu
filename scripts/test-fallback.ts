/**
 * Test Script for Image Generation Fallback Logic
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { generateAndStoreRecipeImage } from '../src/lib/images';

async function testFallback() {
  console.log("🧪 Testing Image Generation Fallback System...\n");
  
  try {
    // This should trigger Imagen 4.0 -> 429 Error -> Gemini 2.0 Flash
    const result = await generateAndStoreRecipeImage(
      "test-fallback-123",
      "Test Avocado Toast",
      "Breakfast",
      "Delicious avocado toast with poached egg",
      ["Avocado", "Bread", "Egg"]
    );
    
    console.log("\n✅ Test Complete!");
    console.log("   Result URL:", result);
    
  } catch (error) {
    console.error("\n❌ Test Failed:", error);
  }
}

testFallback();
