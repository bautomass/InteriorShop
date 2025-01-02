'use client';

import { useActionState } from '@/hooks/useActionState';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { FormEvent, useCallback, useMemo } from 'react';
import { useCart } from './cart-context';

// Helper functions
const ensureVariantId = (id: string): string => {
  const prefix = 'gid://shopify/ProductVariant/';
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
};

// Types
interface SubmitButtonProps {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  // Memoize variant selection logic
  const { variant, selectedVariantId, finalVariant } = useMemo(() => {
    const selectedVariant = variants.find((v: ProductVariant) =>
      v.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
    );

    const defaultId = variants.length === 1 ? variants[0]?.id : undefined;
    const selectedId = selectedVariant?.id || defaultId;
    const finalSelectedVariant = variants.find((v) => v.id === selectedId);

    return {
      variant: selectedVariant,
      selectedVariantId: selectedId,
      finalVariant: finalSelectedVariant
    };
  }, [variants, state]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!selectedVariantId || !finalVariant) {
        console.error('AddToCart: No variant selected', {
          selectedVariantId,
          variantData: finalVariant
        });
        return;
      }

      try {
        // Ensure we're working with a complete variant ID
        const formattedVariantId = ensureVariantId(finalVariant.id);

        console.log('AddToCart: Processing', {
          originalId: finalVariant.id,
          formattedId: formattedVariantId,
          variant: finalVariant
        });

        // Update local cart state first
        if (variant) {
          addCartItem({
            variant: finalVariant,
            product,
            quantity: 1
          });
        }

        // Send to server
        const result = await formAction(formattedVariantId, 1);

        if (result !== 'Success') {
          throw new Error(result);
        }

        console.log('AddToCart: Success', {
          variantId: formattedVariantId,
          result
        });
      } catch (error) {
        console.error('AddToCart: Error', {
          error,
          variant: finalVariant,
          id: selectedVariantId
        });
      }
    },
    [selectedVariantId, finalVariant, variant, addCartItem, product, formAction]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

// Separated button component with proper typing
function SubmitButton({ availableForSale, selectedVariantId }: SubmitButtonProps) {
  const buttonClasses = useMemo(
    () => ({
      base: 'relative flex w-full items-center justify-center rounded-full bg-accent-600 p-4 tracking-wide text-primary-50',
      disabled: 'cursor-not-allowed opacity-60 hover:opacity-60',
      hover: 'hover:opacity-90'
    }),
    []
  );

  const iconWrapper = useMemo(
    () => (
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
    ),
    []
  );

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses.base, buttonClasses.disabled)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses.base, buttonClasses.disabled)}
      >
        {iconWrapper}
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      className={clsx(buttonClasses.base, buttonClasses.hover)}
    >
      {iconWrapper}
      Add To Cart
    </button>
  );
}

// //components/cart/add-to-cart.tsx
// 'use client';

// import { useActionState } from '@/hooks/useActionState';
// import { PlusIcon } from '@heroicons/react/24/outline';
// import clsx from 'clsx';
// import { addItem } from 'components/cart/actions';
// import { useProduct } from 'components/product/product-context';
// import { Product, ProductVariant } from 'lib/shopify/types';
// import { FormEvent } from 'react';
// import { useCart } from './cart-context';

// export function AddToCart({ product }: { product: Product }) {
//   const { variants, availableForSale } = product;
//   const { addCartItem } = useCart();
//   const { state } = useProduct();
//   const [message, formAction] = useActionState(addItem, null);

//   // Find selected variant
//   const variant = variants.find((variant: ProductVariant) =>
//     variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
//   );
//   const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
//   const selectedVariantId = variant?.id || defaultVariantId;
//   const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

//   // Debug logs right after variant selection
//   console.log('🔍 Variants Debug:', {
//     allVariants: variants.map((v) => ({ id: v.id, title: v.title })),
//     selectedVariant: variant,
//     defaultVariantId,
//     selectedVariantId,
//     finalVariant
//   });

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!selectedVariantId || !finalVariant) {
//       console.error('No variant selected:', {
//         selectedVariantId,
//         finalVariant
//       });
//       return;
//     }

//     try {
//       console.log('🛍️ Submitting variant:', {
//         id: finalVariant.id,
//         type: typeof finalVariant.id,
//         variant: finalVariant
//       });

//       if (variant) {
//         addCartItem({
//           variant: finalVariant,
//           product,
//           quantity: 1
//         });
//       }

//       const result = await formAction(finalVariant.id, 1);
//       console.log('🛍️ Form action result:', result);

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
