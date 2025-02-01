// /components/home/components/ProductGallery.tsx
import Image from 'next/image';
import { memo } from 'react';
import { PRODUCT_CONSTANTS } from './constants';
import type { ProductGalleryProps } from './types';

export const ProductGallery = memo(function ProductGallery({
  images,
  title,
  activeImage,
  onImageChange,
  isHovering,
  setIsHovering,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: ProductGalleryProps) {
  const getImagePriority = (index: number): boolean => {
    return index === activeImage || index === (activeImage + 1) % images.length;
  };

  return (
    <div 
      className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group"
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => onTouchStart(e)}
      onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => onTouchMove(e)}
      onTouchEnd={() => onTouchEnd()}
    >
      <div className="absolute inset-0">
        <Image
          src={images[activeImage]?.url || ''}
          alt={images[activeImage]?.altText || title}
          fill
          className="object-cover"
          priority={getImagePriority(activeImage)}
          sizes={PRODUCT_CONSTANTS.IMAGE_SIZES.MAIN}
        />
      </div>

      <button
        onClick={() => {
          const newIndex = activeImage === 0 ? images.length - 1 : activeImage - 1;
          onImageChange(newIndex);
        }}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                  rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center 
                  text-white transition-opacity duration-300 hover:bg-black/60 touch-manipulation
                  opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => {
          const newIndex = activeImage === images.length - 1 ? 0 : activeImage + 1;
          onImageChange(newIndex);
        }}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                  rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center 
                  text-white transition-opacity duration-300 hover:bg-black/60 touch-manipulation
                  opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${activeImage === index 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

ProductGallery.displayName = 'ProductGallery';