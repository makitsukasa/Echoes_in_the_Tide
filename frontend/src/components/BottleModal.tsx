import { MouseEvent } from 'react';

interface Bottle {
  id: string;
  description: string;
  image?: string;
  timestamp?: string;
}

interface BottleModalProps {
  bottle: Bottle;
  onClose: () => void;
}

export default function BottleModal({ bottle, onClose }: BottleModalProps) {
  const handleModalClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">小瓶の中身</h2>
        <p className="text-gray-700 mb-4">{bottle.description}</p>
        {bottle.image && (
          <img
            src={bottle.image}
            alt="小瓶の中身"
            className="w-full h-48 object-contain rounded-lg"
          />
        )}
        <div className="mt-4 flex justify-between items-center">
          {bottle.timestamp && (
            <p className="text-sm text-gray-500">{bottle.timestamp}</p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
