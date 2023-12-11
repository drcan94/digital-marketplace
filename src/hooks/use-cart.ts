import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TProduct = Product & { quantity: number };

export type CartItem = {
  product: TProduct;
};

export type CartState = {
  items: CartItem[];
  addItem: (product: TProduct) => void;
  removeItem: (productId: string) => void;
  removeAllSameIds: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const item = state.items.find(
            (item) => item.product.id === product.id
          );

          if (item) {
            item.product.quantity += 1;
            return { items: [...state.items] };
          }

          return {
            items: [...state.items, { product: { ...product, quantity: 1 } }],
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((item) => item.product.id === id);
          if (item && item.product.quantity > 1) {
            item.product.quantity -= 1;
            return { items: [...state.items] };
          }
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        }),
      removeAllSameIds: (id) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
