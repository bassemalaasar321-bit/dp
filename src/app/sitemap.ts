import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // جلب جميع الألعاب
  const games = await prisma.game.findMany({
    select: {
      id: true,
      createdAt: true
    }
  })

  // صفحات الألعاب
  const gameUrls = games.map((game) => ({
    url: `${baseUrl}/game/${game.id}`,
    lastModified: game.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...gameUrls,
  ]
}