import type { Product } from '@/lib/shopify/types';
import { useEffect, useState } from 'react';

const MAX_RECENT_ITEMS = 7;

export function useRecentlyViewed() {
  const [recentItems, setRecentItems] = useState<Product[]>([]);

  // Load items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentItems(JSON.parse(stored));
    }
  }, []);

  // Add new item to recently viewed
  const addToRecentlyViewed = (product: Product) => {
    setRecentItems(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item.id !== product.id);
      // Add new item to front of array
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentItems, addToRecentlyViewed };
} 