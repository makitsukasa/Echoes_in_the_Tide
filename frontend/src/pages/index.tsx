import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BottleModal from '../components/BottleModal';
import { useBottleStore } from '../features/bottle/stores/useBottleStore';
import { BottleData, BottleType } from '../types/BottleType';

export default function Home() {
  const { bottles, isLoading, error, fetchBottles } = useBottleStore();
  const [selectedBottle, setSelectedBottle] = useState<BottleData | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    fetchBottles();
  }, [fetchBottles]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-red-500">エラーが発生しました: {error.message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* 背景画像 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${basePath}/ocean.webp)`,
            backgroundPosition: 'center bottom',
            backgroundSize: 'cover'
          }}
        />

        {/* 小瓶の表示 */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12">
          {isLoading ? (
            <p className="text-white">読み込み中...</p>
          ) : (
            bottles.map((bottle, index) => (
              <div
                key={bottle.id}
                className="cursor-pointer transform hover:scale-110 transition-transform duration-300"
                style={{
                  transform: `rotate(${index * 15 - 15}deg)`,
                }}
                onClick={() => setSelectedBottle(bottle)}
              >
                <img
                  src={`${basePath}/bottle.webp`}
                  alt="小瓶"
                  className="w-32 h-32 object-contain drop-shadow-lg"
                />
              </div>
            ))
          )}
        </div>

        {/* モーダル */}
        {selectedBottle && (
          <BottleModal
            bottle={{
              id: selectedBottle.id,
              tokenId: selectedBottle.id,
              tokenURI: selectedBottle.tokenURI || '',
              description: selectedBottle.description || '',
              image: selectedBottle.image || `${basePath}/bottle.webp`,
              date: selectedBottle.date || new Date().toLocaleDateString('ja-JP'),
              status: '漂流中',
              timestamp: new Date().toLocaleString('ja-JP')
            }}
            onClose={() => setSelectedBottle(null)}
          />
        )}
      </main>
    </div>
  );
}
