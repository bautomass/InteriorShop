// components/collections/search-provider.tsx
'use client';

import { Filter, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

interface SearchState {
  query: string;
  filters: {
    sort: string;
    type: string;
  };
}

export function SearchProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchState, setSearchState] = useState<SearchState>({
    query: searchParams.get('q') || '',
    filters: {
      sort: searchParams.get('sort') || 'date-desc',
      type: searchParams.get('type') || 'all'
    }
  });

  // Sync URL params with state
  useEffect(() => {
    setSearchState((prev) => ({
      query: searchParams.get('q') || '',
      filters: {
        sort: searchParams.get('sort') || 'date-desc',
        type: searchParams.get('type') || 'all'
      }
    }));
  }, [searchParams]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchState((prev) => ({ ...prev, query: term }));
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('q', term);
        } else {
          params.delete('q');
        }
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const clearSearch = useCallback(() => {
    setSearchState((prev) => ({ ...prev, query: '' }));
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete('q');
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setSearchState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    Object.entries(searchState.filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  }, [pathname, router, searchParams, searchState.filters]);

  return (
    <div className="mx-auto mb-16 flex max-w-3xl flex-wrap items-center justify-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400" />
        <input
          type="search"
          value={searchState.query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search collections..."
          className="w-full rounded-full border border-primary-200 bg-white/80 py-3 pl-12 pr-12 text-base backdrop-blur-sm placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800/80 dark:placeholder:text-primary-500"
        />
        {searchState.query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
            disabled={isPending}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-6 py-3 text-base font-medium text-primary-900 backdrop-blur-sm hover:border-primary-300 dark:border-primary-700 dark:bg-primary-800/80 dark:text-primary-50"
        disabled={isPending}
      >
        <Filter className={`h-5 w-5 ${isPending ? 'animate-spin' : ''}`} />
        Filter
      </button>

      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-4 top-full mt-2 w-64 rounded-lg border border-primary-200 bg-white p-4 shadow-lg dark:border-primary-700 dark:bg-primary-800"
        >
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-primary-900 dark:text-primary-50">Sort By</h3>
              <select
                className="w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-800"
                value={searchState.filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="date-desc">Latest</option>
                <option value="date-asc">Oldest</option>
                <option value="title-asc">A-Z</option>
                <option value="title-desc">Z-A</option>
              </select>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-primary-900 dark:text-primary-50">Type</h3>
              <select
                className="w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-800"
                value={searchState.filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="furniture">Furniture</option>
                <option value="decor">Decor</option>
                <option value="lighting">Lighting</option>
                <option value="textiles">Textiles</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded-md px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="rounded-md bg-accent-500 px-3 py-1 text-sm text-white hover:bg-accent-600"
                disabled={isPending}
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
