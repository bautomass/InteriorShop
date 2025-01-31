// /components/home/components/ProductOptions.tsx
import { Info } from 'lucide-react';
import { memo } from 'react';
import type { ProductOptionsProps } from './types';
import { ProductOption } from '@/lib/shopify/types';

export const ProductOptions = memo(function ProductOptions({
  product,
  selectedOptions,
  onOptionChange,
  onSizeGuideClick
}: ProductOptionsProps) {
  return (
    <div className="space-y-4">
      {product.options.map((option: ProductOption) => (
        <div key={option.name} className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-[#6B5E4C]">
              {option.name}
            </label>
            {option.name === "Size" && (
              <button
                onClick={onSizeGuideClick}
                className="flex items-center gap-1 text-xs text-[#8C7E6A] hover:text-[#6B5E4C] 
                         group transition-colors relative"
              >
                <span className="hover:underline">(SIZE GUIDE)</span>
                <Info className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                               bg-[#6B5E4C] text-white text-xs rounded whitespace-nowrap
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               pointer-events-none">
                  Click to see size guide
                </span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {option.values?.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200
                    ${isSelected 
                      ? 'border-[#6B5E4C] bg-[#6B5E4C] text-white' 
                      : 'border-[#B5A48B]/20 text-[#6B5E4C] hover:border-[#6B5E4C]'}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

ProductOptions.displayName = 'ProductOptions';