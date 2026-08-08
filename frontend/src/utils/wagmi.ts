import { polygon } from 'viem/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';

const projectId = 'a1375d06956bdf6f3658945bc76a989f';

export const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
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

// wagmi が公開している Connector 型には getProvider / switchChain の
// 具体的なシグネチャが無いため、パッチに必要な部分だけを構造的に宣言する。
interface WalletConnectProvider {
  chainId?: number;
}

interface PatchableWalletConnectConnector {
  getProvider: (params?: { chainId?: number }) => Promise<WalletConnectProvider>;
  switchChain?: (params: { chainId: number }) => Promise<unknown>;
}

// WalletConnect コネクタの getProvider は呼び出すたびに switchChain を試みる。
// すでに正しいチェーンにいる場合はスキップし、不要なチェーン切り替えエラーを防ぐ。
if (typeof window !== 'undefined') {
  const wcConnector = wagmiConfig.connectors.find(c => c.id === 'walletConnect') as unknown as
    | PatchableWalletConnectConnector
    | undefined;
  if (wcConnector && typeof wcConnector.getProvider === 'function') {
    const origGetProvider = wcConnector.getProvider.bind(wcConnector);
    wcConnector.getProvider = async ({ chainId }: { chainId?: number } = {}) => {
      // まずチェーン切り替えなしでプロバイダを取得
      const provider = await origGetProvider();
      const providerChainId = provider?.chainId;
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
