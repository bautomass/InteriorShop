//variant-selector.tsx
'use client';

import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { useCallback, useState } from 'react';

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
  const updateURL = useUpdateURL();
  const [isUpdating, setIsUpdating] = useState(false);

  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  // const handleOptionClick = useCallback(
  //   async (optionName: string, value: string) => {
  //     if (isUpdating) return;
  //     setIsUpdating(true);
  //     try {
  //       const newState = updateOption(optionName, value);
  //       await updateURL(newState);
  //     } catch (error) {
  //       console.error('Failed to update variant:', error);
  //     } finally {
  //       setIsUpdating(false);
  //     }
  //   },
  //   [isUpdating, updateOption, updateURL]
  // );

  const handleOptionClick = useCallback(
    async (optionName: string, value: string) => {
      if (isUpdating) return;
      setIsUpdating(true);

      console.log('Before update:', {
        optionName,
        value,
        currentState: state
      });

      try {
        const newState = updateOption(optionName, value);
        console.log('After updateOption:', newState);

        await updateURL(newState);
        console.log('URL updated with state:', newState);
      } catch (error) {
        console.error('Failed to update variant:', error);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, updateOption, updateURL, state]
  );

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <form key={option.id}>
          <dl className="mb-8">
            <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
            <dd className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const optionNameLowerCase = option.name.toLowerCase();

                // Base option params on current selectedOptions
                const optionParams = { ...state, [optionNameLowerCase]: value };

                // Filter out invalid options with type guard
                const filtered = Object.entries(optionParams).filter(
                  (entry): entry is [string, string] =>
                    typeof entry[1] === 'string' &&
                    !!options.find(
                      (opt) =>
                        opt.name.toLowerCase() === entry[0] &&
                        opt.values.includes(entry[1] as string)
                    )
                );

                const isAvailableForSale = combinations.find((combination) =>
                  filtered.every(
                    ([key, val]) => combination[key] === val && combination.availableForSale
                  )
                );

                const isActive = state[optionNameLowerCase] === value;

                return (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleOptionClick(optionNameLowerCase, value);
                    }}
                    key={value}
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
            </dd>
          </dl>
        </form>
      ))}
    </div>
  );
}
