import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ApiErrorBoundary } from "@/pages/common/components/ApiErrorBoundary";
import useFilterStore from "@/store/filter/filterSlice";
import { debounce } from "@/utils/common";
import { CategoryRadioGroup } from "./CategoryRadioGroup";
import { PriceRange } from "./PriceRange";
import { SearchBar } from "./SearchBar";

interface ProductFilterBoxProps {
  children: React.ReactNode;
}

const ProductFilterBox: React.FC<ProductFilterBoxProps> = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  // Zustand에서 상태와 액션 가져오기
  const categoryId = useFilterStore((state) => state.categoryId);
  const setCategoryId = useFilterStore((state) => state.setCategoryId);
  const setMinPrice = useFilterStore((state) => state.setMinPrice);
  const setMaxPrice = useFilterStore((state) => state.setMaxPrice);
  const setTitle = useFilterStore((state) => state.setTitle);

  const handleChangeInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value); // Zustand의 setTitle 함수 호출
    },
    300
  );

  const handlePriceChange = (
    actionCreator: typeof setMinPrice | typeof setMaxPrice
  ) =>
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        actionCreator(-1); // Zustand 액션 바로 호출
      } else {
        const numericValue = Math.max(0, parseInt(value, 10));
        if (!isNaN(numericValue)) {
          actionCreator(numericValue);
        }
      }
    }, 300);

  const handleMinPrice = handlePriceChange(setMinPrice);
  const handleMaxPrice = handlePriceChange(setMaxPrice);

  const handleChangeCategory = (value: string) => {
    if (value !== undefined) {
      setCategoryId(value); // Zustand의 setCategoryId 함수 호출
    } else {
      console.error("카테고리가 설정되지 않았습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="h-24 w-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={categoryId} // Zustand에서 가져온 categoryId 사용
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange
          onChangeMinPrice={handleMinPrice}
          onChangeMaxPrice={handleMaxPrice}
        />
      </ProductFilterBox>
    </div>
  );
};
