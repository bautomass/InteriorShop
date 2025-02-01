'use client';

import { PriceSortFilter } from '@/components/filter/PriceSortFilter';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import { useQuickView } from '@/hooks/useQuickView';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import 'swiper/css';
import 'swiper/css/navigation';

import { LAMP_CONSTANTS } from './constants/lamp-constants';
import { useLampProducts } from './hooks/useLampProducts';
import { useLampSwiperControls } from './hooks/useLampSwiperControls';

import { Product } from '@/lib/shopify/types';
import { Swiper as SwiperType } from 'swiper';
import { CarouselView } from './components/CarouselView';
import { LampBannerSection } from './components/LampBannerSection';
import { LampGridView } from './components/LampGridView';
import { LampThumbnailNav } from './components/LampThumbnailNav';
import { LampViewControls } from './components/LampViewControls';
import { MobileControls } from './components/MobileControls';

function LampsCollectionSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const {
    products,
    sortedProducts,
    error,
    loading,
    handlePriceSort
  } = useLampProducts();

  const {
    mainSwiper,
    thumbSwiper,
    isBeginning,
    isEnd,
    activeThumbIndex,
    isSlideHovered,
    handleSwiperInit,
    handleSlideChange,
    handleThumbsChange,
    handleSlideHover,
    setThumbSwiper,
    setActiveThumbIndex
  } = useLampSwiperControls();

  const [isGridView, setIsGridView] = useState(false);
  const [cardsToShow, setCardsToShow] = useState<number>(LAMP_CONSTANTS.VIEW_SETTINGS.defaultCards);
  const quickView = useQuickView();

  const [hasAnimated, setHasAnimated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lampBannerAnimated') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (inView && !hasAnimated) {
      localStorage.setItem('lampBannerAnimated', 'true');
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  const handleViewChange = useCallback((isGrid: boolean) => {
    setIsGridView(isGrid);
  }, []);

  const handleCardCountChange = useCallback((value: number) => {
    setCardsToShow(value);
  }, []);

  const handleQuickView = useCallback(
    (product: Product) => {
      quickView.openQuickView(product);
    },
    [quickView]
  );

  if (error) {
    return (
      <div className="w-full bg-primary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!products.length || loading) return null;

  return (
    <>
      <section
        ref={ref}
        className="relative w-full overflow-hidden bg-primary-50 py-0"
        aria-label="Lamps Collection"
      >
        <div className="container relative mx-auto px-4">
          {/* Header Section */}
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-4 md:px-8">
            <div className="mx-auto max-w-[2000px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col gap-6"
              >
                {/* Title and Line */}
                <div className="relative">
                  <h2 className="text-3xl font-bold text-primary-900 md:text-4xl">
                    Lamps
                  </h2>
                  <div className="absolute bottom-0 left-0 mt-4 h-px w-full bg-gradient-to-r 
                                from-primary-900/20 via-primary-900/40 to-primary-900/20" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Banner Section */}
          {inView && <LampBannerSection shouldAnimate={!hasAnimated} />}

          {/* Products Section */}
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-10 [@media(max-width:700px)]:px-4">
            <div className="relative mx-auto max-w-[1700px] px-10 [@media(max-width:700px)]:px-2">
              {/* Desktop Controls */}
              <div className="relative hidden h-12 lg:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <PriceSortFilter onSort={handlePriceSort} />
                  </div>

                  <LampViewControls
                    current={cardsToShow}
                    min={LAMP_CONSTANTS.VIEW_SETTINGS.minCards}
                    max={LAMP_CONSTANTS.VIEW_SETTINGS.maxCards}
                    onChange={handleCardCountChange}
                    isGridView={isGridView}
                    onViewChange={handleViewChange}
                  />
                </div>
              </div>

              {/* Mobile Controls */}
              <MobileControls 
                handlePriceSort={handlePriceSort}
                mainSwiper={mainSwiper}
                isBeginning={isBeginning}
                isEnd={isEnd}
                activeThumbIndex={activeThumbIndex}
                sortedProducts={sortedProducts}
                setActiveThumbIndex={setActiveThumbIndex}
              />

              {/* Products Display */}
              {isGridView ? (
                <LampGridView
                  products={sortedProducts as Product[]}
                  cardsToShow={cardsToShow}
                  onQuickView={handleQuickView}
                />
              ) : (
                <CarouselView 
                  products={sortedProducts}
                  cardsToShow={cardsToShow}
                  isSlideHovered={isSlideHovered}
                  handleSlideHover={handleSlideHover}
                  handleQuickView={handleQuickView}
                  handleSwiperInit={handleSwiperInit}
                  handleSlideChange={handleSlideChange}
                  isBeginning={isBeginning}
                  isEnd={isEnd}
                />
              )}

              {/* Mobile Thumbnail Navigation */}
              <LampThumbnailNav 
                products={sortedProducts as Product[]}
                activeThumbIndex={activeThumbIndex}
                onThumbChange={handleThumbsChange}
                mainSwiper={mainSwiper as SwiperType}
                setThumbSwiper={setThumbSwiper as (swiper: SwiperType) => void}
              />
            </div>
          </div>
        </div>
      </section>

      {/* QuickView Modal */}
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
  );
}

export default memo(LampsCollectionSection);