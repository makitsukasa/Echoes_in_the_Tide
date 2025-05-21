import { create } from 'zustand';
import { useAccount } from 'wagmi';
import React from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | undefined;
  setWalletState: (isConnected: boolean, address: string | undefined) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: undefined,
  setWalletState: (isConnected, address) => set({ isConnected, address }),
}));

// ウォレット接続状態を監視するフック
export const useWalletConnection = () => {
  const { address, isConnected } = useAccount();
  const setWalletState = useWalletStore((state) => state.setWalletState);

  React.useEffect(() => {
    setWalletState(isConnected, address);
  }, [isConnected, address, setWalletState]);
};
