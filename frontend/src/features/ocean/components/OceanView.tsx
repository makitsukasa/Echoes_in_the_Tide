import React from 'react';
import { BottleCard } from '../../bottle/components/BottleCard';

// TODO: The Graphからデータを取得する実装を追加
const mockBottles = [
  {
    id: 1,
    message: "海の向こうに何があるのだろう...",
    imageUrl: "https://example.com/bottle1.jpg",
    owner: "0x1234...5678"
  },
  {
    id: 2,
    message: "今日も穏やかな海だ",
    owner: "0x8765...4321"
  }
];

export const OceanView: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">海を眺める</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBottles.map((bottle) => (
          <BottleCard
            key={bottle.id}
            id={bottle.id}
            message={bottle.message}
            imageUrl={bottle.imageUrl}
            owner={bottle.owner}
          />
        ))}
      </div>
    </div>
  );
};
