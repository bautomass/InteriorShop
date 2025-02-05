'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileHero } from './MobileMenuHeader';
const FIRST_SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080
} as const;

const heroImages = [
  {
    id: 'slide-1',
    src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_624ad208-26bc-4437-a2d2-857726a8a421.png?v=1738429094',
    alt: 'Hero image 1',
  },
  {
    id: 'slide-2',
    src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/3_36d88f5d-7420-49c3-9c1c-bfad1a6be399.png?v=1738429093',
    alt: 'Hero image 2',
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
  const isMobile = useMediaQuery('(max-width: 1023px)');
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
    // First pause any current animation
    setIsPaused(true);
    setProgress(0);
    
    // Update the index
    setCurrentIndex(prev => {
      if (direction === 'next') {
        return prev === heroImages.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? heroImages.length - 1 : prev - 1;
    });

    // Resume after a brief delay to ensure clean reset
    setTimeout(() => {
      setIsPaused(false);
    }, 0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Preload all images on component mount
  useEffect(() => {
    heroImages.forEach(image => {
      const img = new window.Image();
      img.src = image.src;
    });
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileHero />
      ) : (
        <section 
          className="relative w-full h-screen overflow-hidden"
          role="region" 
          aria-label="Hero image carousel"
        >
          {/* Keep preconnect hints */}
          <link rel="preconnect" href="https://cdn.shopify.com" />
          <link rel="dns-prefetch" href="https://cdn.shopify.com" />

          {/* Preload all images */}
          {heroImages.map((image, index) => (
            <link
              key={image.id}
              rel="preload"
              as="image"
              href={image.src}
              data-fetchpriority={index === 0 ? "high" : "low"}
            />
          ))}

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.7 }}
              transition={{ duration: 0.1 }}
              className="relative w-full h-full"
            >
              <Image
                src={heroImages[currentIndex]?.src || ''}
                alt={heroImages[currentIndex]?.alt || ''}
                {...(currentIndex === 0 
                  ? {
                      width: FIRST_SLIDE_DIMENSIONS.width,
                      height: FIRST_SLIDE_DIMENSIONS.height,
                      priority: true,
                      fetchPriority: "high",
                      loading: "eager",
                    }
                  : {
                      fill: true,
                      loading: "eager", // Changed from 'lazy' to prevent re-fetching
                    }
                )}
                quality={100}
                sizes="100vw"
                className={`object-cover ${currentIndex === 0 ? 'w-full h-full' : ''}`}
              />

              {/* First slide content with priority */}
              {currentIndex === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-16 top-[20%] transform -translate-y-1/2 z-20 max-w-2xl"
                >
                  <span className="inline-block text-white/90 font-medium tracking-[0.2em] uppercase text-sm mb-4">
                    Nature's Gift
                  </span>

                  <h2 className="text-[4.5rem] font-thin text-white leading-none mb-6">
                    Pure Living
                    <span className="block font-light text-[3.5rem] mt-2 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                      Art in Wood
                    </span>
                  </h2>

                  <p className="text-2xl text-white/80 font-extralight leading-relaxed tracking-wide mb-8">
                    Each piece brings nature's warmth to your home. Crafted by skilled artisans using real wood, our furniture purifies your air while creating spaces that feel alive and peaceful.
                  </p>

                  <div className="inline-flex items-center">
                    <Link 
                      href="/collections/organic-decoration"
                      className="group/btn relative inline-flex items-center justify-center gap-2 
                        px-6 py-3.5
                        bg-[#6B5E4C] text-[#eaeadf] text-sm
                        border border-[#B5A48B]/20
                        hover:bg-[#7B6E5C] hover:border-[#B5A48B]/40 
                        transition-all duration-300 
                        transform hover:-translate-y-0.5
                        overflow-hidden"
                    >
                      <span className="text-sm font-medium relative z-10">Discover the Collection</span>
                      <ChevronRight 
                        className="w-3.5 h-3.5 transform translate-x-0
                          group-hover/btn:translate-x-1 transition-transform duration-300
                          relative z-10" 
                      />
                      <div className="absolute top-0 -left-[100%] w-[120%] h-full 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Second slide content */}
              {currentIndex === 1 && (
                <>
                  <div className="absolute right-[23%] top-[12%] z-20 max-w-2xl">
                    <span className="inline-block text-[#564C47]/90 font-medium tracking-[0.2em] uppercase text-sm mb-4">
                      Art & Nature
                    </span>

                    <h2 className="text-[3.5rem] font-thin text-[#564C47] leading-none mb-8">
                      Mindfully Made
                      <span className="block font-light text-[2.5rem] mt-2 bg-gradient-to-r from-[#564C47] via-[#564C47]/95 to-[#564C47]/70 bg-clip-text text-transparent">
                        Living Pieces
                      </span>
                    </h2>

                    <p className="text-2xl text-[#564C47]/80 font-extralight leading-relaxed tracking-wide mb-8">
                      Each piece is handcrafted from nature's materials,<br/>creating healthier, more beautiful spaces.
                    </p>
                  </div>

                  {/* Buttons positioned at bottom left */}
                  <div className="absolute left-14 bottom-24 z-20 flex flex-row gap-4">
                    <Link 
                      href="/collections/anturam-eco-wooden-stools"
                      className="group/btn relative inline-flex items-center justify-center gap-2 
                        px-6 py-3.5
                        bg-[#6B5E4C] text-[#eaeadf] text-sm
                        border border-[#B5A48B]/20
                        hover:bg-[#7B6E5C] hover:border-[#B5A48B]/40 
                        transition-all duration-300 
                        transform hover:-translate-y-0.5
                        overflow-hidden"
                    >
                      <span className="text-sm font-medium relative z-10">View Wood Collection</span>
                      <ChevronRight 
                        className="w-3.5 h-3.5 transform translate-x-0
                          group-hover/btn:translate-x-1 transition-transform duration-300
                          relative z-10" 
                      />
                      <div className="absolute top-0 -left-[100%] w-[120%] h-full 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out" />
                    </Link>

                    <Link 
                      href="/collections/ceramic-vases"
                      className="group/btn relative inline-flex items-center justify-center gap-2 
                        px-6 py-3.5
                        bg-[#6B5E4C] text-[#eaeadf] text-sm
                        border border-[#B5A48B]/20
                        hover:bg-[#7B6E5C] hover:border-[#B5A48B]/40 
                        transition-all duration-300 
                        transform hover:-translate-y-0.5
                        overflow-hidden"
                    >
                      <span className="text-sm font-medium relative z-10">Shop Ceramics</span>
                      <ChevronRight 
                        className="w-3.5 h-3.5 transform translate-x-0
                          group-hover/btn:translate-x-1 transition-transform duration-300
                          relative z-10" 
                      />
                      <div className="absolute top-0 -left-[100%] w-[120%] h-full 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out" />
                    </Link>
                  </div>
                </>
              )}
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
      )}
    </>
  );
};

export default HeroCarousel;