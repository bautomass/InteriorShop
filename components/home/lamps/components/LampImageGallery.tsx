'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useState } from 'react';
import type { LampImageGalleryProps } from '../types/lamp-types';

export const LampImageGallery = memo(function LampImageGallery({ product }: LampImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Deduplicate images and filter out nulls
  const images = Array.from(
    new Set([product.featuredImage?.url, ...(product.images || []).map((img) => img?.url)])
  ).filter((url): url is string => !!url);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const sectionWidth = width / images.length;
    const section = Math.floor(x / sectionWidth);
    setActiveImage(Math.min(section, images.length - 1));
  };

  if (!images.length) {
    return (
      <div className="relative flex aspect-square items-center justify-center bg-primary-100">
        <span className="text-primary-400">No image available</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Image gallery for ${product.title}`}
      className="group relative aspect-square cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(0);
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
              className="transform object-cover transition-transform duration-500 group-hover:scale-105"
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
            className="h-2 w-2 rounded-full"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />
        ))}
        {images.length > 11 && (
          <div
            className="h-2 w-2 rounded-full bg-black/70"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            title={`+${images.length - 11} more images`}
          />
        )}
      </div>

      {/* Hover guides */}
      {isHovered && images.length > 1 && (
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${images.length}, 1fr)`
          }}
        >
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
  );
});

LampImageGallery.displayName = 'LampImageGallery';