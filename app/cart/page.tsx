import CartModal from 'components/cart/modal';
import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';

export default async function CartPage() {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = cartId ? await getCart(cartId) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="py-16">
        <h1 className="text-3xl font-bold tracking-tight text-[#6B5E4C] mb-8">Shopping Cart</h1>
        <CartModal initialCart={cart} isCartPage={true} />
      </div>
    </div>
  );
} 