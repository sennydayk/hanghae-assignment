import { RootState } from '@/store';

export const selectProducts = (state: RootState) => state.products.items;
export const selectHasNextPage = (state: RootState) =>
  state.products.hasNextPage;
export const selectIsLoading = (state: RootState) => state.products.isLoading;
export const selectError = (state: RootState) => state.products.error;
export const selectTotalCount = (state: RootState) => state.products.totalCount;
