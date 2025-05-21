'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWalletConnection } from '../stores/useWalletStore';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnectionProvider>
          {children}
        </WalletConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function WalletConnectionProvider({ children }: { children: React.ReactNode }) {
  useWalletConnection();
  return <>{children}</>;
}
