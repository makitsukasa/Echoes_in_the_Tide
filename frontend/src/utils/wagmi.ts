import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit';
import { polygonAmoy } from 'viem/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';

const projectId = 'a1375d06956bdf6f3658945bc76a989f';

const connectors = [
  injected({
    target: 'metaMask',
    shimDisconnect: true,
  }),
  walletConnect({
    projectId,
    metadata: {
      name: '波打ち際の小瓶',
      description: '波打ち際の小瓶 - メッセージボトルアプリ',
      url: 'https://makitsukasa.github.io/Echoes_in_the_Tide',
      icons: ['https://makitsukasa.github.io/Echoes_in_the_Tide/bottle.webp']
    },
    qrModalOptions: {
      themeMode: 'light',
      themeVariables: {
        '--wcm-font-family': 'system-ui, sans-serif',
        '--wcm-accent-color': '#3b82f6',
        '--wcm-background-color': '#ffffff',
      },
    },
    showQrModal: true,
  })
];

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  connectors,
});

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [polygonAmoy],
  chains: [polygonAmoy],
  connectors,
});

export const reownConfig = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygonAmoy],
});
