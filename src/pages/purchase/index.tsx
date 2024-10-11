import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageRoutes } from "@/apiRoutes";
import { PHONE_PATTERN } from "@/constants";
import { Layout, authStatusType } from "@/pages/common/components/Layout";
import { ItemList } from "@/pages/purchase/components/ItemList";
import { Payment } from "@/pages/purchase/components/Payment";
import { ShippingInformationForm } from "@/pages/purchase/components/ShippingInformationForm";
import { useAuthStore } from "@/store/auth/authSlice";
import useToastStore from "@/store/toast/toastSlice";
import { usePurchaseMutation } from "@/hooks/usePurchase";

export interface FormData {
  name: string;
  address: string;
  phone: string;
  requests: string;
  payment: string;
}

export interface FormErrors {
  phone: string;
}

export const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);

  const [formData, setFormData] = useState<FormData>({
    name: user?.displayName ?? "",
    address: "",
    phone: "",
    requests: "",
    payment: "accountTransfer",
  });

  const [errors, setErrors] = useState<FormErrors>({ phone: "" });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const { mutate: purchase, isPending, isError, error } = usePurchaseMutation();

  useEffect(() => {
    const { address, phone } = formData;
    const isPhoneValid = PHONE_PATTERN.test(phone);
    setIsFormValid(address.trim() !== "" && isPhoneValid);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") {
      if (!PHONE_PATTERN.test(value) && value !== "") {
        setErrors((prev) => ({
          ...prev,
          phone: "-를 포함한 휴대폰 번호만 가능합니다",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleClickPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    const purchaseData = {
      ...formData,
      totalAmount: 0, // This should be calculated based on the cart items
      paymentMethod: formData.payment,
      shippingAddress: formData.address,
    };

    purchase(
      { purchaseData, userId: user.uid },
      {
        onSuccess: () => {
          showToast("구매가 완료되었습니다.", "success");
          navigate(pageRoutes.main);
        },
        onError: (error) => {
          showToast(`구매에 실패했습니다: ${error.message}`, "error");
        },
      }
    );
  };

  return (
    <Layout
      containerClassName="pt-[30px]"
      authStatus={authStatusType.NEED_LOGIN}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleClickPurchase}>
            <ShippingInformationForm
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
            <ItemList />
            <Payment
              paymentMethod={formData.payment}
              onPaymentMethodChange={handleInputChange}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isPending || !isFormValid}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "구매하기"
                )}
              </Button>
            </div>
            {isError && <p className="text-red-500 mt-2">{error?.message}</p>}
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
