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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50
                     shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#B5A48B]/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#6B5E4C]">
                  Products tagged with #{tag}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-[#6B5E4C] hover:text-[#8C7E6A] 
                           transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C7E6A]">Sort by:</span>
                <button
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'none' : 'price-asc')}
                  className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5
                           transition-colors duration-200 ${
                             sortBy === 'price-asc'
                               ? 'bg-[#6B5E4C] text-white'
                               : 'bg-[#6B5E4C]/10 text-[#6B5E4C] hover:bg-[#6B5E4C]/20'
                           }`}
                >
                  <ArrowUpWideNarrow className="w-4 h-4" />
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy(sortBy === 'price-desc' ? 'none' : 'price-desc')}
                  className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5
                           transition-colors duration-200 ${
                             sortBy === 'price-desc'
                               ? 'bg-[#6B5E4C] text-white'
                               : 'bg-[#6B5E4C]/10 text-[#6B5E4C] hover:bg-[#6B5E4C]/20'
                           }`}
                >
                  <ArrowDownWideNarrow className="w-4 h-4" />
                  Price: High to Low
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
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
                <p className="text-center text-[#8C7E6A] text-sm">
                  No products found with this tag.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {sortedProducts.map((product) => {
                    const primaryImage = product.featuredImage?.url || product.images?.[0]?.url;
                    const secondaryImage = product.images?.[1]?.url || primaryImage;

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.handle}`}
                        className="group"
                        onClick={onClose}
                      >
                        <div className="aspect-square relative rounded-lg overflow-hidden 
                                      border border-[#B5A48B]/20 group">
                          {primaryImage && (
                            <Image
                              src={primaryImage}
                              alt={product.title}
                              fill
                              className="object-cover transition-opacity duration-300 
                                       group-hover:opacity-0"
                            />
                          )}
                          {secondaryImage && (
                            <Image
                              src={secondaryImage}
                              alt={`${product.title} - Alternate View`}
                              fill
                              className="object-cover absolute top-0 left-0 
                                       opacity-0 transition-opacity duration-300 
                                       group-hover:opacity-100"
                            />
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className="text-sm font-medium text-[#6B5E4C] 
                                       truncate group-hover:text-[#8C7E6A]">
                            {product.title}
                          </h3>
                          <p className="text-xs text-[#8C7E6A]">
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