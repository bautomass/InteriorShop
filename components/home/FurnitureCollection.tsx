// components/home/FurnitureCollection.tsx

"use client"

import AnimatedWord from '@/components/animations/AnimatedWord';
import PriceRangeFilter from '@/components/filter/PriceRangeFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { useQuickView } from '@/hooks/useQuickView';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Furniture categories data - keeping this part from your original file
const FURNITURE_CATEGORIES = [
  {
    title: "Living Room",
    description: "Sofas, armchairs, coffee tables, entertainment centers, and side tables",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/living-room.jpg?v=1733382924",
    items: ["Sofas", "Armchairs", "Coffee Tables", "Entertainment Centers", "Side Tables"]
  },
  {
    title: "Bedroom",
    description: "Beds, dressers, nightstands, armoires, and vanities",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/bedroom.jpg?v=1733382924",
    items: ["Beds", "Dressers", "Nightstands", "Armoires", "Vanities"]
  },
  {
    title: "Dining Room",
    description: "Dining tables, chairs, buffets, china cabinets, and serving carts",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/dining-room.jpg?v=1733382924",
    items: ["Dining Tables", "Dining Chairs", "Buffets", "China Cabinets", "Serving Carts"]
  },
  {
    title: "Office",
    description: "Desks, office chairs, filing cabinets, bookcases, and computer stations",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/office.jpg?v=1733382924",
    items: ["Desks", "Office Chairs", "Filing Cabinets", "Bookcases", "Computer Stations"]
  },
  {
    title: "Storage",
    description: "Cabinets, wardrobes, chests, credenzas, and storage benches",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/storage-room.jpg?v=1733382924",
    items: ["Cabinets", "Wardrobes", "Chests", "Credenzas", "Storage Benches"]
  },
  {
    title: "Outdoor",
    description: "Patio tables, outdoor seating, loungers, garden benches, and deck storage",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/outdoor-furniture.jpg?v=1733382925",
    items: ["Patio Tables", "Outdoor Seating", "Loungers", "Garden Benches", "Deck Storage"]
  }
]

const CategoryCard = memo(({ category }: { category: typeof FURNITURE_CATEGORIES[0] }) => (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // Custom easing for smoother animation
      }}
      className={cn(
        "relative rounded-lg overflow-hidden",
        "shadow-lg hover:shadow-2xl",
        "transition-shadow duration-300",
        "group h-full"
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-all duration-700 
                   group-hover:scale-110 will-change-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t 
                      from-black/90 via-black/50 to-transparent 
                      opacity-60 group-hover:opacity-80 
                      transition-opacity duration-300" />
        
        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 
                      transform translate-y-4 group-hover:translate-y-0 
                      transition-transform duration-300 ease-out">
          {/* Decorative Line */}
          <div className="w-12 h-0.5 bg-white/60 mb-4 
                       transform origin-left scale-x-0 group-hover:scale-x-100 
                       transition-transform duration-500 delay-100" />
          
          {/* Title with improved contrast */}
          <h3 className="text-2xl font-bold text-white mb-3 
                       tracking-wide drop-shadow-lg">
            {category.title}
          </h3>
          
          {/* Description with staggered animation */}
          <p className="text-sm text-white/90 leading-relaxed
                      transform opacity-0 -translate-y-4
                      group-hover:opacity-100 group-hover:translate-y-0 
                      transition-all duration-300 delay-150
                      max-w-[90%]">
            {category.description}
          </p>
  
          {/* Animated Arrow Indicator */}
          <div className="mt-4 flex items-center gap-2 
                       transform opacity-0 -translate-x-4
                       group-hover:opacity-100 group-hover:translate-x-0 
                       transition-all duration-300 delay-200">
            <span className="text-sm font-medium text-white/90">Explore</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              <ChevronRight className="w-4 h-4 text-white/90" />
            </motion.div>
          </div>
        </div>
  
        {/* Corner Accent Enhancement */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm 
                       transform rotate-45 origin-bottom-left translate-x-full -translate-y-full
                       group-hover:translate-x-0 group-hover:translate-y-0 
                       transition-transform duration-500 ease-out" />
        </div>
  
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-1000 pointer-events-none
                      bg-gradient-to-r from-transparent via-white/5 to-transparent
                      transform -translate-x-full group-hover:translate-x-full
                      transition-transform duration-1500 ease-in-out" />
      </div>
    </motion.div>
  ))

CategoryCard.displayName = 'CategoryCard'

// Everything below this point is copied exactly from LampsCollection
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

const ImageGallery = memo(({ product, isPriority = false }: { 
  product: Product
  isPriority?: boolean 
}) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const images = useMemo(() => {
    const urls = [
      product.featuredImage?.url,
      ...(product.images || []).map(img => img?.url)
    ].filter((url): url is string => !!url && url.trim() !== '')
    return Array.from(new Set(urls))
  }, [product])

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
              loading={isPriority ? undefined : "lazy"}
              priority={isPriority}
            />
          )}
        </motion.div>
      </AnimatePresence>

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

// Add this before the ProductCard component
const determineFurnitureCategory = (product: Product): string => {
  const title = product.title?.toLowerCase() || ''
  const type = product.productType?.toLowerCase() || ''
  const tags = Array.isArray(product.tags) 
    ? product.tags.map(tag => tag.toLowerCase()) 
    : []
  const description = product.description?.toLowerCase() || ''

  // Combined text for searching
  const searchText = `${title} ${type} ${tags.join(' ')} ${description}`

  // Category patterns based on FURNITURE_CATEGORIES
  const patterns = {
    'Living Room': ['sofa', 'armchair', 'coffee table', 'entertainment center', 'side table'],
    'Bedroom': ['bed', 'dresser', 'nightstand', 'armoire', 'vanity'],
    'Dining Room': ['dining table', 'chair', 'buffet', 'china cabinet', 'serving cart'],
    'Office': ['desk', 'office chair', 'filing cabinet', 'bookcase', 'computer'],
    'Storage': ['cabinet', 'wardrobe', 'chest', 'credenza', 'storage bench'],
    'Outdoor': ['patio', 'outdoor', 'lounger', 'garden bench', 'deck']
  }

  // Find matching category
  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category
    }
  }

  return 'Furniture'
}

