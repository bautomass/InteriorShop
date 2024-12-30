'use client';

import { defaultSort, sorting, type SortFilterItem } from 'lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface SortOptionsProps {
  currentValue?: string | null;
}

export function SortOptions({ currentValue }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize the current sorting value
  const currentSort = useMemo(() => {
    return currentValue || defaultSort.slug || '';
  }, [currentValue]);

  // Create URL search params handler
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (value: string) => {
      const queryString = createQueryString('sort', value);
      router.push(`?${queryString}`, { scroll: false });
    },
    [createQueryString, router]
  );

  return (
    <div className="mb-8 flex items-center justify-end">
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-primary-700 dark:text-primary-200">
          Sort by:
        </label>
        <select
          id="sort"
          name="sort"
          value={currentSort}
          className="rounded-md border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800"
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {sorting.map((option: SortFilterItem) => (
            <option key={option.slug || 'default'} value={option.slug || ''}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
// // components/collections/sort-options.tsx

// 'use client';

// import { defaultSort, sorting } from 'lib/constants';

// interface SortOptionsProps {
//   currentValue?: string;
// }

// export function SortOptions({ currentValue }: SortOptionsProps) {
//   return (
//     <div className="mb-8 flex items-center justify-end">
//       <div className="flex items-center gap-2">
//         <label htmlFor="sort" className="text-sm text-primary-700 dark:text-primary-200">
//           Sort by:
//         </label>
//         <select
//           id="sort"
//           name="sort"
//           defaultValue={currentValue || defaultSort.slug}
//           className="rounded-md border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm dark:border-primary-700 dark:bg-primary-800"
//           onChange={(e) => {
//             const url = new URL(window.location.href);
//             url.searchParams.set('sort', e.target.value);
//             window.location.href = url.toString();
//           }}
//         >
//           {sorting.map((option) => (
//             <option key={option.slug || 'default'} value={option.slug || ''}>
//               {option.title}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
