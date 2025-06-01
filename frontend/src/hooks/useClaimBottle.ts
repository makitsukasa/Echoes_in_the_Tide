import { useCallback } from 'react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { OCEAN_CONTRACT_ADDRESS, OCEAN_ABI } from '../constants/contracts';
import { BottleContractConfig } from '../types/contract';
import { claimBottle as claimBottleLogic } from '../utils/constact';

export const useClaimBottle = () => {
  const contractConfig: BottleContractConfig = {
    address: OCEAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: OCEAN_ABI,
  };

  const { writeContract, isPending, error } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('小瓶を拾いました！');
      },
      onError: (err) => {
        toast.error('小瓶を拾うのに失敗しました');
        console.error(err);
      },
    },
  });

  const claimBottle = useCallback(
    (tokenId: string | number) => {
      claimBottleLogic(writeContract, contractConfig, tokenId);
    },
    [writeContract]
  );

  return { claimBottle, isLoading: isPending, error };
};
