import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';

interface Bottle {
  id: string;
  description: string;
  image?: string;
}

export default function Home() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);

  // モーダル外クリックで閉じる処理
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBottle(null);
    }
  }, []);

  // 仮のデータ（後でThe Graphから取得するように変更）
  useEffect(() => {
    setBottles([
      {
        id: '1',
        description: '海の向こうから届いたメッセージ...',
        image: '/bottle.webp'
      },
      {
        id: '2',
        description: '波の音に乗ってやってきた想い...',
        image: '/bottle.webp'
      },
      {
        id: '3',
        description: '遠い海から届いた物語...',
        image: '/bottle.webp'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* 背景画像 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/ocean.webp)',
            backgroundPosition: 'center bottom',
            backgroundSize: 'cover'
          }}
        />

        {/* 小瓶の表示 */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12">
          {bottles.map((bottle, index) => (
            <div
              key={bottle.id}
              className="cursor-pointer transform hover:scale-110 transition-transform duration-300"
              style={{
                transform: `rotate(${index * 15 - 15}deg)`,
              }}
              onClick={() => setSelectedBottle(bottle)}
            >
              <img
                src={bottle.image}
                alt="小瓶"
                className="w-32 h-32 object-contain drop-shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* モーダル */}
        {selectedBottle && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            onClick={handleModalClick}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4">小瓶の中身</h2>
              <p className="text-gray-700 mb-4">{selectedBottle.description}</p>
              {selectedBottle.image && (
                <img
                  src={selectedBottle.image}
                  alt="小瓶の中身"
                  className="w-full h-48 object-contain rounded-lg"
                />
              )}
              <button
                onClick={() => setSelectedBottle(null)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
