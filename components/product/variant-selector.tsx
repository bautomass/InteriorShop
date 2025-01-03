'use client';

import clsx from 'clsx';
import { useProduct } from 'components/product/product-context';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { useCallback, useEffect, useState } from 'react';

interface Combination {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
}

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
}

export function VariantSelector({ options, variants }: VariantSelectorProps): JSX.Element | null {
  const { state, updateOption } = useProduct();
  const [isUpdating, setIsUpdating] = useState(false);

  // Set default variant when component mounts
  useEffect(() => {
    async function setDefaultVariant() {
      if (Object.keys(state).length === 0 && variants.length > 0) {
        const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
        if (defaultVariant) {
          console.log('Setting default variant:', defaultVariant);
          try {
            for (const option of defaultVariant.selectedOptions) {
              await updateOption(option.name, option.value);
            }
          } catch (error) {
            console.error('Error setting default variant:', error);
          }
        }
      }
    }

    setDefaultVariant();
  }, [variants, state, updateOption]);

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name]: option.value }),
      {}
    )
  }));

  const handleOptionClick = useCallback(
    async (optionName: string, value: string) => {
      if (isUpdating) return;
      setIsUpdating(true);

      try {
        await updateOption(optionName, value);
      } catch (error) {
        console.error('Failed to update option:', error);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, updateOption]
  );

  // Early return if no options or just one option with one value
  if (!options.length || (options.length === 1 && options[0]?.values.length === 1)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <div className="mb-4 text-sm uppercase tracking-wide">{option.name}</div>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionParams = { ...state, [option.name]: value };

              const filtered = Object.entries(optionParams).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === 'string' &&
                  !!options.find((opt) => opt.name === entry[0] && opt.values.includes(entry[1]))
              );

              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, val]) => combination[key] === val && combination.availableForSale
                )
              );

              const isActive = state[option.name] === value;

              return (
                <button
                  key={value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick(option.name, value);
                  }}
                  type="button"
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale || isUpdating}
                  title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                  className={clsx(
                    'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                    {
                      'cursor-default ring-2 ring-blue-600': isActive,
                      'ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600':
                        !isActive && isAvailableForSale,
                      'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                        !isAvailableForSale
                    }
                  )}
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
}
