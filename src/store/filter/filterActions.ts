import { createAction } from '@reduxjs/toolkit';

export const setMinPrice = createAction<number>('filter/setMinPrice');
export const setMaxPrice = createAction<number>('filter/setMaxPrice');
export const setTitle = createAction<string>('filter/setTitle');
export const setCategoryId = createAction<string>('filter/setCategoryId');
export const resetFilter = createAction('filter/resetFilter');
