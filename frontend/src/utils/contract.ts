import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { OCEAN_CONTRACT_ADDRESS, OCEAN_ABI } from '../constants/contracts';
import { BottleContractConfig, ThrowBottleParams } from '../types/contract';
import { useCallback } from 'react';

export const useThrowBottle = ({ description, image }: ThrowBottleParams) => {
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

  const throwBottle = (uri: string) => {
    return writeContract({
      ...contractConfig,
      functionName: 'mintAndAssign',
      args: [uri],
    });
  };

  return { throwBottle, isLoading: isPending, error };
};

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
      onError: (error: Error) => {
        toast.error('小瓶を拾うのに失敗しました');
        console.error(error);
      },
    },
  });

  const claimBottle = useCallback((tokenId: string | number) => {
    return writeContract({
      ...contractConfig,
      functionName: 'claim',
      args: [tokenId],
    });
  }, [writeContract]);

  return { claimBottle, isLoading: isPending, error };
};
