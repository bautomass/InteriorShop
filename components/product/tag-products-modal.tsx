//components/product/tag-products-modal.tsx
'use client';

import { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface TagProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  products: Product[];
  isLoading?: boolean;
}

type SortOption = 'none' | 'price-asc' | 'price-desc';

export function TagProductsModal({ isOpen, onClose, tag, products, isLoading = false }: TagProductsModalProps) {
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const { formatPrice } = useCurrency();

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
    }
    if (sortBy === 'price-desc') {
      return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
    }
    return 0;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] w-full min-w-0 bg-white z-50 
                     shadow-2xl overflow-y-auto rounded-t-xl
                     md:h-full md:w-full md:max-w-md md:right-0 md:left-auto md:top-0 md:rounded-none
                     md:transform-none md:transition-none"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-3 sm:px-4 py-2 sm:py-3 border-b border-[#B5A48B]/20
                          md:px-6 md:py-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-[#6B5E4C] pr-2 min-w-0 truncate">
                  Products tagged with #{tag}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 sm:p-1.5 md:p-2 text-[#6B5E4C] hover:text-[#8C7E6A] 
                           transition-colors duration-200 flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
                <span className="text-xs text-[#8C7E6A] mb-1 sm:mb-0 flex-shrink-0">
                  Sort by:
                </span>
                <div className="flex gap-2 w-full sm:w-auto min-w-0">
                  <button
                    onClick={() => setSortBy(sortBy === 'price-asc' ? 'none' : 'price-asc')}
                    className={`flex-1 sm:flex-none min-w-0 px-2 sm:px-3 py-1.5 text-xs rounded-md 
                             flex items-center justify-center gap-1 sm:gap-1.5
                             transition-colors duration-200 ${
                               sortBy === 'price-asc'
                                 ? 'bg-[#6B5E4C] text-white'
                                 : 'bg-[#6B5E4C]/10 text-[#6B5E4C] hover:bg-[#6B5E4C]/20'
                             }`}
                  >
                    <ArrowUpWideNarrow className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">Low-High</span>
                  </button>
                  <button
                    onClick={() => setSortBy(sortBy === 'price-desc' ? 'none' : 'price-desc')}
                    className={`flex-1 sm:flex-none min-w-0 px-2 sm:px-3 py-1.5 text-xs rounded-md 
                             flex items-center justify-center gap-1 sm:gap-1.5
                             transition-colors duration-200 ${
                               sortBy === 'price-desc'
                                 ? 'bg-[#6B5E4C] text-white'
                                 : 'bg-[#6B5E4C]/10 text-[#6B5E4C] hover:bg-[#6B5E4C]/20'
                             }`}
                  >
                    <ArrowDownWideNarrow className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">High-Low</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {isLoading ? (
                // Loading state
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="bg-[#B5A48B]/10 rounded-lg h-[120px]"
                    />
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <p className="text-center text-[#8C7E6A] text-xs sm:text-sm">
                  No products found with this tag.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {sortedProducts.map((product) => {
                    const primaryImage = product.featuredImage?.url || product.images?.[0]?.url;
                    const secondaryImage = product.images?.[1]?.url || primaryImage;

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.handle}`}
                        className="group min-w-0"
                        onClick={onClose}
                      >
                        <div className="aspect-square relative rounded-lg overflow-hidden 
                                    border border-[#B5A48B]/20 group">
                          {primaryImage && (
                            <Image
                              src={primaryImage}
                              alt={product.title}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover transition-opacity duration-300 
                                     group-hover:opacity-0"
                            />
                          )}
                          {secondaryImage && (
                            <Image
                              src={secondaryImage}
                              alt={`${product.title} - Alternate View`}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover absolute top-0 left-0 
                                     opacity-0 transition-opacity duration-300 
                                     group-hover:opacity-100"
                            />
                          )}
                        </div>
                        <div className="mt-1 sm:mt-2 min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-[#6B5E4C] 
                                     truncate group-hover:text-[#8C7E6A]">
                            {product.title}
                          </h3>
                          <p className="text-xs text-[#8C7E6A] truncate">
                            {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 