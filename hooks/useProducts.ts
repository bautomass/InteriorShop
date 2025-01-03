// hooks/useProducts.ts
import type { Product } from '@/lib/shopify/types';
import { useCallback, useEffect, useState } from 'react';

export function useProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  const sortProducts = useCallback((direction: 'asc' | 'desc') => {
    setProducts((prevProducts) => {
      const sorted = [...prevProducts].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      });
      return sorted;
    });
  }, []);

  return {
    products,
    setProducts,
    sortProducts
  };
}