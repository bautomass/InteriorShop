import { useEffect } from 'react';

const preloadImage = (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

export const useImagePreloader = (imageUrls: string[]) => {
  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(imageUrls.map(preloadImage));
      } catch (error) {
        console.warn('Failed to preload images:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);
};