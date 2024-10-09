import { CartTable } from '@/pages/cart/components/CartTable';
import { EmptyNotice } from '@/pages/cart/components/EmptyNotice';
import { Layout, authStatusType } from '@/pages/common/components/Layout';
import { selectCart } from '@/store/cart/cartSelectors';
import { useAppSelector } from '@/store/hooks';

export const Cart = () => {
  const cart = useAppSelector(selectCart);
  const isExist = cart.length > 0;

  return (
    <Layout
      containerClassName="p-2.5 flex flex-col"
      authStatus={authStatusType.NEED_LOGIN}
    >
      {isExist ? <CartTable /> : <EmptyNotice />}
    </Layout>
  );
};
