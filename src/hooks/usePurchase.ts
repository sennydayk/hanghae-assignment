import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { makePurchase } from "@/api/purchase";
import { PurchaseDTO } from "@/api/dtos/purchaseDTO";
import useCartStore from "@/store/cart/cartSlice";
import { useAuthStore } from "@/store/auth/authSlice";

interface PurchaseMutationData {
  purchaseData: PurchaseDTO;
  userId: string;
}

export const usePurchaseMutation = (): UseMutationResult<
  any,
  Error,
  PurchaseMutationData
> => {
  const { resetCart } = useCartStore();
  const { user } = useAuthStore();

  return useMutation<any, Error, PurchaseMutationData>({
    mutationFn: async ({ purchaseData, userId }: PurchaseMutationData) => {
      if (!user) throw new Error("User is not authenticated");
      const cart = useCartStore.getState().cart;
      return await makePurchase(purchaseData, userId, cart);
    },
    onSuccess: () => {
      resetCart(user!.uid);
    },
  });
};
