// components/gift-builder/product-selector.tsx
'use client';

import { ProductModal } from '@/components/gift-builder/product-modal';
import { getProductsByCollectionQuery } from '@/lib/shopify/queries/product';
import { Collection, ProductVariant, ShopifyProduct } from '@/lib/shopify/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CollectionCarousel } from './collection-carousel';
import { useGiftBuilder } from './context';

type Product = {
  id: string;
  variantId: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  image?: {
    url: string;
    altText: string;
  };
  collection: {
    id: string;
    title: string;
  };
  variant: ProductVariant;
  originalProduct: ShopifyProduct;
  availableForSale: boolean;
  quantity?: number;
  sku?: string;
  weight?: number;
  requiresShipping?: boolean;
};

const EXCLUDED_COLLECTIONS = [
  'all-products',
  'all',
  'carpet-collection',
  'blinds-shades-collection',
  'freshfreshfresh',
  'organic-decoration',
  'gift-boxes-1',
  'home-collection',
  'lamps',
  'new-arrivals',
  'anturam-eco-wooden-stools'
];

const SYSTEM_COLLECTIONS = [
  { handle: 'all-products', title: 'All Products' },
  { handle: 'all', title: 'All' },
  // Add any other variations you see in the logs
];

export function ProductSelector() {
  const { state, dispatch } = useGiftBuilder();
  const { editingProductId, selectedProducts } = state;
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Add console.log to check selected collection
  const handleCollectionSelect = (collectionId: string | null) => {
    console.log('Collection selected:', collectionId);
    setSelectedCollection(collectionId);
  };

  // Fetch collections on mount
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        
        const filteredCollections = data.collections
          .filter((c: any) => {
            // Check against system collections
            const isSystemCollection = SYSTEM_COLLECTIONS.some(
              sys => c.handle === sys.handle || c.title === sys.title
            );
            if (isSystemCollection) return false;
            
            // Check against excluded collections
            if (EXCLUDED_COLLECTIONS.includes(c.handle)) return false;
            
            return true;
          })
          .map((c: any) => ({
            ...c,
            handle: c.handle || '',
            description: c.description || '',
            seo: c.seo || {},
            updatedAt: c.updatedAt || new Date().toISOString(),
          }));
        
        setCollections(filteredCollections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    }
    fetchCollections();
  }, []);

  // Fetch products when collection is selected
  useEffect(() => {
    if (selectedCollection) {
      setIsLoading(true);
      setProducts([]); // Clear existing products
      setCursor(null); // Reset pagination
      fetchProducts();
    }
  }, [selectedCollection]);

  const fetchProducts = async () => {
    if (isLoading || !selectedCollection) return; // Add check for selectedCollection
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/shop/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: getProductsByCollectionQuery,
          variables: {
            collection: selectedCollection,
            first: 12,
            after: cursor
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Safely access nested properties
      const collectionProducts = data?.body?.data?.collection?.products;
      
      if (collectionProducts?.edges) {
        const newProducts = collectionProducts.edges.map((edge: any) => ({
          ...edge.node,
          uniqueId: `${edge.node.id}-${Date.now()}-${Math.random()}`,
          image: edge.node.images?.edges?.[0]?.node || edge.node.featuredImage || {
            url: '',
            altText: 'Product image not available'
          }
        }));
        
        setProducts(prev => [...prev, ...newProducts]);
        setHasMore(collectionProducts.pageInfo.hasNextPage);
        if (collectionProducts.pageInfo.hasNextPage) {
          setCursor(collectionProducts.pageInfo.endCursor);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setHasMore(false);
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  };

  // Load more when scrolled to bottom
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchProducts();
    }
  }, [inView, hasMore, isLoading]);

  // Safe effect that only runs when editing
  useEffect(() => {
    if (editingProductId && !selectedProduct) {  // Only run if we're editing and no product is selected
      const productToEdit = selectedProducts.find(p => p.id === editingProductId);
      if (productToEdit && productToEdit.originalProduct) {
        const originalProduct = productToEdit.originalProduct as unknown as ShopifyProduct;
        setSelectedProduct({
          id: productToEdit.id,
          variantId: productToEdit.variantId,
          collection: productToEdit.collection,
          variant: productToEdit.variant,
          originalProduct: originalProduct,
          title: productToEdit.title,
          image: productToEdit.image,
          availableForSale: true,
          priceRange: {
            minVariantPrice: {
              amount: productToEdit.price.toString(),
              currencyCode: 'USD'
            }
          }
        });
      }
    }
  }, [editingProductId, selectedProducts, selectedProduct]);

  // Safe modal close that preserves existing behavior
  const handleModalClose = () => {
    setSelectedProduct(null);
    if (editingProductId) {
      dispatch({ type: 'EDIT_PRODUCT', payload: '' });
    }
  };

  return (
    <div className="h-full space-y-6">
      {/* Container that matches product grid width */}
      <div className="mx-auto max-w-[900px] px-4"> {/* Reduced from 1200px to 900px */}
        {/* Horizontal Collection Carousel */}
        <div className="w-full overflow-hidden border-b border-primary-200 bg-white/50 pb-4 dark:border-primary-700 dark:bg-primary-800/50">
          <CollectionCarousel
            collections={collections}
            selectedCollection={selectedCollection}
            onSelect={handleCollectionSelect}
          />
        </div>

        {/* Products Grid */}
        <div className="relative space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <motion.button
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedProduct(product)}
                className="group relative overflow-hidden rounded-lg border border-primary-200 bg-white p-4 text-left transition-all hover:border-accent-500 dark:border-primary-700 dark:bg-primary-800"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  {product.image?.url ? (
                    <Image
                      src={product.image.url}
                      alt={product.image.altText || 'Product image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                      <Package className="h-12 w-12 text-primary-400" />
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    {product.title}
                  </h3>
                  {product.priceRange?.minVariantPrice?.amount && (
                    <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  )}
                </div>

                {!product.availableForSale && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                      Out of Stock
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-4" />

          {/* Empty state */}
          {!isLoading && products.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary-200 dark:border-primary-700">
              <Package className="h-12 w-12 text-primary-400" />
              <p className="mt-4 text-center text-primary-600 dark:text-primary-300">
                No products found in this collection.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct as unknown as import('@/lib/shopify/types').Product}
            onClose={handleModalClose}
            onAdd={(product) => {
              if (editingProductId) {
                dispatch({ type: 'REMOVE_PRODUCT', payload: editingProductId });
                dispatch({ type: 'ADD_PRODUCT', payload: { ...product } });
              } else {
                // Preserve original add behavior
                dispatch({ type: 'ADD_PRODUCT', payload: { ...product } });
              }
              handleModalClose();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
