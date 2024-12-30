'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  // Update query when searchParams changes
  useEffect(() => {
    setQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  // Debounced search handler
  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }

      startTransition(() => {
        router.push(`/search?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(query);
      }}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <input
        type="text"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        autoComplete="off"
        className={`text-md w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-primary-900 transition-colors placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-600 dark:focus:border-accent-400 md:text-sm ${isPending ? 'opacity-70' : ''}`}
        aria-label="Search products"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon
          className={`h-4 text-primary-500 transition-colors dark:text-primary-400 ${isPending ? 'animate-pulse' : ''}`}
        />
      </div>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <div className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <div className="animate-pulse">
        <div className="h-10 w-full rounded-lg border border-primary-200 bg-primary-100 dark:border-primary-800 dark:bg-primary-800/50" />
      </div>
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-primary-400 dark:text-primary-600" />
      </div>
    </div>
  );
}

// 'use client';

// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import Form from 'next/form';
// import { useSearchParams } from 'next/navigation';

// export default function Search() {
//   const searchParams = useSearchParams();

//   return (
//     <Form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
//       <input
//         key={searchParams?.get('q')}
//         type="text"
//         name="q"
//         placeholder="Search for products..."
//         autoComplete="off"
//         defaultValue={searchParams?.get('q') || ''}
//         className="text-md border-primary-200 bg-primary-50 text-primary-900 placeholder:text-primary-400 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-600 w-full rounded-lg border px-4 py-2 md:text-sm"
//       />
//       <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
//         <MagnifyingGlassIcon className="text-primary-500 dark:text-primary-400 h-4" />
//       </div>
//     </Form>
//   );
// }

// export function SearchSkeleton() {
//   return (
//     <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
//       <input
//         placeholder="Search for products..."
//         className="border-primary-200 bg-primary-50 text-primary-900 placeholder:text-primary-400 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-600 w-full rounded-lg border px-4 py-2 text-sm"
//       />
//       <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
//         <MagnifyingGlassIcon className="text-primary-500 dark:text-primary-400 h-4" />
//       </div>
//     </form>
//   );
// }
