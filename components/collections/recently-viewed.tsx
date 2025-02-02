// components/collections/recently-viewed.tsx
'use client';

import { ClientOnlyDate } from '@/components/ui/client-only-date';
import { Clock, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface ViewedCollection {
  handle: string;
  title: string;
  image?: {
    url: string;
    altText: string;
  };
  timestamp: number;
}

export function RecentlyViewed() {
  const [viewedCollections, setViewedCollections] = useState<ViewedCollection[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const loadCollections = useCallback(() => {
    try {
      const stored = localStorage.getItem('viewedCollections');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed
          .slice(0, 4)
          .sort((a: ViewedCollection, b: ViewedCollection) => b.timestamp - a.timestamp);
        setViewedCollections(sorted);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const removeCollection = useCallback((handle: string) => {
    setViewedCollections(prev => {
      const updated = prev.filter(c => c.handle !== handle);
      localStorage.setItem('viewedCollections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (!isVisible || viewedCollections.length === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-primary-200 bg-white/80 p-4 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/80">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent-500">
          <Clock className="h-5 w-5" />
          <h2 className="font-medium">Recently Viewed</h2>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            localStorage.removeItem('viewedCollections');
          }}
          className="rounded-full p-1 text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {viewedCollections.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="group relative flex-shrink-0 space-y-2"
          >
            <div className="relative h-24 w-32 overflow-hidden rounded-lg">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  width={128}
                  height={96}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                  <span className="text-xs text-primary-400">No image</span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeCollection(collection.handle);
                }}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
            <p className="text-sm font-medium text-primary-900 dark:text-primary-50">
              {collection.title}
            </p>
            <p className="text-xs text-primary-500">
              <ClientOnlyDate date={collection.timestamp} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
