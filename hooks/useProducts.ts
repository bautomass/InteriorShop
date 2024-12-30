import type { Product } from '@/lib/shopify/types';
import { useCallback, useState } from 'react';

export function useProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const sortProducts = useCallback((direction: 'asc' | 'desc') => {
    setProducts(prevProducts => 
      [...prevProducts].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      })
    );
  }, []);

  return {
    products,
    setProducts,
    sortProducts
  };
} 