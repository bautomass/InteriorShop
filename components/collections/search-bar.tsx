// components/collections/search-bar.tsx
'use client';

import debounce from 'lodash/debounce';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { FilterMenu } from './filter-menu';
import { LayoutSwitch } from './layout-switch';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  const updateSearch = useCallback(
    debounce((term: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
          params.set('q', term);
        } else {
          params.delete('q');
        }
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300),
    [pathname, router, searchParams]
  );

  const handleSearch = (term: string) => {
    setQuery(term);
    updateSearch(term);
  };

  // Cleanup function for the debounced search
  useEffect(() => {
    return () => {
      updateSearch.cancel();
    };
  }, [updateSearch]);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search collections..."
          className="w-full rounded-lg border border-primary-200 bg-white/80 py-2 pl-11 pr-4 backdrop-blur-sm placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800/80 dark:placeholder:text-primary-500"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <LayoutSwitch />
        <FilterMenu />
      </div>
    </div>
  );
}
