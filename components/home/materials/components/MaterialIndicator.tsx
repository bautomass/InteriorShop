'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { memo } from 'react';
import type { MaterialIndicatorProps } from '../types';

export const MaterialIndicator = memo(function MaterialIndicator({
  material,
  index,
  isSelected,
  onSelect,
  position
}: MaterialIndicatorProps) {
  return (
    <div className={cn('absolute inline-flex group', position)}>
      <motion.button
        initial={false}
        animate={isSelected ? {
          scale: [1, 1.2, 1],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
        } : {}}
        onClick={onSelect}
        className="relative z-10"
        aria-label={`View ${material.name} details`}
      >
        <div className={cn(
          "absolute -inset-1 rounded-full",
          isSelected ? "animate-ping bg-[#dcd5ca]/60" : ""
        )} />
        
        <div className={cn(
          "h-4 w-4 rounded-full border-2 transition-all duration-300",
          isSelected
            ? "border-[#9c826b] bg-[#ebe7e0] scale-125"
            : "border-[#9c826b] bg-white/80"
        )} />
      </motion.button>

      <div className={cn(
        "absolute left-full top-1/2 ml-2 min-w-[200px] -translate-y-1/2 rounded-lg border border-[#b39e86] bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 z-20",
        isSelected
          ? "translate-x-0 opacity-100"
          : "-translate-x-4 opacity-0 pointer-events-none"
      )}>
        <h4 className="text-lg font-medium text-[#9c826b]">{material.name}</h4>
        <p className="mt-1 text-sm text-[#9c826b]/80">{material.description}</p>
        <div className="mt-3 space-y-2 text-xs">
          <p><span className="font-medium">Origin:</span> {material.specs.origin}</p>
          <p><span className="font-medium">Sustainability:</span> {material.specs.sustainability}</p>
          <div className="flex flex-wrap gap-1">
            {material.specs.properties.map(prop => (
              <span
                key={prop}
                className="rounded-full bg-[#9c826b]/10 px-2 py-0.5 text-[10px] font-medium text-[#9c826b]"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});