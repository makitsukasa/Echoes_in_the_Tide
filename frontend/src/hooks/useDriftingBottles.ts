import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useBottleStore } from '../stores/useBottleStore';
import { BottleData } from '../types/BottleType';
import { useClaimBottle } from './useClaimBottle';

export const useDriftingBottles = () => {
  const { bottles, isLoading, error, fetchBottles } = useBottleStore();
  const [selectedBottle, setSelectedBottle] = useState<BottleData | null>(null);
  const { claimBottle, isLoading: isClaiming } = useClaimBottle();
  const { address: myAddress, isConnected } = useAccount();

  useEffect(() => {
    fetchBottles(myAddress);
  }, [fetchBottles, myAddress]);

  const reload = useCallback(() => {
    fetchBottles(myAddress);
  }, [fetchBottles, myAddress]);

  const handleClaim = async (bottle: BottleData) => {
    try {
      await claimBottle(bottle.id);
      setSelectedBottle(null);
    } catch {
      // エラーメッセージは useClaimBottle 内で表示済み
    } finally {
      fetchBottles(myAddress);
    }
  };

  return {
    bottles,
    isLoading,
    isConnected,
    error,
    selectedBottle,
    setSelectedBottle,
    handleClaim,
    isClaiming,
    reload,
  };
};
