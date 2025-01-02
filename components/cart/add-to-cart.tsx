'use client';

import { useActionState } from '@/hooks/useActionState';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import { Product, ProductVariant } from 'lib/shopify/types';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { FormEvent, useEffect, useState, useTransition } from 'react';
import { useCart } from './cart-context';

export function AddToCart({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state, setState } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  useEffect(() => {
    if (variants.length > 0) {
      const defaultVariant = variants[0];
      if (defaultVariant) {
        const defaultOptions: { [key: string]: string } = {};
        defaultVariant.selectedOptions.forEach((option) => {
          defaultOptions[option.name.toLowerCase()] = option.value;
        });
        setState(defaultOptions);
      }
    }
  }, [variants, setState]);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

  // Debug state changes
  useEffect(() => {
    console.log('AddToCart state updated:', {
      state,
      selectedVariant: variant?.id,
      allVariants: variants.map((v) => ({
        id: v.id,
        options: v.selectedOptions
      }))
    });
  }, [state, variant, variants]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedVariantId || !finalVariant) {
      console.error('AddToCart: No variant selected', {
        selectedVariantId,
        finalVariant
      });
      return;
    }

    try {
      // Log the variant data before processing
      console.log('AddToCart: Submitting variant', {
        id: String(finalVariant.id),
        variant: finalVariant,
        state: state
      });

      if (variant) {
        addCartItem({
          variant: finalVariant,
          product,
          quantity: 1
        });
      }

      // Ensure we're passing a string ID
      const variantId = String(finalVariant.id);
      console.log('AddToCart: Sending to server', {
        variantId,
        type: typeof variantId
      });

      const result = await formAction(variantId, 1);

      if (result !== 'Success') {
        throw new Error(result);
      }

      console.log('AddToCart: Success', {
        result,
        variantId
      });
    } catch (error) {
      console.error('AddToCart: Error', {
        error,
        variant: finalVariant,
        state: state
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <div className="flex h-[52px] items-center rounded-md border border-[#6B5E4C]/20">
        <button
          type="button"
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-12 overflow-hidden text-center font-medium text-[#6B5E4C]">
          <div className="relative h-[20px]">
            <AnimatedNumber number={quantity} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setQuantity(prev => prev + 1)}
          className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!variant || !product.availableForSale || isPending}
        className={`group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
          !variant || !product.availableForSale || isPending
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="relative z-10">
          {isPending
            ? 'Adding...'
            : !variant
              ? 'Select options'
              : !product.availableForSale
                ? 'Out of Stock'
                : 'Add to Cart'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.button>
    </form>
  );
}

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-accent-600 p-4 tracking-wide text-primary-50';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

function AnimatedNumber({ number }: { number: number }) {
  return (
    <motion.span
      key={number}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{
        duration: 0.15,
        ease: 'easeInOut',
        opacity: { duration: 0.1 }
      }}
      className="absolute left-1/2 -translate-x-1/2"
    >
      {number}
    </motion.span>
  );
}
