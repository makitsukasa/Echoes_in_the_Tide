import { useEffect, useState } from 'react';
import { useBottleStore } from '../stores/useBottleStore';
import { useAccount } from 'wagmi';
import { Bottle } from '../types/BottleType';

export const useMyBottles = () => {
  const { userBottles, isLoading, error, fetchUserBottles } = useBottleStore();
  const { isConnected, address } = useAccount();
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserBottles(address);
    }
  }, [isConnected, address, fetchUserBottles]);

  return {
    isConnected,
    isLoading,
    error,
    bottles: userBottles,
    selectedBottle,
    setSelectedBottle,
  };
};
