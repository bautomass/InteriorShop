'use client';

import { useActionState } from '@/hooks/useActionState';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useCart } from './cart-context';

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVariant = useMemo(() => {
    if (!Object.keys(state).length) return null;

    return variants.find((variant) =>
      variant.selectedOptions.every((option) => state[option.name] === option.value)
    );
  }, [variants, state]);

  useEffect(() => {
    console.log('AddToCart state updated:', {
      selectedVariant: selectedVariant?.id,
      state,
      allOptions: product.options.map((opt) => opt.name),
      selectedOptionCount: Object.keys(state).length,
      requiredOptionCount: product.options.length
    });
  }, [state, selectedVariant, product.options]);

  const handleAddToCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!selectedVariant || !product.availableForSale || isSubmitting) {
        console.log('AddToCart: Invalid variant or product not available');
        return;
      }

      setIsSubmitting(true);

      try {
        console.log('Adding to cart:', {
          variantId: selectedVariant.id,
          quantity
        });

        // Send server action with full variant ID
        const result = await formAction(selectedVariant.id, quantity);
        console.log('Server action result:', result);

        if (result === 'Success') {
          // Only update UI if server action succeeds
          addCartItem({
            variant: selectedVariant,
            product,
            quantity
          });
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
    <form onSubmit={handleAddToCart} className="flex items-center gap-4">
      {/* Quantity Controls */}
      <div className="flex h-[52px] items-center rounded-md border border-[#6B5E4C]/20">
        <button
          type="button"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
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
          onClick={() => setQuantity((prev) => prev + 1)}
          className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
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
        className={`group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
          !selectedVariant || !product.availableForSale || isSubmitting
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
        }`}
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.button>
    </form>
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















// // components/cart/add-to-cart.tsx
// 'use client';

// import { useActionState } from '@/hooks/useActionState';
// import { addItem } from 'components/cart/actions';
// import { useProduct } from 'components/product/product-context';
// import { motion } from 'framer-motion';
// import { Product, ProductVariant } from 'lib/shopify/types';
// import { Minus, Plus, ShoppingCart } from 'lucide-react';
// import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
// import { useCart } from './cart-context';

// export function AddToCart({ product }: { product: Product }) {
//   const [quantity, setQuantity] = useState(1);
//   const { variants, availableForSale } = product;
//   const { addCartItem } = useCart();
//   const { state } = useProduct();
//   const [message, formAction] = useActionState(addItem, null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const selectedVariant = useMemo(() => {
//     if (!Object.keys(state).length) return null;

//     return variants.find((variant: ProductVariant) =>
//       variant.selectedOptions.every((option) => state[option.name] === option.value)
//     );
//   }, [variants, state]);

//   useEffect(() => {
//     console.log('AddToCart state updated:', {
//       selectedVariant: selectedVariant?.id,
//       state,
//       allOptions: product.options.map((opt) => opt.name),
//       selectedOptionCount: Object.keys(state).length,
//       requiredOptionCount: product.options.length
//     });
//   }, [state, selectedVariant, product.options]);

//   const handleAddToCart = useCallback(
//     async (e: FormEvent) => {
//       e.preventDefault();

//       if (!selectedVariant || !product.availableForSale || isSubmitting) {
//         console.log('AddToCart: Invalid variant or product not available');
//         return;
//       }

//       setIsSubmitting(true);

//       try {
//         // Ensure we're using the full Shopify variant ID
//         const variantId = selectedVariant.id;

//         console.log('Adding to cart:', {
//           variantId,
//           quantity,
//           selectedVariant
//         });

//         // Send server action first
//         const result = await formAction(variantId, quantity);
//         console.log('Server action result:', result);

//         if (result === 'Success') {
//           // Only update UI if server action succeeds
//           addCartItem({
//             variant: selectedVariant,
//             product,
//             quantity
//           });
//         } else {
//           throw new Error(`Add to Cart Failed: ${result}`);
//         }
//       } catch (error) {
//         console.error('AddToCart: Error', error);
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [selectedVariant, product, quantity, addCartItem, formAction, isSubmitting]
//   );

//   return (
//     <form onSubmit={handleAddToCart} className="flex items-center gap-4">
//       <div className="flex h-[52px] items-center rounded-md border border-[#6B5E4C]/20">
//         <button
//           type="button"
//           onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//           className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
//         >
//           <Minus className="h-4 w-4" />
//         </button>
//         <div className="relative w-12 overflow-hidden text-center font-medium text-[#6B5E4C]">
//           <div className="relative h-[20px]">
//             <AnimatedNumber number={quantity} />
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={() => setQuantity((prev) => prev + 1)}
//           className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
//         >
//           <Plus className="h-4 w-4" />
//         </button>
//       </div>

//       <motion.button
//         type="submit"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         disabled={!selectedVariant || !product.availableForSale || isSubmitting}
//         className={`group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
//           !selectedVariant || !product.availableForSale || isSubmitting
//             ? 'cursor-not-allowed bg-gray-400'
//             : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
//         }`}
//       >
//         <ShoppingCart className="h-5 w-5" />
//         <span className="relative z-10">
//           {isSubmitting
//             ? 'Adding...'
//             : !selectedVariant
//               ? 'Select options'
//               : !product.availableForSale
//                 ? 'Out of Stock'
//                 : 'Add to Cart'}
//         </span>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//       </motion.button>
//     </form>
//   );
// }

// function AnimatedNumber({ number }: { number: number }) {
//   return (
//     <motion.span
//       key={number}
//       initial={{ y: 10, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{ y: -10, opacity: 0 }}
//       transition={{
//         duration: 0.15,
//         ease: 'easeInOut',
//         opacity: { duration: 0.1 }
//       }}
//       className="absolute left-1/2 -translate-x-1/2"
//     >
//       {number}
//     </motion.span>
//   );
// }
