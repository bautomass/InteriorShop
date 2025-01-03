'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/lib/shopify/types';
import { useEffect } from 'react';

export function RecentlyViewedTracker({ product }: { product: Product }) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  return null; // This component only tracks, doesn't render anything
} 