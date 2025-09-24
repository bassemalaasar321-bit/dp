import { NextResponse } from 'next/server';
import { getPool, initDB } from '@/lib/db';

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        games: [], 
        totalPages: 0, 
        currentPage: 1, 
        totalCount: 0 
      });
    }

    const client = getPool();
    if (!client) {
      return NextResponse.json({ games: [], totalPages: 0, currentPage: 1, totalCount: 0 });
    }

    await initDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM games WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM games WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      countQuery += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      countQuery += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (exclude) {
      query += ` AND id != $${paramIndex}`;
      countQuery += ` AND id != $${paramIndex}`;
      params.push(parseInt(exclude));
      paramIndex++;
    }

    query += ' ORDER BY "createdAt" DESC';

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limitNum, offset);
      
      const [gamesResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, params.slice(0, -2))
      ]);
      
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / limitNum);
      
      return NextResponse.json({
        games: gamesResult.rows,
        totalPages,
        currentPage: pageNum,
        totalCount
      });
    }

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
    }

    const result = await client.query(query, params);
    return NextResponse.json(result.rows);
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

    const client = getPool();
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    await initDB();

    const body = await request.json();
    const { title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs } = body;

    const result = await client.query(
      `INSERT INTO games (title, description, "imageUrl", "downloadLink", category, platforms, "systemReqs", "gameSpecs") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, imageUrl, downloadLink, category, platforms || null, systemReqs || null, gameSpecs || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create game: ' + (error as Error).message }, { status: 500 });
  }
}