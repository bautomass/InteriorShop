'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { memo } from 'react';

interface CarouselNavButtonProps {
  direction: 'prev' | 'next';
  isDisabled: boolean;
  className?: string;
}

export const CarouselNavButton = memo(function CarouselNavButton({
  direction,
  isDisabled,
  className
}: CarouselNavButtonProps) {
  const isPrev = direction === 'prev';

  return (
    <button
      className={cn(
        'custom-swiper-button-prev group absolute top-1/2 isolate z-20 hidden h-14 w-10',
        '-translate-y-1/2 cursor-pointer items-center justify-center overflow-hidden',
        'bg-primary-800/95 shadow-[0_0_10px_rgba(83,66,56,0.3)] backdrop-blur-sm',
        'transition-all duration-300 ease-out hover:w-12',
        'hover:shadow-[0_0_20px_rgba(83,66,56,0.5)] active:scale-95 active:shadow-inner',
        'disabled:cursor-default disabled:opacity-50',
        isPrev ? 'left-0 -translate-x-full rounded-l-md' : 'right-0 translate-x-full rounded-r-md',
        className
      )}
      aria-label={`${isPrev ? 'Previous' : 'Next'} slide`}
      disabled={isDisabled}
    >
      <div className={cn(
        'relative z-20 transition-all duration-300',
        isPrev ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5',
        'group-hover:drop-shadow-[0_0_8px_rgba(199,186,168,0.5)] group-active:scale-90'
      )}>
        {isDisabled ? (
          <div className="relative">
            {isPrev ? (
              <ChevronLeft className="h-6 w-6 text-primary-100 transition-opacity duration-200 group-hover:opacity-0" />
            ) : (
              <ChevronRight className="h-6 w-6 text-primary-100 transition-opacity duration-200 group-hover:opacity-0" />
            )}
            <X className="absolute inset-0 h-6 w-6 scale-110 stroke-[2.5] text-red-400 opacity-0 
                         transition-opacity duration-200 group-hover:opacity-100" />
          </div>
        ) : (
          isPrev ? (
            <ChevronLeft className="h-6 w-6 text-primary-100" />
          ) : (
            <ChevronRight className="h-6 w-6 text-primary-100" />
          )
        )}
      </div>

      {/* Animated border */}
      <div className={cn(
        'absolute inset-0 z-30 opacity-0 transition-opacity duration-300',
        isPrev ? 
          'rounded-l-md bg-gradient-to-r from-accent-300/50 to-transparent [mask-image:linear-gradient(to_right,white_2px,transparent_2px)]' :
          'rounded-r-md bg-gradient-to-l from-accent-300/50 to-transparent [mask-image:linear-gradient(to_left,white_2px,transparent_2px)]',
        'group-hover:opacity-100'
      )} />

      {/* Glow effect */}
      <div className={cn(
        'absolute inset-0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100',
        isPrev ?
          'bg-gradient-to-r from-primary-300/30 via-primary-400/20 to-transparent' :
          'bg-gradient-to-l from-primary-300/30 via-primary-400/20 to-transparent'
      )} />
    </button>
  );
});

CarouselNavButton.displayName = 'CarouselNavButton';