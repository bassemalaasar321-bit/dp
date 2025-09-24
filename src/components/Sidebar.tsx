const categories = [
  { name: 'ألعاب أكشن', value: 'ACTION', icon: '⚔️' },
  { name: 'ألعاب حرب', value: 'WAR', icon: '💣' },
  { name: 'ألعاب كرة قدم', value: 'FOOTBALL', icon: '⚽' },
  { name: 'ألعاب عالم مفتوح', value: 'OPEN_WORLD', icon: '🌍' },
  { name: 'ألعاب سيارات', value: 'CARS', icon: '🏎️' },
  { name: 'ألعاب خفيفة', value: 'LIGHT', icon: '✨' },
  { name: 'ألعاب رعب', value: 'HORROR', icon: '👻' },
  { name: 'ألعاب استراتيجية', value: 'STRATEGY', icon: '♟️' },
  { name: 'ألعاب قديمة', value: 'CLASSIC', icon: '🕹️' }
];

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

export default function Sidebar({ onCategoryChange, selectedCategory }: SidebarProps) {
  return (
    <aside className="bg-white rounded-lg shadow-md p-4 h-fit">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        📁 أقسام الموقع
      </h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategoryChange('')}
            className={`flex items-center gap-2 w-full text-right py-2 px-3 rounded transition-colors cursor-pointer ${
              selectedCategory === '' 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span>🎮</span>
            <span>جميع الألعاب</span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.value}>
            <button
              onClick={() => onCategoryChange(category.value)}
              className={`flex items-center gap-2 w-full text-right py-2 px-3 rounded transition-colors cursor-pointer ${
                selectedCategory === category.value 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}