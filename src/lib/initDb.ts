import { prisma } from './prisma';

export async function initializeDatabase() {
  try {
    // تحقق من وجود الجداول وإنشاؤها إذا لم تكن موجودة
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Game" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "downloadLink" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "platforms" TEXT,
        "systemReqs" TEXT,
        "gameSpecs" TEXT,
        "views" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}