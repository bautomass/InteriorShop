// ProductGallery.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ShareManager } from './ShareManager';

export function ProductGallery({ images, product }: { images: any[], product: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollToActiveThumbnail = (index: number) => {
    if (thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const thumbnails = container.children;
      if (thumbnails[index]) {
        const thumbnail = thumbnails[index] as HTMLElement;
        const containerWidth = container.clientWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const desiredPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: desiredPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const thumbnailsElement = thumbnailsRef.current;
    
    if (thumbnailsElement) {
      thumbnailsElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (thumbnailsElement) {
        thumbnailsElement.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group">
        <motion.div 
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <Image
            src={images[activeImage]?.url}
            alt={images[activeImage]?.altText || "Product image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            const newIndex = activeImage === 0 ? images.length - 1 : activeImage - 1;
            setActiveImage(newIndex);
            scrollToActiveThumbnail(newIndex);
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                    bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                    sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 
                    hover:bg-black/60 touch-manipulation"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => {
            const newIndex = activeImage === images.length - 1 ? 0 : activeImage + 1;
            setActiveImage(newIndex);
            scrollToActiveThumbnail(newIndex);
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                    bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                    sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 
                    hover:bg-black/60"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Background gradient for indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveImage(index);
                scrollToActiveThumbnail(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${activeImage === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails Gallery */}
      <div className="relative mt-1 sm:mt-2">
        {canScrollLeft && (
          <button
            onClick={() => {
              if (thumbnailsRef.current) {
                thumbnailsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center 
                       bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-200"
            aria-label="Scroll thumbnails left"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => {
              if (thumbnailsRef.current) {
                thumbnailsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center 
                       bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-200"
            aria-label="Scroll thumbnails right"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div 
          ref={thumbnailsRef}
          className="flex gap-2 px-1 py-2 sm:py-4 overflow-x-auto scroll-smooth 
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.url}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveImage(index);
                scrollToActiveThumbnail(index);
              }}
              className={`relative w-16 sm:w-20 flex-shrink-0 aspect-square rounded-md sm:rounded-lg cursor-pointer
                         ${activeImage === index ? 'ring-2 ring-offset-2 ring-neutral-900' : 'opacity-70 hover:opacity-100'} 
                         transition-all duration-200`}
            >
              <Image
                src={image.url}
                alt={image.altText || `Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {activeImage === index && (
                <div className="absolute inset-0 bg-neutral-900/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share Section */}
      <div className="hidden sm:block">
        <ShareManager product={product} images={images} />
      </div>
    </div>
  );
}