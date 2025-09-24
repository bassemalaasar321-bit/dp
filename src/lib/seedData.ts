import { addGame } from './jsonDb';

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
  },
  {
    title: "Forza Horizon 5",
    description: "لعبة سباق سيارات في عالم مفتوح مع مناظر طبيعية خلابة",
    category: "CARS",
    platforms: "Windows, Xbox",
    systemReqs: "Windows 10, 8GB RAM, GTX 1060",
    gameSpecs: "حجم اللعبة: 110GB، أكثر من 500 سيارة، طقس ديناميكي"
  },
  {
    title: "Resident Evil 4",
    description: "لعبة رعب وبقاء مع قصة مثيرة وأجواء مرعبة",
    category: "HORROR",
    platforms: "Windows, PlayStation, Xbox",
    systemReqs: "Windows 10, 8GB RAM, GTX 1060",
    gameSpecs: "حجم اللعبة: 60GB، جرافيك محسن، أصوات مرعبة"
  },
  {
    title: "Civilization VI",
    description: "لعبة استراتيجية لبناء الحضارات وإدارة الإمبراطوريات",
    category: "STRATEGY",
    platforms: "Windows, Mac, Linux",
    systemReqs: "Windows 10, 4GB RAM, GTX 770",
    gameSpecs: "حجم اللعبة: 15GB، لعب متعدد اللاعبين، حضارات متنوعة"
  },
  {
    title: "Minecraft",
    description: "لعبة بناء وإبداع في عالم مكون من مكعبات",
    category: "LIGHT",
    platforms: "Windows, Mac, Linux, Mobile",
    systemReqs: "Windows 10, 4GB RAM, Intel HD Graphics",
    gameSpecs: "حجم اللعبة: 1GB، إبداع لا محدود، وضع البقاء"
  },
  {
    title: "Counter-Strike 2",
    description: "لعبة إطلاق نار تكتيكية متعددة اللاعبين",
    category: "ACTION",
    platforms: "Windows, Mac, Linux",
    systemReqs: "Windows 10, 8GB RAM, GTX 1060",
    gameSpecs: "حجم اللعبة: 35GB، مباريات تنافسية، خرائط كلاسيكية"
  },
  {
    title: "Age of Empires II",
    description: "لعبة استراتيجية تاريخية كلاسيكية",
    category: "CLASSIC",
    platforms: "Windows",
    systemReqs: "Windows 10, 4GB RAM, GTX 650",
    gameSpecs: "حجم اللعبة: 25GB، حملات تاريخية، وضع متعدد اللاعبين"
  }
];

export async function seedGames() {
  console.log('بدء إضافة 199 لعبة...');
  
  for (let i = 1; i <= 199; i++) {
    const template = gameTemplates[i % gameTemplates.length];
    const categoryIndex = i % categories.length;
    
    try {
      const game = addGame({
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
  console.log('يمكنك الآن إضافة اللعبة رقم 200 لرؤية إنشاء الملف الجديد');
}