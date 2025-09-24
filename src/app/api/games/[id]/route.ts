import { NextResponse } from 'next/server';
import { getGameById, deleteGame, updateGame } from '@/lib/jsonDb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const game = getGameById(parseInt(resolvedParams.id));
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const success = deleteGame(parseInt(resolvedParams.id));
    
    if (!success) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs } = body;

    const game = updateGame(parseInt(resolvedParams.id), {
      title,
      description,
      imageUrl,
      downloadLink,
      category,
      platforms: platforms || undefined,
      systemReqs: systemReqs || undefined,
      gameSpecs: gameSpecs || undefined
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}