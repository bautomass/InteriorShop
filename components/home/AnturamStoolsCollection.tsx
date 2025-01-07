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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {/* First banner - Text Container */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-[4/5] overflow-hidden rounded-md group"
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
                  className="relative aspect-[4/5] overflow-hidden rounded-md"
                >
                  <img
                    src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool-img-second.jpg?v=1731249736"
                    alt="Anturam stool in modern setting"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  {/* Elegant inner border */}
                  <div className="absolute inset-4 border border-white/20 rounded-sm" />
                </motion.div>

                {/* Third banner - Artisan Quality Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative aspect-[4/5] overflow-hidden rounded-md"
                >
                  <img
                    src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool-img_8b6ee7e3-78bc-49c6-a261-ddadeab7bf28.jpg?v=1731249849"
                    alt="Anturam stool craftsmanship detail"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  {/* Elegant inner border */}
                  <div className="absolute inset-4 border border-white/20 rounded-sm" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Products Section */}
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
                    {products.map((product) => (
                      <SwiperSlide key={product.id}>
                        <ProductCard 
                          product={product} 
                          onQuickView={(e) => {
                            e.preventDefault();
                            quickView.openQuickView(product);
                          }}
                          cardsToShow={cardsToShow}
                          href={`/product/${product.handle}`}
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
