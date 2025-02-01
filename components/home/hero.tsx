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

// Define consistent image dimensions for all slides
const SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080,
  thumbnailWidth: 160,
  thumbnailHeight: 90
} as const;

// Types and Interfaces
interface SlideContent {
  id: string;
  image: string;
  alt: string;
  lampImage?: string;
  productLink?: string;
  width: number;
  height: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

interface HeroProps {}

// Hero slides data with consistent dimensions
export const heroSlides: SlideContent[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/1_4a1ed1f2-1f28-465f-960a-8f58bcb22838.png?v=1738429093',
    alt: 'Modern minimalist living room featuring a sleek pendant light and natural wood furniture',
    width: SLIDE_DIMENSIONS.width,
    height: SLIDE_DIMENSIONS.height,
    priority: true,
    loading: 'eager',
    lampImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/lamp-el.svg',
    productLink: '/product/sleek-curve-japandi-glow-minimalist-pendant-light',
  },
  {
    id: 'slide-2',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_624ad208-26bc-4437-a2d2-857726a8a421.png?v=1738429094',
    alt: 'Contemporary architectural space with natural wood elements and minimalist design',
    width: SLIDE_DIMENSIONS.width,
    height: SLIDE_DIMENSIONS.height,
    loading: 'lazy'
  },
  {
    id: 'slide-3',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/3_36d88f5d-7420-49c3-9c1c-bfad1a6be399.png?v=1738429093',
    alt: 'Minimalist living space showcasing organic materials and clean lines',
    width: SLIDE_DIMENSIONS.width,
    height: SLIDE_DIMENSIONS.height,
    loading: 'lazy'
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

// Preload critical images function
const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;
  
  // Create a single hidden image element for preloading
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = heroSlides[0]?.image || '';
  preloadLink.fetchPriority = 'high';
  document.head.appendChild(preloadLink);
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

  // First slide optimization
  const firstSlideRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Preload first slide image
    const image = new window.Image();
    image.src = heroSlides[0]?.image || '';
  }, []);

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

  useEffect(() => {
    preloadCriticalImages();
  }, []);

  return (
    <>
      {/* Mobile Hero */}
      <MobileHero />

      {/* Desktop Hero - hide on mobile */}
      <div className="hidden lg:block">
        <div className="relative">
          <section 
            className="relative h-[100vh] w-full overflow-hidden pt-[30px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            role="region"
            aria-label="Hero Image Carousel"
          >
            {/* Carousel Container */}
            <div 
              className="relative h-[100vh] w-full overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex h-full">
                {/* First Slide - Optimized Loading */}
                {currentSlide === 0 && (
                  <div 
                    ref={firstSlideRef}
                    className="relative w-full h-full"
                    role="tabpanel"
                    aria-label="Slide 1"
                  >
                    <img
                      src={heroSlides[0]?.image || ''}
                      alt={heroSlides[0]?.alt || ''}
                      width={SLIDE_DIMENSIONS.width}
                      height={SLIDE_DIMENSIONS.height}
                      fetchPriority="high"
                      decoding="sync"
                      id="hero-main-image"
                      data-lcp-element="true"
                      className="object-cover w-full h-full"
                      style={{ 
                        contentVisibility: 'auto',
                        containIntrinsicSize: `${SLIDE_DIMENSIONS.width}px ${SLIDE_DIMENSIONS.height}px`
                      }}
                    />

                    {/* SVG overlay */}
                    <div 
                      className="absolute left-1/3 top-[35%] transform -translate-x-1/3 z-20"
                      aria-hidden="true"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Simple_Interior_Ideas_1_157c17e3-9c9d-4485-bf2c-1fabdcb870c5.svg"
                        alt=""
                        width="630"
                        height="400"
                        loading="lazy"
                        className="object-contain"
                        decoding="async"
                      />
                    </div>
                  </div>
                )}

                {/* Carousel Navigation */}
                <div 
                  className="absolute bottom-16 right-8 z-20 flex items-center gap-4"
                  role="tablist"
                  aria-label="Carousel Navigation"
                >
                  <NavigationButton 
                    direction="prev" 
                    onClick={() => goToSlide(currentSlide - 1)}
                    aria-label="Previous slide"
                  />

                  {/* Thumbnails */}
                  <div className="flex items-center gap-1">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        className={`relative ${currentSlide === index ? 'active' : ''}`}
                        role="tab"
                        aria-selected={currentSlide === index}
                        aria-label={`Slide ${index + 1}`}
                        aria-controls={`slide-${index + 1}`}
                      >
                        <Image
                          src={slide.image}
                          alt=""
                          width={SLIDE_DIMENSIONS.thumbnailWidth}
                          height={SLIDE_DIMENSIONS.thumbnailHeight}
                          className="object-cover rounded"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>

                  <NavigationButton 
                    direction="next" 
                    onClick={() => goToSlide(currentSlide + 1)}
                    aria-label="Next slide"
                  />
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePause}
                  className="absolute bottom-16 right-32 z-20"
                  aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                >
                  {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                </button>
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