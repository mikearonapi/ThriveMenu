import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thrivemenu.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/plan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Try to fetch recipe pages dynamically
  let recipePages: MetadataRoute.Sitemap = []
  
  try {
    const response = await fetch(`${siteUrl}/api/recipes?limit=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (response.ok) {
      const data = await response.json()
      const recipes = data.recipes || []
      
      recipePages = recipes.map((recipe: { id: string; updatedAt?: string }) => ({
        url: `${siteUrl}/recipe/${recipe.id}`,
        lastModified: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching recipes for sitemap:', error)
  }

  return [...staticPages, ...recipePages]
}

