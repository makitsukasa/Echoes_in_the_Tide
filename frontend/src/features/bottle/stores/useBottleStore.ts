import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BottleData } from '../../../types/BottleType';
import { useEncryptedFilebaseStore } from '../../../utils/encryption';
import type { WalletClient, Account } from 'viem';

interface BottleStore {
  bottles: BottleData[];
  isLoading: boolean;
  error: Error | null;
  lastFetched: number | null;
  filebaseConfig: { apiKey: string } | null;

  fetchBottles: (excludedSender?: string) => Promise<void>;
  refreshBottles: (excludedSender?: string) => Promise<void>;
  getBottleById: (id: string) => BottleData | undefined;
  loadConfig: (walletClient: WalletClient, account: Account) => Promise<void>;
  setConfig: (config: { apiKey: string } | null) => void;
  saveConfig: (walletClient: WalletClient, account: Account, config: { apiKey: string }) => Promise<void>;
  clearConfig: () => void;
}

export const useBottleStore = create<BottleStore>()(
  persist(
    (set, get) => ({
      bottles: [],
      isLoading: false,
      error: null,
      lastFetched: null,
      filebaseConfig: null,

      setConfig: (config) => {
        set({ filebaseConfig: config });
      },

      loadConfig: async (walletClient, account) => {
        try {
          const config = await useEncryptedFilebaseStore.getState().loadConfig(walletClient, account);
          set({ filebaseConfig: config });
        } catch (error) {
          console.error('Failed to load Filebase config:', error);
          set({ filebaseConfig: null });
        }
      },

      saveConfig: async (walletClient, account, config) => {
        try {
          await useEncryptedFilebaseStore.getState().encryptAndStoreConfig(config, walletClient, account);
          set({ filebaseConfig: config });
        } catch (error) {
          console.error('Failed to save Filebase config:', error);
          throw error;
        }
      },

      clearConfig: () => {
        useEncryptedFilebaseStore.getState().clearConfig();
        set({ filebaseConfig: null });
      },

      fetchBottles: async (excludedSender) => {
        try {
          set({ isLoading: true, error: null });
          const { fetchBottles } = await import('../../../utils/subgraph');
          const bottles = await fetchBottles(excludedSender);
          set({
            bottles,
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            error: error as Error,
            isLoading: false,
            lastFetched: null,
          });
        }
      },

      refreshBottles: async (excludedSender) => {
        const { fetchBottles } = get();
        await fetchBottles(excludedSender);
      },

      getBottleById: (id) => {
        const { bottles } = get();
        return bottles.find((bottle) => bottle.id === id);
      },
    }),
    {
      name: 'bottle-store'
    }
  )
);
