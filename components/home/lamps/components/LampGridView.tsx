//LampGridView.tsx
'use client';

import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { memo, useCallback, useState } from 'react';
import { LampProductCard } from './LampProductCard';
import { LampGridViewProps } from '../types/lamp-types';

export const LampGridView = memo(function LampGridView({ 
  products, 
  cardsToShow, 
  onQuickView 
}: LampGridViewProps) {
  const [visibleRows, setVisibleRows] = useState(2);
  const productsPerRow = cardsToShow;
  const totalRows = Math.ceil(products.length / productsPerRow);
  const visibleProducts = products.slice(0, visibleRows * productsPerRow);

  const showMoreRows = useCallback(() => {
    setVisibleRows((prev) => Math.min(prev + 2, totalRows));
  }, [totalRows]);

  const handleQuickView = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView(product);
    },
    [onQuickView]
  );

  return (
    <div className="space-y-12">
      <div
        className="grid w-full gap-6 md:gap-8"
        style={{
          gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))`
        }}
      >
        {visibleProducts.map((product: Product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LampProductCard
              product={product}
              onQuickView={(e) => handleQuickView(e, product)}
              cardsToShow={cardsToShow}
            />
          </motion.div>
        ))}
      </div>

      {visibleRows < totalRows && (
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={showMoreRows}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'px-8 py-3 text-base font-medium',
              'bg-primary-900',
              'text-white',
              'rounded-md shadow-lg',
              'hover:bg-primary-800',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            )}
          >
            Show More Products
          </motion.button>
        </div>
      )}
    </div>
  );
});

LampGridView.displayName = 'LampGridView';