
'use client';
// /components/collections/PaginatedProductGrid.tsx
import ProductCardWrapper from '@/components/shared/ProductCardWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface PaginatedProductGridProps {
  products: any[];
  initialProductCount?: number;
  productsPerLoad?: number;
}

export default function PaginatedProductGrid({
  products,
  initialProductCount = 8,
  productsPerLoad = 8
}: PaginatedProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState(initialProductCount);
  const hasMoreProducts = visibleProducts < products.length;

  const handleLoadMore = () => {
    setVisibleProducts(prev => Math.min(prev + productsPerLoad, products.length));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {products.slice(0, visibleProducts).map((product, index) => (
            <motion.div
              key={product.handle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.3,
                delay: index % productsPerLoad * 0.1 // Stagger animation for new products
              }}
            >
              <ProductCardWrapper
                product={product}
                href={`/product/${product.handle}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMoreProducts && (
        <div className="flex justify-center">
          <motion.button
            onClick={handleLoadMore}
            className="group relative px-6 py-3 text-sm font-medium
                     bg-primary-100 dark:bg-primary-800
                     text-primary-900 dark:text-primary-100
                     hover:bg-primary-200 dark:hover:bg-primary-700
                     rounded-lg transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative flex items-center gap-2">
              <span>View More Products</span>
              <span className="text-xs">
                ({products.length - visibleProducts} remaining)
              </span>
            </span>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                         bg-gradient-to-r from-transparent via-white/10 to-transparent
                         -translate-x-full group-hover:translate-x-full
                         transition-all duration-1000 ease-in-out" />
          </motion.button>
        </div>
      )}
    </div>
  );
}