'use client';

import { defaultSort, sorting, type SortFilterItem } from 'lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

interface SortOptionsProps {
  currentValue?: string | null;
  productCount: number;
}

export function SortOptions({ currentValue, productCount }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Ensure current sort value is valid or fallback to default
  const currentSort = useMemo(() => {
    if (!currentValue) return defaultSort.slug;
    const validSort = sorting.find(opt => opt.slug === currentValue);
    return validSort ? validSort.slug : defaultSort.slug;
  }, [currentValue]);

  // Handle URL parameter updates
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Handle default sort case
      if (!value || value === defaultSort.slug) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      
      return params.toString();
    },
    [searchParams]
  );

  // Handle sort change with loading state
  const handleSortChange = useCallback(
    async (value: string | null) => {
      // Validate sort option exists
      if (value && !sorting.find(opt => opt.slug === value)) {
        value = defaultSort.slug;
      }
      setIsLoading(true);
      const queryString = createQueryString('sort', value);
      const newPath = queryString ? `?${queryString}` : window.location.pathname;
      
      router.push(newPath, { scroll: false });
      setIsLoading(false);
    },
    [createQueryString, router]
  );

  return (
    <div className="mb-4 w-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-primary-600 dark:text-primary-300">
            {productCount} Product{productCount !== 1 && 's'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-200">Sort by:</span>
          <div className="flex flex-wrap gap-1">
            {sorting.map((option: SortFilterItem) => (
              <button
                key={option.slug ?? 'default'}
                onClick={() => handleSortChange(option.slug)}
                disabled={isLoading}
                className={`relative rounded-full px-3 py-1 text-sm font-medium transition-all
                  ${currentSort === option.slug ? 'bg-primary-900 text-white shadow-sm dark:bg-primary-50 dark:text-primary-900' : 'bg-primary-100 text-primary-700 hover:bg-primary-200 hover:shadow-sm dark:bg-primary-800 dark:text-primary-200 dark:hover:bg-primary-700'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 dark:from-primary-800 dark:via-primary-700 dark:to-primary-800" />
    </div>
  );
}