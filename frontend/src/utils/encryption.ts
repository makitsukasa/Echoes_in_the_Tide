import { toast } from 'sonner';
import { type WalletClient, type Account, verifyMessage } from 'viem';

const LOCAL_STORAGE_KEY = 'encrypted_filebase_config';
const SESSION_STORAGE_KEY = 'filebase_api_key';

interface FilebaseConfig {
  apiKey: string;
}

export const encryptAndStoreConfig = async (
  config: FilebaseConfig,
  walletClient: WalletClient,
  account: Account
): Promise<void> => {
  try {
    // 設定をJSON文字列に変換
    const configStr = JSON.stringify(config);

    // 署名を取得
    const signature = await walletClient.signMessage({
      account,
      message: configStr
    });

    // 署名と設定を保存
    const encryptedData = {
      signature,
      config: configStr,
      address: account.address
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(encryptedData));
    sessionStorage.setItem(SESSION_STORAGE_KEY, config.apiKey);
    toast.success('設定を保存しました');
  } catch (error) {
    console.error('設定の暗号化に失敗しました:', error);
    toast.error('設定の保存に失敗しました');
    throw error;
  }
};

export const getStoredConfig = async (
  walletClient: WalletClient,
  account: Account
): Promise<FilebaseConfig | null> => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedData) return null;

    const { signature, config: configStr, address } = JSON.parse(storedData);

    // アドレスの検証
    if (address.toLowerCase() !== account.address.toLowerCase()) {
      toast.error('設定の検証に失敗しました');
      return null;
    }

    // 署名を検証
    const isValid = await verifyMessage({
      address: account.address,
      message: configStr,
      signature
    });

    if (!isValid) {
      toast.error('設定の検証に失敗しました');
      return null;
    }

    const config = JSON.parse(configStr);
    // セッションストレージにも保存
    sessionStorage.setItem(SESSION_STORAGE_KEY, config.apiKey);
    return config;
  } catch (error) {
    console.error('設定の復号化に失敗しました:', error);
    toast.error('設定の読み込みに失敗しました');
    return null;
  }
};

export const clearStoredConfig = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  toast.success('設定を削除しました');
};
