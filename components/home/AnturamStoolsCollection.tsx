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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// Constants moved outside component
const SWIPER_CONFIG = {
  spaceBetween: 16,
  speed: 1000,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  breakpoints: {
    0: { slidesPerView: 1.2, spaceBetween: 16 },
    480: { slidesPerView: 2, spaceBetween: 16 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 'auto', spaceBetween: 16 }
  }
} as const;

const VIEW_SETTINGS = {
  minCards: 4,
  maxCards: 6,
  defaultCards: 4
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

// Optimized ViewControls with memoization
const ViewControls = memo(({ current, min, max, onChange, isGridView, onViewChange }: ViewControlsProps) => {
  const buttons = useMemo(() => 
    [...Array(max - min + 1)].map((_, idx) => {
      const value = min + idx;
      return { value, key: `view-control-${value}` };
    }), 
    [min, max]
  );

  return (
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

      {buttons.map(({ value, key }) => (
        <button
          key={key}
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
      ))}
    </div>
  );
});

ViewControls.displayName = 'ViewControls';

// Optimized GridView
const GridView = memo(({ products, cardsToShow, onQuickView }: GridViewProps) => {
  const [visibleRows, setVisibleRows] = useState(2);
  const productsPerRow = cardsToShow;
  const totalRows = Math.ceil(products.length / productsPerRow);
  
  const visibleProducts = useMemo(() => 
    products.slice(0, visibleRows * productsPerRow),
    [products, visibleRows, productsPerRow]
  );

  const showMoreRows = useCallback(() => {
    setVisibleRows(prev => Math.min(prev + 2, totalRows));
  }, [totalRows]);

  const gridStyle = useMemo(() => ({
    gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))`
  }), [cardsToShow]);

  return (
    <div className="space-y-12">
      <div className="grid gap-6 md:gap-8 w-full" style={gridStyle}>
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/product/${product.handle}`} className="block h-full w-full">
              <ProductCard 
                product={product}
                onQuickView={onQuickView}
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
  );
});

GridView.displayName = 'GridView';

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

// Memoized Section Title component
const SectionTitle = memo(() => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className="flex flex-col gap-6 mb-16"
    >
      <div className="relative">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
          Wooden Stools
        </h2>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
      </div>
    </motion.div>
  );
});

SectionTitle.displayName = 'SectionTitle';

// Memoized ContentGrid component
const ContentGrid = memo(() => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="relative grid md:grid-cols-2 gap-12 mb-16">
      {/* Left Content with slide animation */}
      <motion.div 
        className="flex flex-col justify-center relative"
        initial={{ opacity: 0, x: -50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary-100 rounded-full opacity-20 blur-2xl" />
        <div className="relative">
          <motion.div 
            className="w-12 h-1 bg-primary-900/20 dark:bg-primary-100/20 mb-6"
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Consciously Crafted
          </motion.h2>
          
          <motion.p 
            className="text-lg text-primary-800/80 dark:text-primary-100/80 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Each piece from Simple Interior Ideas is handcrafted and custom-made, making it truly unique. 
            Drawing inspiration from the clean lines, warm ambiance, and neutral tones of modern minimalist design, 
            we pour years of passion and craftsmanship into every creation, ensuring it embodies both quality and individuality.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Image with slide animation */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, x: 50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <motion.div 
          className="absolute inset-0 -right-8 -bottom-8 bg-primary-100/10 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        
        <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
          <Image
            src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/round_table_c6175d54-23bc-45ad-953e-f3742b0db969.png?v=1739395060"
            alt="Anturam stool craftsmanship detail"
            fill
            className="object-cover transform transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={100}
            priority
          />
          
          <motion.div 
            className="absolute inset-0 border border-primary-900/10 dark:border-primary-100/10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
});

ContentGrid.displayName = 'ContentGrid';

// Replace SimpleContentGrid with:
const SimpleContentGrid = () => {
  return (
    <>
      <SectionTitle />
      <ContentGrid />
    </>
  );
};

// Define SwiperState interface
interface SwiperState {
  main: SwiperType | null;
  thumb: SwiperType | null;
  isBeginning: boolean;
  isEnd: boolean;
  activeIndex: number;
}

// Fix for Image component type issue
const ImageWithLoader = memo(({ 
  src, 
  alt, 
  ...props 
}: { 
  src: string; 
  alt: string; 
  [key: string]: any; 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
      {isLoading && !error && (
        <div className="absolute inset-0 bg-primary-100/10 animate-pulse" />
      )}
    </div>
  );
});

ImageWithLoader.displayName = 'ImageWithLoader';

// Optimized swiper state management
const useSwiperState = () => {
  const [state, setState] = useState<SwiperState>({
    main: null,
    thumb: null,
    isBeginning: true,
    isEnd: false,
    activeIndex: 0
  });

  const updateSwiperState = useCallback((updates: Partial<SwiperState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleMainSwiper = useCallback((swiper: SwiperType) => {
    updateSwiperState({
      main: swiper,
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd
    });
  }, [updateSwiperState]);

  const handleThumbSwiper = useCallback((swiper: SwiperType) => {
    updateSwiperState({ thumb: swiper });
  }, [updateSwiperState]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    updateSwiperState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
      activeIndex: swiper.activeIndex
    });
  }, [updateSwiperState]);

  return {
    state,
    handleMainSwiper,
    handleThumbSwiper,
    handleSlideChange,
  };
};

