import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDB() {
  const client = getPool();
  if (!client) return false;

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "downloadLink" TEXT NOT NULL,
        category TEXT NOT NULL,
        platforms TEXT,
        "systemReqs" TEXT,
        "gameSpecs" TEXT,
        views INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (error) {
    console.error('DB Init Error:', error);
    return false;
  }
}