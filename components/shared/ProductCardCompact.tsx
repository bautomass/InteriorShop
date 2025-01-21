"use client"
import type { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useState } from 'react';

interface ProductCardCompactProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCardCompact = memo(({ product, onClick }: ProductCardCompactProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useCurrency();

  // Get first two images (featured image and first additional image)
  const images = Array.from(new Set([
    product.featuredImage?.url,
    ...(product.images || []).map(img => img?.url)
  ])).filter((url): url is string => !!url);

  const primaryImage = images[0];
  const secondaryImage = images[1] || images[0]; // Fallback to first image if no second image exists

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative group h-full bg-white dark:bg-primary-800/50 backdrop-blur-sm 
                 rounded-sm shadow-lg transition-all duration-500 
                 hover:shadow-xl hover:shadow-primary-900/10 dark:hover:shadow-primary-100/10 
                 min-w-[200px] w-full"
      onClick={onClick}
    >
      <div className="relative">
        {/* Image Display with Hover Effect */}
        <div 
          className="relative aspect-square overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className={`
                  object-cover absolute top-0 left-0 
                  transition-opacity duration-300 ease-in-out
                  ${isHovered ? 'opacity-0' : 'opacity-100'}
                `}
                loading="lazy"
              />
            )}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.title} - Alternate View`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className={`
                  object-cover absolute top-0 left-0 
                  transition-opacity duration-300 ease-in-out
                  ${isHovered ? 'opacity-100' : 'opacity-0'}
                `}
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Show first tag if available */}
          {product.tags && product.tags.length > 0 && (
            <div className="inline-flex px-2 py-1 rounded-full 
                          text-xs font-medium tracking-wide
                          bg-primary-100/80 dark:bg-primary-700/80
                          text-primary-800 dark:text-primary-100">
              {product.tags[0]}
            </div>
          )}

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
                {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
              </p>
            </div>
            {product.compareAtPriceRange?.minVariantPrice && 
             parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
              <>
                <span className="text-sm text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                  {formatPrice(parseFloat(product.compareAtPriceRange.minVariantPrice.amount))}
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
                      line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

ProductCardCompact.displayName = 'ProductCardCompact' 