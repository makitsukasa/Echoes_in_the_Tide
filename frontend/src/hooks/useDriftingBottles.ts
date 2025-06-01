import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useBottleStore } from '../stores/useBottleStore';
import { BottleData } from '../types/BottleType';
import { useClaimBottle } from './useClaimBottle';

export const useDriftingBottles = () => {
  const { bottles, isLoading, error, fetchBottles } = useBottleStore();
  const [selectedBottle, setSelectedBottle] = useState<BottleData | null>(null);
  const { claimBottle, isLoading: isClaiming } = useClaimBottle();
  const { address: myAddress } = useAccount();

  useEffect(() => {
    fetchBottles(myAddress);
  }, [fetchBottles, myAddress]);

  const handleClaim = async (bottle: BottleData) => {
    try {
      await claimBottle(bottle.id);
      setSelectedBottle(null);
      fetchBottles(myAddress);
    } catch {
      // エラーは useClaimBottle 内でハンドリング済み
    }
  };

  return {
    bottles,
    isLoading,
    error,
    selectedBottle,
    setSelectedBottle,
    handleClaim,
    isClaiming,
  };
};
