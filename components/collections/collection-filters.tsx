// components/collections/collection-filters.tsx
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface FilterProps {
  collections: {
    title: string;
    description: string;
    updatedAt: string;
    // Add other collection properties as needed
  }[];
}

export function CollectionFilters({ collections }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get unique dates (years and months) from collections
  const dates = [...new Set(collections.map(c => {
    const date = new Date(c.updatedAt);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  const [activeFilters, setActiveFilters] = useState({
    date: searchParams.get('date') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('q') || ''
  });

  const updateFilters = useCallback((key: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Construct new URL with filters
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      
      // Update URL
      router.push(`/collections?${params.toString()}`);
      
      return newFilters;
    });
  }, [router]);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Filter by Date
          </label>
          <select
            value={activeFilters.date}
            onChange={(e) => updateFilters('date', e.target.value)}
            className="w-full rounded-lg border border-primary-300 bg-white px-3 py-2 text-primary-900 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-100"
          >
            <option value="">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Sort By
          </label>
          <select
            value={activeFilters.sort}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="w-full rounded-lg border border-primary-300 bg-white px-3 py-2 text-primary-900 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-100"
          >
            <option value="">Featured</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.date || activeFilters.sort || activeFilters.search) && (
          <div className="w-full flex flex-wrap gap-2 mt-4">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <button
                  key={key}
                  onClick={() => updateFilters(key, '')}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300 dark:hover:bg-primary-700"
                >
                  {key === 'search' ? `Search: ${value}` : value}
                  <span aria-hidden="true">&times;</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setActiveFilters({ date: '', sort: '', search: '' });
                router.push('/collections');
              }}
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}