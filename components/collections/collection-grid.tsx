// components/collections/collection-grid.tsx
'use client';

import { ClientOnlyDate } from '@/components/ui/client-only-date';
import { Collection } from '@/lib/shopify/types';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import CollectionCard from './collection-card';

interface CollectionGridProps {
  collections: Collection[];
  layout: 'grid' | 'list' | 'table';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function CollectionGrid({ collections, layout }: CollectionGridProps) {
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
          <tbody>
            <AnimatePresence>
              {collections.map((collection) => (
                <motion.tr
                  key={collection.handle}
                  variants={item}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="border-b border-primary-200 last:border-0 dark:border-primary-700"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {collection.image && (
                        <div className="h-10 w-10 overflow-hidden rounded-lg">
                          <img
                            src={collection.image.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <span className="font-medium text-primary-900 dark:text-primary-50">
                        {collection.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-primary-600 dark:text-primary-300">
                    {/* Add item count if available */}
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
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={layout === 'grid' ? 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}
    >
      <AnimatePresence>
        {collections.map((collection) => (
          <motion.div
            key={collection.handle}
            variants={item}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <CollectionCard collection={collection} layout={layout} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
