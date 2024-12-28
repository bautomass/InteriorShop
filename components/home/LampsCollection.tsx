// components/home/LampsCollection.tsx
"use client"
import { PriceSortFilter } from '@/components/filter/PriceSortFilter';

import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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

const determineProductCategory = (product: Product): string => {
  const title = product.title?.toLowerCase() || ''
  const type = product.productType?.toLowerCase() || ''
  const tags = Array.isArray(product.tags) 
    ? product.tags.map(tag => tag.toLowerCase()) 
    : []
  const description = product.description?.toLowerCase() || ''

  // Combined text for searching
  const searchText = `${title} ${type} ${tags.join(' ')} ${description}`

  // Category patterns
  const patterns = {
    'Chandelier': ['chandelier', 'hanging light', 'pendant light', 'ceiling light'],
    'Wall Lamp': ['wall lamp', 'sconce', 'wall light', 'wall mount'],
    'Floor Lamp': ['floor lamp', 'standing lamp', 'floor light', 'standing light'],
    'Table Lamp': ['table lamp', 'desk lamp', 'bedside lamp', 'desk light'],
    'Pendant Light': ['pendant', 'hanging lamp', 'suspended', 'drop light']
  }

  // Find matching category
  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category
    }
  }

  return 'Lamp'
}

// Updated ProductCard component
const ProductCard = memo(({ 
  product, 
  onQuickView,
  isPriority = false,
  cardsToShow = 4
}: { 
  product: Product
  onQuickView: (product: Product) => void 
  isPriority?: boolean
  cardsToShow?: number
}) => {
  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView(product)
  }, [product, onQuickView])

  const category = useMemo(() => determineProductCategory(product), [product])

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative group h-full bg-white dark:bg-primary-800/50 backdrop-blur-sm 
                 rounded-sm shadow-lg transition-all duration-500 
                 hover:shadow-xl hover:shadow-primary-900/10 dark:hover:shadow-primary-100/10 
                 min-w-[200px] w-full"
    >
      <div className="relative">
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
          
          {/* Updated Price Section */}
          <div className="flex items-center gap-2 mt-1">
            <div className="relative">
              {product.compareAtPriceRange?.minVariantPrice && 
               parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    opacity: 1,
                    rotate: [-12, -15, -12]
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: -15,
                    transition: { duration: 0.2 }
                  }}
                  className="absolute -top-3 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                             text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full 
                             shadow-sm transform -rotate-12 z-10"
                >
                  Sale
                </motion.div>
              )}
              <p className="text-lg font-bold tracking-tight text-accent-500 dark:text-accent-400">
                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
            </div>
            {product.compareAtPriceRange?.minVariantPrice && 
             parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
              <>
                <span className="text-sm text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                  ${parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}
                </span>
                <span className="text-xs text-[#FF6B6B] font-medium px-2 py-0.5 
                               bg-[#FF6B6B]/10 rounded-full">
                  Save {Math.round(((parseFloat(product.compareAtPriceRange.minVariantPrice.amount) - 
                                   parseFloat(product.priceRange.minVariantPrice.amount)) / 
                                   parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) * 100)}%
                </span>
              </>
            )}
          </div>
          
          <p className="text-sm leading-relaxed mt-2
                      text-primary-600/90 dark:text-primary-300/90 
                      line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          
          <div className={cn(
            "flex gap-2 mt-3",
            // Stack vertically only when there are 5 or more cards in a row
            cardsToShow >= 5 ? "flex-col" : "flex-row"
          )}>
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-3 py-1.5",
                "bg-[#8B9D8B] hover:bg-[#7A8C7A]",
                "text-white rounded-sm",
                "transition-all duration-300",
                "flex items-center justify-center gap-1.5",
                "overflow-hidden shadow-sm hover:shadow-md",
                "group",
                // Adjust width based on number of cards
                cardsToShow >= 5 ? "w-full" : "flex-1"
              )}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-transparent via-white/20 to-transparent
                            -translate-x-full group-hover:translate-x-full
                            transition-all duration-1000 ease-in-out" />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-t from-black/10 to-transparent
                            transition-opacity duration-300" />

              <svg 
                className="w-3.5 h-3.5 relative
                          transform group-hover:-translate-y-px
                          transition-transform duration-300 ease-out" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>

              <span className="font-medium text-xs relative
                            transform group-hover:-translate-y-px
                            transition-transform duration-300 ease-out
                            text-shadow-sm">
                Add to Cart
              </span>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            ring-2 ring-white/20
                            transition-opacity duration-300" />
            </motion.button>

            {/* Quick View Button */}
            <motion.button
              onClick={handleQuickView}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-3 py-1.5",
                "bg-[#4A4A4A] hover:bg-[#3A3A3A]",
                "text-white rounded-sm",
                "transition-all duration-300",
                "flex items-center justify-center",
                "overflow-hidden shadow-sm hover:shadow-md",
                "group",
                // Adjust width based on number of cards
                cardsToShow >= 5 ? "w-full" : "w-[100px]",
                "text-xs font-medium"
              )}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-transparent via-white/10 to-transparent
                            -translate-x-full group-hover:translate-x-full
                            transition-all duration-1000 ease-in-out" />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-t from-black/10 to-transparent
                            transition-opacity duration-300" />

              {/* Text with hover animation */}
              <span className="relative transform group-hover:-translate-y-px
                            transition-transform duration-300 ease-out">
                Quick View
              </span>

              {/* Border glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            ring-2 ring-white/10
                            transition-opacity duration-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

// Add the new ViewControls component
const ViewControls = ({ current, min, max, onChange, isGridView, onViewChange }: { 
  current: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isGridView: boolean;
  onViewChange: (value: boolean) => void;
}) => (
  <div className="flex items-center gap-2 mb-4 absolute right-0 top-0 z-10">
    {/* View Toggle Button */}
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

    {/* Vertical Divider */}
    <div className="h-8 w-px bg-primary-900/20 dark:bg-primary-100/20" />

    {/* Card Count Buttons */}
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
            <Link 
              href={`/product/${product.handle}`}
              className="block h-full w-full"
            >
              <ProductCard 
                product={product} 
                onQuickView={(e) => {
                  e.preventDefault();
                  onQuickView(e, product);
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

export default function LampsCollection() {
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
  const [isGridView, setIsGridView] = useState(false)


  // Banner images with proper loading and error handling
  const bannerImages = [
    {
      src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Untitled_664_x_800_px_1.gif",
      alt: "Modern designer lamp in a minimalist setting"
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Untitled_664_x_800_px.jpg",
      alt: "Artistic pendant lighting arrangement"
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/rattan_lamp.jpg",
      alt: "Contemporary floor lamp showcase"
    }
  ]

  useEffect(() => {
    async function fetchLampProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/lamps')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error('Error fetching lamp products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchLampProducts()
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

  const handleSwiperInit = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance);
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  useEffect(() => {
    if (swiper) {
      swiper.update(); // Update swiper when products change
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
        className="w-full py-0 bg-primary-50 dark:bg-primary-900 overflow-hidden relative" 
        aria-label="Lamps Collection"
      >
        <div className="container mx-auto px-4 relative">
          {/* Header Section */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-4 md:px-8">
            <div className="max-w-[2000px] mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 mb-12"
              >
                {/* Title and Line */}
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                    Lamps
                  </h2>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Banner Images */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-4 md:px-8">
            <div className="max-w-[2000px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {bannerImages.map((image, index) => (
                  <motion.div
                    key={image.src}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative aspect-[4/5] overflow-hidden rounded-md group"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={true}
                    />
                    
                    {index === 1 ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/80 to-transparent
                                    translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="space-y-4">
                            <div className="w-12 h-0.5 bg-accent-300/60" />
                            <h3 className="text-xl font-bold text-white tracking-wide">
                              Wabi-Sabi Rattan Chandelier
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <p className="text-accent-200 text-sm font-medium">Natural Harmony</p>
                                <p className="text-white/80 text-xs leading-relaxed">
                                Hand-woven rattan strands dance with light, casting intricate shadows that change with the day's rhythm
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-accent-200 text-sm font-medium">Artisan Heritage</p>
                                <p className="text-white/80 text-xs leading-relaxed">
                                Each weave tells the story of skilled hands, preserving traditional craftsmanship in modern design
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-accent-200 text-sm font-medium">Living Energy</p>
                                <p className="text-white/80 text-xs leading-relaxed">
                                Natural materials breathe life into your space, creating an atmosphere of calm and organic beauty
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-accent-200 text-sm font-medium">Timeless Beauty</p>
                                <p className="text-white/80 text-xs leading-relaxed">
                                Ages gracefully like nature itself, each piece developing its own character over time
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-4 px-6 py-2 bg-accent-300/20 hover:bg-accent-300/30 
                                       border border-accent-300/40 rounded-md
                                       text-white text-sm font-medium
                                       transition-colors duration-200"
                            >
                              Discover More
                            </motion.button>
                          </div>
                          
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent-300/40" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent-300/40" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    )}

                    {/* Keep the existing pulsing dot for the last image */}
                    {index === bannerImages.length - 1 && (
                      <a href="/product/earthy-elegance-wabi-sabi-rattan-chandelier-handcrafted" className="absolute bottom-[70%] left-[15%] group/dot">
                        <div className="relative inline-flex">
                          {/* Pulse rings - made smaller and precisely centered */}
                          <div className="absolute -inset-1.5
                                        w-7 h-7 rounded-full bg-[#dcd5ca]/60
                                        animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite]" />
                          <div className="absolute -inset-1.5
                                        w-7 h-7 rounded-full bg-[#ebe7e0]/50
                                        animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite_1.75s]" />
                          
                          {/* Main dot */}
                          <div className="relative w-4 h-4 rounded-full 
                                        bg-[#ebe7e0] border-2 border-[#9c826b]
                                        shadow-[0_0_10px_rgba(199,186,168,0.8)]
                                        transition-all duration-500 ease-in-out
                                        group-hover/dot:scale-125" />
                          
                          {/* Button */}
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2
                                        opacity-0 -translate-x-2 group-hover/dot:translate-x-0
                                        group-hover/dot:opacity-100 transition-all duration-500 
                                        ease-out min-w-max">
                            <div className="bg-[#ebe7e0]/95 backdrop-blur-sm shadow-lg rounded-lg p-2
                                          border border-[#b39e86] flex items-center gap-2
                                          transition-all duration-500 ease-out
                                          hover:bg-[#dcd5ca]/95">
                              <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap px-1">
                                View Product
                              </span>
                              <svg className="w-4 h-4 text-[#9c826b] transition-all duration-300
                                          group-hover/dot:translate-x-1" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor">
                                <path strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                    )}
                  </motion.div>
                ))}
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
                  products={sortedProducts}
                  cardsToShow={cardsToShow}
                  onQuickView={(e, product) => {
                    e.preventDefault();
                    onQuickView(e, product);
                  }}
                />
              ) : (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsSlideHovered(true)}
                  onMouseLeave={() => setIsSlideHovered(false)}
                >
                  {/* Existing Swiper Component */}
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
                    onSwiper={(swiper) => {
                      handleSwiperInit(swiper)
                    }}
                    onSlideChange={(swiper) => {
                      setIsBeginning(swiper.isBeginning)
                      setIsEnd(swiper.isEnd)
                    }}
                  >
                    {sortedProducts.map((product) => (
                      <SwiperSlide key={product.id}>
                        <Link 
                          href={`/product/${product.handle}`}
                          className="block h-full w-full"
                        >
                          <ProductCard 
                            product={product} 
                            onQuickView={(e) => {
                              e.preventDefault();
                              quickView.openQuickView(product);
                            }}
                            cardsToShow={cardsToShow}
                          />
                        </Link>
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
                    
                    {/* Animated border with more visible colors */}
                    <div className="absolute inset-0 z-30 rounded-l-md opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300
                                    bg-gradient-to-r from-accent-300/50 to-transparent
                                    [mask-image:linear-gradient(to_right,white_2px,transparent_2px)]" />

                    {/* Additional glow effect */}
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
                    
                    {/* Animated border with more visible colors */}
                    <div className="absolute inset-0 z-30 rounded-r-md opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300
                                    bg-gradient-to-l from-accent-300/50 to-transparent
                                    [mask-image:linear-gradient(to_left,white_2px,transparent_2px)]" />

                    {/* Additional glow effect */}
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



