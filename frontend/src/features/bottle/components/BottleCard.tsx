import React from 'react';
import { useClaimBottle } from '../../../utils/contract';
import { useWalletStore } from '../../../stores/useWalletStore';

interface BottleCardProps {
  id: number;
  message: string;
  imageUrl?: string;
  owner: string;
}

export const BottleCard: React.FC<BottleCardProps> = ({ id, message, imageUrl, owner }) => {
  const { isConnected } = useWalletStore();
  const { write: claimBottle, isLoading } = useClaimBottle(id);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Bottle ${id}`}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <p className="text-gray-700 mb-4">{message}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Owner: {owner.slice(0, 6)}...{owner.slice(-4)}</span>
        {isConnected && (
          <button
            onClick={() => claimBottle?.()}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Claiming...' : 'Claim'}
          </button>
        )}
      </div>
    </div>
  );
};
