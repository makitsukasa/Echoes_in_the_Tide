import { Bottle } from '../../types/BottleType';

interface BottleListProps {
  bottles: Bottle[];
  isConnected: boolean;
  isLoading: boolean;
  onBottleClick: (bottle: Bottle) => void;
}

export const BottleList = ({ bottles, isConnected, isLoading, onBottleClick }: BottleListProps) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (isLoading) return <p className="text-center py-12 text-gray-500">読み込み中...</p>;
  if (!isConnected) return <p className="text-center py-12 text-gray-500">ウォレットを接続してください</p>;
  if (bottles.length === 0) return <p className="text-center py-12 text-gray-500">まだ小瓶を拾っていません</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bottles.map((bottle) => (
        <div
          key={bottle.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => onBottleClick(bottle)}
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={bottle.image || `${basePath}/bottle.webp`}
              alt="小瓶"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-2 line-clamp-3">{bottle.description}</p>
            <p className="text-sm text-gray-500">{bottle.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
