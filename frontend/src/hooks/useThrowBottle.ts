import { useCallback } from 'react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { OCEAN_CONTRACT_ADDRESS, OCEAN_ABI } from '../constants/contracts';

export const useThrowBottle = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const throwBottle = useCallback(async (uri: string): Promise<void> => {
    try {
      await writeContractAsync({
        address: OCEAN_CONTRACT_ADDRESS as `0x${string}`,
        abi: OCEAN_ABI,
        functionName: 'mintAndAssign',
        args: [uri],
      });
      toast.success('小瓶を流しました！');
    } catch (err: unknown) {
      throw err;
    }
  }, [writeContractAsync]);

  return { throwBottle, isLoading: isPending };
};
