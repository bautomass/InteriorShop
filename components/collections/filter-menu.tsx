// components/collections/filter-menu.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Filter, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const sortOptions = [
  { label: 'Latest Updates', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
  { label: 'A to Z', value: 'title-asc' },
  { label: 'Z to A', value: 'title-desc' }
];

const typeOptions = [
  { label: 'All Collections', value: 'all' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Decor', value: 'decor' },
  { label: 'Lighting', value: 'lighting' },
  { label: 'Textiles', value: 'textiles' }
];

export function FilterMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'date-desc',
    type: searchParams.get('type') || 'all'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      sort: 'date-desc',
      type: 'all'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white/80 px-4 py-2 text-sm font-medium text-primary-900 transition-colors hover:border-primary-300 dark:border-primary-700 dark:bg-primary-800/80 dark:text-primary-50"
      >
        <Filter className="h-4 w-4" />
        Filter & Sort
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-primary-200 bg-white p-6 shadow-xl dark:border-primary-700 dark:bg-primary-800"
            >
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
                    Filter & Sort
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto">
                  {/* Sort Options */}
                  <div>
                    <h4 className="mb-4 font-medium text-primary-900 dark:text-primary-50">
                      Sort By
                    </h4>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-primary-50 dark:hover:bg-primary-700/50"
                        >
                          <div className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-200 dark:border-primary-600">
                            {filters.sort === option.value && (
                              <div className="h-2.5 w-2.5 rounded-full bg-accent-500" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="sort"
                            value={option.value}
                            checked={filters.sort === option.value}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm text-primary-700 dark:text-primary-200">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className="border-t border-primary-100 pt-6 dark:border-primary-700">
                    <h4 className="mb-4 font-medium text-primary-900 dark:text-primary-50">
                      Collection Type
                    </h4>
                    <div className="space-y-2">
                      {typeOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-primary-50 dark:hover:bg-primary-700/50"
                        >
                          <div className="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-primary-200 dark:border-primary-600">
                            {filters.type === option.value && (
                              <Check className="h-3 w-3 text-accent-500" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="type"
                            value={option.value}
                            checked={filters.type === option.value}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm text-primary-700 dark:text-primary-200">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 border-t border-primary-100 pt-6 dark:border-primary-700">
                  <button
                    onClick={resetFilters}
                    className="flex-1 rounded-lg border border-primary-200 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-50 dark:hover:bg-primary-800"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
