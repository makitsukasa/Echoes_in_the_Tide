import React from 'react';
import { useWalletStore } from '../../../stores/useWalletStore';

// TODO: The Graphからデータを取得する実装を追加
const mockMyBottles = [
  {
    id: 3,
    message: "拾った小瓶のメッセージ",
    imageUrl: "https://example.com/bottle3.jpg",
    owner: "0x1234...5678"
  }
];

export const MyBottlesView: React.FC = () => {
  const { isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">拾った小瓶</h1>
        <p className="text-gray-600">ウォレットを接続してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">拾った小瓶</h1>
      {mockMyBottles.length === 0 ? (
        <p className="text-gray-600 text-center py-8">まだ小瓶を拾っていません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMyBottles.map((bottle) => (
            <div key={bottle.id} className="bg-white rounded-lg shadow-md p-4">
              {bottle.imageUrl && (
                <img
                  src={bottle.imageUrl}
                  alt={`Bottle ${bottle.id}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-gray-700 mb-4">{bottle.message}</p>
              <div className="text-sm text-gray-500">
                ID: {bottle.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
