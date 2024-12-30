// components/quickview/ProductGallery.tsx
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useState } from 'react';

export interface ProductGalleryProps {
  product: Product;
  onImageClick?: (imageUrl: string) => void;
}

export const ProductGallery = memo(({ product, onImageClick }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Get all unique images
  const images = Array.from(
    new Set([product.featuredImage?.url, ...(product.images || []).map((img) => img?.url)])
  ).filter((url): url is string => !!url);

  const handlePrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (onImageClick && images[index]) {
        onImageClick(images[index]);
      }
    },
    [images, onImageClick]
  );

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-sm bg-primary-100 dark:bg-primary-800">
        <span className="text-primary-400 dark:text-primary-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-sm bg-primary-50 dark:bg-primary-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]!}
              alt={`${product.title} - View ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="rounded-md bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="rounded-md bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      {/* Updated Thumbnails Section */}
      <div className="group relative">
        <div className="flex gap-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {images.map((image, index) => (
              <motion.button
                key={image}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm',
                  'ring-2 ring-offset-2 transition-all duration-200',
                  activeIndex === index
                    ? 'ring-accent-500 dark:ring-accent-400'
                    : 'ring-transparent hover:ring-primary-200 dark:hover:ring-primary-800'
                )}
              >
                <Image
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Add thumbnail navigation buttons */}
        {images.length > 4 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm bg-primary-900/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-sm bg-primary-900/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
});

ProductGallery.displayName = 'ProductGallery';
