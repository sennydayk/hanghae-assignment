import { IProduct } from '@/api/dtos/productDTO';
import { ProductSliceState } from '@/types/productType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addProduct, loadProducts } from './productsActions';

const initialState: ProductSliceState = {
  items: [],
  hasNextPage: true,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        loadProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: IProduct[];
            hasNextPage: boolean;
            totalCount: number;
            isInitial: boolean;
          }>
        ) => {
          const { products, hasNextPage, totalCount, isInitial } =
            action.payload;
          state.items = isInitial ? products : [...state.items, ...products];
          state.hasNextPage = hasNextPage;
          state.totalCount = totalCount;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(
        loadProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || 'Failed to load products';
        }
      )
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.items.unshift(action.payload);
          state.totalCount += 1;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(
        addProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || '상품 등록에 실패하였습니다.';
        }
      );
  },
});

export default productsSlice.reducer;
