import { useCallback } from 'react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { OCEAN_CONTRACT_ADDRESS, OCEAN_ABI } from '../constants/contracts';

export const useClaimBottle = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const claimBottle = useCallback(async (tokenId: string | number | bigint): Promise<void> => {
    try {
      await writeContractAsync({
        address: OCEAN_CONTRACT_ADDRESS as `0x${string}`,
        abi: OCEAN_ABI,
        functionName: 'claim',
        args: [BigInt(tokenId.toString())],
      });
      toast.success('小瓶を拾いました！');
    } catch (err) {
      console.error('[useClaimBottle] claimエラー:', err);
      if (err instanceof Error && err.message.includes('Not drifting in the ocean')) {
        toast.error('すでに誰かに拾われました');
      } else if (err instanceof Error && err.message.includes('Chain not configured')) {
        toast.error('Polygon Amoy に切り替えてから接続し直してください');
      } else if (err instanceof Error && err.message.toLowerCase().includes('user rejected')) {
        toast.error('トランザクションがキャンセルされました');
      } else {
        toast.error('小瓶を拾うのに失敗しました');
      }
      throw err;
    }
  }, [writeContractAsync]);

  return { claimBottle, isLoading: isPending };
};
