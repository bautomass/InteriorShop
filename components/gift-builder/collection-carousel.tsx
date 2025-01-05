import type { Collection } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface CollectionImage {
  url: string;
  altText?: string;
}

interface CollectionCarouselProps {
  collections: Collection[];
  selectedCollection: string | null;
  onSelect: (collectionId: string | null) => void;
}

export function CollectionCarousel({ collections, selectedCollection, onSelect }: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: true
  });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowScrollButtons({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 10
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full px-8 mb-2">
      {/* Left gradient overlay */}
      <div className="pointer-events-none absolute left-8 top-0 z-10 h-full w-16 bg-gradient-to-r from-white dark:from-primary-950" />

      <AnimatePresence>
        {showScrollButtons.left && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 active:bg-gray-100 dark:bg-primary-800 dark:hover:bg-primary-700"
          >
            <ChevronLeft className="h-6 w-6 text-primary-900 dark:text-primary-100" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full gap-3 overflow-x-auto scroll-smooth pb-3 pt-1 snap-x snap-mandatory scrollbar-none"
      >
        <div className="flex min-w-0 gap-3">
          {collections.map((collection) => (
            <button
              key={collection.handle}
              onClick={() => onSelect(collection.handle)}
              className={cn(
                "flex-none snap-center flex flex-col items-center min-w-[160px] max-w-[160px] rounded-lg border overflow-hidden transition-all hover:shadow-md",
                selectedCollection === collection.handle 
                  ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20" 
                  : "border-primary-200 dark:border-primary-700"
              )}
            >
              {collection.image && (
                <div className="w-full aspect-[4/3] relative overflow-hidden">
                  <img
                    src={collection.image.url}
                    alt={collection.title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-2 w-full">
                <span className="block text-sm font-medium truncate">{collection.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right gradient overlay */}
      <div className="pointer-events-none absolute right-8 top-0 z-10 h-full w-16 bg-gradient-to-l from-white dark:from-primary-950" />

      <AnimatePresence>
        {showScrollButtons.right && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 active:bg-gray-100 dark:bg-primary-800 dark:hover:bg-primary-700"
          >
            <ChevronRight className="h-6 w-6 text-primary-900 dark:text-primary-100" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 