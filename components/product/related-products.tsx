'use client';

import { ProductCardCompact } from '@/components/shared/ProductCardCompact';
import { Product } from '@/lib/shopify/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProductsClient({ products }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const updateVisibleProducts = () => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const productWidth = 300 + 24; // card width + gap
        const visible = Math.floor(containerWidth / productWidth);
        setVisibleProducts(visible);
      }
    };

    updateVisibleProducts();
    window.addEventListener('resize', updateVisibleProducts);
    return () => window.removeEventListener('resize', updateVisibleProducts);
  }, []);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      const maxScroll = scrollWidth - clientWidth;
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = Math.abs(scrollLeft - maxScroll) < 1;

      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const productWidth = 300 + 24; // card width + gap
    const currentScroll = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    
    let newScrollPosition;
    if (direction === 'left') {
      newScrollPosition = Math.max(0, currentScroll - containerWidth);
    } else {
      newScrollPosition = Math.min(
        scrollWidth - containerWidth,
        currentScroll + containerWidth
      );
    }
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, [visibleProducts]);

  useEffect(() => {
    const sorted = [...products];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
        break;
      case 'price-desc':
        sorted.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
        break;
      case 'popular':
        break;
    }
    setSortedProducts(sorted);
  }, [sortOption, products]);

  const filterSection = (
    <div className="relative inline-block mb-6">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-[#6B5E4C] 
                 border-[#B5A48B] hover:bg-[#FAF7F2] transition-colors duration-200"
      >
        <span>Sort by: {sortOption === 'popular' ? 'Most Popular' : 
              sortOption === 'price-asc' ? 'Price: Low to High' : 
              'Price: High to Low'}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 
                     ${isFilterOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 z-40 w-48 mt-2 bg-white border rounded-md shadow-lg 
                       border-[#B5A48B] overflow-hidden"
            >
              <div className="py-1">
                {[
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value as typeof sortOption);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#FAF7F2] transition-colors 
                              duration-200 ${sortOption === option.value ? 
                              'bg-[#FAF7F2] text-[#6B5E4C]' : 'text-[#8C7E6A]'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const MAX_PRODUCTS = 30;
  const limitedProducts = sortedProducts.slice(0, MAX_PRODUCTS);

  return (
    <div className="w-full max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-light text-[#6B5E4C]">
              Related Products
            </h2>
            <Sparkles className="w-5 h-5 text-[#B5A48B] animate-pulse" />
          </div>
          <p className="mt-2 text-[#8C7E6A]">
            You might also like these carefully selected pieces
          </p>
        </motion.div>
      </div>

      {filterSection}

      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Navigation Arrows */}
        <AnimatePresence>
          {canScrollLeft && isHovering && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                       rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center 
                       text-white transition-all duration-300 hover:bg-black/60 z-30"
              aria-label="Previous products"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {canScrollRight && isHovering && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                       rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center 
                       text-white transition-all duration-300 hover:bg-black/60 z-30"
              aria-label="Next products"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Products Container */}
        <div className="relative overflow-hidden">
          <motion.div
            ref={scrollContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={checkScrollability}
          >
            {limitedProducts.map((product, index) => (
              <motion.div
                key={product.handle}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-none w-[280px] sm:w-[300px] snap-start"
              >
                <Link href={`/product/${product.handle}`} className="block">
                  <ProductCardCompact
                    product={product}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 