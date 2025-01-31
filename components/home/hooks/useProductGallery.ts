// /components/home/hooks/useProductGallery.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCT_CONSTANTS } from '../constants';
import type { TouchState } from '../types';

export const useProductGallery = (totalImages: number) => {
  const [activeImage, setActiveImage] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({ start: null, end: null });
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = useCallback(() => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scrollToThumbnail = useCallback((index: number) => {
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
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch?.clientX) {
      setTouchState(prev => ({ ...prev, start: touch.clientX }));
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch?.clientX) {
      setTouchState(prev => ({ ...prev, end: touch.clientX }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const { start, end } = touchState;
    if (!start || !end) return;
    
    const distance = start - end;
    const isLeftSwipe = distance > PRODUCT_CONSTANTS.TOUCH_THRESHOLD;
    const isRightSwipe = distance < -PRODUCT_CONSTANTS.TOUCH_THRESHOLD;

    if (isLeftSwipe) {
      const newIndex = activeImage === totalImages - 1 ? 0 : activeImage + 1;
      setActiveImage(newIndex);
      scrollToThumbnail(newIndex);
    }
    if (isRightSwipe) {
      const newIndex = activeImage === 0 ? totalImages - 1 : activeImage - 1;
      setActiveImage(newIndex);
      scrollToThumbnail(newIndex);
    }

    setTouchState({ start: null, end: null });
  }, [activeImage, totalImages, touchState, scrollToThumbnail]);

  useEffect(() => {
    const thumbnailsElement = thumbnailsRef.current;
    
    if (thumbnailsElement) {
      const handleScroll = () => checkScrollButtons();
      thumbnailsElement.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        thumbnailsElement.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [checkScrollButtons]);

  return {
    activeImage,
    setActiveImage,
    canScrollLeft,
    canScrollRight,
    thumbnailsRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scrollToThumbnail,
    checkScrollButtons
  };
};