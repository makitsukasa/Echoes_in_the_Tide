import { useState } from 'react';
import Navbar from '../components/Navbar';
import BottleModal from '../components/BottleModal';

interface Bottle {
  id: string;
  description: string;
  image?: string;
  timestamp: string;
}

export default function MyBottles() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 仮のデータ（後でThe Graphから取得するように変更）
  const [bottles] = useState<Bottle[]>([
    {
      id: '1',
      description: '海の向こうから届いたメッセージ...',
      image: `${basePath}/bottle.webp`,
      timestamp: '2024-03-20 15:30'
    },
    {
      id: '2',
      description: '波の音に乗ってやってきた想い...',
      image: `${basePath}/bottle.webp`,
      timestamp: '2024-03-19 10:15'
    },
    {
      id: '3',
      description: '遠い海から届いた物語...',
      image: `${basePath}/bottle.webp`,
      timestamp: '2024-03-18 20:45'
    }
  ]);

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">拾った小瓶</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bottles.map((bottle) => (
              <div
                key={bottle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedBottle(bottle)}
              >
                {bottle.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={bottle.image}
                      alt="小瓶"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-gray-700 mb-2 line-clamp-3">{bottle.description}</p>
                  <p className="text-sm text-gray-500">{bottle.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {bottles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">まだ小瓶を拾っていません</p>
            </div>
          )}

          {/* モーダル */}
          {selectedBottle && (
            <BottleModal
              bottle={selectedBottle}
              onClose={() => setSelectedBottle(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
