/**
 * Quick test script for Google Gemini 2.0 Flash Preview Image Generation
 * Tests the generateContent endpoint with image output
 */

import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBhzno0jb2UbP3P5fIxJ_eEAQynF2GNvrk";

async function testGeminiImageGen() {
  console.log("🧪 Testing Gemini 2.0 Flash Preview Image Generation...");
  console.log(`   API Key: ${GEMINI_API_KEY.substring(0, 10)}...`);
  
  const prompt = "Professional food photography of a delicious avocado toast with poached egg, beautifully plated on white ceramic plate, studio lighting, shallow depth of field, food magazine quality. No text or watermarks.";
  
  // Gemini 2.0 Flash Experimental Image Generation
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;
  
  console.log(`   Model: gemini-2.0-flash-exp-image-generation`);
  console.log(`   Prompt: "${prompt.substring(0, 50)}..."`);
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"]
    }
  };

  try {
    console.log("\n📡 Making API request...");
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ API Error:\n${errorText}`);
      return;
    }

    const data = await response.json();
    console.log("\n✅ API Response received!");
    console.log("   Response keys:", Object.keys(data));
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      console.log("   Candidate keys:", Object.keys(candidate));
      
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const imageSize = part.inlineData.data.length;
            console.log(`\n🎉 SUCCESS! Image generated!`);
            console.log(`   Image size: ${Math.round(imageSize / 1024)} KB (base64)`);
            console.log(`   MIME type: ${part.inlineData.mimeType}`);
            return;
          }
          if (part.text) {
            console.log(`   Text response: ${part.text.substring(0, 100)}...`);
          }
        }
      }
      console.log("\n⚠️ No image data in response parts");
    } else {
      console.log("\n⚠️ No candidates in response:", JSON.stringify(data, null, 2).substring(0, 500));
    }
    
  } catch (error) {
    console.error("\n❌ Request failed:", error);
  }
}

testGeminiImageGen();
