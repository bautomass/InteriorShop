// Hero.tsx

'use client';

import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import MobileHero from './MobileMenuHeader';

// Constants
const CONSTANTS = {
  ANIMATION: {
    DURATION: 500,
    CAROUSEL_INTERVAL: 7000,
    DEBOUNCE_DELAY: 300,
  }
} as const;

// Types and Interfaces
interface SlideContent {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
  lampImage?: string;
  productLink?: string;
  menu: {
    items: Array<{
      label: string;
      link: string;
      description?: string;
    }>;
    position?: 'left' | 'right';
    style?: 'minimal' | 'elegant' | 'modern' | 'classic' | 'bold';
    alignment?: 'top' | 'middle' | 'center';
  };
}

interface HeroProps {}

// Hero slides data
const heroSlides: SlideContent[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile_image_banner.jpg?v=1713192308',
    alt: 'Simple Interior Ideas',
    title: 'Modern Living',
    subtitle: 'Discover our collection',
    lampImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/lamp-el.svg',
    productLink: '/product/sleek-curve-japandi-glow-minimalist-pendant-light',
    menu: {
      items: [
        { label: 'Modern Lighting', link: '/collections/lighting', description: 'Illuminate your space' },
        { label: 'Living Room', link: '/collections/living-room', description: 'Create comfort' },
        { label: 'New Arrivals', link: '/collections/new', description: 'Latest designs' }
      ],
      position: 'right',
      style: 'elegant',
      alignment: 'top'
    }
  },
  {
    id: 'slide-3',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-soft-chair.jpg?v=1736700243&width=2048&height=1152&crop=center&quality=100',
    alt: 'Architectural Beauty',
    title: 'Architectural Beauty',
    subtitle: 'Where form meets function',
    menu: {
      items: [
        { label: 'Wall Art', link: '/collections/wall-art', description: 'Statement pieces' },
        { label: 'Sculptures', link: '/collections/sculptures', description: 'Artistic expression' },
        { label: 'Designer Collection', link: '/collections/designer', description: 'Signature works' }
      ],
      position: 'right',
      style: 'bold',
      alignment: 'top'
    }
  },
  {
    id: 'slide-4',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2-chairs-hero.jpg?v=1736700243&width=2048&height=1152&crop=center&quality=100',
    alt: 'Minimalist Living',
    title: 'Minimalist Living',
    subtitle: 'Less is more',
    menu: {
      items: [
        { label: 'Minimalist Decor', link: '/collections/minimalist', description: 'Simple elegance' },
        { label: 'Storage Solutions', link: '/collections/storage', description: 'Hidden beauty' },
        { label: 'Accent Pieces', link: '/collections/accents', description: 'Perfect details' }
      ],
      position: 'right',
      style: 'minimal',
      alignment: 'middle'
    }
  },
  {
    id: 'slide-5',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-white-sofa.jpg?v=1736700243&width=2048&height=1152&crop=center&quality=100',
    alt: 'Contemporary Dining',
    title: 'Contemporary Dining',
    subtitle: 'Elevate your dining experience',
    menu: {
      items: [
        { label: 'Dining Tables', link: '/collections/dining-tables', description: 'Gather in style' },
        { label: 'Dining Chairs', link: '/collections/dining-chairs', description: 'Comfort meets design' },
        { label: 'Table Decor', link: '/collections/table-decor', description: 'Perfect finishing touches' }
      ],
      position: 'left',
      style: 'modern',
      alignment: 'middle'
    }
  },
  {
    id: 'slide-6',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-image-slide.jpg?v=1737195548&width=2048&height=1152&crop=center&quality=100',
    alt: 'Serene Bedroom',
    title: 'Serene Bedroom',
    subtitle: 'Create your sanctuary',
    menu: {
      items: [
        { label: 'Bedding Collection', link: '/collections/bedding', description: 'Luxurious comfort' },
        { label: 'Bedroom Furniture', link: '/collections/bedroom', description: 'Timeless pieces' },
        { label: 'Night Lighting', link: '/collections/bedroom-lighting', description: 'Ambient glow' }
      ],
      position: 'right',
      style: 'classic',
      alignment: 'top'
    }
  }
];

