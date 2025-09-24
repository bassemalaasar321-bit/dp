import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const trendingGames = await prisma.game.findMany({
      orderBy: { views: 'desc' },
      take: 5
    });
    return NextResponse.json(trendingGames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending games' }, { status: 500 });
  }
}