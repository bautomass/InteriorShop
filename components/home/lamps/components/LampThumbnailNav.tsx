'use client';

import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface LampThumbnailNavProps {
  products: Product[];
  activeThumbIndex: number;
  onThumbChange: (swiper: SwiperType) => void;
  mainSwiper: SwiperType | null;
  setThumbSwiper: (swiper: SwiperType) => void;
}

export const LampThumbnailNav = memo(function LampThumbnailNav({
  products,
  activeThumbIndex,
  onThumbChange,
  mainSwiper,
  setThumbSwiper
}: LampThumbnailNavProps) {
  const handleThumbsChange = (index: number) => {
    // ... existing logic ...
  };

  return (
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
          onSwiper={setThumbSwiper}
          onSlideChange={(swiper) => {
            onThumbChange(swiper);
            // Sync main swiper
            if (swiper && swiper.activeIndex !== activeThumbIndex) {
              mainSwiper?.slideTo(swiper.activeIndex);
            }
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={`thumb-${product.id}`}>
              <button
                onClick={() => {
                  mainSwiper?.slideTo(index);
                  onThumbChange(mainSwiper as SwiperType);
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

        {/* Navigation Buttons */}
        <button
          className="thumb-prev absolute left-0 top-0 z-10 flex h-full w-10 items-center 
                     justify-center bg-gradient-to-r from-primary-900/40 via-primary-900/20 
                     to-transparent transition-all duration-300 hover:from-primary-900/60"
          aria-label="Previous thumbnails"
        >
          <div className="flex h-full items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
          </div>
        </button>
        <button
          className="thumb-next absolute right-0 top-0 z-10 flex h-full w-10 items-center 
                     justify-center bg-gradient-to-l from-primary-900/40 via-primary-900/20 
                     to-transparent transition-all duration-300 hover:from-primary-900/60"
          aria-label="Next thumbnails"
        >
          <div className="flex h-full items-center justify-center">
            <ChevronRight className="h-5 w-5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
          </div>
        </button>
      </div>
    </div>
  );
});

LampThumbnailNav.displayName = 'LampThumbnailNav';