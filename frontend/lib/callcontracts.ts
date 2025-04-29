import { BrowserProvider, Contract, ethers } from 'ethers';

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

// ウォレットアドレスを取得する
export async function getWalletAddress(): Promise<string | null> {
  if (!signer) {
    const connected = await connectWallet();
    if (!connected) return null;
  }
  return await signer!.getAddress();
}

// OceanコントラクトにmintAndAssignを実行する
export async function mintAndAssignToOcean(tokenURI: string): Promise<ethers.ContractTransactionReceipt> {
  try {
    if (!signer) {
      const connected = await connectWallet();
      if (!connected) throw new Error('ウォレットに接続できませんでした');
    }

    // コントラクトの初期化
    console.log('Initializing contract...');
    const oceanContract = new Contract(oceanAddress, oceanABI, signer!);
    console.log('Contract initialized');

    // ガス代の見積もり
    console.log('Estimating gas...');
    const gasEstimate = await oceanContract.mintAndAssign.estimateGas(tokenURI);
    console.log('Estimated gas:', gasEstimate.toString());

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
        gasLimit: gasEstimate
      });

      console.log('Transaction hash:', tx.hash);

      // トランザクションの完了を待つ
      console.log('Waiting for transaction receipt...');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      return receipt!;
    } catch (error) {
      console.error('Transaction execution error:', error);
      if (error.data) {
        console.error('Error data:', error.data);
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
    if (!window.ethereum) {
      throw new Error('MetaMaskがインストールされていません');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const oceanContract = new ethers.Contract(
      oceanAddress,
      oceanABI,
      signer
    );

    console.log('Claiming bottle with tokenId:', tokenId);

    // ガス代の見積もりを取得
    const gasEstimate = await oceanContract.claim.estimateGas(tokenId);
    console.log('Estimated gas:', gasEstimate);

    // トランザクションをより単純な形式で送信
    const tx = await oceanContract.claim(tokenId, {
      gasLimit: gasEstimate
    });

    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    return receipt!;
  } catch (error) {
    console.error('Error in claimBottle:', error);
    if (error.code === -32603) {
      throw new Error('トランザクションの実行に失敗しました。ネットワークの状態を確認してください。');
    }
    throw error;
  }
}
