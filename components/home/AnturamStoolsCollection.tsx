// components/home/AnturamStoolsCollection.tsx
"use client"
import { PriceSortFilter } from '@/components/filter/PriceSortFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { ProductCard } from '@/components/shared/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface GridViewProps {
  products: Product[];
  cardsToShow: number;
  onQuickView: (e: React.MouseEvent<Element>) => void;
}

interface ViewSettings {
  minCards: number;
  maxCards: number;
  defaultCards: number;
}

interface ViewControlsProps {
  current: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isGridView: boolean;
  onViewChange: (value: boolean) => void;
}

const SWIPER_CONFIG = {
  spaceBetween: 16,
  speed: 1000,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 16 },
    480: { slidesPerView: 2, spaceBetween: 16 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 'auto' as const, spaceBetween: 16 }
  }
} as const;

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Failed to fetch products',
  NO_DATA: 'No products data received'
} as const;

const useCardsView = (settings: ViewSettings) => {
  const [cardsToShow, setCardsToShow] = useState(settings.defaultCards)
  
  const handleViewChange = useCallback((value: number) => {
    setCardsToShow(value)
  }, [])

  return { cardsToShow, handleViewChange }
}

const ViewControls = ({ current, min, max, onChange, isGridView, onViewChange }: ViewControlsProps) => (
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

const GridView = memo(({ products, cardsToShow, onQuickView }: GridViewProps) => {
  const [visibleRows, setVisibleRows] = useState(2);
  const productsPerRow = cardsToShow;
  const totalRows = Math.ceil(products.length / productsPerRow);
  const visibleProducts = products.slice(0, visibleRows * productsPerRow);

  const showMoreRows = () => {
    setVisibleRows(prev => Math.min(prev + 2, totalRows));
  }

  return (
    <div className="space-y-12">
      <div 
        className="grid gap-6 md:gap-8 w-full"
        style={{ gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))` }}
      >
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href={`/product/${product.handle}`}
              className="block h-full w-full"
            >
              <ProductCard 
                product={product}
                onQuickView={(e) => {
                  e.preventDefault();
                  onQuickView(e);
                }}
                cardsToShow={cardsToShow}
              />
            </Link>
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

const useProductsFetch = () => {
  const [state, setState] = useState<{
    products: Product[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/anturam-stools');
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || ERROR_MESSAGES.FETCH_ERROR);
        if (!data.products) throw new Error(ERROR_MESSAGES.NO_DATA);
        
        if (mounted) {
          setState({
            products: data.products,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_ERROR
          }));
        }
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return state;
};

export default function AnturamStoolsCollection() {
  const quickView = useQuickView()
  const { products: fetchedProducts, loading, error } = useProductsFetch()
  const { products, sortProducts } = useProducts(fetchedProducts)
  const [isSlideHovered, setIsSlideHovered] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isGridView, setIsGridView] = useState(false)
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  const handlePriceSort = useCallback((direction: 'asc' | 'desc') => {
    sortProducts(direction);
  }, [sortProducts]);

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
  
  if (error) {
    return (
      <div className="w-full py-12 bg-primary-50 dark:bg-primary-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!products?.length) return null;

  return (
    <>
      <section 
        ref={ref}
        className="w-full py-12 bg-primary-50 dark:bg-primary-900 overflow-hidden relative" 
        aria-label="Anturam Eco Wooden Stools Collection"
      >
        <div className="container mx-auto px-4 relative">
          {/* Moved Collection Title Section to top */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-16"
          >
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                Anturam Eco Wooden Stools
              </h2>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
            </div>
          </motion.div>

          {/* Banner Images */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-4 md:px-8">
            <div className="max-w-[2000px] mx-auto">
              {/* Desktop: 3-column grid, Mobile: Staggered mosaic */}
              <div className="mb-12 md:grid md:grid-cols-3 md:gap-6">
                {/* Mobile: Custom flex layout */}
                <div className="relative [@media(max-width:768px)]:flex [@media(max-width:768px)]:flex-col md:contents">
                  {/* First banner - Text Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-md group aspect-[4/5] md:aspect-[4/5]
                               [@media(max-width:768px)]:w-[85%] [@media(max-width:768px)]:mr-auto"
                  >
                    {/* Initial State - Vertical Text */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 to-primary-800/95
                                    group-hover:scale-110 transition-all duration-700 ease-out">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20
                                      bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]
                                      transition-opacity duration-700" />
                      
                      {/* Initial Text State */}
                      <div className="absolute inset-0 p-12 flex flex-col items-center justify-center
                                      group-hover:opacity-0 transition-all duration-500 ease-out">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center space-y-2"
                        >
                          <div className="overflow-hidden">
                            <motion.span 
                              initial={{ y: 40 }}
                              animate={{ y: 0 }}
                              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                              className="block text-4xl font-bold text-white/90 tracking-wide"
                            >
                              Wooden
                            </motion.span>
                          </div>
                          <div className="overflow-hidden">
                            <motion.span 
                              initial={{ y: 40 }}
                              animate={{ y: 0 }}
                              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                              className="block text-4xl font-bold text-white/90 tracking-wide"
                            >
                              Stools
                            </motion.span>
                          </div>
                          <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="w-12 h-0.5 mx-auto bg-accent-300/60 origin-left"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover State Content */}
                    <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 
                                    transition-transform duration-700 ease-out">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 to-primary-800/95">
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 0.1, scale: 1 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.4
                              }}
                              className="absolute w-32 h-32 rounded-full bg-accent-300/30 blur-xl"
                              style={{
                                left: `${20 + i * 15}%`,
                                top: `${10 + i * 20}%`
                              }}
                            />
                          ))}
                        </div>

                        {/* Content Grid */}
                        <div className="relative h-full p-6 flex flex-col justify-end z-10">
                          <div className="space-y-6">
                            {/* Decorative Line */}
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.8 }}
                              className="w-12 h-0.5 bg-accent-300/60 origin-left"
                            />

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="space-y-2"
                                >
                                  <h4 className="text-accent-200 text-sm font-medium">Sustainable Design</h4>
                                  <p className="text-white/80 text-xs leading-relaxed">
                                    Each piece embodies our commitment to environmental stewardship
                                  </p>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                  className="space-y-2"
                                >
                                  <h4 className="text-accent-200 text-sm font-medium">Natural Beauty</h4>
                                  <p className="text-white/80 text-xs leading-relaxed">
                                    Unique grain patterns tell a story of nature's artistry
                                  </p>
                                </motion.div>
                              </div>

                              <div className="space-y-4">
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.1 }}
                                  className="space-y-2"
                                >
                                  <h4 className="text-accent-200 text-sm font-medium">Artisan Craft</h4>
                                  <p className="text-white/80 text-xs leading-relaxed">
                                    Handcrafted with precision and generations of expertise
                                  </p>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                  className="space-y-2"
                                >
                                  <h4 className="text-accent-200 text-sm font-medium">Timeless Appeal</h4>
                                  <p className="text-white/80 text-xs leading-relaxed">
                                    Classic designs that transcend passing trends
                                  </p>
                                </motion.div>
                              </div>
                            </div>

                            {/* Interactive Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative mt-4 px-6 py-2 w-full group/btn
                                       bg-accent-300/20 hover:bg-accent-300/30 
                                       border border-accent-300/40 rounded-md
                                       overflow-hidden"
                            >
                              <span className="relative z-10 text-white text-sm font-medium">
                                Explore Collection
                              </span>
                              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0
                                            bg-gradient-to-r from-accent-300/0 via-accent-300/20 to-accent-300/0
                                            transition-transform duration-700" />
                            </motion.button>
                          </div>

                          {/* Decorative Corners */}
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent-300/40" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent-300/40" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Second banner - Modern Living Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-md 
                               [@media(max-width:768px)]:-mt-[30%] [@media(max-width:768px)]:w-[65%] 
                               [@media(max-width:768px)]:ml-auto [@media(max-width:768px)]:mb-3
                               [@media(max-width:768px)]:aspect-[1.2/1] md:aspect-[4/5]"
                  >
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool-img-second.jpg?v=1731249736"
                      alt="Anturam stool in modern setting"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 65vw, 33vw"
                    />
                    <div className="absolute inset-0" />
                    <div className="absolute inset-4 border border-white/20 rounded-sm" />
                  </motion.div>

                  {/* Third banner - Artisan Quality Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden rounded-md
                               [@media(max-width:768px)]:w-[75%] [@media(max-width:768px)]:ml-[12.5%]
                               [@media(max-width:768px)]:aspect-[1.6/1] md:aspect-[4/5]"
                  >
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool-img_8b6ee7e3-78bc-49c6-a261-ddadeab7bf28.jpg?v=1731249849"
                      alt="Anturam stool craftsmanship detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 75vw, 33vw"
                    />
                    <div className="absolute inset-0" />
                    <div className="absolute inset-4 border border-white/20 rounded-sm" />
                    
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full 
                                   bg-accent-300/20 backdrop-blur-sm hidden [@media(max-width:768px)]:block" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-10 [@media(max-width:700px)]:px-4">
            <div className="relative max-w-[1700px] px-10 mx-auto [@media(max-width:700px)]:px-2">
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

              {/* Mobile Sort Controls and Pagination */}
              <div className="mb-4 flex items-center justify-between lg:hidden">
                {/* Sort Controls */}
                <div className="inline-flex items-center rounded-lg border border-primary-200 bg-white shadow-sm" role="group">
                  <span className="border-r border-primary-200 px-2 text-xs font-medium text-primary-600">
                    Price
                  </span>
                  <button
                    onClick={() => handlePriceSort('asc')}
                    className="flex items-center gap-0.5 border-r border-primary-200 px-2 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 active:bg-primary-100"
                    aria-label="Sort price low to high"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                      <path d="M12 5l0 14M5 12l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePriceSort('desc')}
                    className="flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 active:bg-primary-100"
                    aria-label="Sort price high to low"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                      <path d="M12 19l0-14M5 12l7 7 7-7" />
                    </svg>
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center">
                  <button
                    onClick={() => swiper?.slidePrev()}
                    className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
                    disabled={isBeginning}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="relative flex items-center">
                    <div className="absolute left-0 z-10 h-full w-4 bg-gradient-to-r from-primary-50 to-transparent" />
                    <div className="flex items-center gap-1.5 overflow-hidden px-1">
                      {products.map((_, idx) => {
                        const startIdx = Math.max(0, Math.min(activeThumbIndex - 3, products.length - 7));
                        const endIdx = Math.min(startIdx + 7, products.length);
                        if (idx < startIdx || idx >= endIdx) return null;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              swiper?.slideTo(idx);
                              setActiveThumbIndex(idx);
                            }}
                            className={cn(
                              'h-1.5 rounded-full transition-all duration-200',
                              activeThumbIndex === idx
                                ? 'w-4 bg-primary-600'
                                : 'w-1.5 bg-primary-300 hover:bg-primary-400',
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute right-0 z-10 h-full w-4 bg-gradient-to-l from-primary-50 to-transparent" />
                  </div>

                  <button
                    onClick={() => swiper?.slideNext()}
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
                    disabled={isEnd}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Conditional Rendering */}
              {isGridView ? (
                <GridView 
                  products={products}
                  cardsToShow={cardsToShow}
                  onQuickView={(e: React.MouseEvent<Element>) => {
                    e.preventDefault();
                    const target = e.currentTarget as HTMLElement;
                    if (target.dataset.product) {
                      const product = products.find(p => p.id === target.dataset.product);
                      if (product) {
                        quickView.openQuickView(product);
                      }
                    }
                  }}
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
                        slidesPerView: 1.2,
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
                    onSwiper={(swiper) => {
                      setMainSwiper(swiper);
                      handleSwiperInit(swiper);
                    }}
                    onSlideChange={(swiper) => {
                      setIsBeginning(swiper.isBeginning);
                      setIsEnd(swiper.isEnd);
                      setActiveThumbIndex(swiper.activeIndex);
                      if (thumbSwiper && thumbSwiper.activeIndex !== swiper.activeIndex) {
                        thumbSwiper.slideTo(swiper.activeIndex);
                      }
                    }}
                  >
                    {products.map((product) => (
                      <SwiperSlide key={product.id}>
                        <ProductCard 
                          product={product} 
                          onQuickView={(e) => {
                            e.preventDefault();
                            quickView.openQuickView(product);
                          }}
                          cardsToShow={cardsToShow}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Navigation Buttons */}
                  <button 
                    className="custom-swiper-button-prev group absolute left-0 top-1/2 isolate z-20 hidden [@media(min-width:700px)]:flex h-14 w-10 -translate-x-full -translate-y-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-l-md bg-primary-800/95 shadow-[0_0_10px_rgba(83,66,56,0.3)] backdrop-blur-sm transition-all duration-300 ease-out hover:w-12 hover:shadow-[0_0_20px_rgba(83,66,56,0.5)] active:scale-95 active:shadow-inner disabled:cursor-default disabled:opacity-50"
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
                    className="custom-swiper-button-next group absolute right-0 top-1/2 isolate z-20 hidden [@media(min-width:700px)]:flex h-14 w-10 -translate-y-1/2 translate-x-full cursor-pointer items-center justify-center overflow-hidden rounded-r-md bg-primary-800/95 shadow-[0_0_10px_rgba(83,66,56,0.3)] backdrop-blur-sm transition-all duration-300 ease-out hover:w-12 hover:shadow-[0_0_20px_rgba(83,66,56,0.5)] active:scale-95 active:shadow-inner disabled:cursor-default disabled:opacity-50"
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

              {/* Thumbnail Navigation - Only visible below 500px */}
              <div className="mt-4 hidden [@media(max-width:500px)]:block">
                <div className="relative">
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={5.5}
                    className="thumbnail-swiper"
                    navigation={{
                      prevEl: '.thumb-prev',
                      nextEl: '.thumb-next'
                    }}
                    breakpoints={{
                      0: { slidesPerView: 4.5 },
                      400: { slidesPerView: 5.5 }
                    }}
                    centeredSlides={true}
                    slideToClickedSlide={true}
                    onSwiper={setThumbSwiper}
                    onSlideChange={(swiper) => {
                      setActiveThumbIndex(swiper.activeIndex);
                      if (swiper && swiper.activeIndex !== activeThumbIndex) {
                        mainSwiper?.slideTo(swiper.activeIndex);
                      }
                    }}
                  >
                    {products.map((product, index) => (
                      <SwiperSlide key={`thumb-${product.id}`}>
                        <button
                          onClick={() => {
                            swiper?.slideTo(index);
                            setActiveThumbIndex(index);
                          }}
                          className={cn(
                            'relative aspect-square w-full overflow-hidden rounded-sm',
                            'border transition-all duration-300',
                            activeThumbIndex === index
                              ? 'border-primary-600 opacity-100 ring-1 ring-primary-500/50'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          )}
                        >
                          <Image
                            src={product.featuredImage?.url || ''}
                            alt={`${product.title} thumbnail`}
                            fill
                            sizes="(max-width: 500px) 20vw, 0vw"
                            className="object-cover"
                          />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <button
                    className="thumb-prev absolute left-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-r from-primary-900/40 via-primary-900/20 to-transparent transition-all duration-300 hover:from-primary-900/60"
                    aria-label="Previous thumbnails"
                  >
                    <div className="flex h-full items-center justify-center">
                      <ChevronLeft className="h-5 w-5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
                    </div>
                  </button>
                  <button
                    className="thumb-next absolute right-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-l from-primary-900/40 via-primary-900/20 to-transparent transition-all duration-300 hover:from-primary-900/60"
                    aria-label="Next thumbnails"
                  >
                    <div className="flex h-full items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
                    </div>
                  </button>
                </div>
              </div>
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

