const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // إنشاء مستخدم أدمن
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword
    }
  });

  // إضافة بعض الألعاب التجريبية
  const sampleGames = [
    {
      title: 'لعبة الأكشن المثيرة',
      description: 'لعبة أكشن مليئة بالإثارة والمغامرات الشيقة',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download1',
      category: 'ACTION',
      platforms: 'Windows, PlayStation, Xbox',
      systemReqs: 'Windows 10\nRAM: 8GB\nGraphics: GTX 1060\nStorage: 50GB',
      gameSpecs: 'حجم اللعبة: 45GB\nنوع اللعب: فردي وجماعي\nاللغات: العربية، الإنجليزية'
    },
    {
      title: 'محارب الظلام',
      description: 'قاتل الوحوش في عالم مظلم مليء بالأسرار',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download4',
      category: 'ACTION',
      platforms: 'Windows, Xbox',
      systemReqs: 'Windows 10\nRAM: 6GB\nGraphics: GTX 1050\nStorage: 40GB',
      gameSpecs: 'حجم اللعبة: 35GB\nنوع اللعب: فردي\nاللغات: العربية، الإنجليزية'
    },
    {
      title: 'حرب النجوم',
      description: 'معركة ملحمية في الفضاء الخارجي',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download5',
      category: 'ACTION',
      platforms: 'Windows, PlayStation',
      systemReqs: 'Windows 10\nRAM: 8GB\nGraphics: GTX 1060\nStorage: 55GB',
      gameSpecs: 'حجم اللعبة: 50GB\nنوع اللعب: فردي وجماعي\nاللغات: متعددة'
    },
    {
      title: 'لعبة كرة القدم الرائعة',
      description: 'استمتع بأفضل لعبة كرة قدم على الإطلاق',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download2',
      category: 'FOOTBALL',
      platforms: 'Windows, Android, iOS',
      systemReqs: 'Windows 7 أو أحدث\nRAM: 4GB\nStorage: 25GB',
      gameSpecs: 'حجم اللعبة: 20GB\nنوع اللعب: فردي وجماعي أونلاين\nعدد الفرق: أكثر من 700 فريق'
    },
    {
      title: 'بطولة العالم 2024',
      description: 'شارك في بطولة كأس العالم مع أفضل الفرق',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download6',
      category: 'FOOTBALL',
      platforms: 'Windows, PlayStation, Xbox',
      systemReqs: 'Windows 10\nRAM: 6GB\nStorage: 30GB',
      gameSpecs: 'حجم اللعبة: 25GB\nنوع اللعب: فردي وجماعي\nعدد الفرق: 32 فريق'
    },
    {
      title: 'لعبة الرعب المخيفة',
      description: 'لعبة رعب ستجعلك تقفز من مقعدك',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download3',
      category: 'HORROR',
      platforms: 'Windows, PlayStation',
      systemReqs: 'Windows 10\nRAM: 6GB\nGraphics: GTX 970\nStorage: 30GB',
      gameSpecs: 'حجم اللعبة: 28GB\nنوع اللعب: فردي فقط\nالتقييم: +18 سنة'
    },
    {
      title: 'البيت المسكون',
      description: 'استكشف البيت المهجور واكتشف أسراره المرعبة',
      imageUrl: 'https://via.placeholder.com/300x200',
      downloadLink: 'https://example.com/download7',
      category: 'HORROR',
      platforms: 'Windows',
      systemReqs: 'Windows 10\nRAM: 4GB\nGraphics: GTX 960\nStorage: 20GB',
      gameSpecs: 'حجم اللعبة: 18GB\nنوع اللعب: فردي\nالتقييم: +16 سنة'
    }
  ];

  // حذف الألعاب الموجودة وإضافة الجديدة
  await prisma.game.deleteMany({});
  
  for (const [index, game] of sampleGames.entries()) {
    await prisma.game.create({
      ...game,
      platforms: game.platforms || '',
      systemReqs: game.systemReqs || '',
      gameSpecs: game.gameSpecs || '',
      views: Math.floor(Math.random() * 100) + (8 - index) * 10 // زيارات عشوائية
    });
  }

  console.log('تم إعداد قاعدة البيانات بنجاح!');
  console.log('بيانات تسجيل الدخول:');
  console.log('اسم المستخدم: admin');
  console.log('كلمة المرور: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });