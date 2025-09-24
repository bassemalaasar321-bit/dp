'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TrendingGames from '@/components/TrendingGames';
import GameCard from '@/components/GameCard';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12;

  useEffect(() => {
    fetchGames();
  }, [currentPage, selectedCategory, searchQuery]);



  const fetchGames = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: gamesPerPage.toString(),
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });
      
      const response = await fetch(`/api/games?${params}`);
      const data = await response.json();
      
      setFilteredGames(data.games || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = window.innerWidth < 768 ? 5 : 10; // 5 على الموبايل، 10 على الديسكتوب
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 md:px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
        >
          السابق
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 md:px-3 py-2 rounded text-sm cursor-pointer ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 md:px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
        >
          التالي
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-8">
        <div className="container mx-auto text-center">
          <a href="/" className="inline-block">
            <h1 className="text-5xl font-bold mb-4 hover:text-blue-200 transition-colors cursor-pointer">
              🎮 تحميل العاب برو
            </h1>
          </a>
          <p className="text-xl text-blue-100 mb-4">
            أفضل موقع لتحميل الألعاب المجانية بروابط مباشرة وسريعة
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <Header 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          <div className="flex-1 order-2 lg:order-1 min-w-0">
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد ألعاب متاحة حالياً</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
          
          <div className="lg:w-64 order-1 lg:order-2 flex-shrink-0">
            <Sidebar 
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
            <TrendingGames />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}