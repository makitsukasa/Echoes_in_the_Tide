import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BottleModal from '../components/BottleModal';
import { useBottleStore } from '../features/bottle/stores/useBottleStore';
import { useAccount } from 'wagmi';

interface Bottle {
  id: string;
  description: string;
  image?: string;
  timestamp: string;
}

export default function MyBottles() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const { userBottles, isLoading, error, fetchUserBottles } = useBottleStore();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      fetchUserBottles(address);
    }
  }, [isConnected, address, fetchUserBottles]);

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-red-500 text-center">{error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">拾った小瓶</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">読み込み中...</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-12">
              <p className="text-gray-500">ウォレットを接続してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBottles.map((bottle) => (
                <div
                  key={bottle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedBottle(bottle)}
                >
                  {bottle.image ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={bottle.image}
                        alt="小瓶"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={`${basePath}/bottle.webp`}
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
          )}

          {isConnected && userBottles.length === 0 && !isLoading && (
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
