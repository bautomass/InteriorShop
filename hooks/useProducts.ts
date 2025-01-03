// hooks/useProducts.ts
import type { Product } from '@/lib/shopify/types';
import { useCallback, useEffect, useState } from 'react';

export function useProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    console.log('Initial products received:', initialProducts);
    if (!initialProducts?.length) {
      console.warn('No initial products provided');
    }
    setProducts(initialProducts || []);
  }, [initialProducts]);

  const sortProducts = useCallback((direction: 'asc' | 'desc') => {
    console.log('Sorting products in direction:', direction);
    setProducts((prevProducts) => {
      const sorted = [...prevProducts].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
        
        console.log(`Comparing prices: ${priceA} vs ${priceB}`);
        
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      });
      
      console.log('Products after sorting:', sorted.map(p => ({
        title: p.title,
        price: p.priceRange.minVariantPrice.amount
      })));
      
      return sorted;
    });
  }, []);

  return {
    products,
    setProducts,
    sortProducts
  };
}