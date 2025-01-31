// Hero.tsx

'use client';

import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import MobileHero from './MobileMenuHeader';

// Constants moved outside component to prevent recreation
const ANIMATION = {
  DURATION: 500,
  CAROUSEL_INTERVAL: 7000,
  DEBOUNCE_DELAY: 300,
} as const;

// Types and Interfaces
interface SlideContent {
  id: string;
  image: string;
  alt: string;
  lampImage?: string;
  productLink?: string;
}

interface HeroProps {}

// Hero slides data
const heroSlides: SlideContent[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Hero-banner.webp?v=1737225966',
    alt: 'Simple Interior Ideas',
    lampImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/lamp-el.svg',
    productLink: '/product/sleek-curve-japandi-glow-minimalist-pendant-light',
  },
  {
    id: 'slide-2',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Hero-Banner-Slide_2.webp?v=1737230223',
    alt: 'Architectural Beauty',
  },
  {
    id: 'slide-3',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/image-slide-banner.webp?v=1737894828',
    alt: 'Minimalist Living',
  }
];

// Memoized helper functions
const getLoopedIndex = (index: number, length: number) => ((index % length) + length) % length;

// Memoized components for better performance
const ProductDot = memo(({ className, href }: { className: string; href: string }) => (
  <div className={`relative inline-flex ${className}`}>
    <div className="absolute -inset-1 w-5 h-5 rounded-full bg-[#dcd5ca]/60 animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite]" />
    <div className="absolute -inset-1 w-5 h-5 rounded-full bg-[#ebe7e0]/50 animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite_1.75s]" />
    <div className="relative w-3 h-3 rounded-full bg-[#ebe7e0] shadow-[0_0_8px_rgba(199,186,168,0.8)] transition-all duration-500 ease-in-out group-hover:scale-125" />
    <div className="absolute left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Link 
        href={href}
        className="flex items-center gap-2 bg-[#ebe7e0]/95 backdrop-blur-sm shadow-lg rounded-lg p-2 border border-[#b39e86] hover:bg-[#dcd5ca]/95"
      >
        <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap px-1">
          View Product
        </span>
        <ChevronRight className="w-4 h-4 text-[#9c826b]" />
      </Link>
    </div>
  </div>
));

ProductDot.displayName = 'ProductDot';

const NavigationButton = memo(({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className={`relative group scale-90 ${direction === 'prev' ? 'ml-2' : 'mr-2'}`}
    whileHover={{ scale: 0.95 }}
    whileTap={{ scale: 0.85 }}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm group-hover:bg-black/60 transition-all duration-300 -z-10" />
    <div className="p-2.5 text-white flex items-center">
      {direction === 'prev' ? (
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      ) : (
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </div>
  </motion.button>
));

NavigationButton.displayName = 'NavigationButton';

// Custom hooks refactored for better performance
const useSlideNavigation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const nextIndex = getLoopedIndex(index, totalSlides);
    setCurrentSlide(nextIndex);
    
    const timer = setTimeout(() => setIsAnimating(false), ANIMATION.DURATION);
    return () => clearTimeout(timer);
  }, [isAnimating, totalSlides]);

  return { currentSlide, isAnimating, goToSlide };
};

const useImagePreloader = (images: string[]) => {
  useEffect(() => {
    const preloadImages = () => {
      images.forEach(src => {
        const img = new window.Image();
        img.src = src;
      });
    };
    preloadImages();
  }, [images]);
};

