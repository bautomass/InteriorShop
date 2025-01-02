'use client';

import { useActionState } from '@/hooks/useActionState';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { FormEvent, useEffect } from 'react';
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
// 'use client';

// import { useActionState } from '@/hooks/useActionState';
// import { PlusIcon } from '@heroicons/react/24/outline';
// import clsx from 'clsx';
// import { addItem } from 'components/cart/actions';
// import { useProduct } from 'components/product/product-context';
// import { Product, ProductVariant } from 'lib/shopify/types';
// import { FormEvent } from 'react';
// import { useCart } from './cart-context';

// // In add-to-cart.tsx
// const { state } = useProduct();

// export function AddToCart({ product }: { product: Product }) {
//   const { variants, availableForSale } = product;
//   const { addCartItem } = useCart();
//   const { state } = useProduct();
//   const [message, formAction] = useActionState(addItem, null);

//   const variant = variants.find((variant: ProductVariant) =>
//     variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
//   );
//   const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
//   const selectedVariantId = variant?.id || defaultVariantId;
//   const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!selectedVariantId || !finalVariant) {
//       console.error('No variant selected');
//       return;
//     }

//     try {
//       // Log the variant data before processing
//       console.log('Variant Debug:', {
//         id: String(finalVariant.id),
//         variant: finalVariant
//       });

//       if (variant) {
//         addCartItem({
//           variant: finalVariant,
//           product,
//           quantity: 1
//         });
//       }

//       // Pass the raw ID and let server action handle formatting
//       const result = await formAction(String(finalVariant.id), 1);
//       if (result !== 'Success') {
//         throw new Error(result);
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
//       <p aria-live="polite" className="sr-only" role="status">
//         {message}
//       </p>
//     </form>
//   );
// }

// function SubmitButton({
//   availableForSale,
//   selectedVariantId
// }: {
//   availableForSale: boolean;
//   selectedVariantId: string | undefined;
// }) {
//   const buttonClasses =
//     'relative flex w-full items-center justify-center rounded-full bg-accent-600 p-4 tracking-wide text-primary-50';
//   const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

//   if (!availableForSale) {
//     return (
//       <button disabled className={clsx(buttonClasses, disabledClasses)}>
//         Out Of Stock
//       </button>
//     );
//   }

//   if (!selectedVariantId) {
//     return (
//       <button
//         aria-label="Please select an option"
//         disabled
//         className={clsx(buttonClasses, disabledClasses)}
//       >
//         <div className="absolute left-0 ml-4">
//           <PlusIcon className="h-5" />
//         </div>
//         Add To Cart
//       </button>
//     );
//   }

//   return (
//     <button
//       type="submit"
//       aria-label="Add to cart"
//       className={clsx(buttonClasses, {
//         'hover:opacity-90': true
//       })}
//     >
//       <div className="absolute left-0 ml-4">
//         <PlusIcon className="h-5" />
//       </div>
//       Add To Cart
//     </button>
//   );
// }
