import React from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { useWalletStore } from '../stores/useWalletStore';

export const ConnectButton: React.FC = () => {
  const { isConnected } = useWalletStore();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        切断
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      接続
    </button>
  );
};
