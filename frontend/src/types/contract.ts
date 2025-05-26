import { type Address } from 'viem';

export interface BottleContractConfig {
  address: Address;
  abi: readonly any[];
}

export interface ThrowBottleParams {
  message: string;
  imageHash: string | null;
}

export interface BottleMetadata {
  message: string;
  imageHash: string | null;
  timestamp: number;
}
