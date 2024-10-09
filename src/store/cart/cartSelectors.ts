import { RootState } from '@/store';

export const selectCart = (state: RootState) => state.cart.cart;
export const selectTotalCount = (state: RootState) => state.cart.totalCount;
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice;
