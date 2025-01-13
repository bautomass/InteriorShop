"use client"
import { PriceSortFilter } from '@/components/filter/PriceSortFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList, MoveHorizontal, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSwipeable } from 'react-swipeable';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductCard } from '@/components/shared/ProductCard';

type ViewSettings = {
  minCards: number
  maxCards: number
  defaultCards: number
}

const useCardsView = (settings: ViewSettings) => {
  const [cardsToShow, setCardsToShow] = useState(settings.defaultCards)
  
  const handleViewChange = useCallback((value: number) => {
    setCardsToShow(value)
  }, [])

  return { cardsToShow, handleViewChange }
}

// Add the ViewControls component
const ViewControls = ({ current, min, max, onChange, isGridView, onViewChange }: { 
  current: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isGridView: boolean;
  onViewChange: (value: boolean) => void;
}) => (
  <div className="flex items-center gap-2 mb-4 absolute right-0 top-0 z-10">
    <button
      onClick={() => onViewChange(!isGridView)}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
        "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
        "focus:outline-none focus:ring-2 focus:ring-primary-500",
        "border border-primary-900/20 dark:border-primary-100/20",
        isGridView
          ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
          : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
      )}
    >
      <div className="flex items-center gap-2">
        {isGridView ? (
          <>
            <LayoutList className="w-4 h-4" />
            <span>Carousel View</span>
          </>
        ) : (
          <>
            <LayoutGrid className="w-4 h-4" />
            <span>Grid View</span>
          </>
        )}
      </div>
    </button>

    <div className="h-8 w-px bg-primary-900/20 dark:bg-primary-100/20" />

    {[...Array(max - min + 1)].map((_, idx) => {
      const value = min + idx;
      return (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            "border border-primary-900/20 dark:border-primary-100/20",
            value === current
              ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent"
              : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
          )}
        >
          {value}
        </button>
      );
    })}
  </div>
);

const GridView = memo(({ 
  products, 
  cardsToShow, 
  onQuickView 
}: { 
  products: Product[]
  cardsToShow: number
  onQuickView: (e: React.MouseEvent, product: Product) => void
}) => {
  const [visibleRows, setVisibleRows] = useState(2)
  const productsPerRow = cardsToShow
  const totalRows = Math.ceil(products.length / productsPerRow)
  const visibleProducts = products.slice(0, visibleRows * productsPerRow)

  const showMoreRows = () => {
    setVisibleRows(prev => Math.min(prev + 2, totalRows))
  }

  return (
    <div className="space-y-12">
      <div 
        className="grid gap-6 md:gap-8 w-full"
        style={{ 
          gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))` 
        }}
      >
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard 
              product={product} 
              onQuickView={(e) => onQuickView(e, product)}
              cardsToShow={cardsToShow}
            />
          </motion.div>
        ))}
      </div>

      {visibleRows < totalRows && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={showMoreRows}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "px-8 py-3 text-base font-medium",
              "bg-primary-900 dark:bg-primary-100",
              "text-white dark:text-primary-900",
              "rounded-md shadow-lg",
              "hover:bg-primary-800 dark:hover:bg-primary-200",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            )}
          >
            Show More Products
          </motion.button>
        </div>
      )}
    </div>
  )
})

GridView.displayName = 'GridView'

// Add MobileProductView component
const MobileProductView = memo(({ products, quickView, onSort }: { 
  products: Product[]
  quickView: ReturnType<typeof useQuickView>
  onSort: (direction: 'asc' | 'desc') => void
}) => {
  const [currentView, setCurrentView] = useState('grid');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(4);
  
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
      {/* View Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-primary-50/80 dark:bg-primary-900/80 backdrop-blur-md py-3"
      >
        <div className="flex items-center justify-between px-2">
          {/* Price Sort Controls */}
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

          {/* Navigation Controls - Moved from bottom */}
          {currentView === 'immersive' && (
            <div className="flex items-center gap-2">
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
              <div className="flex gap-1">
                {products.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300
                      ${idx === activeIndex 
                        ? 'w-4 bg-primary-900 dark:bg-primary-100' 
                        : 'w-1.5 bg-primary-400 dark:bg-primary-600'
                      }`}
                  />
                ))}
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

          {/* View Toggle Buttons */}
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
              <MoveHorizontal className="w-4 h-4" />
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
                  <ProductCard 
                    product={product} 
                    onQuickView={(e) => quickView.openQuickView(product)}
                    cardsToShow={2}
                  />
                </motion.div>
              ))}
            </div>

            {/* Show More Button */}
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
                  <MoveHorizontal className="w-4 h-4" />
                  <span className="text-sm">Swipe to browse</span>
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
                    <ProductCard 
                      product={product} 
                      onQuickView={(e) => quickView.openQuickView(product)}
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
});

