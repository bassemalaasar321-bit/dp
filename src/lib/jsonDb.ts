import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// تأكد من وجود المجلد
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  }
}
const GAMES_PER_FILE = 200;

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
  platforms?: string;
  systemReqs?: string;
  gameSpecs?: string;
  views: number;
  createdAt: string;
}

interface GameFile {
  games: Game[];
  startId: number;
  endId: number;
  count: number;
}

interface Index {
  totalGames: number;
  filesCount: number;
  lastFileNumber: number;
  nextId: number;
  gamesPerFile: number;
}



// قراءة الفهرس
function getIndex(): Index {
  ensureDataDir();
  const indexPath = path.join(DATA_DIR, 'index.json');
  
  console.log('Reading index from:', indexPath);
  console.log('Index exists:', fs.existsSync(indexPath));
  
  if (!fs.existsSync(indexPath)) {
    const defaultIndex: Index = {
      totalGames: 0,
      filesCount: 0,
      lastFileNumber: 0,
      nextId: 1,
      gamesPerFile: GAMES_PER_FILE
    };
    fs.writeFileSync(indexPath, JSON.stringify(defaultIndex, null, 2));
    console.log('Created default index');
    return defaultIndex;
  }
  
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  console.log('Loaded index:', index);
  return index;
}

// حفظ الفهرس
function saveIndex(index: Index) {
  const indexPath = path.join(DATA_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

// قراءة ملف ألعاب
function getGameFile(fileNumber: number): GameFile {
  const filePath = path.join(DATA_DIR, `games-${fileNumber}.json`);
  
  if (!fs.existsSync(filePath)) {
    const defaultFile: GameFile = {
      games: [],
      startId: (fileNumber - 1) * GAMES_PER_FILE + 1,
      endId: fileNumber * GAMES_PER_FILE,
      count: 0
    };
    fs.writeFileSync(filePath, JSON.stringify(defaultFile, null, 2));
    return defaultFile;
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// حفظ ملف ألعاب
function saveGameFile(fileNumber: number, gameFile: GameFile) {
  const filePath = path.join(DATA_DIR, `games-${fileNumber}.json`);
  fs.writeFileSync(filePath, JSON.stringify(gameFile, null, 2));
}

// إضافة لعبة جديدة
export function addGame(gameData: Omit<Game, 'id' | 'views' | 'createdAt'>): Game {
  const index = getIndex();
  
  // تحديد رقم الملف الحالي
  let currentFileNumber = index.lastFileNumber || 1;
  let currentFile = getGameFile(currentFileNumber);
  
  // إذا امتلأ الملف الحالي، أنشئ ملف جديد
  if (currentFile.count >= GAMES_PER_FILE) {
    currentFileNumber++;
    currentFile = getGameFile(currentFileNumber);
    index.filesCount++;
    index.lastFileNumber = currentFileNumber;
  }
  
  // إنشاء اللعبة الجديدة
  const newGame: Game = {
    ...gameData,
    id: index.nextId,
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  // إضافة اللعبة للملف
  currentFile.games.push(newGame);
  currentFile.count++;
  
  // تحديث الفهرس
  index.totalGames++;
  index.nextId++;
  if (index.filesCount === 0) index.filesCount = 1;
  
  // حفظ التغييرات
  saveGameFile(currentFileNumber, currentFile);
  saveIndex(index);
  
  return newGame;
}

// البحث في جميع الألعاب
export function searchGames(options: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  exclude?: number;
}): { games: Game[]; totalCount: number; totalPages: number } {
  const index = getIndex();
  const { search, category, page = 1, limit = 12, exclude } = options;
  
  let allGames: Game[] = [];
  
  // قراءة جميع الملفات
  for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
    const gameFile = getGameFile(i);
    allGames = allGames.concat(gameFile.games);
  }
  
  // تطبيق الفلاتر
  let filteredGames = allGames;
  
  if (search) {
    filteredGames = filteredGames.filter(game => 
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredGames = filteredGames.filter(game => game.category === category);
  }
  
  if (exclude) {
    filteredGames = filteredGames.filter(game => game.id !== exclude);
  }
  
  // ترتيب حسب التاريخ (الأحدث أولاً)
  filteredGames.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const totalCount = filteredGames.length;
  const totalPages = Math.ceil(totalCount / limit);
  
  // تطبيق pagination
  const startIndex = (page - 1) * limit;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + limit);
  
  return {
    games: paginatedGames,
    totalCount,
    totalPages
  };
}

// الحصول على لعبة بالـ ID
export function getGameById(id: number): Game | null {
  const index = getIndex();
  
  for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
    const gameFile = getGameFile(i);
    const game = gameFile.games.find(g => g.id === id);
    if (game) return game;
  }
  
  return null;
}

// حذف لعبة
export function deleteGame(id: number): boolean {
  const index = getIndex();
  
  for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
    const gameFile = getGameFile(i);
    const gameIndex = gameFile.games.findIndex(g => g.id === id);
    
    if (gameIndex !== -1) {
      gameFile.games.splice(gameIndex, 1);
      gameFile.count--;
      index.totalGames--;
      
      saveGameFile(i, gameFile);
      saveIndex(index);
      return true;
    }
  }
  
  return false;
}

// تحديث لعبة
export function updateGame(id: number, updates: Partial<Omit<Game, 'id' | 'createdAt'>>): Game | null {
  const index = getIndex();
  
  for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
    const gameFile = getGameFile(i);
    const gameIndex = gameFile.games.findIndex(g => g.id === id);
    
    if (gameIndex !== -1) {
      gameFile.games[gameIndex] = { ...gameFile.games[gameIndex], ...updates };
      saveGameFile(i, gameFile);
      return gameFile.games[gameIndex];
    }
  }
  
  return null;
}

// زيادة عدد المشاهدات
export function incrementViews(id: number): boolean {
  try {
    const index = getIndex();
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = getGameFile(i);
      const gameIndex = gameFile.games.findIndex(g => g.id === id);
      
      if (gameIndex !== -1) {
        gameFile.games[gameIndex].views = (gameFile.games[gameIndex].views || 0) + 1;
        saveGameFile(i, gameFile);
        console.log(`Incremented views for game ${id} to ${gameFile.games[gameIndex].views}`);
        return true;
      }
    }
    
    console.log(`Game ${id} not found for view increment`);
    return false;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return false;
  }
}

// الحصول على الألعاب الأكثر مشاهدة
export function getTrendingGames(limit: number = 6): Game[] {
  try {
    ensureDataDir();
    const index = getIndex();
    let allGames: Game[] = [];
    
    console.log('Getting trending games, files count:', index.lastFileNumber || 1);
    
    // قراءة جميع الملفات
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      try {
        const gameFile = getGameFile(i);
        allGames = allGames.concat(gameFile.games);
        console.log(`Loaded ${gameFile.games.length} games from file ${i}`);
      } catch (error) {
        console.error(`Error loading file ${i}:`, error);
      }
    }
    
    console.log(`Total games loaded: ${allGames.length}`);
    
    // ترتيب حسب المشاهدات (الأعلى أولاً)
    const sorted = allGames
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
      
    console.log('Top trending games:', sorted.map(g => ({ id: g.id, title: g.title, views: g.views })));
    
    return sorted;
  } catch (error) {
    console.error('Error getting trending games:', error);
    return [];
  }
}