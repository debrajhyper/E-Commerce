import { create } from "zustand";
import { CART_STORE_NAME } from "@/constants";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Cart store
 * @note This store is persisted in session storage
 */
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            /**
             * The count of items in the cart
             */
            cartItemCount: 0,
            /**
             * Updates the count of items in the cart
             * @param {number} newCartItemCount - the new count of items in the cart
             */
            updateCartItemCount: (newCartItemCount: number) => {
                set({ cartItemCount: newCartItemCount });
            },
        }),
        {
            /**
             * The name of the store
             */
            name: CART_STORE_NAME,
            /**
             * The storage for the store
             */
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)