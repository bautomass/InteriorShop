'use client';

import { Collection } from '@/lib/shopify/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface CollectionsShowcaseProps {
  className?: string;
}

export function CollectionsShowcase({ className = '' }: CollectionsShowcaseProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        
        const filteredCollections = data.collections.filter((collection: Collection) => 
          !['freshfreshfresh, new-arrivals,top-products,home-collection, sale, collections, best sellers'].includes(collection.handle)
        );
        const shuffled = filteredCollections.sort(() => 0.5 - Math.random());
        setCollections(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [collections]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -280 : 280;
      
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Update active index
      const newIndex = direction === 'left' 
        ? Math.max(0, activeIndex - 1)
        : Math.min(collections.length - 1, activeIndex + 1);
      setActiveIndex(newIndex);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const itemWidth = 280; // Approximate width of each item
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  if (!collections.length) return null;

  return (
    <div className={`w-full max-w-[1400px] mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${className} relative z-[1]`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#F5EFE6] rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E9DFD4] rounded-full blur-3xl opacity-20 -z-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="mb-10 sm:mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-1 bg-gradient-to-b from-[#6B5E4C] to-[#B5A48B] rounded-full" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#6B5E4C]">
            Explore Our Collections
          </h2>
          <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#B5A48B] animate-pulse" />
        </div>
        <p className="mt-2 text-sm sm:text-base text-[#8C7E6A] max-w-2xl">
          Discover more categories that might interest you, carefully curated for your unique style
        </p>
      </motion.div>

      <div className="relative">
        <AnimatePresence>
          {showScrollButtons && (
            <>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 rounded-full p-3 shadow-lg hidden md:flex items-center justify-center
                         hover:bg-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeIndex === 0}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-[#6B5E4C]" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 rounded-full p-3 shadow-lg hidden md:flex items-center justify-center
                         hover:bg-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeIndex === collections.length - 1}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-[#6B5E4C]" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 pb-4 sm:pb-0"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.handle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0"
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <Link 
                href={`/collections/${collection.handle}`}
                className="group block relative overflow-hidden rounded-xl aspect-[3/4] z-[2]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/60 group-hover:via-black/30 group-hover:to-black/70 transition-colors duration-500 z-[15]" />
                
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out z-[10]"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#FAF7F2] z-[10]" />
                )}
                
                <div className="absolute inset-x-0 bottom-0 z-[20] p-5 sm:p-6">
                  <motion.div 
                    initial={false}
                    animate={{ y: isHovering === index ? -8 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-start"
                  >
                    <motion.h3 
                      className="text-white text-lg sm:text-xl font-medium mb-2 sm:mb-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {collection.title}
                    </motion.h3>
                    
                    {collection.description && (
                      <motion.p 
                        className="text-white/90 text-sm line-clamp-2 mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {collection.description}
                      </motion.p>
                    )}
                    
                    <motion.div
                      className="flex items-center gap-2 text-white text-sm border-b border-white/50 pb-1
                               group-hover:border-white transition-colors duration-300"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots for mobile */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {collections.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-[#6B5E4C] w-4' 
                  : 'bg-[#B5A48B]'
              }`}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const scrollAmount = index * 280;
                  scrollContainerRef.current.scrollTo({ 
                    left: scrollAmount, 
                    behavior: 'smooth' 
                  });
                  setActiveIndex(index);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
