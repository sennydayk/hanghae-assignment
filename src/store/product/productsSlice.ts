import { create } from "zustand";
import { IProduct, NewProductDTO } from "@/api/dtos/productDTO";
import { addProductAPI, fetchProducts } from "@/api/product";
import { ProductFilter } from "@/types/productType";

interface ProductState {
  items: IProduct[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;

  loadProducts: (
    filter: ProductFilter,
    pageSize: number,
    page: number,
    isInitial: boolean
  ) => Promise<void>;
  addProduct: (productData: NewProductDTO) => Promise<void>;
}

const useProductStore = create<ProductState>((set) => ({
  items: [],
  hasNextPage: true,
  isLoading: false,
  error: null,
  totalCount: 0,

  loadProducts: async (filter, pageSize, page, isInitial) => {
    set({ isLoading: true });
    try {
      const result = await fetchProducts(filter, pageSize, page);
      set((state) => ({
        items: isInitial
          ? result.products
          : [...state.items, ...result.products],
        hasNextPage: result.hasNextPage,
        totalCount: result.totalCount,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to load products",
      });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const newProduct = await addProductAPI(productData);
      set((state) => ({
        items: [newProduct, ...state.items],
        totalCount: state.totalCount + 1,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "상품 등록에 실패하였습니다.",
      });
    }
  },
}));

export default useProductStore;
