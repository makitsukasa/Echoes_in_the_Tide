import { BottleContractConfig } from '../types/contract';

export const throwBottle = (
  writeContract: (config: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args: any[];
  }) => void,
  contractConfig: BottleContractConfig,
  uri: string
): void => {
  writeContract({
    ...contractConfig,
    functionName: 'mintAndAssign',
    args: [uri],
  });
};

export const claimBottle = (
  writeContract: (config: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args: any[];
  }) => void,
  contractConfig: BottleContractConfig,
  tokenId: string | number
): void => {
  writeContract({
    ...contractConfig,
    functionName: 'claim',
    args: [tokenId],
  });
};
