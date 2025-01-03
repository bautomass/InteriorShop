'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  data: { 
    merchandiseId: string; 
    quantity: number;
    attributes?: { key: string; value: string }[];
  }
) {
  try {
    console.log('Server Action - Received data:', data);

    if (!data?.merchandiseId) {
      throw new Error('No variant ID provided');
    }

    // Check if request is coming from cart page
    const headersList = headers();
    const referer = headersList.get('referer') || '';
    const isFromCartPage = referer.includes('/cart');

    let cartId = cookies().get('cartId')?.value;
    let cart;

    if (!cartId) {
      cart = await createCart();
      if (!cart?.id) throw new Error('Failed to create cart');
      cartId = cart.id;
      cookies().set('cartId', cart.id);
    }

    const lines = [{
      merchandiseId: data.merchandiseId,
      quantity: data.quantity,
      // Apply 10% discount if coming from cart page
      attributes: isFromCartPage ? [
        {
          key: '_discount',
          value: '10'
        }
      ] : []
    }];

    console.log('Server Action - Cart lines:', lines);

    cart = await addToCart(cartId, lines);

    if (!cart) {
      throw new Error('Failed to add item to cart');
    }

    revalidateTag(TAGS.cart);
    return 'Success';
  } catch (e) {
    console.error('Server Action - Error:', e);
    return `Error: ${e instanceof Error ? e.message : 'Failed to add item to cart'}`;
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

    const result = await removeFromCart(cartId, [lineItem.id]);
    if (!result) {
      throw new Error('Failed to remove item from cart');
    }

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
