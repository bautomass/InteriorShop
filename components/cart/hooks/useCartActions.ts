// hooks/useCartActions.ts
'use client';

import { useActionState } from '@/hooks/useActionState';
import { Product } from '@/lib/shopify/types';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useCallback, useState } from 'react';

const DISCOUNT_PERCENTAGE = 10;

export function useCartActions() {
  const [isAddingToCart, setIsAddingToCart] = useState<{[key: string]: boolean}>({});
  const [message, formAction] = useActionState(addItem, null);
  const { addCartItem } = useCart();

  const calculateDiscountedPrice = useCallback((originalPrice: string) => {
    const price = parseFloat(originalPrice);
    const discountedPrice = price * (1 - DISCOUNT_PERCENTAGE / 100);
    return discountedPrice.toFixed(2);
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    try {
      const defaultVariant = product.variants[0];
      
      if (!defaultVariant?.id) {
        console.error('No variant available for product:', product.title);
        return;
      }

      setIsAddingToCart(prev => ({ ...prev, [product.id]: true }));
      
      const result = await formAction({
        merchandiseId: defaultVariant.id,
        quantity: 1,
        attributes: [{ key: '_discount', value: '10' }]
      });

      if (result === 'Success') {
        const discountedVariant = {
          ...defaultVariant,
          price: {
            ...defaultVariant.price,
            amount: calculateDiscountedPrice(defaultVariant.price.amount)
          }
        };

        addCartItem({
          variant: discountedVariant,
          product,
          quantity: 1
        });
        
        setTimeout(() => {
          setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [formAction, addCartItem, calculateDiscountedPrice]);

  return {
    isAddingToCart,
    addToCart,
    calculateDiscountedPrice
  };
}