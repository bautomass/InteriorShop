'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/lib/shopify/types';
import { useEffect } from 'react';

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  return (
    // Your existing product view JSX
    <div>
      {/* Product details */}
    </div>
  );
} 