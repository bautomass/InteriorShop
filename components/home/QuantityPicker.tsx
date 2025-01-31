// /components/home/components/QuantityPicker.tsx
import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { QuantityPickerProps } from './types';

export const QuantityPicker = memo(function QuantityPicker({
  quantity,
  onIncrement,
  onDecrement
}: QuantityPickerProps) {
  return (
    <div className="flex h-10 sm:h-12 items-center rounded-md border-2 border-[#6B5E4C]/20 w-[90px] sm:w-[100px]">
      <button
        onClick={onDecrement}
        className="flex h-full items-center justify-center px-2 text-[#6B5E4C] 
                 transition-colors duration-200 hover:bg-[#6B5E4C]/5"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <div className="w-8 text-center text-sm font-medium text-[#6B5E4C]">
        {quantity}
      </div>
      <button
        onClick={onIncrement}
        className="flex h-full items-center justify-center px-2 text-[#6B5E4C] 
                 transition-colors duration-200 hover:bg-[#6B5E4C]/5"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
});

QuantityPicker.displayName = 'QuantityPicker';