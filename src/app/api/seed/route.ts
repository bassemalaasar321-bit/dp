import { NextResponse } from 'next/server';
import { seedGames } from '@/lib/seedData';

export async function POST() {
  try {
    await seedGames();
    return NextResponse.json({ 
      success: true, 
      message: 'تم إضافة 199 لعبة بنجاح!' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'فشل في إضافة الألعاب: ' + (error as Error).message 
    }, { status: 500 });
  }
}