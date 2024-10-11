import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import { PaymentMethodTableRow } from "@/pages/purchase/components/PaymentMethodTableRow";
import useCartStore from "@/store/cart/cartSlice";
import { formatPrice } from "@/utils/formatter";
import { CartItem } from "@/types/cartType";

interface PaymentProps {
  paymentMethod: string;
  onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Payment = ({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentProps) => {
  // Cart 상태에서 장바구니 항목 가져오기
  const cart = useCartStore((state) => state.cart);
  const shippingCost = 3000;

  // 총 가격 계산
  const getTotalPrice = () => {
    const totalPrice = cart.reduce((acc, item: CartItem) => {
      return acc + item.price * item.count;
    }, 0);
    return formatPrice(totalPrice + shippingCost);
  };

  const getCartTotalPrice = () => {
    return cart.reduce((acc, item: CartItem) => {
      return acc + item.price * item.count;
    }, 0);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-6 w-6" />
          결제정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">총상품가격</TableCell>
              <TableCell>{formatPrice(getCartTotalPrice())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">배송비</TableCell>
              <TableCell>{formatPrice(shippingCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">총결제금액</TableCell>
              <TableCell>{getTotalPrice()}</TableCell>
            </TableRow>
            <PaymentMethodTableRow
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
