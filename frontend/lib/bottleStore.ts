import { create } from 'zustand'
import { Bottle } from "@/types/bottle"

interface BottleState {
  selectedBottle: Bottle | null
  setSelectedBottle: (bottle: Bottle | null) => void
  isThrowModalOpen: boolean
  setIsThrowModalOpen: (isOpen: boolean) => void
}

export const useBottleStore = create<BottleState>((set) => ({
  selectedBottle: null,
  setSelectedBottle: (bottle) => set({ selectedBottle: bottle }),
  isThrowModalOpen: false,
  setIsThrowModalOpen: (isOpen) => set({ isThrowModalOpen: isOpen }),
}))
