import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // صفحات أساسية فقط أثناء البناء
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // إضافة صفحات الألعاب في الإنتاج
  if (process.env.NODE_ENV === 'production') {
    try {
      const { searchGames } = await import('@/lib/jsonDb')
      const result = searchGames({ limit: 1000 })
      
      const gameUrls = result.games.map((game) => ({
        url: `${baseUrl}/game/${game.id}`,
        lastModified: new Date(game.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      
      return [...staticPages, ...gameUrls]
    } catch (error) {
      console.log('JSON DB not available during build, using static sitemap')
    }
  }

  return staticPages
}