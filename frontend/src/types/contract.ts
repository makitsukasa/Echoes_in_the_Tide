import { type Address } from 'viem';

export interface BottleContractConfig {
  address: Address;
  abi: readonly any[];
}

export interface ThrowBottleParams {
  description: string;
  image: string | null;
}

export interface BottleMetadata {
  name: string;
  description: string;
  image: string | null;
}
