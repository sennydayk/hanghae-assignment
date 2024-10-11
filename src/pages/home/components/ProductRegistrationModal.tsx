import { NewProductDTO } from "@/api/dtos/productDTO";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_CATEGORY_ID, categories } from "@/constants";
import { createNewProduct } from "@/helpers/product";
import useProductStore from "@/store/product/productsSlice";
import { uploadImage } from "@/utils/imageUpload";
import { useForm } from "react-hook-form";
import useToastStore from "@/store/toast/toastSlice";

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const ProductRegistrationModal: React.FC<
  ProductRegistrationModalProps
> = ({ isOpen, onClose, onProductAdded }) => {
  const addProduct = useProductStore((state) => state.addProduct);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewProductDTO>({
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      category: { id: "" },
      image: null,
    },
  });

  const product = watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue("image", file);
    }
  };

  const handleCategoryChange = (value: string): void => {
    setValue("category.id", value);
  };

  const onSubmit = async (data: NewProductDTO): Promise<void> => {
    try {
      if (!data.image) {
        throw new Error("이미지를 선택해야 합니다.");
      }
      const imageUrl = await uploadImage(data.image as File);
      if (!imageUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
      const newProduct = createNewProduct(data, imageUrl);
      addProduct(newProduct);
      onClose();
      onProductAdded();
      showToast("게시물이 등록되었습니다.", "success");
    } catch (error) {
      console.error("물품 등록에 실패했습니다.", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Input
              {...register("title", { required: "상품명을 입력해주세요" })}
              placeholder="상품명"
            />
            {errors.title && <span>{errors.title.message}</span>}

            <Input
              {...register("price", { required: "가격을 입력해주세요" })}
              type="number"
              placeholder="가격"
            />
            {errors.price && <span>{errors.price.message}</span>}

            <Textarea
              {...register("description", {
                required: "상품 설명을 입력해주세요",
              })}
              className="resize-none"
              placeholder="상품 설명"
            />
            {errors.description && <span>{errors.description.message}</span>}

            <Select
              onValueChange={handleCategoryChange}
              value={product.category.id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.id !== ALL_CATEGORY_ID)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.category && <span>카테고리를 선택해주세요</span>}

            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.image && <span>{errors.image.message}</span>}
          </div>
          <DialogFooter>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
