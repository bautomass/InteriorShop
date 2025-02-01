'use client';

import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/providers/CurrencyProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import { LAMP_CONSTANTS } from '../constants/lamp-constants';
import { determineProductCategory } from '../utils/product-utils';
import { LampImageGallery } from './LampImageGallery';
import { LampVariantModal } from './LampVariantModal';

interface LampProductCardProps {
  product: Product;
  onQuickView: (e: React.MouseEvent<HTMLButtonElement>) => void;
  cardsToShow: number;
}

export const LampProductCard = memo(function LampProductCard({ 
  product, 
  onQuickView, 
  cardsToShow 
}: LampProductCardProps) {
  const { formatPrice } = useCurrency();
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const handleQuickView = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView(e);
    },
    [onQuickView]
  );

  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVariantModalOpen(true);
  }, []);

  // Calculate sale percentage if applicable
  const salePercentage = product.compareAtPriceRange?.minVariantPrice && 
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 
    parseFloat(product.priceRange.minVariantPrice.amount) ?
    Math.round(((parseFloat(product.compareAtPriceRange.minVariantPrice.amount) - 
      parseFloat(product.priceRange.minVariantPrice.amount)) / 
      parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) * 100) : null;

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative h-full w-full min-w-[200px] rounded-sm bg-white shadow-lg backdrop-blur-sm 
                   transition-all duration-500 hover:shadow-xl hover:shadow-primary-900/10"
      >
        <div className="relative">
          <LampImageGallery product={product} />
          <div className="p-4">
            {/* Category Badge */}
            <div className="inline-flex rounded-full bg-primary-100/80 px-2 py-1 text-xs font-medium 
                          tracking-wide text-primary-800">
              {determineProductCategory(product)}
            </div>

            {/* Product Title */}
            <Link 
              href={`/product/${product.handle}`}
              className="block cursor-pointer hover:opacity-80"
            >
              <h3 className="mt-2 line-clamp-1 text-base font-semibold tracking-tight text-primary-900">
                {product.title}
              </h3>
            </Link>

            {/* Price Section */}
            <div className="mt-1 flex items-center gap-2">
              <div className="relative">
                {salePercentage && (
                  <motion.div
                    initial={LAMP_CONSTANTS.ANIMATION.SALE_BADGE.initial}
                    animate={LAMP_CONSTANTS.ANIMATION.SALE_BADGE.animate}
                    className="absolute -left-2 -top-3 z-10 -rotate-12 transform rounded-full 
                             bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] px-1.5 py-0.5 
                             text-[10px] font-medium text-white shadow-sm"
                  >
                    Sale
                  </motion.div>
                )}
                <p className="text-lg font-bold tracking-tight text-accent-500">
                  {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
                </p>
              </div>

              {/* Sale Price Display */}
              {salePercentage && (
                <>
                  <span className="text-sm text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                    {formatPrice(parseFloat(product.compareAtPriceRange!.minVariantPrice.amount))}
                  </span>
                  <span className="rounded-full bg-[#FF6B6B]/10 px-2 py-0.5 text-xs font-medium text-[#FF6B6B]">
                    Save {salePercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Product Description */}
            <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-primary-600/90 
                         [@media(max-width:700px)]:hidden">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className={cn(
              'mt-3 flex gap-2',
              '[@media(max-width:600px)]:flex-col',
              cardsToShow >= 5 ? 'flex-col' : 'flex-row'
            )}>
              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative px-3 py-1.5',
                  'bg-[#8B9D8B] hover:bg-[#7A8C7A]',
                  'rounded-sm text-white',
                  'transition-all duration-300',
                  'flex items-center justify-center gap-1.5',
                  'overflow-hidden shadow-sm hover:shadow-md',
                  'group',
                  '[@media(max-width:600px)]:w-full',
                  cardsToShow >= 5 ? 'w-full' : 'flex-1'
                )}
              >
                {/* Button Animations */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent 
                              via-white/20 to-transparent opacity-0 transition-all duration-1000 
                              ease-in-out group-hover:translate-x-full group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent 
                              opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Cart Icon */}
                <svg
                  className="relative h-3.5 w-3.5 transform transition-transform duration-300 
                           ease-out group-hover:-translate-y-px"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>

                <span className="text-shadow-sm relative transform text-xs font-medium 
                               transition-transform duration-300 ease-out group-hover:-translate-y-px">
                  Add to Cart
                </span>

                <div className="absolute inset-0 opacity-0 ring-2 ring-white/20 
                              transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>

              {/* Quick View Button */}
              <motion.button
                onClick={handleQuickView}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative px-3 py-1.5',
                  'bg-[#4A4A4A] hover:bg-[#3A3A3A]',
                  'rounded-sm text-white',
                  'transition-all duration-300',
                  'flex items-center justify-center',
                  'overflow-hidden shadow-sm hover:shadow-md',
                  'group',
                  '[@media(max-width:600px)]:w-full',
                  cardsToShow >= 5 ? 'w-full' : 'w-[100px]',
                  'text-xs font-medium'
                )}
              >
                {/* Button Animations */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent 
                              via-white/10 to-transparent opacity-0 transition-all duration-1000 
                              ease-in-out group-hover:translate-x-full group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent 
                              opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative transform transition-transform duration-300 
                               ease-out group-hover:-translate-y-px">
                  Quick View
                </span>

                <div className="absolute inset-0 opacity-0 ring-2 ring-white/10 
                              transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <LampVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        product={product}
        onAddToCart={() => {}} // This is handled inside the modal
      />
    </>
  );
});

LampProductCard.displayName = 'LampProductCard';