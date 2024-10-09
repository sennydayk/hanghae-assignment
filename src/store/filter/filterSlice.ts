import { ALL_CATEGORY_ID } from '@/constants';
import { ProductFilter } from '@/types/productType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  resetFilter,
  setCategoryId,
  setMaxPrice,
  setMinPrice,
  setTitle,
} from './filterActions';

const initialState: ProductFilter = {
  minPrice: 0,
  maxPrice: 0,
  title: '',
  categoryId: ALL_CATEGORY_ID,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setMinPrice, (state, action: PayloadAction<number>) => {
        state.minPrice = action.payload;
      })
      .addCase(setMaxPrice, (state, action: PayloadAction<number>) => {
        state.maxPrice = action.payload;
      })
      .addCase(setTitle, (state, action: PayloadAction<string>) => {
        state.title = action.payload;
      })
      .addCase(setCategoryId, (state, action: PayloadAction<string>) => {
        state.categoryId = action.payload;
      })
      .addCase(resetFilter, () => initialState);
  },
});

export default filterSlice.reducer;
