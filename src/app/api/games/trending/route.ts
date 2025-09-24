import { NextResponse } from 'next/server';
import { getTrendingGames } from '@/lib/jsonDb';

export async function GET() {
  try {
    const trendingGames = getTrendingGames(5);
    return NextResponse.json(trendingGames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending games' }, { status: 500 });
  }
}