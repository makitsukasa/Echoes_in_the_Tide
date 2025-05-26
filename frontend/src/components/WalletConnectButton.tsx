'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const WalletConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const handleDisconnect = () => {
    if (isConfirming) {
      disconnect();
      setIsConfirming(false);
      toast.success('ウォレットを切断しました');
    } else {
      setIsConfirming(true);
      toast.info('ウォレットを切断しますか？', {
        action: {
          label: '切断',
          onClick: () => {
            disconnect();
            setIsConfirming(false);
            toast.success('ウォレットを切断しました');
          },
        },
      });
    }
  };

  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {`接続済み ${address?.slice(0, 6)}...${address?.slice(-4)}`}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      ウォレットを接続
    </button>
  );
};

// クライアントサイドのみでレンダリング
export default dynamic(() => Promise.resolve(WalletConnectButton), {
  ssr: false,
});
