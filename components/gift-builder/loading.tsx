// components/gift-builder/loading.tsx
'use client';

import { motion } from 'framer-motion';

export function GiftBuilderSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-12 text-center">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
        <div className="mx-auto mt-4 h-6 w-96 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-primary-100 dark:bg-primary-800" />
        <div className="relative z-10 flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: step * 0.2
                }}
                className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800"
              />
              <div className="mt-2 h-4 w-16 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-800"
              >
                <motion.div
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="aspect-square bg-primary-100 dark:bg-primary-800"
                />
                <div className="space-y-2 p-4">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="w-80 flex-shrink-0">
          <div className="rounded-2xl border border-primary-200 bg-white p-6 dark:border-primary-700 dark:bg-primary-800">
            <div className="h-6 w-24 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
            <div className="mt-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
                  <div className="h-4 w-16 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductLoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
          className="overflow-hidden rounded-lg border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-800"
        >
          <div className="aspect-square bg-primary-100 dark:bg-primary-800" />
          <div className="space-y-2 p-4">
            <div className="h-6 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 animate-pulse rounded bg-primary-100 dark:bg-primary-800" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary-100 dark:bg-primary-800" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
