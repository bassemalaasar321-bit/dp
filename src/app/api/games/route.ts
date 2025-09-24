import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const where: Record<string, any> = {};
    if (category) where.category = category;
    if (exclude) where.id = { not: parseInt(exclude) };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // إذا كان هناك pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [games, totalCount] = await Promise.all([
        prisma.game.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.game.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      return NextResponse.json({
        games,
        totalPages,
        currentPage: pageNum,
        totalCount
      });
    }

    // بدون pagination (للألعاب المشابهة)
    const games = await prisma.game.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs } = body;

    const game = await prisma.game.create({
      data: {
        title,
        description,
        imageUrl,
        downloadLink,
        category,
        platforms: platforms || null,
        systemReqs: systemReqs || null,
        gameSpecs: gameSpecs || null
      }
    });

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}