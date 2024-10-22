import { create } from 'zustand'

export const useContextStore = create((set, get) => ({
  context: undefined,
  setContext: (context) => set((state) => ({ context })),
}))