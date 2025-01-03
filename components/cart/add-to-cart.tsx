// components/cart/add-to-cart.tsx
'use client';

import { useActionState } from '@/hooks/useActionState';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useCart } from './cart-context';

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedVariant = useMemo(() => {
    if (!Object.keys(state).length) return null;

    return variants.find((variant) =>
      variant.selectedOptions.every((option) => state[option.name] === option.value)
    );
  }, [variants, state]);

  useEffect(() => {
    if (selectedVariant) {
      console.log('AddToCart - Selected Variant:', {
        id: selectedVariant.id,
        options: selectedVariant.selectedOptions,
        price: selectedVariant.price
      });
    }
  }, [selectedVariant]);

  const handleAddToCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!selectedVariant || !product.availableForSale || isSubmitting) return;

      setIsSubmitting(true);
      setIsSuccess(false);

      try {
        const result = await formAction({
          merchandiseId: selectedVariant.id,
          quantity: quantity
        });

        if (result === 'Success') {
          setIsSuccess(true);
          addCartItem({
            variant: selectedVariant,
            product,
            quantity
          });
          setTimeout(() => setIsSuccess(false), 2000);
        } else {
          throw new Error(`Add to Cart Failed: ${result}`);
        }
      } catch (error) {
        console.error('AddToCart: Error', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedVariant, product, quantity, addCartItem, formAction, isSubmitting]
  );

  return (
    <form onSubmit={handleAddToCart} className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
      {/* Quantity Controls */}
      <div className="flex h-[52px] items-center rounded-md border border-[#6B5E4C]/20 sm:w-auto">
        <button
          type="button"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="flex h-full w-16 items-center justify-center text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5 sm:w-12"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-16 overflow-hidden text-center font-medium text-[#6B5E4C] sm:w-12">
          {quantity}
        </div>
        <button
          type="button"
          onClick={() => setQuantity((prev) => prev + 1)}
          className="flex h-full w-16 items-center justify-center text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5 sm:w-12"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!selectedVariant || !product.availableForSale || isSubmitting}
        className={`group relative flex h-[52px] w-full flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-8 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
          !selectedVariant || !product.availableForSale || isSubmitting
            ? 'cursor-not-allowed bg-gray-400'
            : isSuccess
            ? 'bg-green-500'
            : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span>Added to Cart!</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="relative z-10">
                {isSubmitting
                  ? 'Adding...'
                  : !selectedVariant
                  ? 'Select options'
                  : !product.availableForSale
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSuccess ? 0 : 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </form>
  );
}
