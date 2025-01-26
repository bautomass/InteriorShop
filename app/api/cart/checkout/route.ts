export const dynamic = 'force-dynamic'
import { getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cartId = cookies().get('cartId')?.value;
    const cart = await getCart(cartId);

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      checkoutUrl: cart.checkoutUrl
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout' },
      { status: 500 }
    );
  }
} 