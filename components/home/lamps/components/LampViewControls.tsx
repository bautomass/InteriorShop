'use client';

import { cn } from '@/lib/utils';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { memo } from 'react';
import type { LampViewControlsProps } from '../types/lamp-types';

export const LampViewControls = memo(function LampViewControls({
  current,
  min,
  max,
  onChange,
  isGridView,
  onViewChange
}: LampViewControlsProps) {
  return (
    <div className="absolute right-0 top-0 z-10 mb-4 flex items-center gap-2">
      {/* View Toggle Button */}
      <button
        onClick={() => onViewChange(!isGridView)}
        className={cn(
          'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
          'hover:bg-primary-800/10',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'border border-primary-900/20',
          isGridView
            ? 'border-transparent bg-primary-900 text-white'
            : 'bg-primary-100/50 text-primary-900'
        )}
      >
        <div className="flex items-center gap-2">
          {isGridView ? (
            <>
              <LayoutList className="h-4 w-4" />
              <span>Carousel View</span>
            </>
          ) : (
            <>
              <LayoutGrid className="h-4 w-4" />
              <span>Grid View</span>
            </>
          )}
        </div>
      </button>

      {/* Vertical Divider */}
      <div className="h-8 w-px bg-primary-900/20" />

      {/* Card Count Buttons */}
      {[...Array(max - min + 1)].map((_, idx) => {
        const value = min + idx;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
              'hover:bg-primary-800/10',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'border border-primary-900/20',
              value === current
                ? 'border-transparent bg-primary-900 text-white'
                : 'bg-primary-100/50 text-primary-900'
            )}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
});

LampViewControls.displayName = 'LampViewControls';