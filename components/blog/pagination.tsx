// /components/blog/pagination.tsx
'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', page.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'rounded-lg p-2 hover:bg-primary-100 dark:hover:bg-primary-800',
          currentPage <= 1 && 'cursor-not-allowed opacity-50'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          className={cn(
            'rounded-lg px-3 py-1 text-sm',
            currentPage === i + 1
              ? 'bg-primary-900 text-white dark:bg-primary-100 dark:text-primary-900'
              : 'hover:bg-primary-100 dark:hover:bg-primary-800'
          )}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'rounded-lg p-2 hover:bg-primary-100 dark:hover:bg-primary-800',
          currentPage >= totalPages && 'cursor-not-allowed opacity-50'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}