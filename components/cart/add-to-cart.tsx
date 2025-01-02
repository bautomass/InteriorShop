//components/cart/add-to-cart.tsx
'use client';

import { useActionState } from '@/hooks/useActionState';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { FormEvent } from 'react';
import { useCart } from './cart-context';

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedVariantId || !finalVariant) {
      console.error('No variant selected:', { selectedVariantId, finalVariant });
      return;
    }

    try {
      // Debug log
      console.log('Debug - Variant Details:', {
        product,
        variant,
        finalVariant,
        selectedVariantId,
        finalVariantId: finalVariant.id,
        variants: variants.map((v) => ({ id: v.id, title: v.title }))
      });

      if (variant) {
        addCartItem({
          variant: finalVariant,
          product,
          quantity: 1
        });
      }

      // Use the full variant ID structure
      const result = await formAction(
        String(finalVariant.id).startsWith('gid://')
          ? finalVariant.id
          : `gid://shopify/ProductVariant/${finalVariant.id}`,
        1
      );

      console.log('Add to cart result:', result);

      if (result !== 'Success') {
        throw new Error(result);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedVariantId || !finalVariant) {
  //     console.error('No variant selected');
  //     return;
  //   }

  //   try {
  //     // Log the initial variant ID
  //     console.log('Initial variant info:', {
  //       selectedVariantId,
  //       finalVariantId: finalVariant.id,
  //       type: typeof selectedVariantId
  //     });

  //     if (variant) {
  //       addCartItem({
  //         variant: finalVariant,
  //         product,
  //         quantity: 1
  //       });
  //     }

  //     // Pass the full variant ID
  //     const result = await formAction(finalVariant.id, 1);
  //     if (result !== 'Success') {
  //       throw new Error(result);
  //     }
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
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
