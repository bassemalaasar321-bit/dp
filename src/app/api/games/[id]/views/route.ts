import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/jsonDb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const success = incrementViews(parseInt(resolvedParams.id));
    
    if (!success) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
  }
}