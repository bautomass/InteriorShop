// hooks/useServerCart.ts
'use client';

import { Cart } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { useEffect, useState } from 'react';

export function useServerCart() {
  const [serverCart, setServerCart] = useState<Cart | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { cart: contextCart } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setServerCart(data.cart);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  return {
    cart: contextCart || serverCart,
    isLoading
  };
}