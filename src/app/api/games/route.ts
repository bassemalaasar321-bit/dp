import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request: Request) {
  try {
    // تحقق من وجود قاعدة البيانات
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        games: [], 
        totalPages: 0, 
        currentPage: 1, 
        totalCount: 0 
      });
    }
    
    // تهيئة قاعدة البيانات إذا لزم الأمر
    await initializeDatabase();

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
    console.error('Database error:', error);
    return NextResponse.json({ 
      games: [], 
      totalPages: 0, 
      currentPage: 1, 
      totalCount: 0,
      error: 'Database connection failed' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    // تهيئة قاعدة البيانات
    await initializeDatabase();

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
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create game: ' + (error as Error).message }, { status: 500 });
  }
}