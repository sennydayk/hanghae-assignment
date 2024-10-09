import { RootState } from '@/store';

export const selectMinPrice = (state: RootState) => state.filter.minPrice;
export const selectMaxPrice = (state: RootState) => state.filter.maxPrice;
export const selectTitle = (state: RootState) => state.filter.title;
export const selectCategoryId = (state: RootState) => state.filter.categoryId;
export const selectFilter = (state: RootState) => state.filter;
