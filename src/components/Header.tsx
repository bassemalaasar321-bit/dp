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

        
        <div className="flex justify-center mt-4">
          <nav className="hidden lg:flex gap-4 bg-blue-800 rounded-lg p-4">
            <button 
              onClick={() => onCategoryChange('')}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors cursor-pointer text-white font-medium"
            >
              🎮 جميع الألعاب
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-white"
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            className="lg:hidden bg-blue-800 px-4 py-2 rounded-lg cursor-pointer text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰ الفئات
          </button>
        </div>

        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}></div>
            <nav className="fixed right-0 top-0 h-full w-80 bg-blue-900 z-50 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">فئات الألعاب</h3>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-2xl hover:text-blue-200"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => { onCategoryChange(''); setMobileMenuOpen(false); }}
                  className="block w-full text-right py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-600 cursor-pointer text-white font-medium"
                >
                  🎮 جميع الألعاب
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { onCategoryChange(cat.value); setMobileMenuOpen(false); }}
                    className="block w-full text-right py-3 px-4 rounded-lg hover:bg-blue-600 cursor-pointer text-white"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}


      </div>
    </header>
  );
}