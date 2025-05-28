import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { wagmiConfig } from '../utils/wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const queryClient = new QueryClient();

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        切断: {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  const metaMask = connectors.find((connector) => connector.name === 'MetaMask');
  const walletConnect = connectors.find((connector) => connector.name === 'WalletConnect');

  return (
    <div className="flex gap-2">
      {metaMask && (
        <button
          key={metaMask.uid}
          onClick={() => connect({ connector: metaMask })}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          MetaMaskで接続
        </button>
      )}
      {walletConnect && (
        <button
          key={walletConnect.uid}
          onClick={() => connect({ connector: walletConnect })}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          WalletConnectで接続
        </button>
      )}
    </div>
  );
}

export default function WalletConnectButton({ children }: { children?: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors duration={3000} />
        <ConnectButton />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
