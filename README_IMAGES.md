# Image Generation Setup Guide

## Quick Start

### 1. Verify Vercel Blob is Connected

Run the test script to verify your Vercel Blob setup:

```bash
npm run test-blob
```

This will check if:
- ✅ `BLOB_READ_WRITE_TOKEN` is set in your `.env` file
- ✅ You can upload images to Vercel Blob
- ✅ Everything is configured correctly

### 2. Environment Variables Needed

Make sure your `.env` file has:

```env
# Vercel Blob Storage Token
# Get this from: Vercel Dashboard → Your Project → Storage → Blob → Settings
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx

# Google Gemini API Key (for future image generation)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Generate Images for All Recipes

Once verified, generate images for all recipes:

```bash
npm run generate-images
```

This will:
- Generate images for all 240+ recipes
- Upload each to Vercel Blob Storage
- Store the blob URLs (you'll need to update your database)

## Important Notes

### Gemini API Limitation
**Google Gemini doesn't have image generation API yet.** 

Current implementation:
- Uses Unsplash images as source
- Uploads them to Vercel Blob
- Stores blob URLs for optimal performance

### Future Options for True Image Generation:
1. **OpenAI DALL-E 3** - Best quality, costs ~$0.04/image
2. **Stable Diffusion** - Open source, self-hosted
3. **Midjourney API** - When available
4. **Gemini** - When image generation is added

### Current Workflow:
1. Fetch image from Unsplash (free, no API key needed)
2. Upload to Vercel Blob (fast CDN, optimized)
3. Store blob URL in database
4. Next.js Image component optimizes automatically

## Testing

Test a single image generation:

```bash
# Via API route
curl -X POST http://localhost:3001/api/images/generate \
  -H "Content-Type: application/json" \
  -d '{
    "recipeId": "test-recipe",
    "recipeName": "Lemon Herb Baked Salmon",
    "category": "Seafood"
  }'
```

## What You Need to Share

If you want me to help troubleshoot, please share:

1. ✅ **BLOB_READ_WRITE_TOKEN** - Only if you want me to test (or just run `npm run test-blob` yourself)
2. ✅ Results of `npm run test-blob` command
3. ✅ Any error messages you see

**Security Note:** Never commit your `.env` file or share tokens publicly!

