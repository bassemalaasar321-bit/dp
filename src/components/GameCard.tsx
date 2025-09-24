interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const handleClick = () => {
    fetch(`/api/games/${game.id}/views`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className="card flex flex-col md:flex-row gap-6 p-6 group max-w-4xl">
      <div className="md:w-64 w-full overflow-hidden rounded">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 md:h-40 object-cover rounded group-hover:scale-110 transition-transform duration-500"
          style={{ contentVisibility: 'auto' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <a href={`/game/${game.id}`} onClick={handleClick} className="text-2xl font-bold mb-4 text-gray-800 hover:text-blue-600 block break-words">
          {game.title}
        </a>
        <p className="text-gray-600 mb-4 text-base leading-relaxed break-words">{game.description}</p>
        <a 
          href={`/game/${game.id}`}
          onClick={handleClick}
          className="btn-primary inline-block text-lg px-6 py-3"
        >
          عرض التفاصيل
        </a>
      </div>
    </div>
  );
}