import { IProduct } from '@/api/dtos/productDTO';

export interface ProductFilter {
  categoryId: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSliceState {
  items: IProduct[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}