// Main Hero Component
const HeroComponent = function Hero({}: HeroProps): JSX.Element {
  // Add to the HeroComponent state
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Preload all hero images
  useImagePreloader(heroSlides.map(slide => slide.image));

  // State and hooks
  const { currentSlide, isAnimating, goToSlide } = useSlideNavigation(heroSlides.length);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const controls = useAnimation();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>();
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPaused && !isMenuHovered) {
      const timer = setTimeout(() => {
        goToSlide(currentSlide + 1);
      }, ANIMATION.CAROUSEL_INTERVAL + 4000);
      
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isMenuHovered, isPaused, goToSlide]);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.cssText = 'overflow: hidden; position: fixed; width: 100%; height: 100%;';
    } else {
      document.body.style.cssText = '';
    }

    return () => {
      document.body.style.cssText = '';
    };
  }, [isNavOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0]) setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null || !e.touches[0]) return;
    
    const diff = touchStart - e.touches[0].clientX;
    
    if (Math.abs(diff) > 50) {
      goToSlide(currentSlide + (diff > 0 ? 1 : -1));
      setTouchStart(null);
    }
  }, [touchStart, currentSlide, goToSlide]);

  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  // Event handlers
  const handleMenuHover = (isHovering: boolean) => {
    setIsMenuHovered(isHovering);
  };

  const handleScroll = useCallback((e: WheelEvent) => {
    // Commenting out the slide change logic on scroll
    // if (Math.abs(e.deltaY) > 30) {
    //   goToSlide(currentSlide + (e.deltaY > 0 ? 1 : -1));
    // }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const element = slideRefs.current[currentSlide];
    if (element) {
      element.addEventListener('wheel', handleScroll, { passive: true });
      return () => element.removeEventListener('wheel', handleScroll);
    }
  }, [currentSlide, handleScroll]);

  return (
    <>
      {/* Mobile Hero */}
      <MobileHero />

      {/* Desktop Hero - hide on mobile */}
      <div className="hidden lg:block">
        <div className="relative">
          <section 
            className="relative h-[100vh] w-full overflow-hidden pt-[57px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Updated Hero Content */}
            <div className="relative h-[100vh] w-full overflow-hidden">
              <div className="flex h-full">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    ref={el => slideRefs.current[index] = el}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      left: `${index * 100}%`,
                      transform: `translateX(${-currentSlide * 100}%)`,
                      transition: 'transform 0.5s ease-in-out'
                    }}
                    className="flex-shrink-0"
                  >
                    {/* Loading placeholder */}
                    <div 
                      className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${
                        loadedImages.has(slide.image) ? 'opacity-0' : 'opacity-100'
                      }`} 
                    />
                    
                    {/* Image component */}
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={index === 0 || index === 1} // Preload first two slides
                      quality={100}
                      className="object-cover w-full h-full transition-opacity duration-500 ${
                        loadedImages.has(slide.image) ? 'opacity-100' : 'opacity-0'
                      }"
                      sizes="(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, 100vw"
                      style={{
                        objectPosition: index === 2 ? 'center -75px' : 'center'
                      }}
                      onLoad={() => {
                        setLoadedImages(prev => new Set(prev).add(slide.image));
                      }}
                    />

                    {/* Lamp Image - Keep animation for visual interest */}
                    {index === 0 && slide.lampImage && (
                      <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ 
                          opacity: currentSlide === index ? 1 : 0,
                          y: currentSlide === index ? 0 : -50,
                          rotate: [0, 2, -2, 2, 0],
                        }}
                        transition={{
                          opacity: { duration: 0.5 },
                          y: { duration: 0.5 },
                          rotate: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        className="absolute left-[15%] top-[-4%] z-10 w-[120px] origin-top md:w-[175px]"
                      >
                        <div className="relative">
                          <Image
                            src={slide.lampImage}
                            alt=""
                            width={175}
                            height={175}
                            priority
                            className="h-auto w-full"
                          />
                          
                          {/* Keep the interactive product dot */}
                          <div className="group absolute bottom-[20%] left-[65%] -translate-x-1/2 translate-y-1/2">
                            <ProductDot className="w-4 h-4" href={slide.productLink || '#'} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* New Image for the first slide */}
                    {index === 0 && (
                      <div className="absolute left-1/3 top-[35%] transform -translate-x-1/3 z-20">
                        <Image
                          src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Simple_Interior_Ideas_1_157c17e3-9c9d-4485-bf2c-1fabdcb870c5.svg?v=1711363730"
                          alt="Simple Interior Ideas"
                          width={550}
                          height={400}
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* New Product Dot 1 - Render only on the first slide */}
                    {currentSlide === 0 && (
                      <div className="group absolute bottom-[30%] right-[38%] -translate-x-1/2 translate-y-1/2">
                        <ProductDot className="w-4 h-4" href="/product/product-1" />
                      </div>
                    )}

                    {/* New Product Dot 2 - Render only on the first slide */}
                    {currentSlide === 0 && (
                      <div className="group absolute bottom-[32%] left-[36%] -translate-x-1/2 translate-y-1/2">
                        <ProductDot className="w-4 h-4" href="/product/product-2" />
                      </div>
                    )}

                    {/* New Heading and Buttons for the second slide */}
                    {currentSlide === 1 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-16 top-[40%] transform -translate-y-1/2 z-20 max-w-2xl"
                      >
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                          className="inline-block text-white/90 font-medium tracking-[0.2em] uppercase text-sm mb-4"
                        >
                          Nature's Gift
                        </motion.span>

                        <motion.h2
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className="text-[5.5rem] font-thin text-white leading-none mb-6"
                        >
                          Pure Living
                          <span className="block font-light text-[3.5rem] mt-2 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                          Art in Wood
                          </span>
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                          className="text-2xl text-white/80 font-extralight leading-relaxed tracking-wide mb-8"
                        >
                          Each piece brings nature's warmth to your home. Crafted by skilled artisans using real wood, our furniture purifies your air while creating spaces that feel alive and peaceful.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                          className="group inline-flex items-center"
                        >
                          <Link 
                            href="/collections/organic-decoration"
                            className="inline-flex items-center gap-3 bg-[#ebe7e0]/95 backdrop-blur-sm 
                                     shadow-lg border border-[#b39e86] overflow-hidden hover:bg-[#dcd5ca]/95 
                                     transition-all duration-500 px-4 py-4 relative"
                          >
                            <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap">
                              Discover the Collection
                            </span>
                            <motion.div 
                              className="flex items-center"
                              initial={{ x: 0 }}
                              animate={{ x: [0, 5, 0] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.5,
                                ease: "easeInOut"
                              }}
                            >
                              <ChevronRight className="w-5 h-5 text-[#9c826b]" />
                            </motion.div>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                    {/* End of Heading and Buttons for the second slide */}

                    {/* Content for the third slide */}
                    {currentSlide === 2 && (
                      <>
                        {/* Text content - keeping exact same position */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute right-64 top-[10%] z-20 max-w-2xl"
                        >
                          <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                          className="inline-block text-white/90 font-medium tracking-[0.2em] uppercase text-sm mb-4"
                          >
                          Art & Nature
                          </motion.span>

                          <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                            className="text-[3.5rem] font-thin text-white leading-none mb-8"
                          >
                            Mindfully Made
                            <span className="block font-light text-[2.5rem] mt-2 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                              Living Pieces
                            </span>
                          </motion.h2>

                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                            className="text-2xl text-white/80 font-extralight leading-relaxed tracking-wide"
                          >
                            Each piece is handcrafted from nature's materials,<br/>creating healthier, more beautiful spaces.
                          </motion.p>
                        </motion.div>

                        {/* Buttons positioned at bottom left */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute left-14 bottom-24 z-20 flex flex-row gap-4"
                        >
                          {/* First Button */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="group inline-flex items-center"
                          >
                            <Link 
                              href="/collections/anturam-eco-wooden-stools"
                              className="inline-flex items-center gap-3 bg-[#ebe7e0]/95 backdrop-blur-sm 
                                      shadow-lg border border-[#b39e86] overflow-hidden hover:bg-[#dcd5ca]/95 
                                      transition-all duration-500 px-4 py-4 relative"
                            >
                              <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap">
                              View Wood Collection
                              </span>
                              <motion.div 
                                className="flex items-center"
                                initial={{ x: 0 }}
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                              >
                                <ChevronRight className="w-5 h-5 text-[#9c826b]" />
                              </motion.div>
                            </Link>
                          </motion.div>

                          {/* Second Button */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="group inline-flex items-center"
                          >
                            <Link 
                              href="/collections/ceramic-vases"
                              className="inline-flex items-center gap-3 bg-[#ebe7e0]/95 backdrop-blur-sm 
                                      shadow-lg border border-[#b39e86] overflow-hidden hover:bg-[#dcd5ca]/95 
                                      transition-all duration-500 px-4 py-4 relative"
                            >
                              <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap">
                              Shop Ceramics
                              </span>
                              <motion.div 
                                className="flex items-center"
                                initial={{ x: 0 }}
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                              >
                                <ChevronRight className="w-5 h-5 text-[#9c826b]" />
                              </motion.div>
                            </Link>
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                    {/* End of Content for the third slide */}
                  </div>
                ))}
              </div>

              {/* Enhanced Professional Pagination with Navigation and Pause Button */}
              <div className="absolute bottom-16 right-8 z-20 flex items-center gap-4 perspective-[1200px] transform-gpu scale-80">
                <NavigationButton direction="prev" onClick={() => goToSlide(currentSlide - 1)} />

                <div className="flex items-center gap-1 relative">
                  {[...Array(3)].map((_, i) => {
                    const slideIndex = getLoopedIndex(currentSlide - 1 + i, heroSlides.length);
                    const slide = heroSlides[slideIndex];
                    if (!slide) return null;
                    const isActive = i === 1;
                    const actualSlideNumber = slideIndex + 1;
                    
                    return (
                      <motion.div
                        key={`${slide.id}-${i}`}
                        onClick={() => goToSlide(slideIndex)}
                        initial={false}
                        animate={{
                          scale: isActive ? 1 : 0.9,
                          rotateY: (i - 1) * 12,
                          z: isActive ? 0 : -30,
                          y: isActive ? -4 : 0
                        }}
                        whileHover={{ 
                          scale: isActive ? 1.02 : 0.95,
                          y: isActive ? -8 : -4,
                          transition: { duration: 0.2 }
                        }}
                        className={`relative cursor-pointer rounded-lg
                                    transition-shadow duration-300
                                    ${isActive ? 
                                      'w-40 h-20 shadow-lg hover:shadow-xl z-10' : 
                                      'w-32 h-16 shadow-md hover:shadow-lg z-0'}`}
                      >
                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
                          <Image
                            src={`${slide.image}&width=400&height=240&crop=center&quality=90`}
                            alt={slide.alt}
                            fill
                            priority={isActive}
                            className="object-cover transition-all duration-500 ease-out rounded-lg"
                            sizes="(min-width: 768px) 160px, 128px"
                            quality={90}
                          />
                          <div className={`absolute inset-0 transition-all duration-500
                                        bg-gradient-to-t from-black/30 to-transparent
                                        ${isActive ? 'opacity-0' : 'opacity-100 hover:opacity-50'}`}
                          />
                          
                          {/* Active Highlight Effects */}
                          {isActive && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 1.2 }}
                                animate={{ opacity: [0, 1, 0], scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 bg-white/20 pointer-events-none"
                              />
                              {/* Shimmering effect */}
                              <motion.div
                                initial={{ x: '-100%', opacity: 0.5 }}
                                animate={{ x: '100%', opacity: 0 }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatDelay: 3,
                                  ease: "easeInOut"
                                }}
                                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                           transform rotate-15 pointer-events-none blur-sm"
                                style={{
                                  clipPath: 'polygon(5% 0, 95% 0, 85% 100%, 15% 100%)'
                                }}
                              />
                            </>
                          )}
                        </div>
                        
                        {/* Active Indicator with Enhanced Animation */}
                        {isActive && (
                          <motion.div
                            layoutId="activeThumb"
                            className="absolute inset-0 border-2 border-white"
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        {/* Slide number indicator - slightly reduced size */}
                        <div className="absolute -top-2 -right-2 z-[100] bg-black/50 backdrop-blur-sm 
                                rounded-full w-6 h-6 border border-white/10
                                flex items-center justify-center text-white/90 
                                text-xs font-medium shadow-lg">
                          {actualSlideNumber}
                        </div>

                        {/* Pause/Play Button - preserved */}
                        {isActive && (
                          <motion.button
                            onClick={togglePause}
                            className="absolute bottom-2 left-2 z-20 p-1 bg-black/60 rounded-full group"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={isPaused ? "Play" : "Pause"}
                          >
                            {isPaused ? (
                              <Play className="h-2.5 w-2.5 text-white" />
                            ) : (
                              <Pause className="h-2.5 w-2.5 text-white" />
                            )}
                            <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {isPaused ? "Play" : "Pause"}
                            </span>
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <NavigationButton direction="next" onClick={() => goToSlide(currentSlide + 1)} />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Navigation Buttons - Added opposite to carousel thumbnails */}
      {currentSlide === 0 && (
        <div className="absolute bottom-6 left-8 z-20 hidden lg:flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-4 perspective-[1200px] transform-gpu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/story"
              aria-label="Read our story"
              className="relative group inline-flex items-center justify-center px-6 py-3 
                        bg-white/90 backdrop-blur-sm text-[#9e896c]
                        hover:bg-[#9e896c] hover:text-white
                        transition-all duration-300 shadow-lg shadow-black/5
                        focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2
                        transform transition-transform duration-300 scale-100 group-hover:scale-105"
            >
              <span className="relative text-sm font-medium">
                Our Story
              </span>
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [0.8, 1], opacity: [0, 0.1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </Link>

            <Link
              href="/collections/all-products"
              aria-label="Browse all products"
              className="relative group inline-flex items-center justify-center px-6 py-3
                        bg-[#9e896c]/90 backdrop-blur-sm text-white
                        hover:bg-[#dcd5ca] hover:text-[#9e89ā6c] 
                        transition-all duration-300 shadow-lg shadow-black/5
                        focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2
                        transform transition-transform duration-300 scale-100 group-hover:scale-105"
            >
              <span className="relative text-sm font-medium">
                All Products
              </span>
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [0.8, 1], opacity: [0, 0.1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </Link>

            <Link
              href="/collections"
              aria-label="Browse all collections"
              className="relative group inline-flex items-center justify-center px-6 py-3
                        bg-[#eaeadf] backdrop-blur-sm text-white
                        hover:bg-[#dcd5ca] hover:text-[#9e896c] 
                        transition-all duration-300 shadow-lg shadow-black/5
                        focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2
                        transform transition-transform duration-300 scale-100 group-hover:scale-110"
            >
              <span className="relative text-sm font-medium text-[#9e896c]">
                All Collections
              </span>
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [0.8, 1], opacity: [0, 0.1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </Link>
          </motion.div>
        </div>
      )}
    </>
  );
};

const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';

export default Hero;