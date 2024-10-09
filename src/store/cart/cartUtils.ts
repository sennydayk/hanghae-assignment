import { getItem, setItem } from '@/helpers/localStorage';
import { CartItem } from '@/types/cartType';
import { parseJSON } from '@/utils/common';

const CART_LOCAL_STORAGE_KEY = 'CART_LOCAL_STORAGE_KEY';

export const getCartFromLocalStorage = (userId: string): CartItem[] => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  if (!cartData) {
    return [];
  }

  const cartItem = parseJSON(cartData) as { [key: string]: CartItem[] } | null;
  return cartItem?.[userId] ?? [];
};

export const resetCartAtLocalStorage = (userId: string): void => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  const cartItem = cartData
    ? (parseJSON(cartData) as { [key: string]: CartItem[] })
    : {};

  setItem(CART_LOCAL_STORAGE_KEY, {
    ...cartItem,
    [userId]: [],
  });
};

export const setCartToLocalStorage = (
  cart: CartItem[],
  userId: string
): void => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  const cartItem = cartData
    ? (parseJSON(cartData) as { [key: string]: CartItem[] })
    : {};

  setItem(CART_LOCAL_STORAGE_KEY, {
    ...cartItem,
    [userId]: cart,
  });
};

export const calculateTotal = (cart: CartItem[]) =>
  cart.reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.count,
      totalPrice: acc.totalPrice + item.price * item.count,
    }),
    { totalCount: 0, totalPrice: 0 }
  );
