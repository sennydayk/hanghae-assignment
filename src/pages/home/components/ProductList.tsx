import { IProduct } from "@/api/dtos/productDTO";
import { pageRoutes } from "@/apiRoutes";
import { Button } from "@/components/ui/button";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { extractIndexLink, isFirebaseIndexError } from "@/helpers/error";
import { useModal } from "@/hooks/useModal";
import { FirebaseIndexErrorModal } from "@/pages/error/components/FirebaseIndexErrorModal";
import { useAuthStore } from "@/store/auth/authSlice";
import useCartStore from "@/store/cart/cartSlice";
import useProductStore from "@/store/product/productsSlice";
import useFilterStore from "@/store/filter/filterSlice";
import { CartItem } from "@/types/cartType";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";
import { EmptyProduct } from "./EmptyProduct";
import { ProductCard } from "./ProductCard";
import { ProductRegistrationModal } from "./ProductRegistrationModal";

interface ProductListProps {
  pageSize?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  pageSize = PRODUCT_PAGE_SIZE,
}) => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] =
    useState<boolean>(false);
  const [indexLink, setIndexLink] = useState<string | null>(null);

  const products = useProductStore((state) => state.items);
  const hasNextPage = useProductStore((state) => state.hasNextPage);
  const isLoading = useProductStore((state) => state.isLoading);
  const totalCount = useProductStore((state) => state.totalCount);
  const loadProducts = useProductStore((state) => state.loadProducts);

  const filter = useFilterStore((state) => state);

  const user = useAuthStore((state) => state.user);
  const isLogin = useAuthStore((state) => state.isLogin);

  const addCartItem = useCartStore((state) => state.addCartItem);

  const loadProductsData = async (isInitial = false): Promise<void> => {
    try {
      const page = isInitial ? 1 : currentPage + 1;
      await loadProducts(filter, pageSize, page, isInitial);
      if (!isInitial) {
        setCurrentPage(page);
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (isFirebaseIndexError(errorMessage)) {
        const link = extractIndexLink(errorMessage);
        setIndexLink(link);
        setIsIndexErrorModalOpen(true);
      }
      throw error;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProductsData(true);
  }, [filter]);

  const handleCartAction = (product: IProduct): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
      console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handlePurchaseAction = (product: IProduct): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = (): void => {
    setCurrentPage(1);
    loadProductsData(true);
  };

  const firstProductImage = products[0]?.image;
  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          {isLogin && (
            <Button onClick={openModal}>
              <Plus className="mr-2 h-4 w-4" /> 상품 등록
            </Button>
          )}
        </div>
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard
                  key={`${product.id}_${index}`}
                  product={product}
                  onClickAddCartButton={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleCartAction(product);
                  }}
                  onClickPurchaseButton={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handlePurchaseAction(product);
                  }}
                />
              ))}
            </div>
            {hasNextPage && currentPage * pageSize < totalCount && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => loadProductsData()} disabled={isLoading}>
                  {isLoading ? "로딩 중..." : "더 보기"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
