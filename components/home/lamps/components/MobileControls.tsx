'use client';

import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

interface MobileControlsProps {
  handlePriceSort: (direction: 'asc' | 'desc') => void;
  mainSwiper: any;
  isBeginning: boolean;
  isEnd: boolean;
  activeThumbIndex: number;
  sortedProducts: Product[];
  setActiveThumbIndex: (index: number) => void;
}

export const MobileControls = memo(function MobileControls({
  handlePriceSort,
  mainSwiper,
  isBeginning,
  isEnd,
  activeThumbIndex,
  sortedProducts,
  setActiveThumbIndex
}: MobileControlsProps) {
  return (
    <div className="mb-4 flex items-center justify-between lg:hidden">
      {/* Sort Controls */}
      <div className="inline-flex items-center rounded-lg border border-primary-200 bg-white shadow-sm" role="group">
        <span className="border-r border-primary-200 px-2 text-xs font-medium text-primary-600">
          Price
        </span>
        <button
          onClick={() => handlePriceSort('asc')}
          className="flex items-center gap-0.5 border-r border-primary-200 px-2 py-1.5 text-xs 
                    font-medium text-primary-700 transition-colors hover:bg-primary-50 active:bg-primary-100"
          aria-label="Sort price low to high"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
            <path d="M12 5l0 14M5 12l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => handlePriceSort('desc')}
          className="flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-primary-700 
                    transition-colors hover:bg-primary-50 active:bg-primary-100"
          aria-label="Sort price high to low"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
            <path d="M12 19l0-14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center">
        <button
          onClick={() => mainSwiper?.slidePrev()}
          className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 
                    transition-colors hover:bg-primary-50"
          aria-label="Previous products"
          disabled={isBeginning}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative flex items-center">
          {/* Left Gradient */}
          <div className="absolute left-0 z-10 h-full w-4 bg-gradient-to-r from-primary-50 to-transparent" />

          {/* Dots Container */}
          <div className="flex items-center gap-1.5 overflow-hidden px-1">
            {sortedProducts.map((_, idx) => {
              const startIdx = Math.max(0, Math.min(activeThumbIndex - 3, sortedProducts.length - 7));
              const endIdx = Math.min(startIdx + 7, sortedProducts.length);
              if (idx < startIdx || idx >= endIdx) return null;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    mainSwiper?.slideTo(idx);
                    setActiveThumbIndex(idx);
                  }}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    activeThumbIndex === idx
                      ? 'w-4 bg-primary-600'
                      : 'w-1.5 bg-primary-300 hover:bg-primary-400',
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Right Gradient */}
          <div className="absolute right-0 z-10 h-full w-4 bg-gradient-to-l from-primary-50 to-transparent" />
        </div>

        <button
          onClick={() => mainSwiper?.slideNext()}
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 
                    transition-colors hover:bg-primary-50"
          aria-label="Next products"
          disabled={isEnd}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

MobileControls.displayName = 'MobileControls';