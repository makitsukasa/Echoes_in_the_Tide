import { toast } from 'sonner';
import { type WalletClient, type Account } from 'viem';
import CryptoJS from 'crypto-js';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const LOCAL_STORAGE_KEY = 'encrypted_filebase_config';
export const SESSION_STORAGE_KEY = 'filebase_api_key';

export interface FilebaseConfig {
  apiKey: string;
}

interface EncryptedFilebaseState {
  encryptedData: {
    ciphertext: string;
    signature: string;
    address: string;
  } | null;
  sessionApiKey: string | null;
}

interface EncryptedFilebaseStore extends EncryptedFilebaseState {
  loadConfig: (walletClient: WalletClient, account: Account) => Promise<FilebaseConfig | null>;
  encryptAndStoreConfig: (config: FilebaseConfig, walletClient: WalletClient, account: Account) => Promise<void>;
  clearConfig: () => void;
}

export const useEncryptedFilebaseStore = create<EncryptedFilebaseStore>()(
  persist(
    (set, get) => ({
      encryptedData: null,
      sessionApiKey: null,

      loadConfig: async (walletClient: WalletClient, account: Account): Promise<FilebaseConfig | null> => {
        // まずセッションストレージを確認
        const sessionApiKey = get().sessionApiKey;
        if (sessionApiKey) {
          return { apiKey: sessionApiKey };
        }

        try {
          const encryptedData = get().encryptedData;
          if (!encryptedData) return null;

          if (encryptedData.address.toLowerCase() !== account.address.toLowerCase()) {
            return null;
          }

          const key = CryptoJS.SHA256(encryptedData.signature).toString();
          const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key).toString(CryptoJS.enc.Utf8);
          if (!decrypted) return null;

          const config = JSON.parse(decrypted);
          set({ sessionApiKey: config.apiKey });
          return config;
        } catch (error) {
          console.error('設定の読み込みに失敗しました:', error);
          return null;
        }
      },

      encryptAndStoreConfig: async (
        config: FilebaseConfig,
        walletClient: WalletClient,
        account: Account
      ): Promise<void> => {
        try {
          const configStr = JSON.stringify(config);

          const signature = await walletClient.signMessage({
            account,
            message: 'Encrypt filebase config'
          });

          const key = CryptoJS.SHA256(signature).toString();
          const ciphertext = CryptoJS.AES.encrypt(configStr, key).toString();

          const encryptedData = {
            ciphertext,
            signature,
            address: account.address
          };

          set({
            encryptedData,
            sessionApiKey: config.apiKey
          });
          toast.success('設定を保存しました');
        } catch (error) {
          console.error('設定の暗号化に失敗しました:', error);
          toast.error('設定の保存に失敗しました');
          throw error;
        }
      },

      clearConfig: (): void => {
        set({
          encryptedData: null,
          sessionApiKey: null
        });
        toast.success('設定を削除しました');
      }
    }),
    {
      name: 'encrypted-filebase-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        encryptedData: state.encryptedData,
        sessionApiKey: state.sessionApiKey
      })
    }
  )
);

export const getStoredConfig = async (
  walletClient: WalletClient,
  account: Account
): Promise<FilebaseConfig | null> => {
  return useEncryptedFilebaseStore.getState().loadConfig(walletClient, account);
};

export const clearStoredConfig = (): void => {
  useEncryptedFilebaseStore.getState().clearConfig();
};
