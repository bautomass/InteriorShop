// /components/blog/sort-options.tsx
'use client';

import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortOptionsProps {
  currentValue?: string;
}

const sortOptions = [
  { label: 'Latest', value: 'date-desc' },
  { label: 'Oldest', value: 'date-asc' },
  { label: 'A-Z', value: 'title-asc' },
  { label: 'Z-A', value: 'title-desc' }
];

export function SortOptions({ currentValue }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) {
      newParams.set('sort', value);
    } else {
      newParams.delete('sort');
    }

    router.push(createUrl('/blog', newParams));
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-primary-600 dark:text-primary-300">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentValue || 'date-desc'}
        onChange={(e) => handleSort(e.target.value)}
        className="rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-sm text-primary-900 shadow-sm transition-colors focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 dark:focus:border-primary-600 dark:focus:ring-primary-600"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
