import { BrowserProvider, ethers } from 'ethers';

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (eventName: string, callback: (accounts: string[]) => void) => void
  removeListener: (eventName: string, callback: (accounts: string[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

// グローバルprovider/signer（キャッシュ用）
let provider: BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;

// MetaMaskと接続する
export async function connectWallet(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Polygon Amoyネットワークの設定
      const chainId = '0x13882'; // Polygon AmoyのチェーンID
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      return true;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      return false;
    }
  } else {
    alert('MetaMaskをインストールしてください');
    return false;
  }
}

// 自動再接続を試みる
export async function tryAutoConnect(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // 既に接続されているアカウントを確認
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      }) as string[];

      if (accounts.length > 0) {
        // 接続済みの場合は自動的にproviderとsignerを初期化
        provider = new BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        return true;
      }
    } catch (error) {
      console.error('Error in auto connect:', error);
    }
  }
  return false;
}

// ウォレットアドレスを取得する
export async function getWalletAddress(): Promise<string | null> {
  if (!signer) {
    // まず自動再接続を試みる
    const autoConnected = await tryAutoConnect();
    if (!autoConnected) {
      // 自動再接続に失敗した場合は手動接続を試みる
      const connected = await connectWallet();
      if (!connected) return null;
    }
  }
  return await signer!.getAddress();
}

// サインアーを取得する
export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  if (!signer) {
    const autoConnected = await tryAutoConnect();
    if (!autoConnected) {
      const connected = await connectWallet();
      if (!connected) return null;
    }
  }
  return signer;
}
