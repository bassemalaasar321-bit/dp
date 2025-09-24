import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      totalGames: games.length,
      games: games
    };
    
    return NextResponse.json(backup);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const backupData = await request.json();
    
    if (!backupData.games || !Array.isArray(backupData.games)) {
      return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });
    }
    
    // حذف جميع الألعاب الحالية
    await prisma.game.deleteMany();
    
    // إضافة الألعاب من الـ backup
    for (const game of backupData.games) {
      await prisma.game.create({
        data: {
          title: game.title,
          description: game.description,
          imageUrl: game.imageUrl,
          downloadLink: game.downloadLink,
          category: game.category,
          platforms: game.platforms || null,
          systemReqs: game.systemReqs || null,
          gameSpecs: game.gameSpecs || null
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `تم استعادة ${backupData.games.length} لعبة بنجاح` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}