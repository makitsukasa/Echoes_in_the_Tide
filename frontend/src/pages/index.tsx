import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BottleModal from '../components/BottleModal';

interface Bottle {
  id: string;
  description: string;
  image?: string;
}

export default function Home() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 仮のデータ（後でThe Graphから取得するように変更）
  useEffect(() => {
    setBottles([
      {
        id: '1',
        description: '海の向こうから届いたメッセージ...',
        image: `${basePath}/bottle.webp`
      },
      {
        id: '2',
        description: '波の音に乗ってやってきた想い...',
        image: `${basePath}/bottle.webp`
      },
      {
        id: '3',
        description: '遠い海から届いた物語...',
        image: `${basePath}/bottle.webp`
      }
    ]);
  }, [basePath]);

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
          <BottleModal
            bottle={selectedBottle}
            onClose={() => setSelectedBottle(null)}
          />
        )}
      </main>
    </div>
  );
}
