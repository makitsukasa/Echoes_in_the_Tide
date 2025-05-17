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
    console.log('signer.getAddress(): ' + await signer.getAddress());
    console.log('tokenURI: ' + tokenURI);

    try {
      // コントラクトの初期化
      const oceanContract = new Contract(
        CONTRACT_ADDRESSES.OCEAN,
        CONTRACT_ABIS.OCEAN,
        signer
      );

      // ガス代の見積もりを取得
      // const gasEstimate = await oceanContract.mintAndAssign.estimateGas(tokenURI);
      // console.log('Estimated gas:', gasEstimate.toString());

      // トランザクションの送信
      const tx = await oceanContract.mintAndAssign(tokenURI, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: any) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error.data) {
        console.error('Error data:', error.data);
      }
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.transaction) {
        console.error('Failed transaction:', error.transaction);
      }

      // エラーメッセージをより具体的に
      if (error.message?.includes('insufficient funds')) {
        throw new Error('ガス代が不足しています。MATICを追加してください。');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('トランザクションが拒否されました。');
      } else if (error.message?.includes('nonce')) {
        throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
      } else {
        throw new Error(`トランザクションの実行に失敗しました: ${error.message || '不明なエラー'}`);
      }
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

    console.log('Claiming bottle with tokenId:', tokenId);

    try {
      // コントラクトの初期化
      const oceanContract = new Contract(
        CONTRACT_ADDRESSES.OCEAN,
        CONTRACT_ABIS.OCEAN,
        signer
      );

      // ガス代の見積もりを取得
      // const gasEstimate = await oceanContract.claim.estimateGas(tokenId);
      // console.log('Estimated gas:', gasEstimate.toString());

      // トランザクションの送信
      const tx = await oceanContract.claim(tokenId, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: any) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error.data) {
        console.error('Error data:', error.data);
      }
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.transaction) {
        console.error('Failed transaction:', error.transaction);
      }

      // エラーメッセージをより具体的に
      if (error.message?.includes('insufficient funds')) {
        throw new Error('ガス代が不足しています。MATICを追加してください。');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('トランザクションが拒否されました。');
      } else if (error.message?.includes('nonce')) {
        throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
      } else {
        throw new Error(`トランザクションの実行に失敗しました: ${error.message || '不明なエラー'}`);
      }
    }
  } catch (error) {
    console.error('Error in claimBottle:', error);
    throw error;
  }
}
