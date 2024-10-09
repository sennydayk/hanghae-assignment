import { CartItem } from '@/types/cartType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  calculateTotal,
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
} from './cartUtils';

interface CartState {
  cart: CartItem[];
  totalCount: number;
  totalPrice: number;
}

const initialState: CartState = {
  cart: [],
  totalCount: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (!userId) return;
      const prevCartItems = getCartFromLocalStorage(userId);
      const total = calculateTotal(prevCartItems);
      state.cart = prevCartItems;
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
    },
    resetCart: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      resetCartAtLocalStorage(userId);
      state.cart = [];
      state.totalCount = 0;
      state.totalPrice = 0;
    },
    addCartItem: (
      state,
      action: PayloadAction<{ item: CartItem; userId: string; count: number }>
    ) => {
      const { item, userId, count } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].count += count;
      } else {
        state.cart.push({ ...item, count });
      }
      const total = calculateTotal(state.cart);
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
      setCartToLocalStorage(state.cart, userId);
    },
    removeCartItem: (
      state,
      action: PayloadAction<{ itemId: string; userId: string }>
    ) => {
      const { itemId, userId } = action.payload;
      state.cart = state.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(state.cart);
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
      setCartToLocalStorage(state.cart, userId);
    },
    changeCartItemCount: (
      state,
      action: PayloadAction<{ itemId: string; count: number; userId: string }>
    ) => {
      const { itemId, count, userId } = action.payload;
      const itemIndex = state.cart.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        state.cart[itemIndex].count = count;
        const total = calculateTotal(state.cart);
        state.totalCount = total.totalCount;
        state.totalPrice = total.totalPrice;
        setCartToLocalStorage(state.cart, userId);
      }
    },
  },
});

export const {
  initCart,
  resetCart,
  addCartItem,
  removeCartItem,
  changeCartItemCount,
} = cartSlice.actions;

export default cartSlice.reducer;
