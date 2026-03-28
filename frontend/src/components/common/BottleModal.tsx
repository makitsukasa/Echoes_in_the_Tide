import { MouseEvent } from 'react';
import { Bottle } from '../../types/BottleType';

interface BottleModalProps {
  bottle: Bottle;
  onClose: () => void;
  showClaimButton?: boolean;
  isConnected?: boolean;
  onClaim?: (bottle: Bottle) => void;
}

export default function BottleModal({ bottle, onClose, showClaimButton = false, isConnected = false, onClaim }: BottleModalProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
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
        {bottle.image ? (
          <img
            src={bottle.image}
            alt="小瓶の中身"
            className="w-full h-48 object-contain rounded-lg"
          />
        ) : (
          <img
            src={`${basePath}/bottle.webp`}
            alt="小瓶の中身"
            className="w-full h-48 object-contain rounded-lg"
          />
        )}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            {bottle.timestamp && (
              <p className="text-sm text-gray-500">{bottle.timestamp}</p>
            )}
            {showClaimButton && (
              <button
                onClick={() => isConnected && onClaim && onClaim(bottle)}
                disabled={!isConnected}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? '拾う' : 'ウォレットを接続してください'}
              </button>
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
    </div>
  );
}
