// Canvas Collection
"use client"
import { PriceSortFilter } from '@/components/filter/PriceSortFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import CanvaProductCard from '@/components/shared/CanvaProductCard';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import MobileCanvasView from './MobileCanvasView';

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

const GridView = memo(({ 
  products, 
  cardsToShow, 
  onQuickView 
}: { 
  products: Product[]
  cardsToShow: number
  onQuickView: (product: Product) => void
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
            <CanvaProductCard 
              product={product} 
              onQuickView={onQuickView}
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

export default function CanvasCollection() {
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
  const [isGridView, setIsGridView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchCanvas() {
      try {
        setLoading(true)
        const response = await fetch('/api/canvas')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error('Error fetching canvas products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCanvas()
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        className="w-full py-12 bg-primary-50 dark:bg-primary-900 overflow-hidden relative" 
        aria-label="Canvas Collection"
      >
        <div className="container mx-auto px-4 relative">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-12"
          >
            {/* Title and Line */}
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                Canvas Collection
              </h2>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
            </div>
          </motion.div>

          {/* Products Section */}
          {isMobile ? (
            <MobileCanvasView
              products={sortedProducts}
              quickView={quickView}
              onSort={handlePriceSort}
              onQuickView={quickView.openQuickView}
            />
          ) : (
            <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-10">
              <div className="relative max-w-[1700px] px-10 mx-auto">
                {/* View Controls - Desktop only */}
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

                {/* Conditional Rendering */}
                {isGridView ? (
                  <GridView 
                    products={sortedProducts}
                    cardsToShow={cardsToShow}
                    onQuickView={quickView.openQuickView}
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
                          <CanvaProductCard 
                            product={product} 
                            onQuickView={quickView.openQuickView}
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
            </div>
          )}
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