import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'sonner';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, polygonAmoy } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [mainnet, polygon, polygonAmoy],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
