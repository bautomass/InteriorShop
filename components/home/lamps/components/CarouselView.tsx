'use client';

import type { Product } from '@/lib/shopify/types';
import { memo } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LAMP_CONSTANTS } from '../constants/lamp-constants';
import { CarouselNavButton } from './CarouselNavButton';
import { LampProductCard } from './LampProductCard';

interface CarouselViewProps {
  products: Product[];
  cardsToShow: number;
  isSlideHovered: boolean;
  handleSlideHover: (isHovered: boolean) => void;
  handleQuickView: (product: Product) => void;
  handleSwiperInit: (swiper: any) => void;
  handleSlideChange: (swiper: any) => void;
  isBeginning: boolean;
  isEnd: boolean;
}

export const CarouselView = memo(function CarouselView({
  products,
  cardsToShow,
  isSlideHovered,
  handleSlideHover,
  handleQuickView,
  handleSwiperInit,
  handleSlideChange,
  isBeginning,
  isEnd
}: CarouselViewProps) {
  return (
    <div
      className="relative"
      onMouseEnter={() => handleSlideHover(true)}
      onMouseLeave={() => handleSlideHover(false)}
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
          enabled: true
        }}
        breakpoints={LAMP_CONSTANTS.SWIPER_CONFIG.breakpoints}
        className="px-0"
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <LampProductCard
              product={product}
              onQuickView={() => handleQuickView(product)}
              cardsToShow={cardsToShow}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <CarouselNavButton 
        direction="prev" 
        isDisabled={isBeginning} 
        className="[@media(min-width:700px)]:flex"
      />
      <CarouselNavButton 
        direction="next" 
        isDisabled={isEnd} 
        className="[@media(min-width:700px)]:flex"
      />
    </div>
  );
});

CarouselView.displayName = 'CarouselView';