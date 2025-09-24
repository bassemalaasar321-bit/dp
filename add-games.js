const { addGame } = require('./src/lib/jsonDb.ts');

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

console.log('بدء إضافة 199 لعبة...');

for (let i = 1; i <= 199; i++) {
  const template = gameTemplates[i % gameTemplates.length];
  const categoryIndex = i % categories.length;
  
  try {
    addGame({
      title: `${template.title} ${i}`,
      description: `${template.description} - إصدار رقم ${i}`,
      imageUrl: `/icon.jpg`,
      downloadLink: `https://example.com/download/game-${i}`,
      category: categories[categoryIndex],
      platforms: template.platforms,
      systemReqs: template.systemReqs,
      gameSpecs: `${template.gameSpecs} - معرف اللعبة: ${i}`
    });
    
    if (i % 20 === 0) {
      console.log(`تم إضافة ${i} لعبة...`);
    }
  } catch (error) {
    console.error(`خطأ في إضافة اللعبة ${i}:`, error);
  }
}

console.log('تم الانتهاء من إضافة 199 لعبة!');