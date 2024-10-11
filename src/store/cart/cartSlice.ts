import { create } from "zustand";
import { CartItem } from "@/types/cartType";
import {
  calculateTotal,
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
} from "./cartUtils";

interface CartState {
  cart: CartItem[];
  totalCount: number;
  totalPrice: number;
  initCart: (userId: string) => void;
  resetCart: (userId: string) => void;
  addCartItem: (item: CartItem, userId: string, count: number) => void;
  removeCartItem: (itemId: string, userId: string) => void;
  changeCartItemCount: (itemId: string, count: number, userId: string) => void;
}

const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  initCart: (userId: string) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  resetCart: (userId: string) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    });
  },

  addCartItem: (item: CartItem, userId: string, count: number) => {
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart = [...state.cart];
      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].count += count;
      } else {
        updatedCart.push({ ...item, count });
      }
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  removeCartItem: (itemId: string, userId: string) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  changeCartItemCount: (itemId: string, count: number, userId: string) => {
    set((state) => {
      const itemIndex = state.cart.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        let updatedCart = [...state.cart];
        updatedCart[itemIndex].count = count;
        const total = calculateTotal(updatedCart);
        setCartToLocalStorage(updatedCart, userId);
        return {
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        };
      }
      return state;
    });
  },
}));

export default useCartStore;
