import { BrowserProvider, Contract } from 'ethers';

// コントラクトのアドレス
const oceanAddress = "0xA01f4A6b456122e1e745d113e61aaBe1AbEfB422";   // Ocean コントラクトのアドレス

// ABI（インターフェース定義）
const oceanABI = [
  "function mintAndAssign(address to, string memory tokenURI) external",
  "function claim(uint256 tokenId) external"
];

// グローバルprovider/signer（キャッシュ用）
let provider;
let signer;

// MetaMaskと接続する
export async function connectWallet() {
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    return true;
  } else {
    alert('MetaMaskをインストールしてください');
    return false;
  }
}

// ウォレットアドレスを取得する
export async function getWalletAddress() {
  if (!signer) {
    const connected = await connectWallet();
    if (!connected) return null;
  }
  return await signer.getAddress();
}

// OceanコントラクトにmintAndAssignを実行する
export async function mintAndAssignToOcean(tokenURI) {
  if (!signer) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const address = await signer.getAddress();
  const oceanContract = new Contract(oceanAddress, oceanABI, signer);
  const tx = await oceanContract.mintAndAssign(address, tokenURI);
  await tx.wait();
  console.log('Bottle assigned to ocean successfully');
}

// Oceanコントラクトのclaimを実行する
export async function claimBottle(tokenId) {
  if (!signer) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const oceanContract = new Contract(oceanAddress, oceanABI, signer);
  const tx = await oceanContract.claim(tokenId);
  await tx.wait();
  console.log(`Bottle with ID ${tokenId} claimed successfully`);
}
