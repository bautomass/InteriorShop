'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

const heroImages = [
  {
    id: 'slide-1',
    src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_624ad208-26bc-4437-a2d2-857726a8a421.png?v=1738429094',
    alt: 'Hero image 1',
    priority: true,
    loading: 'eager'
  },
  {
    id: 'slide-2',
    src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/3_36d88f5d-7420-49c3-9c1c-bfad1a6be399.png?v=1738429093',
    alt: 'Hero image 2',
    loading: 'lazy'
  }
];

const NavigationControl = ({ onNavigate, isPaused, onPauseToggle, progress }: {
  onNavigate: (direction: 'prev' | 'next') => void;
  isPaused: boolean;
  onPauseToggle: () => void;
  progress: number;
}) => (
  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl rounded-lg p-1.5 border border-white/10 shadow-lg scale-90">
    <motion.button
      onClick={() => onNavigate('prev')}
      className="p-2 transition-all duration-300"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChevronLeft className="w-4 h-4 text-white/90" />
    </motion.button>

    <div className="relative h-8 flex items-center px-2 group">
      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-white/40 via-white/60 to-white/80"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.1s linear'
          }}
        />
      </div>
      
      <motion.button
        className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                 transition-all duration-300 bg-white/10 backdrop-blur-md p-1.5 rounded-full
                 border border-white/20 shadow-xl hover:bg-white/20"
        onClick={onPauseToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPaused ? (
          <Play className="h-3 w-3 text-white" />
        ) : (
          <Pause className="h-3 w-3 text-white" />
        )}
      </motion.button>
    </div>

    <motion.button
      onClick={() => onNavigate('next')}
      className="p-2 transition-all duration-300"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChevronRight className="w-4 h-4 text-white/90" />
    </motion.button>
  </div>
);

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const ROTATION_INTERVAL = useMemo(() => 10000, []);

  const rotateImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    let startTime = Date.now();

    // Progress bar interval
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = (elapsedTime / ROTATION_INTERVAL) * 100;
      
      if (calculatedProgress >= 100) {
        setProgress(0);
      } else {
        setProgress(calculatedProgress);
      }
    }, 16);

    const rotationInterval = setInterval(() => {
      rotateImage();
      startTime = Date.now();
      setProgress(0);
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(progressInterval);
      clearInterval(rotationInterval);
    };
  }, [isPaused, rotateImage, ROTATION_INTERVAL]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    setProgress(0);
    setCurrentIndex(prev => {
      if (direction === 'next') {
        return prev === heroImages.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? heroImages.length - 1 : prev - 1;
    });
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return (
    <section 
      className="relative w-full h-screen overflow-hidden"
      role="region" 
      aria-label="Hero image carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={false}
          animate={{ opacity: 1 }}
          exit={false}
          transition={{ duration: 0 }}
          className="relative w-full h-full"
        >
          <Image
            src={heroImages[currentIndex]?.src || ''}
            alt={heroImages[currentIndex]?.alt || ''}
            fill
            priority={currentIndex === 0}
            quality={90}
            sizes="100vw"
            className="object-cover"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 z-20">
        <NavigationControl 
          onNavigate={handleNavigate}
          isPaused={isPaused}
          onPauseToggle={togglePause}
          progress={progress}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;