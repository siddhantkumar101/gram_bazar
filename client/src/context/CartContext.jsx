import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addToCart: (listing, qty = 1) =>
    set((state) => ({
      items: [...state.items, { listing, qty }]
    })),
  clearCart: () => set({ items: [] })
}));
