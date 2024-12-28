// components/gift-builder/product-selector.tsx
'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { Collection } from '@/lib/shopify/queries/collection';
import { motion } from 'framer-motion';
import { Check, Minus, Package, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState, useEffect } from 'react';
import { useGiftBuilder } from './context';

interface Collection {
  id: string;
  title: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image?: {
    url: string;
    altText: string;
  };
  collection: Collection;
}

export function ProductSelector() {
  const { state, dispatch } = useGiftBuilder();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [products, setProducts] = useState<Product[]>([]); // This would be fetched from your API
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections on mount
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        setCollections(data.collections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    }
    fetchCollections();
  }, []);

  // Update product fetching logic
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (selectedCollection) params.append('collection', selectedCollection);

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, [debouncedSearch, selectedCollection]);

  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    // Implement product search logic
  }, []);

  const handleAddProduct = useCallback(
    (product: Product) => {
      if (!state.selectedBox) return;
      if (state.selectedProducts.length >= state.selectedBox.maxProducts) return;

      dispatch({ type: 'ADD_PRODUCT', payload: product });
    },
    [dispatch, state.selectedBox, state.selectedProducts.length]
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
    },
    [dispatch]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-50">
          Add Products to Your Gift
          {state.selectedBox && (
            <span className="ml-2 text-lg text-primary-500">
              ({state.selectedProducts.length}/{state.selectedBox.maxProducts} items)
            </span>
          )}
        </h2>
        <p className="mt-2 text-primary-600 dark:text-primary-300">
          Choose up to {state.selectedBox?.maxProducts} items for your gift box
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-primary-200 bg-white py-3 pl-12 pr-4 placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800"
          />
        </div>

        <select
          value={selectedCollection || ''}
          onChange={(e) => setSelectedCollection(e.target.value || null)}
          className="rounded-lg border border-primary-200 bg-white px-4 py-3 dark:border-primary-700 dark:bg-primary-800"
        >
          <option value="">All Collections</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative overflow-hidden rounded-lg border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-800"
          >
            <div className="relative aspect-square overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image.url}
                  alt={product.image.altText}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                  <Package className="h-12 w-12 text-primary-400" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50">
                {product.title}
              </h3>
              <p className="mt-1 text-sm text-primary-600 dark:text-primary-300">
                {product.collection.title}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-accent-500">${product.price.toFixed(2)}</p>
                {state.selectedProducts.some((p) => p.id === product.id) ? (
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddProduct(product)}
                    disabled={
                      !state.selectedBox ||
                      state.selectedProducts.length >= state.selectedBox.maxProducts
                    }
                    className="rounded-full bg-accent-500 p-2 text-white transition-colors hover:bg-accent-600 disabled:bg-primary-200 dark:disabled:bg-primary-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      {state.selectedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-3 font-medium text-white transition-colors hover:bg-accent-600"
          >
            Review Your Gift
            <Check className="h-5 w-5" />
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary-200 dark:border-primary-700"
        >
          <Package className="h-12 w-12 text-primary-400" />
          <p className="mt-4 text-center text-primary-600 dark:text-primary-300">
            No products found. Try adjusting your search or filters.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
