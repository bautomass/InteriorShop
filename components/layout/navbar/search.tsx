'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="text-md border-primary-200 bg-primary-50 text-primary-900 placeholder:text-primary-400 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-600 w-full rounded-lg border px-4 py-2 md:text-sm"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="text-primary-500 dark:text-primary-400 h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="border-primary-200 bg-primary-50 text-primary-900 placeholder:text-primary-400 dark:border-primary-800 dark:bg-primary-900/50 dark:text-primary-50 dark:placeholder:text-primary-600 w-full rounded-lg border px-4 py-2 text-sm"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="text-primary-500 dark:text-primary-400 h-4" />
      </div>
    </form>
  );
}
