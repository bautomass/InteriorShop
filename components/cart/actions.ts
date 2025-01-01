//components/cart/actions.ts
'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
  quantity: number = 1
) {
  try {
    let cartId = cookies().get('cartId')?.value;
    console.log('Initial cartId:', cartId);

    // Create cart if it doesn't exist
    if (!cartId) {
      const cart = await createCart();
      console.log('Created new cart:', cart);
      if (!cart?.id) {
        throw new Error('Failed to create cart');
      }
      cartId = cart.id;
      cookies().set('cartId', cart.id, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
      });
    }

    if (!selectedVariantId) {
      throw new Error('No variant ID provided');
    }

    console.log('Selected variant ID:', selectedVariantId);

    // Safe variant ID formatting
    let formattedVariantId = String(selectedVariantId);
    if (!formattedVariantId.startsWith('gid://')) {
      // Remove any existing "ProductVariant/" prefix
      const cleanId = formattedVariantId.replace('ProductVariant/', '');
      formattedVariantId = `gid://shopify/ProductVariant/${cleanId}`;
    }

    console.log('Formatted variant ID:', formattedVariantId);

    // Add item to cart with formatted ID
    const result = await addToCart(cartId, [{ merchandiseId: formattedVariantId, quantity }]);

    console.log('Add to cart result:', result);

    if (!result?.id) {
      throw new Error('Failed to add item to cart');
    }

    revalidateTag(TAGS.cart);
    return 'Success';
  } catch (e) {
    console.error('Full error details:', e);
    const errorMsg = e instanceof Error ? e.message : 'Failed to add item to cart';
    return `Error: ${errorMsg}`;
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cartId = cookies().get('cartId')?.value;
    if (!cartId) {
      throw new Error('Missing cart ID');
    }

    const cart = await getCart(cartId);
    if (!cart) {
      throw new Error('Error fetching cart');
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);
    if (!lineItem?.id) {
      throw new Error('Item not found in cart');
    }

    await removeFromCart(cartId, [lineItem.id]);
    revalidateTag(TAGS.cart);
    return 'Success';
  } catch (e) {
    console.error('Error removing item:', e);
    return `Error: ${e instanceof Error ? e.message : 'Failed to remove item'}`;
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  try {
    const cartId = cookies().get('cartId')?.value;
    if (!cartId) {
      throw new Error('Missing cart ID');
    }

    const { merchandiseId, quantity } = payload;
    const cart = await getCart(cartId);

    if (!cart) {
      throw new Error('Error fetching cart');
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem?.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
    return 'Success';
  } catch (e) {
    console.error('Error updating quantity:', e);
    return `Error: ${e instanceof Error ? e.message : 'Failed to update quantity'}`;
  }
}

export async function redirectToCheckout() {
  try {
    const cartId = cookies().get('cartId')?.value;
    if (!cartId) {
      throw new Error('Missing cart ID');
    }

    const cart = await getCart(cartId);
    if (!cart) {
      throw new Error('Error fetching cart');
    }

    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL available');
    }

    redirect(cart.checkoutUrl);
  } catch (e) {
    console.error('Error redirecting to checkout:', e);
    return `Error: ${e instanceof Error ? e.message : 'Failed to redirect to checkout'}`;
  }
}

export async function createCartAndSetCookie() {
  try {
    const cart = await createCart();
    if (!cart?.id) {
      throw new Error('Failed to create cart');
    }
    cookies().set('cartId', cart.id);
    return 'Success';
  } catch (e) {
    console.error('Error creating cart:', e);
    return `Error: ${e instanceof Error ? e.message : 'Failed to create cart'}`;
  }
}
