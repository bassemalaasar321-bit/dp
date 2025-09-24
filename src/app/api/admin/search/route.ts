import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }
    
    const games = await prisma.game.findMany({
      where: {
        title: {
          contains: query
        }
      },
      select: {
        id: true,
        title: true,
        category: true
      }
    });
    
    return NextResponse.json({ 
      found: games.length > 0,
      count: games.length,
      games: games 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}