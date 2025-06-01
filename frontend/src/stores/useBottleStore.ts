import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletClient, Account } from 'viem';
import { BottleData, Bottle } from '../types/BottleType';
import { useEncryptedFilebaseStore } from '../utils/encryption';
import { fetchDriftingBottles, fetchUserClaimedBottles } from '../utils/subgraph';

interface BottleStore {
  bottles: BottleData[];
  userBottles: Bottle[];
  filebaseConfig: { apiKey: string } | null;
  isLoading: boolean;
  error: Error | null;
  lastFetched: number | null;

  fetchBottles: (excludedSender?: string) => Promise<void>;
  fetchUserBottles: (address: string) => Promise<void>;
  getBottleById: (id: string) => BottleData | undefined;

  loadConfig: (walletClient: WalletClient, account: Account) => Promise<void>;
  saveConfig: (walletClient: WalletClient, account: Account, config: { apiKey: string }) => Promise<void>;
  setConfig: (config: { apiKey: string } | null) => void;
  clearConfig: () => void;
}

export const useBottleStore = create<BottleStore>()(persist((set, get) => ({
  bottles: [],
  userBottles: [],
  filebaseConfig: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchBottles: async (excludedSender) => {
    set({ isLoading: true, error: null });
    try {
      const bottles = await fetchDriftingBottles(excludedSender);
      // console.log(excludedSender, 'fetchBottles()', bottles);
      set({ bottles, lastFetched: Date.now(), isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchUserBottles: async (address) => {
    if (!address) {
      set({ error: new Error('ウォレットが接続されていません') });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const bottles = await fetchUserClaimedBottles(address);
      set({ userBottles: bottles, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  getBottleById: (id) => get().bottles.find(b => b.id === id),

  setConfig: (config) => set({ filebaseConfig: config }),

  loadConfig: async (walletClient, account) => {
    try {
      const config = await useEncryptedFilebaseStore.getState().loadConfig(walletClient, account);
      set({ filebaseConfig: config });
    } catch {
      set({ filebaseConfig: null });
    }
  },

  saveConfig: async (walletClient, account, config) => {
    await useEncryptedFilebaseStore.getState().encryptAndStoreConfig(config, walletClient, account);
    set({ filebaseConfig: config });
  },

  clearConfig: () => {
    useEncryptedFilebaseStore.getState().clearConfig();
    set({ filebaseConfig: null });
  },

}), { name: 'bottle-store' }));
