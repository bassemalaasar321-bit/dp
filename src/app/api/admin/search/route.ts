import { NextResponse } from 'next/server';
import { searchGames } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }
    
    const result = searchGames({ search: query, limit: 100 });
    const games = result.games.map(game => ({
      id: game.id,
      title: game.title,
      category: game.category
    }));
    
    return NextResponse.json({ 
      found: games.length > 0,
      count: games.length,
      games: games 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}