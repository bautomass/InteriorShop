// /components/home/components/AddToCartButton.tsx
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { memo } from 'react';
import { PRODUCT_CONSTANTS } from './constants';
import type { AddToCartButtonProps } from './types';

export const AddToCartButton = memo(function AddToCartButton({
  onClick,
  disabled,
  isPending
}: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isPending}
      className="group relative h-10 sm:h-12 flex-1 flex items-center justify-center gap-2 
                 overflow-hidden rounded-md px-6 text-sm font-medium text-white 
                 shadow-md transition-all duration-200 hover:shadow-lg 
                 disabled:cursor-not-allowed disabled:bg-gray-400
                 enabled:bg-[#6B5E4C] enabled:hover:bg-[#5A4D3B]"
    >
      <motion.div
        variants={PRODUCT_CONSTANTS.ANIMATION.MOBILE_BLINK}
        initial="initial"
        animate={isPending ? "initial" : "hover"}
        className="relative z-10"
      >
        <ShoppingCart className="h-4 w-4" />
      </motion.div>
      <span className="relative z-10 font-medium">
        {isPending ? 'Adding...' : 'Add to Cart'}
      </span>
    </button>
  );
});

AddToCartButton.displayName = 'AddToCartButton';