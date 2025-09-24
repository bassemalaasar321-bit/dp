'use client';
import { useState } from 'react';

const categories = [
  { name: 'ألعاب أكشن', value: 'ACTION' },
  { name: 'ألعاب رياضة', value: 'FOOTBALL' },
  { name: 'ألعاب مغامرات', value: 'OPEN_WORLD' },
  { name: 'ألعاب رعب', value: 'HORROR' },
  { name: 'ألعاب خفيفة', value: 'LIGHT' },
  { name: 'ألعاب حرب', value: 'WAR' },
  { name: 'ألعاب استراتيجية', value: 'STRATEGY' }
];

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
}

export default function Header({ onCategoryChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <a href="/" className="inline-block">
            <h1 className="text-4xl font-bold mb-2 hover:text-blue-200 transition-colors cursor-pointer flex items-center gap-3">
              🎮 تحميل العاب برو
            </h1>
          </a>
          <p className="text-blue-200">كل ما تحتاجه من ألعاب الكمبيوتر في مكان واحد</p>
        </div>
        
        <nav className="hidden md:flex justify-center gap-6 mb-4">
          <button 
            onClick={() => onCategoryChange('')}
            className="hover:text-blue-200 transition-colors cursor-pointer"
          >
            تحميل العاب
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className="hover:text-blue-200 transition-colors cursor-pointer"
            >
              {cat.name}
            </button>
          ))}
        </nav>

        <button 
          className="md:hidden mb-4 bg-blue-800 px-4 py-2 rounded cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          القائمة
        </button>

        {mobileMenuOpen && (
          <nav className="md:hidden mb-4 bg-blue-800 rounded p-4 space-y-2">
            <button 
              onClick={() => { onCategoryChange(''); setMobileMenuOpen(false); }}
              className="block w-full text-right py-2 hover:text-blue-200 cursor-pointer"
            >
              تحميل العاب
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { onCategoryChange(cat.value); setMobileMenuOpen(false); }}
                className="block w-full text-right py-2 hover:text-blue-200 cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}

        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="ابحث عن لعبة..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full px-4 py-2 rounded text-gray-900 placeholder-gray-500 border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}