// Safe swiper update function
const useSwiperUpdate = (swiper: SwiperType | null, dependencies: any[]) => {
  useEffect(() => {
    if (!swiper) return;

    const updateSwiper = () => {
      requestAnimationFrame(() => {
        try {
          swiper.update();
        } catch (error) {
          console.error('Swiper update failed:', error);
        }
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSwiper();
    });

    resizeObserver.observe(swiper.el);
    updateSwiper();

    return () => {
      resizeObserver.disconnect();
    };
  }, [swiper, ...dependencies]);
};

// Type-safe product preloader hook
const useProductPreloader = (products: Product[]) => {
  const preloadedUrls = useRef(new Set<string>());
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, []);

  useEffect(() => {
    if (!products?.length) return;

    const signal = abortController.current.signal;
    const validImageUrls = products
      .map(product => product.featuredImage?.url)
      .filter((url): url is string => {
        if (!url) return false;
        try {
          new URL(url);
          return !preloadedUrls.current.has(url);
        } catch {
          return false;
        }
      });

    if (!validImageUrls.length) return;

    const preloadImage = async (url: string): Promise<void> => {
      if (signal.aborted) return;

      return new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        const timeoutId = window.setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 5000);

        img.onload = () => {
          window.clearTimeout(timeoutId);
          if (!signal.aborted) {
            preloadedUrls.current.add(url);
          }
          resolve();
        };

        img.onerror = () => {
          window.clearTimeout(timeoutId);
          reject(new Error(`Failed to load image: ${url}`));
        };

        img.src = url;
      });
    };

    const preloadChunk = async (urls: string[]) => {
      const CHUNK_SIZE = 3;
      const DELAY_BETWEEN_CHUNKS = 100;

      for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
        if (signal.aborted) break;

        const chunk = urls.slice(i, i + CHUNK_SIZE);
        await Promise.allSettled(chunk.map(preloadImage));

        if (i + CHUNK_SIZE < urls.length && !signal.aborted) {
          await new Promise(resolve => window.setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
        }
      }
    };

    void preloadChunk(validImageUrls).catch(error => {
      if (!signal.aborted) {
        console.error('Error during image preloading:', error);
      }
    });

    return () => {
      abortController.current.abort();
    };
  }, [products]);

  const clearPreloadedUrls = useCallback(() => {
    preloadedUrls.current.clear();
  }, []);

  return {
    preloadedUrls: preloadedUrls.current,
    clearPreloadedUrls
  };
};

// Main component optimization
const AnturamStoolsCollection = () => {
  const quickView = useQuickView();
  const { products: fetchedProducts, loading, error } = useProductsFetch();
  const { products, sortProducts } = useProducts(fetchedProducts);
  const [isGridView, setIsGridView] = useState(false);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  // Use custom hook for swiper state management
  const {
    state: swiperState,
    handleMainSwiper,
    handleThumbSwiper,
    handleSlideChange
  } = useSwiperState();

  const { cardsToShow, handleViewChange } = useCardsView(VIEW_SETTINGS);

  const handlePriceSort = useCallback((direction: 'asc' | 'desc') => {
    sortProducts(direction);
  }, [sortProducts]);

  const handleQuickView = useCallback((product: Product) => {
    quickView.openQuickView(product);
  }, [quickView]);

  // Use custom hook for image preloading
  const { preloadedUrls, clearPreloadedUrls } = useProductPreloader(products);

  if (loading || error || !products?.length) return null;

  return (
    <>
      <section 
        className="w-full py-12 bg-primary-50 dark:bg-primary-900 overflow-hidden relative" 
        aria-label="Anturam Eco Wooden Stools Collection"
      >
        <div className="container mx-auto px-4 relative">
          <SimpleContentGrid />

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
                    min={VIEW_SETTINGS.minCards}
                    max={VIEW_SETTINGS.maxCards}
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
                    onClick={() => swiperState.main?.slidePrev()}
                    className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
                    disabled={swiperState.isBeginning}
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
                              swiperState.main?.slideTo(idx);
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
                    onClick={() => swiperState.main?.slideNext()}
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
                    disabled={swiperState.isEnd}
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
                        handleQuickView(product);
                      }
                    }
                  }}
                />
              ) : (
                <div 
                  className="relative"
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
                      swiperState.main = swiper;
                      handleMainSwiper(swiper);
                    }}
                    onSlideChange={(swiper) => {
                      handleSlideChange(swiper);
                      setActiveThumbIndex(swiper.activeIndex);
                      if (swiperState.thumb && swiperState.thumb.activeIndex !== swiper.activeIndex) {
                        swiperState.thumb.slideTo(swiper.activeIndex);
                      }
                    }}
                  >
                    {products.map((product) => (
                      <SwiperSlide key={product.id}>
                        <ProductCard 
                          product={product} 
                          onQuickView={(e) => {
                            e.preventDefault();
                            handleQuickView(product);
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
                    disabled={swiperState.isBeginning}
                  >
                    <div className="relative z-20 transition-all duration-300 
                                    group-hover:-translate-x-0.5 group-active:scale-90
                                    group-hover:drop-shadow-[0_0_8px_rgba(199,186,168,0.5)]">
                      {swiperState.isBeginning ? (
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
                    disabled={swiperState.isEnd}
                  >
                    <div className="relative z-20 transition-all duration-300 
                                    group-hover:translate-x-0.5 group-active:scale-90
                                    group-hover:drop-shadow-[0_0_8px_rgba(199,186,168,0.5)]">
                      {swiperState.isEnd ? (
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
                    onSwiper={(swiper) => {
                      swiperState.thumb = swiper;
                    }}
                    onSlideChange={(swiper) => {
                      setActiveThumbIndex(swiper.activeIndex);
                      if (swiper && swiper.activeIndex !== activeThumbIndex) {
                        swiperState.main?.slideTo(swiper.activeIndex);
                      }
                    }}
                  >
                    {products.map((product, index) => (
                      <SwiperSlide key={`thumb-${product.id}`}>
                        <button
                          onClick={() => {
                            swiperState.main?.slideTo(index);
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

export default memo(AnturamStoolsCollection);


