import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit';
import { polygonAmoy } from 'viem/chains';
import { walletConnect, injected } from 'wagmi/connectors';

const projectId = 'a1375d06956bdf6f3658945bc76a989f';

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [polygonAmoy],
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

export const reownConfig = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygonAmoy],
});