MobileProductView.displayName = 'MobileProductView';

export default function NewArrivalsCollection() {
  const quickView = useQuickView()
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSlideHovered, setIsSlideHovered] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isGridView, setIsGridView] = useState(true)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true)
        const response = await fetch('/api/new-arrivals')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error('Error fetching new arrivals:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  useEffect(() => {
    setSortedProducts(products)
  }, [products])

  const handlePriceSort = useCallback((direction: 'asc' | 'desc') => {
    const sorted = [...sortedProducts].sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount)
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount)
      return direction === 'asc' ? priceA - priceB : priceB - priceA
    })
    setSortedProducts(sorted)
  }, [sortedProducts])

  const viewSettings: ViewSettings = {
    minCards: 4,
    maxCards: 6,
    defaultCards: 4
  }

  const { cardsToShow, handleViewChange } = useCardsView(viewSettings)

  const LoadingSkeleton = () => (
    <div className="w-full py-12 bg-primary-50 dark:bg-primary-900">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-12">
          <div className="flex items-center justify-center gap-3">
            <div className="h-6 w-6 bg-primary-200 dark:bg-primary-700 rounded" />
            <div className="h-8 w-64 bg-primary-200 dark:bg-primary-700 rounded" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="aspect-[3/4] bg-primary-200 dark:bg-primary-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const handleSwiperInit = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance);
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  useEffect(() => {
    if (swiper) {
      swiper.update();
      setIsEnd(swiper.isEnd);
    }
  }, [swiper, products]);

  if (loading) return <LoadingSkeleton />
  if (error) return (
    <div className="w-full py-12 bg-primary-50 dark:bg-primary-900">
      <div className="container mx-auto px-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  )
  if (!products.length) return null

  return (
    <>
      <section 
        ref={ref}
        className="w-full bg-primary-50 dark:bg-primary-900 overflow-hidden" 
        aria-label="New Arrivals Collection"
      >
        <div className="container mx-auto relative py-12">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-12"
          >
            {/* Title and Line */}
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                New Arrivals
              </h2>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
            </div>
          </motion.div>

          {/* Products Section */}
          <div className="relative">
            <div className="relative max-w-[1700px] mx-auto">
              {/* View Controls - Desktop only */}
              {!isMobile && (
                <div className="hidden lg:block relative h-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <PriceSortFilter onSort={handlePriceSort} />
                    </div>

                    <ViewControls
                      current={cardsToShow}
                      min={viewSettings.minCards}
                      max={viewSettings.maxCards}
                      onChange={handleViewChange}
                      isGridView={isGridView}
                      onViewChange={setIsGridView}
                    />
                  </div>
                </div>
              )}

              {/* Conditional Mobile/Desktop Rendering */}
              {isMobile ? (
                <MobileProductView 
                  products={sortedProducts}
                  quickView={quickView}
                  onSort={handlePriceSort}
                />
              ) : (
                <div className="relative">
                  {isGridView ? (
                    <GridView
                      products={sortedProducts}
                      cardsToShow={cardsToShow}
                      onQuickView={(e, product) => quickView.openQuickView(product)}
                    />
                  ) : (
                    <div 
                      className="relative"
                      onMouseEnter={() => setIsSlideHovered(true)}
                      onMouseLeave={() => setIsSlideHovered(false)}
                    >
                      <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={cardsToShow}
                        loop={false}
                        speed={1000}
                        autoplay={{
                          delay: 6000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true
                        }}
                        navigation={{
                          prevEl: '.custom-swiper-button-prev',
                          nextEl: '.custom-swiper-button-next',
                          enabled: true,
                        }}
                        breakpoints={{
                          0: { 
                            slidesPerView: 1,
                            spaceBetween: 16 
                          },
                          480: { 
                            slidesPerView: 2,
                            spaceBetween: 16
                          },
                          768: { 
                            slidesPerView: 3,
                            spaceBetween: 16
                          },
                          1024: { 
                            slidesPerView: cardsToShow,
                            spaceBetween: 16
                          }
                        }}
                        className="px-0"
                        onSwiper={handleSwiperInit}
                        onSlideChange={(swiper) => {
                          setIsBeginning(swiper.isBeginning)
                          setIsEnd(swiper.isEnd)
                        }}
                      >
                        {sortedProducts.map((product) => (
                          <SwiperSlide key={product.id}>
                            <ProductCard 
                              product={product} 
                              onQuickView={(e) => quickView.openQuickView(product)}
                              cardsToShow={cardsToShow}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      
                      {/* Navigation Buttons */}
                      <button 
                        className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-20
                                  w-10 h-14 bg-primary-800/95 dark:bg-primary-100/95 backdrop-blur-sm
                                  flex items-center justify-center overflow-hidden isolate
                                  rounded-l-md
                                  transition-all duration-300 ease-out
                                  group hover:w-12 
                                  disabled:opacity-50
                                  shadow-[0_0_10px_rgba(83,66,56,0.3)]
                                  hover:shadow-[0_0_20px_rgba(83,66,56,0.5)]
                                  active:scale-95 active:shadow-inner
                                  cursor-pointer disabled:cursor-default"
                        aria-label="Previous slide"
                        disabled={isBeginning}
                      >
                        <div className="relative z-20 transition-all duration-300 
                                        group-hover:-translate-x-0.5 group-active:scale-90
                                        group-hover:drop-shadow-[0_0_8px_rgba(199,186,168,0.5)]">
                          {isBeginning ? (
                            <div className="relative">
                              <ChevronLeft className="h-6 w-6 text-primary-100 dark:text-primary-900
                                                 group-hover:opacity-0 transition-opacity duration-200" />
                              <X className="h-6 w-6 text-red-400 dark:text-red-400
                                          absolute inset-0 opacity-0 group-hover:opacity-100 
                                          transition-opacity duration-200
                                          scale-110 stroke-[2.5]"
                              />
                            </div>
                          ) : (
                            <ChevronLeft className="h-6 w-6 text-primary-100 dark:text-primary-900" />
                          )}
                        </div>
                        
                        <div className="absolute inset-0 z-30 rounded-l-md opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300
                                        bg-gradient-to-r from-accent-300/50 to-transparent
                                        [mask-image:linear-gradient(to_right,white_2px,transparent_2px)]" />

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300
                                        bg-gradient-to-r from-primary-300/30 via-primary-400/20 to-transparent
                                        blur-md" />
                      </button>

                      <button 
                        className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20
                                  w-10 h-14 bg-primary-800/95 dark:bg-primary-100/95 backdrop-blur-sm
                                  flex items-center justify-center overflow-hidden isolate
                                  rounded-r-md
                                  transition-all duration-300 ease-out
                                  group hover:w-12
                                  disabled:opacity-50
                                  shadow-[0_0_10px_rgba(83,66,56,0.3)]
                                  hover:shadow-[0_0_20px_rgba(83,66,56,0.5)]
                                  active:scale-95 active:shadow-inner
                                  cursor-pointer disabled:cursor-default"
                        aria-label="Next slide"
                        disabled={isEnd}
                      >
                        <div className="relative z-20 transition-all duration-300 
                                        group-hover:translate-x-0.5 group-active:scale-90
                                        group-hover:drop-shadow-[0_0_8px_rgba(199,186,168,0.5)]">
                          {isEnd ? (
                            <div className="relative">
                              <ChevronRight className="h-6 w-6 text-primary-100 dark:text-primary-900
                                                 group-hover:opacity-0 transition-opacity duration-200" />
                              <X className="h-6 w-6 text-red-400 dark:text-red-400
                                          absolute inset-0 opacity-0 group-hover:opacity-100 
                                          transition-opacity duration-200
                                          scale-110 stroke-[2.5]"
                              />
                            </div>
                          ) : (
                            <ChevronRight className="h-6 w-6 text-primary-100 dark:text-primary-900" />
                          )}
                        </div>
                        
                        <div className="absolute inset-0 z-30 rounded-r-md opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300
                                        bg-gradient-to-l from-accent-300/50 to-transparent
                                        [mask-image:linear-gradient(to_left,white_2px,transparent_2px)]" />

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300
                                        bg-gradient-to-l from-primary-300/30 via-primary-400/20 to-transparent
                                        blur-md" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {quickView.isOpen && quickView.selectedProduct && (
          <ProductQuickView 
            product={quickView.selectedProduct}
            isOpen={quickView.isOpen}
            onClose={quickView.closeQuickView}
          />
        )}
      </AnimatePresence>
    </>
  )
} 