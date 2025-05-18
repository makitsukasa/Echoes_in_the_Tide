import { ethers } from 'ethers';
import { OceanContract } from "./ocean-contract"

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

// コントラクトのアドレス
const oceanAddress = "0xA01f4A6b456122e1e745d113e61aaBe1AbEfB422";   // Ocean コントラクトのアドレス

// ABI（インターフェース定義）
const oceanABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintAndAssign",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// グローバルprovider/signer（キャッシュ用）
const signer: ethers.JsonRpcSigner | null = null;

// MetaMaskと接続する
export async function connectWallet(): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      console.error("MetaMaskがインストールされていません")
      return false
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return Array.isArray(accounts) && accounts.length > 0
  } catch (error) {
    console.error("ウォレットの接続に失敗しました:", error)
    return false
  }
}

// 自動再接続を試みる
export async function tryAutoConnect(): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      return false
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return Array.isArray(accounts) && accounts.length > 0
  } catch (error) {
    console.error("自動再接続に失敗しました:", error)
    return false
  }
}

// ウォレットアドレスを取得する
export async function getWalletAddress(): Promise<string | null> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      return null
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null
  } catch (error) {
    console.error("ウォレットアドレスの取得に失敗しました:", error)
    return null
  }
}

// OceanコントラクトにmintAndAssignを実行する
export async function mintAndAssignToOcean(tokenURI: string): Promise<ethers.ContractTransactionReceipt> {
  try {
    if (!signer) {
      const connected = await connectWallet();
      if (!connected) throw new Error('ウォレットに接続できませんでした');
    }

    // トランザクションの実行
    console.log('Executing transaction...');
    try {
      // トランザクションデータの構築
      const iface = new ethers.Interface(oceanABI);
      const data = iface.encodeFunctionData("mintAndAssign", [tokenURI]);

      // トランザクションの送信
      const tx = await signer!.sendTransaction({
        to: oceanAddress,
        data: data,
      });

      console.log('Transaction hash:', tx.hash);

      // トランザクションの完了を待つ
      console.log('Waiting for transaction receipt...');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      return receipt as unknown as ethers.ContractTransactionReceipt;
    } catch (error) {
      console.error('Transaction execution error:', error);
      if (error instanceof Error) {
        console.error('Error data:', (error as unknown as { data: unknown }).data);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in mintAndAssignToOcean:', error);
    throw error;
  }
}

// Oceanコントラクトのclaimを実行する
export async function claimBottle(tokenId: string): Promise<ethers.ContractTransactionReceipt> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMaskがインストールされていません")
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const oceanContract = new OceanContract(signer)

    const receipt = await oceanContract.claimBottle(tokenId)
    console.log("Transaction receipt:", receipt)
    return receipt as unknown as ethers.ContractTransactionReceipt
  } catch (error) {
    console.error("小瓶を拾う際にエラーが発生しました:", error)
    throw error
  }
}
