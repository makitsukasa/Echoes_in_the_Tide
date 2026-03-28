import { polygonAmoy } from 'viem/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';

const projectId = 'a1375d06956bdf6f3658945bc76a989f';

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  connectors: [
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
        icons: ['https://makitsukasa.github.io/Echoes_in_the_Tide/bottle.webp'],
      },
      showQrModal: true,
    }),
  ],
});

// WalletConnect コネクタの getProvider は呼び出すたびに switchChain を試みる。
// すでに正しいチェーンにいる場合はスキップし、不要なチェーン切り替えエラーを防ぐ。
if (typeof window !== 'undefined') {
  const wcConnector = wagmiConfig.connectors.find(c => c.id === 'walletConnect') as any;
  if (wcConnector && typeof wcConnector.getProvider === 'function') {
    const origGetProvider = (wcConnector.getProvider as Function).bind(wcConnector);
    wcConnector.getProvider = async ({ chainId }: { chainId?: number } = {}) => {
      // まずチェーン切り替えなしでプロバイダを取得
      const provider = await origGetProvider();
      const providerChainId = (provider as any)?.chainId;
      // プロバイダが既に目的のチェーンにいる場合はスキップ
      if (chainId && providerChainId !== chainId) {
        await wcConnector.switchChain?.({ chainId }).catch((e: unknown) => {
          console.warn('[wagmi patch] switchChain failed:', e);
        });
      }
      return provider;
    };
  }
}
