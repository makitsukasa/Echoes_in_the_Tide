import { useCallback } from 'react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { OCEAN_CONTRACT_ADDRESS, OCEAN_ABI } from '../constants/contracts';
import { BottleContractConfig } from '../types/contract';
import { throwBottle as throwBottleLogic } from '../utils/constact';

export const useThrowBottle = () => {
  const contractConfig: BottleContractConfig = {
    address: OCEAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: OCEAN_ABI,
  };

  const { writeContract, isPending, error } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('小瓶を流しました！');
      },
      onError: (error: Error) => {
        toast.error('小瓶を流すのに失敗しました');
        console.error(error);
      },
    },
  });

  const throwBottle = useCallback(
    (uri: string) => {
      throwBottleLogic(writeContract, contractConfig, uri);
    },
    [writeContract]
  );

  return { throwBottle, isLoading: isPending, error };
};
