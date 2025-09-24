const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const GAMES_PER_FILE = 200;

// إنشاء مجلد البيانات
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const categories = ['ACTION', 'WAR', 'FOOTBALL', 'OPEN_WORLD', 'CARS', 'LIGHT', 'HORROR', 'STRATEGY', 'CLASSIC'];

const gameTemplates = [
  {
    title: "Call of Duty: Modern Warfare",
    description: "لعبة إطلاق نار من منظور الشخص الأول مع قصة مثيرة ومعارك ملحمية",
    category: "WAR",
    platforms: "Windows, PlayStation, Xbox",
    systemReqs: "Windows 10, 8GB RAM, GTX 1060",
    gameSpecs: "حجم اللعبة: 175GB، دعم 4K، معدل إطارات عالي"
  },
  {
    title: "FIFA 2024",
    description: "أحدث إصدار من سلسلة فيفا مع فرق محدثة وجرافيك محسن",
    category: "FOOTBALL",
    platforms: "Windows, PlayStation, Xbox, Nintendo Switch",
    systemReqs: "Windows 10, 8GB RAM, GTX 1050",
    gameSpecs: "حجم اللعبة: 50GB، دعم الذكاء الاصطناعي المحسن"
  },
  {
    title: "Grand Theft Auto V",
    description: "لعبة عالم مفتوح مع قصة جريمة مثيرة في مدينة لوس سانتوس",
    category: "OPEN_WORLD",
    platforms: "Windows, PlayStation, Xbox",
    systemReqs: "Windows 10, 8GB RAM, GTX 660",
    gameSpecs: "حجم اللعبة: 90GB، عالم مفتوح ضخم، وضع اللعب الجماعي"
  }
];

// إنشاء الفهرس
const index = {
  totalGames: 199,
  filesCount: 1,
  lastFileNumber: 1,
  nextId: 200,
  gamesPerFile: 200
};

// إنشاء الألعاب
const games = [];
for (let i = 1; i <= 199; i++) {
  const template = gameTemplates[i % gameTemplates.length];
  const categoryIndex = i % categories.length;
  
  games.push({
    id: i,
    title: `${template.title} ${i}`,
    description: `${template.description} - إصدار رقم ${i}`,
    imageUrl: `/icon.jpg`,
    downloadLink: `https://example.com/download/game-${i}`,
    category: categories[categoryIndex],
    platforms: template.platforms,
    systemReqs: template.systemReqs,
    gameSpecs: `${template.gameSpecs} - معرف اللعبة: ${i}`,
    views: Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString()
  });
}

// حفظ الفهرس
fs.writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(index, null, 2));

// حفظ الألعاب
const gameFile = {
  games: games,
  startId: 1,
  endId: 200,
  count: 199
};

fs.writeFileSync(path.join(DATA_DIR, 'games-1.json'), JSON.stringify(gameFile, null, 2));

console.log('تم إضافة 199 لعبة بنجاح!');
console.log('الملفات المنشأة:');
console.log('- data/index.json');
console.log('- data/games-1.json');