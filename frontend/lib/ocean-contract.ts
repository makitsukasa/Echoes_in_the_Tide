import { Contract, ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from './contract-config';
import { getSigner } from './wallet';

export class OceanContract {
  private contract: Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new Contract(
      CONTRACT_ADDRESSES.OCEAN,
      CONTRACT_ABIS.OCEAN,
      signer
    );
  }

  async throwBottle(name: string, description: string): Promise<ethers.ContractTransactionReceipt> {
    try {
      const tx = await this.contract.mintAndAssign(description, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: unknown) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error && typeof error === 'object') {
        const err = error as { data?: unknown; message?: string; code?: unknown; transaction?: unknown };
        if (err.data) {
          console.error('Error data:', err.data);
        }
        if (err.message) {
          console.error('Error message:', err.message);
        }
        if (err.code) {
          console.error('Error code:', err.code);
        }
        if (err.transaction) {
          console.error('Failed transaction:', err.transaction);
        }

        // エラーメッセージをより具体的に
        if (err.message?.includes('insufficient funds')) {
          throw new Error('ガス代が不足しています。MATICを追加してください。');
        } else if (err.message?.includes('user rejected')) {
          throw new Error('トランザクションが拒否されました。');
        } else if (err.message?.includes('nonce')) {
          throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
        } else {
          throw new Error(`トランザクションの実行に失敗しました: ${err.message || '不明なエラー'}`);
        }
      }
      throw new Error('不明なエラーが発生しました');
    }
  }

  async claimBottle(tokenId: string): Promise<ethers.ContractTransactionReceipt> {
    try {
      const tx = await this.contract.claim(tokenId, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: unknown) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error && typeof error === 'object') {
        const err = error as { data?: unknown; message?: string; code?: unknown; transaction?: unknown };
        if (err.data) {
          console.error('Error data:', err.data);
        }
        if (err.message) {
          console.error('Error message:', err.message);
        }
        if (err.code) {
          console.error('Error code:', err.code);
        }
        if (err.transaction) {
          console.error('Failed transaction:', err.transaction);
        }

        // エラーメッセージをより具体的に
        if (err.message?.includes('insufficient funds')) {
          throw new Error('ガス代が不足しています。MATICを追加してください。');
        } else if (err.message?.includes('user rejected')) {
          throw new Error('トランザクションが拒否されました。');
        } else if (err.message?.includes('nonce')) {
          throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
        } else {
          throw new Error(`トランザクションの実行に失敗しました: ${err.message || '不明なエラー'}`);
        }
      }
      throw new Error('不明なエラーが発生しました');
    }
  }
}

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

      // トランザクションの送信
      const tx = await oceanContract.mintAndAssign(tokenURI, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: unknown) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error && typeof error === 'object') {
        const err = error as { data?: unknown; message?: string; code?: unknown; transaction?: unknown };
        if (err.data) {
          console.error('Error data:', err.data);
        }
        if (err.message) {
          console.error('Error message:', err.message);
        }
        if (err.code) {
          console.error('Error code:', err.code);
        }
        if (err.transaction) {
          console.error('Failed transaction:', err.transaction);
        }

        // エラーメッセージをより具体的に
        if (err.message?.includes('insufficient funds')) {
          throw new Error('ガス代が不足しています。MATICを追加してください。');
        } else if (err.message?.includes('user rejected')) {
          throw new Error('トランザクションが拒否されました。');
        } else if (err.message?.includes('nonce')) {
          throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
        } else {
          throw new Error(`トランザクションの実行に失敗しました: ${err.message || '不明なエラー'}`);
        }
      }
      throw new Error('不明なエラーが発生しました');
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

      // トランザクションの送信
      const tx = await oceanContract.claim(tokenId, {
        // gasLimit: Math.floor(Number(gasEstimate) * 1.5) // 50%のバッファを追加
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt as ethers.ContractTransactionReceipt;
    } catch (error: unknown) {
      console.error('Transaction execution error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      if (error && typeof error === 'object') {
        const err = error as { data?: unknown; message?: string; code?: unknown; transaction?: unknown };
        if (err.data) {
          console.error('Error data:', err.data);
        }
        if (err.message) {
          console.error('Error message:', err.message);
        }
        if (err.code) {
          console.error('Error code:', err.code);
        }
        if (err.transaction) {
          console.error('Failed transaction:', err.transaction);
        }

        // エラーメッセージをより具体的に
        if (err.message?.includes('insufficient funds')) {
          throw new Error('ガス代が不足しています。MATICを追加してください。');
        } else if (err.message?.includes('user rejected')) {
          throw new Error('トランザクションが拒否されました。');
        } else if (err.message?.includes('nonce')) {
          throw new Error('トランザクションの順序に問題があります。しばらく待ってから再試行してください。');
        } else {
          throw new Error(`トランザクションの実行に失敗しました: ${err.message || '不明なエラー'}`);
        }
      }
      throw new Error('不明なエラーが発生しました');
    }
  } catch (error) {
    console.error('Error in claimBottle:', error);
    throw error;
  }
}
