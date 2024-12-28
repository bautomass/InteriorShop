'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { createUrl } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const sortOptions = [
  { label: 'Latest', value: 'date-desc' },
  { label: 'Oldest', value: 'date-asc' },
  { label: 'A-Z', value: 'title-asc' },
  { label: 'Z-A', value: 'title-desc' }
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState(searchParams?.get('sort') || 'date-desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      newParams.set('q', debouncedSearchTerm);
    } else {
      newParams.delete('q');
    }

    if (sortValue !== 'date-desc') {
      newParams.set('sort', sortValue);
    } else {
      newParams.delete('sort');
    }

    router.push(createUrl('/blog', newParams));
  }, [debouncedSearchTerm, sortValue, router, searchParams]);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-primary-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          defaultValue={searchParams?.get('q') || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-primary-200 bg-white py-3 pl-10 pr-4 text-primary-900 shadow-sm placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 dark:placeholder:text-primary-500 dark:focus:border-accent-500 dark:focus:ring-accent-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary-400" aria-hidden="true" />
        <select
          id="sort"
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-primary-900 shadow-sm transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 dark:focus:border-accent-500 dark:focus:ring-accent-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}