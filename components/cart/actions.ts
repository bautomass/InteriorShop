//components/cart/actions.ts

'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// export async function addItem(
//   prevState: any,
//   selectedVariantId: string | undefined,
//   quantity: number = 1
// ) {
//   console.log('Server action: addItem', { selectedVariantId, quantity });
  
//   try {
//     let cartId = cookies().get('cartId')?.value;
    
//     if (!cartId) {
//       console.log('Creating new cart...');
//       const cart = await createCart();
//       if (!cart?.id) {
//         throw new Error('Failed to create cart');
//       }
//       cartId = cart.id;
//       cookies().set('cartId', cart.id);
//     }

//     if (!selectedVariantId) {
//       throw new Error('No variant ID provided');
//     }

//     const result = await addToCart(cartId, [
//       { merchandiseId: selectedVariantId, quantity }
//     ]);
    
//     console.log('Add to cart result:', result);
    
//     if (!result) {
//       throw new Error('Failed to add to cart');
//     }
    
//     revalidateTag(TAGS.cart);
//     return 'Success';
//   } catch (e) {
//     console.error('Error adding to cart:', e);
//     return `Error: ${e instanceof Error ? e.message : 'Failed to add item to cart'}`;
//   }
// }

// export async function addItem(
//   prevState: any,
//   selectedVariantId: string | undefined,
//   quantity: number = 1
// ) {
//   console.log('Server action: addItem', { selectedVariantId, quantity });
  
//   let cartId = cookies().get('cartId')?.value;
//   let cart;
  
//   try {
//     if (!cartId) {
//       console.log('Creating new cart...');
//       cart = await createCart();
//       if (!cart?.id) {
//         throw new Error('Failed to create cart');
//       }
//       cartId = cart.id;
//       cookies().set('cartId', cart.id);
//     }

//     if (!selectedVariantId) {
//       throw new Error('No variant ID provided');
//     }

//     if (!cartId) {
//       throw new Error('No cart ID available');
//     }

//     const result = await addToCart(cartId, [
//       { merchandiseId: selectedVariantId, quantity }
//     ]);
    
//     console.log('Add to cart result:', result);
    
//     if (!result) {
//       throw new Error('Failed to add item to cart');
//     }
    
//     revalidateTag(TAGS.cart);
//     return 'Success';
//   } catch (e) {
//     console.error('Error in addItem:', e);
//     const errorMessage = e instanceof Error ? e.message : 'Failed to add item to cart';
//     return `Error: ${errorMessage}`;
//   }
// }

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
  quantity: number = 1
) {
  console.log('Server action: addItem', { selectedVariantId, quantity });
  
  let cartId = cookies().get('cartId')?.value;
  let cart;
  
  try {
    // Create cart if needed
    if (!cartId) {
      console.log('Creating new cart...');
      cart = await createCart();
      if (!cart?.id) {
        throw new Error('Failed to create cart');
      }
      cartId = cart.id;
      cookies().set('cartId', cart.id);
    }

    if (!selectedVariantId) {
      throw new Error('No variant ID provided');
    }

    // Add item to cart
    console.log('Adding item to cart...', { cartId, selectedVariantId, quantity });
    const result = await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity }
    ]);
    
    console.log('Add to cart result:', result);
    
    if (!result) {
      throw new Error('Failed to add item to cart');
    }
    
    revalidateTag(TAGS.cart);
    return 'Success';
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to add item to cart';
    console.error('Error in addItem:', errorMsg);
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















// //Cart Actions
// 'use server';

// import { TAGS } from 'lib/constants';
// import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
// import { revalidateTag } from 'next/cache';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

// export async function addItem(
//   prevState: any,
//   selectedVariantId: string | undefined,
//   quantity: number = 1
// ) {
//   console.log('Server action: addItem', { selectedVariantId, quantity });
  
//   let cartId = cookies().get('cartId')?.value;
  
//   if (!cartId) {
//     console.log('Creating new cart...');
//     const cart = await createCart();
//     if (!cart?.id) {
//       console.error('Failed to create cart');
//       return 'Error: Failed to create cart';
//     }
//     cartId = cart.id;
//     cookies().set('cartId', cart.id);
//   }

//   if (!selectedVariantId) {
//     console.error('No variant ID provided');
//     return 'Error: No variant ID';
//   }

//   try {
//     const result = await addToCart(cartId, [
//       { merchandiseId: selectedVariantId, quantity }
//     ]);
    
//     console.log('Add to cart result:', result);
    
//     if (!result) {
//       throw new Error('Failed to add to cart');
//     }
    
//     revalidateTag(TAGS.cart);
//     return 'Success';
//   } catch (e) {
//     console.error('Error adding to cart:', e);
//     return 'Error adding item to cart';
//   }
// }

// export async function removeItem(prevState: any, merchandiseId: string) {
//   let cartId = (await cookies()).get('cartId')?.value;

//   if (!cartId) {
//     return 'Missing cart ID';
//   }

//   try {
//     const cart = await getCart(cartId);

//     if (!cart) {
//       return 'Error fetching cart';
//     }

//     const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

//     if (lineItem && lineItem.id) {
//       await removeFromCart(cartId, [lineItem.id]);
//       revalidateTag(TAGS.cart);
//     } else {
//       return 'Item not found in cart';
//     }
//   } catch (e) {
//     return 'Error removing item from cart';
//   }
// }

// export async function updateItemQuantity(
//   prevState: any,
//   payload: {
//     merchandiseId: string;
//     quantity: number;
//   }
// ) {
//   let cartId = (await cookies()).get('cartId')?.value;

//   if (!cartId) {
//     return 'Missing cart ID';
//   }

//   const { merchandiseId, quantity } = payload;

//   try {
//     const cart = await getCart(cartId);

//     if (!cart) {
//       return 'Error fetching cart';
//     }

//     const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

//     if (lineItem && lineItem.id) {
//       if (quantity === 0) {
//         await removeFromCart(cartId, [lineItem.id]);
//       } else {
//         await updateCart(cartId, [
//           {
//             id: lineItem.id,
//             merchandiseId,
//             quantity
//           }
//         ]);
//       }
//     } else if (quantity > 0) {
//       // If the item doesn't exist in the cart and quantity > 0, add it
//       await addToCart(cartId, [{ merchandiseId, quantity }]);
//     }

//     revalidateTag(TAGS.cart);
//   } catch (e) {
//     console.error(e);
//     return 'Error updating item quantity';
//   }
// }

// export async function redirectToCheckout() {
//   let cartId = (await cookies()).get('cartId')?.value;

//   if (!cartId) {
//     return 'Missing cart ID';
//   }

//   let cart = await getCart(cartId);

//   if (!cart) {
//     return 'Error fetching cart';
//   }

//   redirect(cart.checkoutUrl);
// }

// export async function createCartAndSetCookie() {
//   let cart = await createCart();
//   (await cookies()).set('cartId', cart.id!);
// }
