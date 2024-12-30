"use client"

import { PriceRangeFilter } from '@/components/filter/PriceRangeFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Constants
const CONSTANTS = {
  ANIMATION: {
    DURATION: 300,
    SWIPER_SPEED: 1000,
    AUTOPLAY_DELAY: 6000
  },
  CARDS: {
    MIN: 4,
    MAX: 6,
    DEFAULT: 5
  },
  RETRY_ATTEMPTS: 3
} as const

// Types
interface ProductState {
  products: Product[]
  sortedProducts: Product[]
  loading: boolean
  error: string | null
}

interface StoolsCollectionProps {
  // Empty for now, but available for future props
}

interface HandlePriceSortProps {
  direction: 'asc' | 'desc'
  onSort: (direction: 'asc' | 'desc') => void
}

// Type Guards
function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  )
}

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

const ImageComponent = memo(function ImageComponent({ 
  src, 
  alt,
  priority = false 
}: { 
  src: string
  alt: string
  priority?: boolean
}) {
  const [error, setError] = useState(false)
  
  const handleError = useCallback(() => {
    setError(true)
  }, [])

  if (error) {
    return (
      <div className="relative aspect-square bg-primary-100 dark:bg-primary-800 
                    flex items-center justify-center">
        <span className="text-primary-400 dark:text-primary-500">
          Image not available
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={85}
      priority={priority}
      onError={handleError}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover"
      loading={priority ? 'eager' : 'lazy'}
    />
  )
})

const NavigationButton = memo(function NavigationButton({
  direction,
  disabled,
  onClick
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-20",
        "w-10 h-14 bg-primary-800/95 dark:bg-primary-100/95",
        "flex items-center justify-center",
        "transition-all duration-300",
        direction === 'prev' ? "-translate-x-full rounded-l-md" : "translate-x-full rounded-r-md"
      )}
    >
      <div className="relative">
        <Icon className="h-6 w-6 text-primary-100 dark:text-primary-900" />
        {disabled && (
          <X className="h-6 w-6 text-red-400 dark:text-red-400 absolute inset-0 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </button>
  )
})

const ImageGallery = memo(({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  // Updated image deduplication
  const images = Array.from(new Set([
    product.featuredImage?.url,
    ...(product.images || []).map(img => img?.url)
  ])).filter((url): url is string => !!url)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const sectionWidth = width / images.length
    const section = Math.floor(x / sectionWidth)
    setActiveImage(Math.min(section, images.length - 1))
  }

  if (!images.length) {
    return (
      <div className="relative aspect-square bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
        <span className="text-primary-400 dark:text-primary-500">No image available</span>
      </div>
    )
  }

  return (
    <div 
      role="region"
      aria-label={`Image gallery for ${product.title}`}
      className="relative aspect-square overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveImage(0)
      }}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="absolute inset-0"
        >
          {images[activeImage] && (
            <Image
              src={images[activeImage]}
              alt={`${product.title} - View ${activeImage + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Updated image indicators with max limit */}
      <div 
        className={`absolute bottom-3 left-0 right-0 flex justify-center gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {images.slice(0, 11).map((_, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              scale: activeImage === idx ? 1.2 : 1,
              backgroundColor: activeImage === idx ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)'
            }}
            className="w-2 h-2 rounded-full"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />
        ))}
        {images.length > 11 && (
          <div className="w-2 h-2 rounded-full bg-black/70" 
               style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
               title={`+${images.length - 11} more images`}
          />
        )}
      </div>

      {/* Updated hover guides */}
      {isHovered && images.length > 1 && (
        <div className="absolute inset-0 grid" style={{ 
          gridTemplateColumns: `repeat(${images.length}, 1fr)` 
        }}>
          {images.map((_, idx) => (
            <div 
              key={idx}
              className="h-full border-r border-transparent last:border-r-0"
              onMouseEnter={() => setActiveImage(idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
})

ImageGallery.displayName = 'ImageGallery'

// Type for category patterns
type CategoryPatterns = Record<string, {
  keywords: string[]
  weight: number
}>

const CATEGORY_PATTERNS: CategoryPatterns = {
  'Bar Stool': {
    keywords: ['bar stool', 'counter stool', 'high stool', 'bar height'],
    weight: 2
  },
  'Dining Stool': {
    keywords: ['dining stool', 'kitchen stool', 'low stool', 'dining height'],
    weight: 1.5
  },
  'Counter Stool': {
    keywords: ['counter height', 'counter seating', 'kitchen counter'],
    weight: 1.5
  },
  'Decorative Stool': {
    keywords: ['decorative', 'accent stool', 'vanity stool', 'accent piece'],
    weight: 1
  },
  'Industrial Stool': {
    keywords: ['industrial', 'metal stool', 'workshop stool', 'factory'],
    weight: 1
  }
} as const;

const determineProductCategory = (product: Product): string => {
  const title = product.title?.toLowerCase() || '';
  const tags = Array.isArray(product.tags) 
    ? product.tags.map(tag => tag.toLowerCase()) 
    : [];
  const description = product.description?.toLowerCase() || '';

  // Combine all text for searching
  const searchText = `${title} ${tags.join(' ')} ${description}`;

  // Calculate scores for each category
  const scores = Object.entries(CATEGORY_PATTERNS).map(([category, { keywords, weight }]) => ({
    category,
    score: keywords.reduce((score, keyword) => 
      score + (searchText.includes(keyword) ? weight : 0), 0)
  }));

  // Find category with highest score
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best,
    { category: 'Stool', score: 0 }
  );

  return bestMatch.category;
};

// Custom hook for memoized category determination
const useCategoryDetermination = (product: Product): string => {
  return useMemo(() => determineProductCategory(product), [
    product.title,
    product.tags,
    product.description
  ]);
};

const ProductCard = memo(({ 
  product, 
  onQuickView,
  isPriority = false 
}: { 
  product: Product
  onQuickView: (product: Product) => void 
  isPriority?: boolean
}) => {
  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView(product)
  }, [product, onQuickView])

  const category = useCategoryDetermination(product);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "h-full bg-white dark:bg-primary-800/50 backdrop-blur-sm",
        "rounded-sm shadow-lg overflow-hidden",
        "transition-all duration-500",
        "hover:shadow-xl hover:shadow-primary-900/10 dark:hover:shadow-primary-100/10",
        "group",
        "min-w-[200px]",
        "w-full"
      )}
    >
      <ImageGallery product={product} />
      <div className="p-4">
        {/* Category Tag */}
        <div className="inline-flex px-2 py-1 rounded-full 
                      text-xs font-medium tracking-wide
                      bg-primary-100/80 dark:bg-primary-700/80
                      text-primary-800 dark:text-primary-100">
          {category}
        </div>

        <h3 className="font-semibold text-base tracking-tight mt-2 
                     text-primary-900 dark:text-primary-100 
                     line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-sm leading-relaxed mt-1
                    text-primary-600/90 dark:text-primary-300/90 
                    line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-3 gap-2">
          <p className="text-lg font-bold tracking-tight
                     text-accent-500 dark:text-accent-400
                     whitespace-nowrap">
            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
          </p>

          <motion.button
            onClick={handleQuickView}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-3 py-1.5",
              "text-xs font-medium",
              "bg-primary-900 dark:bg-primary-100",
              "text-white dark:text-primary-900",
              "rounded-sm",
              "hover:bg-primary-800 dark:hover:bg-primary-200",
              "transition-colors duration-200",
              "whitespace-nowrap"
            )}
          >
            Quick View
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

const ViewControls = ({ current, min, max, onChange }: { 
  current: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex items-center gap-2 mb-4 absolute right-0 top-0 z-10">
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

const SWIPER_CONFIG = {
  spaceBetween: 16,
  speed: CONSTANTS.ANIMATION.SWIPER_SPEED,
  autoplay: {
    delay: CONSTANTS.ANIMATION.AUTOPLAY_DELAY,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  }
} as const

const BREAKPOINTS = {
  0: { slidesPerView: 1 },
  480: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 'auto' as const }
} as const

export default function StoolsCollection({}: StoolsCollectionProps) {
  const quickView = useQuickView()
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stools')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.products?.length) {
        throw new Error('No products found in response')
      }

      setProducts(data.products)
      setSortedProducts(data.products)
      setLoading(false)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const [isSlideHovered, setIsSlideHovered] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Banner images
  const bannerImages = [
    {
      src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool_banner_wide.jpg",
      alt: "Modern stools collection showcase"
    }
  ]

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
    defaultCards: 5
  }

  const { cardsToShow, handleViewChange } = useCardsView(viewSettings)

  const breakpoints = useMemo(() => ({
    0: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: cardsToShow }
  }), [cardsToShow])

  const memoizedProducts = useMemo(() => products, [products])

  const LoadingSkeleton = () => (
    <div className="w-full py-12 bg-primary-50 dark:bg-primary-900">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-12">
          {/* Header Skeleton */}
          <div className="flex items-center justify-center gap-3">
          <div className="h-6 w-6 bg-primary-200 dark:bg-primary-700 rounded" />
            <div className="h-8 w-64 bg-primary-200 dark:bg-primary-700 rounded" />
          </div>
          
          {/* Banner Images Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((index) => (
              <div 
                key={index}
                className="relative aspect-[16/9] bg-primary-200 dark:bg-primary-700 rounded-lg"
              />
            ))}
          </div>
          
          {/* Products Skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="aspect-[3/4] bg-primary-200 dark:bg-primary-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const handleSwiperInit = useCallback((swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
  }, [])

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }, [])

  useEffect(() => {
    if (swiper) {
      swiper.update(); // Update swiper when products change
      setIsEnd(swiper.isEnd);
    }
  }, [swiper, products]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!products.length) return null

  return (
    <>
      <section 
        ref={ref}
        className="w-full py-12 bg-primary-50 dark:bg-primary-900 overflow-hidden relative" 
        aria-label="Stools Collection"
      >
        {/* Diagonal Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-[200%] h-[120px] bg-primary-100 dark:bg-primary-800/40
                      transform rotate-6 -translate-y-1/2 -left-1/4"
            style={{ top: '40%' }}
          />
          
          <div 
            className="absolute w-[200%] h-[180px] 
                      bg-gradient-to-l from-accent-100/20 via-primary-200/20 to-accent-200/20
                      dark:from-accent-800/20 dark:via-primary-700/20 dark:to-accent-700/20
                      transform rotate-6 translate-y-1/2"
            style={{ top: '60%' }}
          />
          
          <div 
            className="absolute inset-0 opacity-15 dark:opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a1a1a1' fill-opacity='0.1'%3E%3Cpath d='M30 0L30 60M60 30L0 30M45 15L15 45M15 15L45 45'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Banner moved to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[200px] mb-24 max-w-[95vw] mx-auto overflow-hidden rounded-md
                       bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 
                       dark:from-primary-800/80 dark:via-primary-900 dark:to-primary-800/80"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0">
              {/* Geometric Wood Pattern Background */}
              <div className="absolute inset-0 opacity-10 dark:opacity-80"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23534238' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                     backgroundSize: '150px 150px'
                   }} 
              />
              
              {/* Accent Overlays */}
              <div className="absolute right-0 top-0 w-1/3 h-full 
                              bg-gradient-to-l from-[#C7BAA8]/20 to-transparent 
                              dark:from-[#8B7355]/20" />
              
              {/* Subtle Wood Grain Texture */}
              <div className="absolute inset-0 opacity-50 dark:opacity-20 mix-blend-overlay"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='0' height='0' viewBox='0 0 0 0' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                     backgroundSize: '0px 0px'
                   }} 
              />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col md:flex-row md:items-center justify-between px-8 md:px-12 lg:px-16">
              {/* Left side content */}
              <div className="flex flex-col justify-center md:max-w-[70%] lg:max-w-[80%]">
                <h2 className="text-1xl md:text-2xl lg:text-2xl font-bold 
                               text-primary-700 dark:text-primary-100
                               leading-tight">
                  A Better Home Starts With Natural Choices
                </h2>
                
                <p className="mt-2 text-base md:text-lg lg:text-1xl 
                              text-primary-700 dark:text-primary-300 
                              leading-relaxed">
                  Discover furniture that respects our planet while transforming your space
                </p>
                <span className="mt-2 font-semibold text-base md:text-lg lg:text-1xl
                                 text-primary-700 dark:text-primary-100">
                  Join us in redefining what home means with mindful wood design
                </span>
              </div>

              {/* CTA Button - Right side */}
              <div className="mt-6 md:mt-0 md:ml-8">
                <motion.a
                  href="/collections"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-6 py-3 md:px-8 md:py-4",
                    "text-sm md:text-base font-medium",
                    "bg-accent-500 hover:bg-accent-600",
                    "text-white",
                    "rounded-md shadow-lg",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500",
                    "whitespace-nowrap"
                  )}
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* New Feature Banners */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-[95vw] mx-auto"
          >
            {/* Sales Promotion Banner */}
            <div className="relative h-[400px] overflow-hidden rounded-lg group 
                            bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700
                            dark:from-accent-600 dark:via-accent-700 dark:to-accent-800">
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" 
                     style={{
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                     }}
                />
              </div>

              {/* Content Container */}
              <div className="relative h-full p-8">
                {/* Top Row - Badge and Secondary Text */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-white/95 rounded-full
                                    shadow-lg transform -rotate-2">
                      <span className="text-accent-600 font-bold tracking-wider text-sm">
                        Easy to browse, easier to save
                      </span>
                    </div>
                    <p className="text-white/90 text-base pl-2">
                      All sale products in one place
                    </p>
                  </div>
                </div>

                {/* Main Content - Split into Two Columns */}
                <div className="flex justify-between items-center h-[240px]">
                  {/* Left Column - Sale Text */}
                  <div className="flex-1">
                    <h3 className="text-8xl font-bold text-white">
                      SALE
                    </h3>
                  </div>

                  {/* Right Column - Discount and CTA */}
                  <div className="flex-1 flex flex-col items-end gap-8">
                    {/* Discount Section */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-2 mb-2">
                        <span className="text-white/90 text-2xl">Up to</span>
                        <span className="text-8xl font-bold text-white">50%</span>
                        <span className="text-white/90 text-2xl">OFF</span>
                      </div>
                      <p className="text-white/80 text-lg">
                        On selected stools and furniture pieces
                      </p>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                      href="/collections/sale"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-8 py-4 bg-white text-accent-600 
                                rounded-md font-semibold text-lg shadow-lg hover:bg-white/95
                                transition-colors duration-200"
                    >
                      Shop Sale Items
                      <ChevronRight className="ml-2 h-6 w-6" />
                    </motion.a>
                  </div>
                </div>

                {/* Bottom Row - Terms */}
                <div className="absolute bottom-4 left-8">
                  <p className="text-white/70 text-sm">
                    *Terms and conditions apply
                  </p>
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 
                              border-white/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 
                              border-white/20 rounded-bl-lg" />
            </div>

            {/* New Arrivals Banner */}
            <div className="relative h-[400px] overflow-hidden rounded-lg group 
                            bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900
                            dark:from-primary-100 dark:via-primary-50 dark:to-primary-100">
                {/* Decorative Pattern - kept as is */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" 
                        style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                {/* Content Container */}
                <div className="relative h-full p-6 sm:p-8 flex flex-col">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="inline-flex items-center px-3 py-1.5 
                                    bg-white/10 dark:bg-primary-900/10 backdrop-blur-sm
                                    rounded-full border border-white/20 dark:border-primary-900/20
                                    mb-3">
                            <span className="text-white dark:text-primary-900 text-sm font-medium">
                                New Collection
                            </span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-white dark:text-primary-900 
                                      leading-tight mb-2">
                            Just Arrived
                        </h3>
                        <p className="text-white/70 dark:text-primary-900/70 text-sm sm:text-base">
                            Discover our latest additions
                        </p>
                    </div>

                    {/* Featured Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                            {
                                name: "Nordic Bar Stool",
                                price: "$299",
                                tag: "New Design"
                            },
                            {
                                name: "Artisan Counter Stool",
                                price: "$249",
                                tag: "Bestseller"
                            },
                            {
                                name: "Modern Swivel Stool",
                                price: "$329",
                                tag: "Limited Edition"
                            }
                        ].map((product, index) => (
                            <div key={index} 
                                 className="bg-white/10 dark:bg-primary-900/10 
                                            backdrop-blur-sm rounded-lg p-4
                                            border border-white/10 dark:border-primary-900/10">
                                <div className="flex flex-col h-full">
                                    <span className="text-xs font-medium px-2 py-1 rounded-full
                                                   bg-white/20 dark:bg-primary-900/20 
                                                   text-white dark:text-primary-900 
                                                   inline-flex items-center justify-center w-fit mb-2">
                                        {product.tag}
                                    </span>
                                    <h4 className="text-white dark:text-primary-900 font-medium mb-1">
                                        {product.name}
                                    </h4>
                                    <p className="text-white/70 dark:text-primary-900/70 text-sm">
                                        From {product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto text-center">
                        <motion.a
                            href="/collections/new-arrivals"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center px-6 py-2.5
                                    bg-white dark:bg-primary-900
                                    text-primary-900 dark:text-white
                                    rounded-md font-medium text-sm sm:text-base
                                    hover:bg-white/90 dark:hover:bg-primary-800
                                    transition-colors duration-200"
                        >
                            Shop New Arrivals
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </motion.a>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-0 right-0 w-24 h-24 
                                bg-gradient-to-bl from-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-24 h-24 
                                bg-gradient-to-tr from-white/10 to-transparent" />
            </div>
          </motion.div>

          {/* Products Carousel Section */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-10">
            <div className="relative max-w-[1700px] px-10 mx-auto">
              {/* Title Section moved here */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 mb-12"
              >
                {/* Title */}
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-900 dark:text-primary-100">
                  Stools
                </h2>

                {/* Subtitle and Tags Group */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <p className="text-base md:text-lg lg:text-xl text-primary-600 dark:text-primary-300 whitespace-nowrap">
                    Discover collections of
                  </p>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {["Bar Stools", "Dining Stools", "Counter Stools", "Decorative Stools", "Industrial Stools"].map((style) => (
                      <div
                        key={style}
                        className="inline-flex items-center px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-md 
                                  bg-white dark:bg-primary-800 
                                  shadow-sm hover:shadow-md
                                  border border-primary-100 dark:border-primary-700
                                  transition-all duration-200 ease-in-out
                                  hover:translate-y-[-2px]"
                      >
                        <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-primary-900 to-primary-700 
                                       dark:from-primary-100 dark:to-primary-300 bg-clip-text text-transparent">
                          {style}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* View Controls - Desktop only */}
              <div className="hidden lg:block relative h-12">
                <div className="flex items-center justify-between">
                  <PriceRangeFilter 
                    selectedRange={null} 
                    onChange={(range: string | null) => {
                      if (range === 'high-to-low') handlePriceSort('desc');
                      else if (range === 'low-to-high') handlePriceSort('asc');
                    }} 
                  />
                  <ViewControls
                    current={cardsToShow}
                    min={viewSettings.minCards}
                    max={viewSettings.maxCards}
                    onChange={handleViewChange}
                  />
                </div>
              </div>

              {/* Swiper Container */}
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
                  onSlideChange={handleSlideChange}
                >
                  {sortedProducts.map((product, index) => (
                    <SwiperSlide key={product.id}>
                      <ProductCard 
                        product={product} 
                        onQuickView={quickView.openQuickView}
                        isPriority={index === 0}
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
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Button */}
          <div className="mt-8 text-center">
            <motion.a
              href="/collections/stools"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-3 text-base font-medium",
                "bg-primary-900 dark:bg-primary-100",
                "text-white dark:text-primary-900",
                "rounded-md shadow-lg",
                "hover:bg-primary-800 dark:hover:bg-primary-200",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              )}
            >
              View All Products
            </motion.a>
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

export const metadata: Metadata = {
  title: 'Stools Collection | Your Store Name',
  description: 'Discover our exclusive collection of artisan-crafted stools.',
  openGraph: {
    title: 'Stools Collection | Your Store Name',
    description: 'Discover our exclusive collection of artisan-crafted stools.',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Stools Collection'
      }
    ]
  }
}
