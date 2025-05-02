import { BrowserProvider, Contract, ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from './contract-config';
import { getSigner } from './wallet';

// OceanコントラクトにmintAndAssignを実行する
export async function mintAndAssignToOcean(tokenURI: string): Promise<ethers.ContractTransactionReceipt> {
  try {
    const signer = await getSigner()
    if (!signer) {
      throw new Error('ウォレットに接続できませんでした');
    }

    // コントラクトの初期化
    console.log('Initializing contract...');
    const oceanContract = new Contract(CONTRACT_ADDRESSES.OCEAN, CONTRACT_ABIS.OCEAN, signer);
    console.log('Contract initialized');

    // ガス代の見積もり
    console.log('Estimating gas...');
    const gasEstimate = await oceanContract.mintAndAssign.estimateGas(tokenURI);
    console.log('Estimated gas:', gasEstimate.toString());

    // トランザクションの実行
    console.log('Executing transaction...');
    try {
      // トランザクションデータの構築
      const iface = new ethers.Interface(CONTRACT_ABIS.OCEAN);
      const data = iface.encodeFunctionData("mintAndAssign", [tokenURI]);

      // トランザクションの送信
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESSES.OCEAN,
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
    const signer = await getSigner()
    if (!signer) {
      throw new Error('ウォレットに接続できませんでした');
    }

    const oceanContract = new Contract(
      CONTRACT_ADDRESSES.OCEAN,
      CONTRACT_ABIS.OCEAN,
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