// Helper functions
const getLoopedIndex = (index: number, length: number) => {
  return ((index % length) + length) % length;
};

const getMenuPosition = (menu: { position?: string; alignment?: string }, slideId: string) => {
  switch (slideId) {
    case 'slide-1':
      return 'right-[160px] top-32';
    case 'slide-2':
      return 'left-16 top-24';
    case 'slide-3':
      return 'right-16 top-24';
    case 'slide-4':
      return 'right-16 top-24';
    case 'slide-5':
      return 'right-16 top-24';
    default:
      return `${menu.position === 'left' ? 'left-16' : 'right-16'} top-1/2 -translate-y-1/2`;
  }
};

// Custom hooks
const useSlideNavigation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const nextIndex = getLoopedIndex(index, totalSlides);
    
    const nextSlide = heroSlides[nextIndex];
    if (nextSlide) {
      const imagesToPreload = [nextSlide.image].filter(Boolean);
      imagesToPreload.forEach(src => {
        const img = new window.Image();
        img.src = src;
      });
    }
    
    setCurrentSlide(nextIndex);
    setTimeout(() => setIsAnimating(false), CONSTANTS.ANIMATION.DURATION);
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

  // Event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || !e.touches[0]) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < heroSlides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
      setTouchStart(null);
    }
  };

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
    if (isPaused || isMenuHovered) {
      return;
    }

    const delayTime = CONSTANTS.ANIMATION.CAROUSEL_INTERVAL + 4000;
    
    const timer = setTimeout(() => {
      goToSlide(currentSlide + 1);
    }, delayTime);
    
    return () => {
      clearTimeout(timer);
    };
  }, [currentSlide, isMenuHovered, isPaused, goToSlide]);

  useEffect(() => {
    const shouldPreventScroll = isNavOpen;
    
    if (shouldPreventScroll) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isNavOpen]);

  // Toggle pause handler
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <>
      {/* Mobile Hero */}
      <MobileHero />

      {/* Desktop Hero - hide on mobile */}
      <div className="hidden lg:block">
        <div className="relative">
          <section 
            className="relative h-[100vh] w-full overflow-hidden pt-12"
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
                        objectPosition: 'center'
                      }}
                      onLoad={() => {
                        setLoadedImages(prev => new Set(prev).add(slide.image));
                      }}
                    />

                    {/* Lamp Image - Keep animation for visual interest */}
                    {index === 0 && slide.lampImage && (
                      <motion.div m
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
                        className="absolute left-[15%] top-[-7%] z-10 w-[120px] origin-top md:w-[180px]"
                      >
                        <div className="relative">
                          <Image
                            src={slide.lampImage}
                            alt=""
                            width={180}
                            height={180}
                            priority
                            className="h-auto w-full"
                          />
                          
                          {/* Keep the interactive product dot */}
                          <div className="group absolute bottom-[20%] left-[65%] -translate-x-1/2 translate-y-1/2">
                            <div className="relative inline-flex">
                              {/* Pulse rings */}
                              <div className="absolute -inset-1.5 w-7 h-7 rounded-full bg-[#dcd5ca]/60
                                            animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite]" />
                              <div className="absolute -inset-1.5 w-7 h-7 rounded-full bg-[#ebe7e0]/50
                                            animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite_1.75s]" />
                              
                              {/* Main dot */}
                              <div className="relative w-4 h-4 rounded-full bg-[#ebe7e0] border-2 border-[#9c826b]
                                            shadow-[0_0_10px_rgba(199,186,168,0.8)]
                                            transition-all duration-500 ease-in-out
                                            group-hover:scale-125" />

                              {/* Simplified hover button */}
                              <div className="absolute left-6 top-2 opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-300">
                                <Link 
                                  href={slide.productLink || '#'}
                                  className="flex items-center gap-2 bg-[#ebe7e0]/95 backdrop-blur-sm 
                                           shadow-lg rounded-lg p-2 border border-[#b39e86] 
                                           hover:bg-[#dcd5ca]/95"
                                >
                                  <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap px-1">
                                    View Product
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-[#9c826b]" />
                                </Link>
                              </div>
                            </div>
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

                    {/* Simplified Menu */}
                    {index === 0 ? null : (
                      <div
                        onMouseEnter={() => handleMenuHover(true)}
                        onMouseLeave={() => handleMenuHover(false)}
                        className={`absolute ${getMenuPosition(slide.menu, slide.id)} z-20 max-w-[460px] p-7 
                                   rounded-xl bg-black/10 backdrop-blur-[2px] shadow-2xl 
                                   shadow-black/5 border border-white/5 
                                   transition-opacity duration-500
                                   ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {/* Title Group */}
                        <div className={`mb-7 ${slide.menu.position === 'right' ? 'text-right' : 'text-left'}`}>
                          <h2 className="text-[2.5rem] leading-[1.1] tracking-normal text-white font-light 
                                         [text-shadow:_0_1px_2px_rgba(0,0,0,0.1)]">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="mt-3 text-xl text-white/90 font-light tracking-wide">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-3">
                          {slide.menu.items.map((item) => (
                            <div
                              key={item.label}
                              className={`group cursor-pointer ${
                                slide.menu.position === 'right' ? 'text-right' : 'text-left'
                              }`}
                            >
                              <Link 
                                href={item.link}
                                className={`relative block transition-all duration-300 py-3 px-7 rounded-lg 
                                         ${slide.menu.position === 'right' ? 'hover:pr-14' : 'hover:pl-14'} 
                                         hover:bg-white/5`}
                              >
                                <span className="block text-[1.85rem] font-light tracking-wide text-white/90 
                                                 group-hover:text-white transition-colors duration-300">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="block mt-1 text-sm text-white/60 group-hover:text-white/80 
                                                 transition-colors duration-300 font-light tracking-wide">
                                    {item.description}
                                  </span>
                                )}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Professional Pagination with Navigation and Pause Button */}
              <div className="absolute bottom-16 right-8 z-20 flex items-center gap-4 perspective-[1200px] transform-gpu scale-80">
                {/* Previous Button - smaller size */}
                <motion.button
                  onClick={() => goToSlide(currentSlide - 1)}
                  disabled={isAnimating}
                  className="relative group scale-90"
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Previous slide"
                >
                  <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm 
                                  group-hover:bg-black/60 transition-all duration-300 -z-10" />
                  <div className="p-2.5 text-white flex items-center overflow-hidden">
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    <div className="w-0 group-hover:w-16 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                      <span className="text-xs font-medium pl-2 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 delay-100">
                        Previous
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Thumbnails */}
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
                            className="absolute bottom-2 left-2 z-20 p-2 bg-black/60 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                          >
                            {isPaused ? (
                              <Play className="h-3 w-3 text-white" />
                            ) : (
                              <Pause className="h-3 w-3 text-white" />
                            )}
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Next Button - smaller size */}
                <motion.button
                  onClick={() => goToSlide(currentSlide + 1)}
                  disabled={isAnimating}
                  className="relative group scale-90"
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Next slide"
                >
                  <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm 
                                 group-hover:bg-black/60 transition-all duration-300 -z-10" />
                  <div className="p-2.5 text-white flex items-center overflow-hidden">
                    <div className="w-0 group-hover:w-16 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                      <span className="text-xs font-medium pr-2 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 delay-100">
                        Next
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Navigation Buttons - Added opposite to carousel thumbnails */}
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
                      focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2"
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
                      hover:bg-[#9e896c] 
                      transition-all duration-300 shadow-lg shadow-black/5
                      focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2"
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
        </motion.div>
      </div>
    </>
  );
};

const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';

export default Hero;
