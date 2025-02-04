'use client'
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProductBanner } from './hooks/useProductBanner';
import { LampCard } from './components/LampCard';
import { BANNER_CONSTANTS } from './constants';
import type { InfiniteProductBannerProps } from './types';

const InfiniteProductBanner = ({ className = '' }: InfiniteProductBannerProps) => {
  const { 
    products, 
    isScrolling, 
    loading, 
    handleHoverStart, 
    handleHoverEnd 
  } = useProductBanner();

  // Memoize product snippets to prevent regeneration
  const productSnippets = useMemo(() => 
    products.map(() => BANNER_CONSTANTS.SNIPPETS[
      Math.floor(Math.random() * BANNER_CONSTANTS.SNIPPETS.length)
    ]),
    [products]
  );

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full overflow-hidden py-4 sm:py-8 ${className}
      hidden min-[700px]:block
      bg-gradient-to-r from-[#E8E2D9] via-[#F0EDE9] to-[#E8E2D9]
      before:absolute before:inset-0 
      before:bg-[radial-gradient(circle_at_50%_50%,rgba(107,94,76,0.08),transparent_45%)]
      before:opacity-60`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 
        bg-gradient-to-r from-[#E8E2D9] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 
        bg-gradient-to-l from-[#E8E2D9] to-transparent z-10" />
      
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isScrolling ? "-50%" : "0%" }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: BANNER_CONSTANTS.ANIMATION.SCROLL.duration,
            ease: BANNER_CONSTANTS.ANIMATION.SCROLL.ease
          }
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        className="flex gap-4 sm:gap-6 w-fit"
      >
        {[...products, ...products].map((product, index) => (
          <LampCard
            key={`${product.id}-${index}`}
            product={product}
            snippet={productSnippets[index % products.length] || BANNER_CONSTANTS.SNIPPETS[0]}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default memo(InfiniteProductBanner);