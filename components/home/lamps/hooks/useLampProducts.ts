import type { Product } from '@/lib/shopify/types';
import { useCallback, useEffect, useState } from 'react';

export const useLampProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLampProducts = async () => {
      try {
        const response = await fetch('/api/lamps');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        if (mounted) {
          setProducts(data.products);
          setSortedProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching lamp products:', err);
        if (mounted) {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLampProducts();
    return () => { mounted = false; };
  }, []);

  const handlePriceSort = useCallback((direction: 'asc' | 'desc') => {
    setSortedProducts(prev => [...prev].sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return direction === 'asc' ? priceA - priceB : priceB - priceA;
    }));
  }, []);

  return {
    products,
    sortedProducts,
    error,
    loading,
    handlePriceSort,
    setSortedProducts
  };
};