// Replace the existing ProductCard component with this updated version
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

  const category = useMemo(() => determineFurnitureCategory(product), [product])

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
      <ImageGallery product={product} isPriority={isPriority} />
      <div className="p-4">
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
            "border border-primary-900/20 dark:border-primary-100/20", // Added border
            value === current
              ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 border-transparent" // Remove border when active
              : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
          )}
        >
          {value}
        </button>
      );
    })}
  </div>
);



export default function FurnitureCollection() {
  const quickView = useQuickView()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSlideHovered, setIsSlideHovered] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
    async function fetchFurnitureProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/furniture')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error('Error fetching furniture products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFurnitureProducts()
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

  const LoadingSkeleton = memo(() => (
    <div className="w-full py-12 bg-primary-50 dark:bg-primary-900">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-12">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-48 bg-primary-200 dark:bg-primary-700 rounded" />
            <div className="h-6 w-64 bg-primary-200 dark:bg-primary-700 rounded" />
          </div>
          
          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="rounded-lg overflow-hidden"
              >
                <div className="aspect-[4/3] bg-primary-200 dark:bg-primary-700" />
                <div className="p-6 bg-primary-100 dark:bg-primary-800">
                  <div className="h-6 w-32 bg-primary-200 dark:bg-primary-700 rounded mb-3" />
                  <div className="h-4 w-full bg-primary-200 dark:bg-primary-700 rounded mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-primary-200 dark:bg-primary-700 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Skeleton */}
          <div>
            <div className="h-6 w-48 bg-primary-200 dark:bg-primary-700 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-primary-200 dark:bg-primary-700 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))

  LoadingSkeleton.displayName = 'LoadingSkeleton'

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
        aria-label="Furniture Collection"
      >
        {/* Diagonal Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* First diagonal stripe */}
          <div 
            className="absolute w-[200%] h-[100px] bg-primary-100 dark:bg-primary-800/40
                      transform -rotate-6 -translate-y-1/2 left-0"
            style={{ top: '45%' }}
          />
          
          {/* Second diagonal stripe with gradient */}
          <div 
            className="absolute w-[200%] h-[150px] 
                      bg-gradient-to-r from-accent-100/20 via-primary-200/20 to-accent-200/20
                      dark:from-accent-800/20 dark:via-primary-700/20 dark:to-accent-700/20
                      transform -rotate-6 translate-y-1/2 -translate-x-1/4"
            style={{ top: '55%' }}
          />
          
          {/* Subtle texture overlay */}
          <div 
            className="absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a1a1a1' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-12"
          >
            {/* Title - Increased size */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-900 dark:text-primary-100">
              Furniture
            </h2>

            {/* Subtitle and Tags Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              {/* Increased size of "Discover collections of" */}
              <p className="text-base md:text-lg lg:text-xl text-primary-600 dark:text-primary-300 whitespace-nowrap">
                Discover collections of
              </p>
              
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["Modern", "Contemporary", "Traditional", "Rustic"].map((style) => (
                  <div
                    key={style}
                    className="inline-flex items-center px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-md 
                              bg-white dark:bg-primary-800 
                              shadow-sm hover:shadow-md
                              border border-primary-100 dark:border-primary-700
                              transition-all duration-200 ease-in-out
                              hover:translate-y-[-2px]"
                  >
                    {/* Decreased size of tag text */}
                    <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-primary-900 to-primary-700 
                                   dark:from-primary-100 dark:to-primary-300 bg-clip-text text-transparent">
                      {style} Furniture
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {FURNITURE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>

          <div className="mb-6 mt-12 relative w-screen left-1/2 right-1/2 -mx-[50vw]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center text-center w-full py-2"
              >
                <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-primary-800/90 dark:text-primary-200/90 tracking-tight">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-wrap justify-center">
                    <span className="whitespace-normal sm:whitespace-nowrap">Furniture that makes your home</span>
                    <span className="inline-flex items-center relative z-30 bg-gradient-to-r from-primary-800 via-primary-900 to-accent-600 
                                  dark:from-primary-200 dark:via-primary-100 dark:to-accent-400 
                                  bg-clip-text text-transparent">
                      <AnimatedWord 
                        words={[
                          'perfect',
                          'unique',
                          'special',
                          'inviting',
                          'peaceful',
                          'beautiful',
                          'inspiring',
                          'timeless',
                          'personal',
                          'balanced',
                          'graceful',
                          'authentic',
                          'natural',
                          'pleasant',
                          'harmonious',
                          'complete',
                          'welcoming',
                          'charming',
                          'memorable',
                          'delightful'
                        ]} 
                      />
                    </span>
                  </div>
                </h3>
              </motion.div>
            </div>
          </div>

          {/* Products Carousel */}
          <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-10">
            <div className="relative max-w-[1700px] px-10 mx-auto">
              {/* View Controls - Desktop only */}
              <div className="hidden lg:block relative h-12">
                <div className="flex items-center justify-between">
                  <PriceRangeFilter onSort={handlePriceSort} />
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
                  onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                  }}
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
              href="/collections/furniture"
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
              View All Furniture
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
