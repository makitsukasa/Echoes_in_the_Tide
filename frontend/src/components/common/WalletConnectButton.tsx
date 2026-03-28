import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { polygonAmoy } from 'viem/chains';
import { wagmiConfig } from '../../utils/wagmi';

function WalletConnectButtonInner() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, status, connector, chainId: accountChainId } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connectError) {
      console.error('接続エラー:', connectError);
    }
  }, [connectError]);

  // 接続後にチェーンが違う場合は自動で Amoy に切り替える
  useEffect(() => {
    if (!isConnected || !accountChainId || accountChainId === polygonAmoy.id || status !== 'connected') return;
    switchChain({ chainId: polygonAmoy.id });
  }, [isConnected, accountChainId, status, switchChain]);

  // WalletConnect セッションの namespace に polygonAmoy が含まれているか確認
  useEffect(() => {
    if (!isConnected || connector?.id !== 'walletConnect') return;

    const wcConnector = wagmiConfig.connectors.find(c => c.id === 'walletConnect');
    if (!wcConnector || typeof (wcConnector as { getProvider?: unknown }).getProvider !== 'function') return;
    (wcConnector as { getProvider: () => Promise<unknown> }).getProvider().then((provider: unknown) => {
      const p = provider as { session?: { namespaces?: { eip155?: { chains?: string[] } } } };
      const sessionChains = p?.session?.namespaces?.eip155?.chains ?? [];
      if (!sessionChains.includes(`eip155:${polygonAmoy.id}`)) {
        disconnect();
        toast.error('セッションに Polygon Amoy が含まれていません。Polygon Amoy をアクティブにして再接続してください');
      }
    }).catch(console.error);
  }, [isConnected, connector, disconnect]);

  if (!mounted) return null;

  const isConnecting = status === 'connecting';
  const isWrongChain = isConnected && accountChainId !== polygonAmoy.id;
  const isWalletConnect = connector?.id === 'walletConnect';

  const metaMask = connectors.find(c => c.type === 'injected' && c.name === 'MetaMask');
  const walletConnect = connectors.find(c => c.id === 'walletConnect');

  if (isConnected && address) {
    if (isWrongChain) {
      return (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              switchChain(
                { chainId: polygonAmoy.id },
                {
                  onSuccess: () => {
                    toast.success('Polygon Amoy に切り替えました');
                  },
                  onError: () => {
                    if (isWalletConnect) {
                      toast.error('切り替えに失敗しました。切断して Polygon Amoy をアクティブにしてから再接続してください');
                    } else {
                      toast.error('Polygon Amoy への切り替えに失敗しました。ウォレット側で切り替えてください');
                    }
                  },
                }
              );
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Polygon Amoyに切り替える
          </button>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            切断
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => disconnect()}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        切断: {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {metaMask && (
          <button
            onClick={() => connect({ connector: metaMask })}
            disabled={isConnecting}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {isConnecting ? '接続中...' : 'MetaMaskで接続'}
          </button>
        )}
        {walletConnect && (
          <button
            onClick={() => connect({ connector: walletConnect })}
            disabled={isConnecting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? '接続中...' : 'WalletConnectで接続'}
          </button>
        )}
      </div>
      {walletConnect && (
        <p className="text-xs text-gray-500">
          WalletConnect: QRコードを読む前に Polygon Amoy をアクティブにしてください
        </p>
      )}
    </div>
  );
}

const WalletConnectButton = dynamic(() => Promise.resolve(WalletConnectButtonInner), {
  ssr: false,
});

export default WalletConnectButton;
