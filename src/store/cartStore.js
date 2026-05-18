import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const existing = get().cart.find((item) => item._id === product._id);

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item,
            ),
          });
        } else {
          set({
            cart: [
              ...get().cart,
              {
                ...product,
                quantity: 1,
              },
            ],
          });
        }
      },

      increaseQty: (id) => {
        set({
          cart: get().cart.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        });
      },

      decreaseQty: (id) => {
        set({
          cart: get().cart.map((item) =>
            item._id === id && item.quantity > 1
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item,
          ),
        });
      },

      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((item) => item._id !== id),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
