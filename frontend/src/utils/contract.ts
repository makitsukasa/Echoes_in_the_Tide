import { BOTTLE_ABI, BOTTLE_CONTRACT_ADDRESS, OCEAN_ABI, OCEAN_CONTRACT_ADDRESS } from '../constants/contracts';
import { useContractRead, useContractWrite } from 'wagmi';

export const useMintBottle = () => {
  return useContractWrite({
    abi: BOTTLE_ABI,
    address: BOTTLE_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'mint',
  });
};

export const useClaimBottle = (bottleId: number) => {
  return useContractWrite({
    abi: OCEAN_ABI,
    address: OCEAN_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'claim',
    args: [bottleId],
  });
};

export const useGetBottleOwner = (bottleId: number) => {
  return useContractRead({
    abi: BOTTLE_ABI,
    address: BOTTLE_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'ownerOf',
    args: [bottleId],
  });
};
