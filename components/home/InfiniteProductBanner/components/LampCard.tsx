// /components/home/components/LampCard.tsx
'use client';

import { useCurrency } from '@/providers/CurrencyProvider';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback } from 'react';
import type { ProductCardProps } from '../types';

export const LampCard = memo(function LampCard({ product, snippet }: ProductCardProps) {
  const { formatPrice } = useCurrency();

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `/product/${product.handle}`;
  }, [product.handle]);

  return (
    <Link href={`/product/${product.handle}`} className="block h-full w-full">
      <motion.div
        whileHover={{ 
          scale: 1.08,
          y: -8,
          filter: 'grayscale(0%)',
          zIndex: 20,
          transition: { 
            type: "spring",
            stiffness: 200,
            damping: 25,
          }
        }}
        className="relative w-[200px] sm:w-[260px] aspect-square flex-shrink-0 rounded-xl overflow-hidden 
                  transform-gpu group bg-[#F0EDE9]"
        style={{ filter: 'grayscale(100%)' }}
      >
        {product.compareAtPriceRange?.minVariantPrice && 
         parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1,
              rotate: [-12, -15, -12]
            }}
            className="absolute top-2 left-2 z-20 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                       text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full 
                       shadow-sm transform -rotate-12"
          >
            Sale
          </motion.div>
        )}

        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <span className="text-neutral-400">No image</span>
          </div>
        )}
        
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 
                      group-hover:translate-x-2 group-hover:-translate-y-2
                      transition-all duration-300 ease-out transform-gpu">
          <div className="bg-[#6B5E4C]/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 
                        rounded-md text-xs sm:text-sm shadow-xl
                        border border-white/10">
            <div className="flex flex-col items-end gap-1 sm:gap-1.5">
              <div className="flex items-center justify-end w-full gap-2">
                <span className="text-[#D4C8B8] text-[10px] sm:text-xs mr-1">From</span>
                <span className="text-white font-medium">
                  {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
                </span>
                {product.compareAtPriceRange?.minVariantPrice && 
                 parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
                  <span className="text-[10px] text-[#FF6B6B] font-medium">
                    Save {Math.round(((parseFloat(product.compareAtPriceRange.minVariantPrice.amount) - 
                                     parseFloat(product.priceRange.minVariantPrice.amount)) / 
                                     parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) * 100)}%
                  </span>
                )}
              </div>
              <div className="w-full h-px bg-white/20 my-0.5 sm:my-1" />
              <span className="text-[10px] sm:text-xs text-[#D4C8B8] text-right leading-tight sm:leading-relaxed max-w-[150px]">
                {snippet}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/90 via-[#6B5E4C]/40 
                      to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                      duration-300 flex items-end justify-end p-2 sm:p-4">
          <button 
            onClick={handleViewClick}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/95 rounded-lg hover:bg-white 
                    text-[#6B5E4C] transition-all duration-300 flex items-center gap-1.5
                    hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
            aria-label={`View details for ${product.title}`}
          >
            <span className="text-xs sm:text-sm font-medium">View</span>
            <svg 
              className="w-3 h-3 sm:w-4 sm:h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </Link>
  );
});

LampCard.displayName = 'LampCard';