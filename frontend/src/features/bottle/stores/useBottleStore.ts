import { create } from 'zustand';
import { BottleData } from '../../../types/BottleType';

interface BottleStore {
  bottles: BottleData[];
  isLoading: boolean;
  error: Error | null;
  lastFetched: number | null;
  fetchBottles: (excludedSender?: string) => Promise<void>;
  refreshBottles: (excludedSender?: string) => Promise<void>;
  getBottleById: (id: string) => BottleData | undefined;
  filebaseConfig: {
    apiKey: string;
  } | null;
}

export const useBottleStore = create<BottleStore>((set, get) => ({
  bottles: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  filebaseConfig: null,

  fetchBottles: async (excludedSender?: string) => {
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

  refreshBottles: async (excludedSender?: string) => {
    const { fetchBottles } = get();
    await fetchBottles(excludedSender);
  },

  getBottleById: (id: string) => {
    const { bottles } = get();
    return bottles.find(bottle => bottle.id === id);
  },
}));
