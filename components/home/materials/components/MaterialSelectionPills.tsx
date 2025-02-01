'use client';

import { cn } from '@/lib/utils';
import { memo } from 'react';
import type { MaterialSelectionPillsProps } from '../types';

export const MaterialSelectionPills = memo(function MaterialSelectionPills({
  materials,
  selectedIndex,
  onSelect
}: MaterialSelectionPillsProps) {
  return (
    <div className="mt-8 flex gap-3 lg:hidden">
      {materials.map((material, index) => (
        <button
          key={material.name}
          onClick={() => onSelect(index)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
            selectedIndex === index
              ? "bg-[#6B5E4C] text-white"
              : "bg-white/50 text-[#6B5E4C]"
          )}
        >
          {material.name}
        </button>
      ))}
    </div>
  );
});