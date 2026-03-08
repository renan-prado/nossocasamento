import { create } from "zustand";

export type CartItem = {
  giftId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (giftId: string) => void;
  decrementItem: (giftId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.giftId === item.giftId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.giftId === item.giftId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (giftId) => {
    set((state) => ({
      items: state.items.filter((i) => i.giftId !== giftId),
    }));
  },

  decrementItem: (giftId) => {
    set((state) => {
      const item = state.items.find((i) => i.giftId === giftId);
      if (!item) return state;
      if (item.quantity <= 1) {
        return { items: state.items.filter((i) => i.giftId !== giftId) };
      }
      return {
        items: state.items.map((i) =>
          i.giftId === giftId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
