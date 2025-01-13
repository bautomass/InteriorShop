import { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import CanvaProductCard from '../shared/CanvaProductCard';

interface MobileCanvasViewProps {
  products: Product[];
  quickView: any;
  onSort: (direction: 'asc' | 'desc') => void;
  onQuickView: (product: Product) => void;
}

const MobileCanvasView = ({ 
  products, 
  quickView,
  onSort,
  onQuickView
}: MobileCanvasViewProps) => {
  const [currentView, setCurrentView] = useState('grid');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(4);

  // Swipe handlers for immersive view
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeIndex < products.length - 1 && !isTransitioning && currentView === 'immersive') {
        setIsTransitioning(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsTransitioning(false), 400);
      }
    },
    onSwipedRight: () => {
      if (activeIndex > 0 && !isTransitioning && currentView === 'immersive') {
        setIsTransitioning(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsTransitioning(false), 400);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  // Hide tip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
    onSort(direction);
  };

  const handleShowMore = () => {
    setVisibleProducts(prev => Math.min(prev + 4, products.length));
  };

  return (
    <div className="w-full min-h-screen px-2">
      {/* Sticky Header with Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-primary-50/80 dark:bg-primary-900/80 backdrop-blur-md py-3"
      >
        <div className="flex items-center justify-between px-2">
          {/* Sort Controls */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleSort('asc')}
              className={cn(
                "p-2 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                "border border-primary-900/20 dark:border-primary-100/20",
                sortDirection === 'asc'
                  ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
                  : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
              )}
              aria-label="Sort by price: low to high"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="12" y1="20" x2="12" y2="4" />
                <polyline points="4 12 12 4 20 12" />
              </svg>
            </button>
            <button
              onClick={() => handleSort('desc')}
              className={cn(
                "p-2 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                "border border-primary-900/20 dark:border-primary-100/20",
                sortDirection === 'desc'
                  ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
                  : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
              )}
              aria-label="Sort by price: high to low"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="12" y1="4" x2="12" y2="20" />
                <polyline points="4 12 12 20 20 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Controls for Immersive View */}
          {currentView === 'immersive' && (
            <div className="flex items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => activeIndex > 0 && setActiveIndex(prev => prev - 1)}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  "bg-primary-100/50 dark:bg-primary-800/50",
                  "border border-primary-900/20 dark:border-primary-100/20",
                  "text-primary-900 dark:text-primary-100",
                  "disabled:opacity-50",
                  "transition-all duration-200"
                )}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              {/* Pagination Dots */}
              <div className="relative flex gap-1 w-24 overflow-hidden">
                <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-primary-50/80 dark:from-primary-900/80 to-transparent z-10" />
                <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-primary-50/80 dark:from-primary-900/80 to-transparent z-10" />
                <div 
                  className="flex gap-1 transition-transform duration-300"
                  style={{
                    transform: `translateX(${(() => {
                      const dotsToShow = 7; // Number of dots visible in the container
                      const centerIndex = Math.floor(dotsToShow / 2);
                      
                      if (products.length <= dotsToShow) {
                        return 0; // Don't translate if all dots fit
                      }
                      
                      if (activeIndex <= centerIndex) {
                        return 0; // Keep at start until center point is reached
                      }
                      
                      if (activeIndex >= products.length - (dotsToShow - centerIndex)) {
                        return -((products.length - dotsToShow) * 6); // Lock to end
                      }
                      
                      return -(activeIndex - centerIndex) * 6; // Center the active dot
                    })()}px)`
                  }}
                >
                  {products.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 shrink-0
                        ${idx === activeIndex 
                          ? 'w-4 bg-primary-900 dark:bg-primary-100' 
                          : 'w-1.5 bg-primary-400 dark:bg-primary-600'
                        }`}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => activeIndex < products.length - 1 && setActiveIndex(prev => prev + 1)}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  "bg-primary-100/50 dark:bg-primary-800/50",
                  "border border-primary-900/20 dark:border-primary-100/20",
                  "text-primary-900 dark:text-primary-100",
                  "disabled:opacity-50",
                  "transition-all duration-200"
                )}
                disabled={activeIndex === products.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setCurrentView('grid')}
              className={cn(
                "p-2 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                "border border-primary-900/20 dark:border-primary-100/20",
                currentView === 'grid'
                  ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
                  : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('immersive')}
              className={cn(
                "p-2 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                "border border-primary-900/20 dark:border-primary-100/20",
                currentView === 'immersive'
                  ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
                  : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
              )}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentView === 'grid' ? (
          // Grid View
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8 mt-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, visibleProducts).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CanvaProductCard 
                    product={product} 
                    onQuickView={onQuickView}
                    cardsToShow={2}
                  />
                </motion.div>
              ))}
            </div>

            {visibleProducts < products.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleShowMore}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "px-6 py-2.5 text-sm font-medium",
                    "bg-primary-900 dark:bg-primary-100",
                    "text-white dark:text-primary-900",
                    "rounded-md shadow-sm",
                    "hover:bg-primary-800 dark:hover:bg-primary-200",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  )}
                >
                  Show More Products
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Immersive View
          <motion.div
            key="immersive"
            {...handlers}
            className="relative mt-4"
          >
            {/* Swipe Tip */}
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-20 
                           bg-black/80 text-white px-4 py-2 rounded-full
                           flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Swipe to browse</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Single Product View */}
            <div className="relative min-h-fit pb-4">
              {products.map((product, idx) => {
                const isActive = idx === activeIndex;
                const isPrevious = idx === activeIndex - 1;
                const isNext = idx === activeIndex + 1;

                if (!isActive && !isPrevious && !isNext) return null;

                return (
                  <motion.div
                    key={product.id}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.85,
                      x: isActive ? 0 : isPrevious ? '-100%' : '100%',
                      opacity: isActive ? 1 : 0.3,
                      zIndex: isActive ? 10 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0"
                  >
                    <CanvaProductCard 
                      product={product} 
                      onQuickView={onQuickView}
                      cardsToShow={1}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileCanvasView;