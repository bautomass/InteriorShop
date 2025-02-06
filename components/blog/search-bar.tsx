'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { createUrl } from '@/lib/utils';
import { ArrowUpDown, Search } from 'lucide-react';
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
    <div className="mx-auto mb-8 mt-8 max-w-2xl">
      <div className="relative flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search 
              className="h-5 w-5 text-primary-400 transition-colors group-focus-within:text-accent-500" 
              aria-hidden="true" 
            />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            defaultValue={searchParams?.get('q') || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="group w-full rounded-full border border-primary-200/80 bg-white/80 px-10 py-3 text-base text-primary-900 shadow-sm backdrop-blur transition-all placeholder:text-primary-400 hover:border-primary-300 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-500 dark:hover:border-primary-700 dark:focus:border-accent-500 dark:focus:bg-primary-900"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            id="sort"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            className="group h-12 appearance-none rounded-full border border-primary-200/80 bg-white/80 px-4 pr-10 text-base text-primary-900 shadow-sm backdrop-blur transition-all hover:border-primary-300 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:hover:border-primary-700 dark:focus:border-accent-500 dark:focus:bg-primary-900"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowUpDown 
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400 transition-colors group-hover:text-primary-500" 
            aria-hidden="true" 
          />
        </div>
      </div>
    </div>
  );
}
