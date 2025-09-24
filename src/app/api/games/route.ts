import { NextResponse } from 'next/server';
import { searchGames, addGame } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const options = {
      search: search || undefined,
      category: category || undefined,
      exclude: exclude ? parseInt(exclude) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12
    };

    const result = searchGames(options);

    // إذا كان هناك pagination
    if (page && limit) {
      return NextResponse.json({
        games: result.games,
        totalPages: result.totalPages,
        currentPage: parseInt(page),
        totalCount: result.totalCount
      });
    }

    // بدون pagination (للألعاب المشابهة)
    return NextResponse.json(result.games);
  } catch (error) {
    console.error('JSON DB error:', error);
    return NextResponse.json({ 
      games: [], 
      totalPages: 0, 
      currentPage: 1, 
      totalCount: 0,
      error: 'Failed to fetch games' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs } = body;

    const newGame = addGame({
      title,
      description,
      imageUrl,
      downloadLink,
      category,
      platforms: platforms || undefined,
      systemReqs: systemReqs || undefined,
      gameSpecs: gameSpecs || undefined
    });

    return NextResponse.json(newGame);
  } catch (error) {
    console.error('JSON DB error:', error);
    return NextResponse.json({ error: 'Failed to create game: ' + (error as Error).message }, { status: 500 });
  }
}