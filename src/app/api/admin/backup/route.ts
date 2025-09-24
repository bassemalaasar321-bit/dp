import { NextResponse } from 'next/server';
import { searchGames, addGame } from '@/lib/jsonDb';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const result = searchGames({ limit: 10000 });
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      totalGames: result.totalCount,
      games: result.games
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
    
    // حذف جميع ملفات JSON
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      files.forEach(file => {
        if (file.startsWith('games-') && file.endsWith('.json')) {
          fs.unlinkSync(path.join(dataDir, file));
        }
      });
    }

    // إعادة إنشاء الفهرس
    const indexPath = path.join(dataDir, 'index.json');
    const newIndex = {
      totalGames: 0,
      filesCount: 0,
      lastFileNumber: 0,
      nextId: 1,
      gamesPerFile: 200
    };
    fs.writeFileSync(indexPath, JSON.stringify(newIndex, null, 2));
    
    // إضافة الألعاب من الـ backup
    for (const game of backupData.games) {
      addGame({
        title: game.title,
        description: game.description,
        imageUrl: game.imageUrl,
        downloadLink: game.downloadLink,
        category: game.category,
        platforms: game.platforms,
        systemReqs: game.systemReqs,
        gameSpecs: game.gameSpecs
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