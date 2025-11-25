# Image Generation & Storage Strategy for ThriveMenu

## Overview
We use **Vercel Blob Storage** for storing generated recipe images, combined with **Next.js Image Optimization** for optimal performance.

## Architecture

### 1. Image Generation Flow
```
Recipe Created → Gemini API (or DALL-E) → Generate Image → Upload to Vercel Blob → Store URL in Database
```

### 2. Image Display Flow
```
Database (URL) → Next.js Image Component → Vercel CDN → Optimized WebP/AVIF → User's Browser
```

## Why Vercel Blob?

### ✅ Advantages:
1. **Edge CDN**: Images served from edge locations worldwide
2. **Automatic Optimization**: Works seamlessly with Next.js Image component
3. **Cost-Effective**: Pay only for storage and bandwidth used
4. **Fast Uploads**: Direct upload API, no intermediate storage needed
5. **Built-in Security**: Access control and signed URLs available
6. **No Infrastructure**: Fully managed, no servers to maintain

### 📊 Performance Benefits:
- **Automatic WebP/AVIF conversion** via Next.js Image
- **Lazy loading** built into Next.js Image
- **Responsive sizing** based on device
- **Edge caching** for instant loads
- **Bandwidth optimization** (smaller file sizes)

## Implementation

### Step 1: Install Dependencies
```bash
npm install @vercel/blob @google/generative-ai
```

### Step 2: Environment Variables
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Generate & Store Images
```typescript
import { put } from '@vercel/blob';

// After generating image via API
const blob = await put(`recipes/${recipeId}.jpg`, imageBuffer, {
  access: 'public',
  contentType: 'image/jpeg',
});

// Store blob.url in database
```

### Step 4: Display Images
```tsx
import Image from 'next/image';

<Image
  src={recipe.imageUrl} // Vercel Blob URL
  alt={recipe.name}
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>
```

## Alternative: External Image URLs

If using external image services (Unsplash, etc.), Next.js Image still optimizes them:
- Automatic format conversion (WebP/AVIF)
- Responsive sizing
- Lazy loading
- Edge caching

## Database Schema

Store only URLs, not binary data:
```prisma
model Recipe {
  imageUrl String? // Vercel Blob URL or external URL
}
```

## Cost Considerations

### Vercel Blob Pricing (as of 2024):
- **Storage**: $0.15/GB/month
- **Bandwidth**: $0.40/GB (first 100GB free)
- **Operations**: $0.0001 per 1,000 operations

### Estimated Costs for 240 Recipes:
- **Storage**: ~240 images × 500KB = 120MB = $0.018/month
- **Bandwidth**: Depends on traffic (first 100GB free)
- **Very affordable** for this scale

## Migration Path

1. **Phase 1** (Current): Use Unsplash Source URLs
2. **Phase 2**: Generate images via API, store in Vercel Blob
3. **Phase 3**: Batch generate all recipe images
4. **Phase 4**: Update database with Vercel Blob URLs

## Best Practices

1. **Always use Next.js Image component** - Never use `<img>` tags
2. **Set proper dimensions** - Helps with layout shift prevention
3. **Use lazy loading** - Default in Next.js Image
4. **Optimize quality** - Balance between size and quality (85% is good)
5. **Cache aggressively** - Set long TTLs for recipe images
6. **Monitor usage** - Track storage and bandwidth in Vercel dashboard

## Performance Metrics

Expected improvements with Vercel Blob + Next.js Image:
- **Load time**: 50-70% faster than unoptimized images
- **File size**: 30-50% smaller (WebP/AVIF vs JPEG)
- **Core Web Vitals**: Improved LCP scores
- **Bandwidth**: Reduced by 40-60%

