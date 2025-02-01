import { useCallback, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export const useLampSwiperControls = () => {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [isSlideHovered, setIsSlideHovered] = useState(false);

  const handleSwiperInit = useCallback((swiperInstance: SwiperType) => {
    setMainSwiper(swiperInstance);
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
    swiperInstance.navigation.update();
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveThumbIndex(swiper.activeIndex);
    
    if (thumbSwiper && thumbSwiper.activeIndex !== swiper.activeIndex) {
      thumbSwiper.slideTo(swiper.activeIndex);
    }
  }, [thumbSwiper]);

  const handleThumbsChange = useCallback((swiper: SwiperType) => {
    setActiveThumbIndex(swiper.activeIndex);
    if (mainSwiper && mainSwiper.activeIndex !== swiper.activeIndex) {
      mainSwiper.slideTo(swiper.activeIndex);
    }
  }, [mainSwiper]);

  const handleSlideHover = useCallback((isHovered: boolean) => {
    setIsSlideHovered(isHovered);
  }, []);

  return {
    mainSwiper,
    thumbSwiper,
    isBeginning,
    isEnd,
    activeThumbIndex,
    isSlideHovered,
    setMainSwiper,
    setThumbSwiper,
    handleSwiperInit,
    handleSlideChange,
    handleThumbsChange,
    handleSlideHover,
    setIsSlideHovered,
    setActiveThumbIndex
  };
};