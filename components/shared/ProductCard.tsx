// /components/shared/ProductCard.tsx
"use client"
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useCallback, useMemo, useState } from 'react';

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

      {/* Image indicators */}
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

      {/* Hover guides */}
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

  const searchText = `${title} ${type} ${tags.join(' ')} ${description}`

  const patterns = {
    'Chandelier': ['chandelier', 'hanging light', 'pendant light', 'ceiling light'],
    'Wall Lamp': ['wall lamp', 'sconce', 'wall light', 'wall mount'],
    'Floor Lamp': ['floor lamp', 'standing lamp', 'floor light', 'standing light'],
    'Table Lamp': ['table lamp', 'desk lamp', 'bedside lamp', 'desk light'],
    'Pendant Light': ['pendant', 'hanging lamp', 'suspended', 'drop light']
  }

  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category
    }
  }

  return 'Lamp'
}

interface ProductCardProps {
  product: Product;
  onQuickView: (e: React.MouseEvent) => void;
  isPriority?: boolean;
  cardsToShow?: number;
}

export const ProductCard = memo(({ 
  product, 
  onQuickView,
  isPriority = false,
  cardsToShow = 4
}: ProductCardProps) => {
  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView(e)
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
          
          <div className="flex items-center gap-2">
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
                  className="absolute -top-3 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                             text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full 
                             shadow-sm transform -rotate-12"
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
            cardsToShow >= 5 ? "flex-col" : "flex-row"
          )}>
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
                cardsToShow >= 5 ? "w-full" : "w-[100px]",
                "text-xs font-medium"
              )}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-transparent via-white/10 to-transparent
                            -translate-x-full group-hover:translate-x-full
                            transition-all duration-1000 ease-in-out" />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-t from-black/10 to-transparent
                            transition-opacity duration-300" />

              <span className="relative transform group-hover:-translate-y-px
                            transition-transform duration-300 ease-out">
                Quick View
              </span>

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