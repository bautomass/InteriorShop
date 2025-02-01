import type { Product } from '@/lib/shopify/types';
import { useCallback, useEffect, useState } from 'react';

export const useProductBanner = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isScrolling, setIsScrolling] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleHoverStart = useCallback(() => {
    setIsScrolling(false);
  }, []);

  const handleHoverEnd = useCallback(() => {
    const timer = setTimeout(() => setIsScrolling(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchLamps = async () => {
      try {
        const response = await fetch('/api/lamps');
        if (!response.ok) throw new Error('Failed to fetch lamps');
        const data = await response.json();
        
        if (mounted && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching lamps:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLamps();
    return () => { mounted = false; };
  }, []);

  return {
    products,
    isScrolling,
    loading,
    handleHoverStart,
    handleHoverEnd
  };
};