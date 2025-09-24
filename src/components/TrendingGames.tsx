'use client';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  views: number;
}

export default function TrendingGames() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  const fetchTrendingGames = async () => {
    try {
      const response = await fetch('/api/games/trending');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrendingGames(data);
      } else {
        setTrendingGames([]);
      }
    } catch (error) {
      console.error('Error fetching trending games:', error);
      setTrendingGames([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">الألعاب الرائجة</h3>
      <div className="space-y-3">
        {Array.isArray(trendingGames) && trendingGames.map((game, index) => (
          <a 
            key={game.id}
            href={`/game/${game.id}`}
            className="block p-3 rounded hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-blue-600">{index + 1}</span>
            </div>
            <img 
              src={game.imageUrl} 
              alt={game.title}
              loading="lazy"
              decoding="async"
              className="w-full h-20 object-cover rounded mb-2"
              style={{ contentVisibility: 'auto' }}
            />
            <span className="text-xs font-medium text-gray-800 block text-center break-words leading-tight">{game.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}