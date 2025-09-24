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

  // إضافة صفحات الألعاب فقط في الإنتاج
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    try {
      const { prisma } = await import('@/lib/prisma')
      const games = await prisma.game.findMany({
        select: {
          id: true,
          createdAt: true
        }
      })
      
      const gameUrls = games.map((game) => ({
        url: `${baseUrl}/game/${game.id}`,
        lastModified: game.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      
      return [...staticPages, ...gameUrls]
    } catch (error) {
      console.log('Database not available during build, using static sitemap')
    }
  }

  return staticPages
}