// components/collections/collection-grid.tsx
'use client';
import { ClientOnlyDate } from '@/components/ui/client-only-date';
import { Collection } from '@/lib/shopify/types';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import CollectionCard from './collection-card';

interface CollectionGridProps {
  collections: Collection[];
  layout: 'grid' | 'list' | 'table';
}

export function CollectionGrid({ collections, layout }: CollectionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableSectionElement>(null);

  const observeItems = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = layout === 'table' ? tableRef.current : gridRef.current;
    if (currentRef) {
      const items = currentRef.querySelectorAll('.collection-item');
      items.forEach((item) => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [layout]);

  useEffect(() => {
    const cleanup = observeItems();
    return cleanup;
  }, [collections, observeItems]);

  if (layout === 'table') {
    return (
      <div className="overflow-hidden rounded-xl border border-primary-200 bg-white/80 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/80">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-200 dark:border-primary-700">
              <th className="p-4 text-left text-sm font-medium text-primary-900 dark:text-primary-50">
                Collection
              </th>
              <th className="p-4 text-left text-sm font-medium text-primary-900 dark:text-primary-50">
                Items
              </th>
              <th className="p-4 text-left text-sm font-medium text-primary-900 dark:text-primary-50">
                Last Updated
              </th>
              <th className="p-4 text-right text-sm font-medium text-primary-900 dark:text-primary-50">
                Action
              </th>
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {collections.map((collection) => (
              <tr
                key={collection.handle}
                className="collection-item border-b border-primary-200 last:border-0 dark:border-primary-700 opacity-0 transition-opacity duration-300"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {collection.image && (
                      <div className="h-10 w-10 overflow-hidden rounded-lg">
                        <img
                          src={collection.image.url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="font-medium text-primary-900 dark:text-primary-50">
                      {collection.title}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-primary-600 dark:text-primary-300">
                  --
                </td>
                <td className="p-4 text-primary-600 dark:text-primary-300">
                  <ClientOnlyDate date={collection.updatedAt} />
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/collections/${collection.handle}`}
                    className="text-sm font-medium text-accent-500 hover:text-accent-600"
                  >
                    View Collection →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={`${
        layout === 'grid' ? 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'
      }`}
    >
      {collections.map((collection) => (
        <div
          key={collection.handle}
          className="collection-item opacity-0 transition-opacity duration-300"
        >
          <CollectionCard collection={collection} layout={layout} />
        </div>
      ))}
    </div>
  );
}