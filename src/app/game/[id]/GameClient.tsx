'use client';
import { useState, useEffect, use } from 'react';
import Footer from '@/components/Footer';

const categoryNames: { [key: string]: string } = {
  ACTION: 'ألعاب أكشن',
  WAR: 'ألعاب حرب',
  FOOTBALL: 'ألعاب كرة قدم',
  OPEN_WORLD: 'ألعاب عالم مفتوح',
  CARS: 'ألعاب سيارات',
  LIGHT: 'ألعاب خفيفة',
  HORROR: 'ألعاب رعب',
  STRATEGY: 'ألعاب استراتيجية',
  CLASSIC: 'ألعاب قديمة'
};

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
}

export default function GameClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameData();
    fetch(`/api/games/${resolvedParams.id}/views`, { method: 'POST' }).catch(() => {});
  }, [resolvedParams.id]);

  const fetchGameData = async () => {
    try {
      const gameResponse = await fetch(`/api/games/${resolvedParams.id}`);
      const gameData = await gameResponse.json();
      
      if (gameData.error) {
        return;
      }
      
      setGame(gameData);
      
      const similarResponse = await fetch(`/api/games?category=${gameData.category}&exclude=${resolvedParams.id}&limit=4`);
      const similarData = await similarResponse.json();
      setSimilarGames(Array.isArray(similarData) ? similarData : []);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    fetch(`/api/games/${resolvedParams.id}/views`, { method: 'POST' }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">اللعبة غير موجودة</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-4">
        <div className="container mx-auto">
          <nav className="mb-2 text-sm">
            <ol className="flex items-center space-x-2 rtl:space-x-reverse">
              <li>
                <a href="/" className="text-blue-200 hover:text-white">
                  الرئيسية
                </a>
              </li>
              <li className="text-blue-300">/</li>
              <li>
                <span className="text-blue-200">{categoryNames[game.category]}</span>
              </li>
              <li className="text-blue-300">/</li>
              <li>
                <span className="text-white font-medium">{game.title}</span>
              </li>
            </ol>
          </nav>
          
          <a href="/">
            <h1 className="text-3xl font-bold hover:text-blue-200 transition-colors cursor-pointer flex items-center gap-2">
              🎮 تحميل العاب برو
            </h1>
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center break-words">
              {game.title}
            </h1>
            
            <div className="mb-8 text-center">
              <img 
                src={game.imageUrl} 
                alt={game.title}
                loading="eager"
                decoding="async"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                style={{ contentVisibility: 'auto' }}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">وصف اللعبة</h2>
              <p className="text-gray-600 text-lg leading-relaxed break-words">
                {game.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">مواصفات اللعبة</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-100 break-words">الفئة</td>
                      <td className="py-3 px-4 break-words">{categoryNames[game.category]}</td>
                    </tr>
                    {game.platforms && (
                      <tr className="border-b">
                        <td className="py-3 px-4 font-bold text-gray-700 bg-gray-100 break-words">المنصات المدعومة</td>
                        <td className="py-3 px-4 break-words overflow-wrap-anywhere">{game.platforms}</td>
                      </tr>
                    )}
                    {game.systemReqs && (
                      <tr className="border-b">
                        <td className="py-3 px-4 font-bold text-gray-700 bg-gray-100 break-words">متطلبات التشغيل</td>
                        <td className="py-3 px-4 whitespace-pre-line break-words">{game.systemReqs}</td>
                      </tr>
                    )}
                    {game.gameSpecs && (
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-700 bg-gray-100 break-words">مواصفات إضافية</td>
                        <td className="py-3 px-4 whitespace-pre-line break-words">{game.gameSpecs}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mb-8">
              <a 
                href={game.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownloadClick}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-700 transition-colors inline-block cursor-pointer"
              >
                💾 تحميل اللعبة الآن
              </a>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ألعاب مشابهة ({similarGames.length})</h2>
              {similarGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarGames.map((similarGame) => (
                  <div key={similarGame.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <img 
                      src={similarGame.imageUrl} 
                      alt={similarGame.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-24 object-cover rounded mb-3"
                      style={{ contentVisibility: 'auto' }}
                    />
                    <h3 className="font-bold text-gray-800 mb-2 text-sm break-words">{similarGame.title}</h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 break-words">{similarGame.description}</p>
                    <a 
                      href={`/game/${similarGame.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors inline-block w-full text-center"
                    >
                      عرض التفاصيل
                    </a>
                  </div>
                ))}
              </div>
              ) : (
                <p className="text-center text-gray-500">لا توجد ألعاب مشابهة</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}