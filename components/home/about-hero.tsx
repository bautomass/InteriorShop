'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useInView } from 'react-intersection-observer';

// Core interfaces
interface ImageItem {
  url: string;
  alt: string;
  text: string;
  caption: string;
}

interface Feature {
  title: string;
  id: string;
  description: string;
}

interface CollectionMapItem {
  handle: string;
  displayTitle: string;
  order: number;
  accent: string;
  description: string;
}

interface ScrollMetrics {
  containerWidth: number;
  totalWidth: number;
  isAtStart: boolean;
  isAtEnd: boolean;
}

interface ShopifyCollection {
  handle: string;
  image?: {
    url: string;
    altText?: string;
  };
}

interface EnhancedCollection extends ShopifyCollection {
  displayTitle: string;
  path: string;
  order: number;
  accent: string;
  description: string;
}

interface CollectionCardProps {
  collection: EnhancedCollection;
  inView: boolean;
  index: number;
}

// Performance: Memoize constants and move outside component
const CONSTANTS = {
  SCROLL: {
    MULTIPLIER: 0.8,
    THRESHOLD: 100,
    ANIMATION_DURATION: 300,
  },
  TIMING: {
    CAROUSEL_INTERVAL: 4000,
    RETRY_DELAY: 1000,
    DEBOUNCE_DELAY: 150,
    METRICS_UPDATE_DELAY: 100,
  },
  INTERSECTION: {
    threshold: 0.2,
    triggerOnce: true,
  },
} as const;

// Enhanced features array with more engaging content
const features = [
  { 
    title: 'Eco-Friendly', 
    id: 'eco',
    description: 'Sustainable materials, mindful production'
  },
  { 
    title: 'Artisan Crafted', 
    id: 'artisan',
    description: 'Handmade with care and expertise'
  },
  { 
    title: 'Mindful Living', 
    id: 'mindful',
    description: 'Bringing harmony to your space'
  },
] as const;

// Enhanced images with richer metadata
const images = [
  {
    url: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Screenshot_2024-02-01_at_17.07.51.png?v=1706800058",
    alt: "Lifestyle image 2",
    text: "Japandi is influenced by the ancient Japanese philosophy of Wabi-Sabi, a way of life which values slow-living, contentment and simplicity.",
    caption: "Embrace the art of simplicity"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Screenshot_2024-02-01_at_17.08.01.png?v=1706800057",
    alt: "Lifestyle image 1",
    text: "As well as the Scandinavian practice of 'hygge', which translates to comfort, cosiness and wellbeing.",
    caption: "Experience true Nordic comfort"
  }
];

// Enhanced collection mapping with more metadata
const collectionMap = [
  { 
    handle: 'textiles-collection',
    displayTitle: 'Linen Textures',
    order: 0,
    accent: '#D6CFC7',
    description: 'Premium natural fabrics'
  },
  {
    handle: 'canvas',
    displayTitle: 'Abstract Wall Art',
    order: 1,
    accent: '#C7CCCA',
    description: 'Contemporary art pieces'
  },
  {
    handle: 'baskets-rattan',
    displayTitle: 'Rattan Baskets',
    order: 2,
    accent: '#D6C7B8',
    description: 'Handwoven storage solutions'
  },
  {
    handle: 'ceramic-vases',
    displayTitle: 'Ceramic Vases',
    order: 3,
    accent: '#C5CAC9',
    description: 'Artisanal pottery'
  },
  {
    handle: 'accessories',
    displayTitle: 'Sleek Marble Trays',
    order: 4,
    accent: '#D8D3CD',
    description: 'Elegant serving pieces'
  },
  {
    handle: 'organic-decoration',
    displayTitle: 'Wooden Furniture',
    order: 5,
    accent: '#C9C2B8',
    description: 'Sustainable wood pieces'
  }
];

// Optimized CollectionCard with hover effects and engagement metrics
const CollectionCard = memo(function CollectionCard({ 
  collection, 
  inView,
  index
}: CollectionCardProps) {
  const { ref, inView: cardInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px 0px'  // Preload slightly before viewport entry
  });

  return (
    <Link
      ref={ref}
      href={`/collections/${collection.handle}`}
      className={`group relative flex h-16 min-w-[240px] overflow-hidden rounded-xl 
        bg-[#6B5E4C] backdrop-blur-sm transition-opacity duration-200
        hover:shadow-lg hover:-translate-y-1
        ${cardInView ? 'opacity-100' : 'opacity-0'}`}
      aria-label={`View ${collection.displayTitle} collection`}
    >
      <div className="relative w-16 overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.displayTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="64px"
            loading={index < 2 ? "eager" : "lazy"}
            priority={index < 2}
          />
        ) : (
          <div className="h-full bg-[#B5A48B]/20" />
        )}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ 
            backgroundColor: `${collection.accent}40`,
            transform: 'translateZ(0)'
          }}
        />
      </div>

      <div className="relative flex-1 px-4">
        {/* Default centered title */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-[#eaeadf] text-sm font-medium tracking-wide whitespace-nowrap">
            {collection.displayTitle}
          </h3>
        </div>

        {/* Hover content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="text-center">
            <h3 className="text-[#eaeadf] text-sm font-medium tracking-wide whitespace-nowrap mb-1">
              {collection.displayTitle}
            </h3>
            {collection.description && (
              <p className="text-[#eaeadf]/80 text-xs">
                {collection.description}
              </p>
            )}
          </div>
          
          <ArrowRight 
            className="absolute right-3 w-4 h-4 text-[#eaeadf] transform translate-x-0 
              group-hover:translate-x-1 transition-all duration-300" 
          />
        </div>
      </div>
    </Link>
  );
});

// First, add a "View All" card component
const ViewAllCard = memo(function ViewAllCard({ inView, index }: { inView: boolean; index: number }) {
  const { ref, inView: cardInView } = useInView(CONSTANTS.INTERSECTION);

  return (
    <Link
      ref={ref}
      href="/collections"
      className={`group relative flex h-16 min-w-[240px] overflow-hidden rounded-xl 
        bg-[#6B5E4C] backdrop-blur-sm transition-all duration-500 
        hover:shadow-lg hover:-translate-y-1 hover:bg-[#7B6E5C]
        ${cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        motion-safe:transform motion-safe:transition-all motion-safe:duration-700`}
      style={{
        transitionDelay: `${index * 100}ms`
      }}
    >
      {/* Main content container with centered text */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="text-center pr-6"> {/* Added padding-right for arrow space */}
          <h3 className="font-medium text-[#eaeadf] text-sm tracking-wide whitespace-nowrap
                        group-hover:text-white transition-colors duration-300">
            View All Collections
          </h3>
          <p className="text-[#eaeadf]/80 text-xs mt-0.5
                       group-hover:text-white/90 transition-colors duration-300">
            Explore our complete catalog
          </p>
        </div>

        {/* Arrow icon with hover animation */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ArrowRight 
            className="w-4 h-4 text-[#eaeadf] transform translate-x-0 
                       group-hover:translate-x-1 group-hover:text-white 
                       transition-all duration-300" 
          />
        </div>
      </div>

      {/* Enhanced hover effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                     transition-all duration-500 pointer-events-none">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r 
                       from-[#8C7E6A]/20 via-[#8C7E6A]/10 to-transparent" />
        
        {/* Glowing effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                       transition-opacity duration-300
                       bg-gradient-to-r from-white/5 via-white/10 to-transparent
                       blur-xl" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                       transition-transform duration-1000
                       bg-gradient-to-r from-transparent via-white/10 to-transparent
                       transform-gpu" />
      </div>
    </Link>
  );
});

ViewAllCard.displayName = 'ViewAllCard';

// Performance: Create a custom hook for image preloading
const useImagePreloader = (imageUrls: string[]) => {
  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => preloadImage(url));

      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn('Failed to preload images:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);
};

// Performance: Create a custom hook for collections with caching
const useCollections = () => {
  const [state, setState] = useState<{
    collections: EnhancedCollection[];
    isLoading: boolean;
    error: Error | null;
  }>({
    collections: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchCollections = async () => {
      try {
        const cachedData = sessionStorage.getItem('collections');
        if (cachedData) {
          setState(JSON.parse(cachedData));
          return;
        }

        const response = await fetch('/api/collections');
        if (!mounted) return;

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { collections: ShopifyCollection[] } = await response.json();
        if (!mounted) return;

        const mappedCollections = collectionMap
          .map(mappedItem => {
            const shopifyCollection = data.collections.find(
              c => c.handle === mappedItem.handle
            );
            
            if (!shopifyCollection) return null;

            return {
              ...shopifyCollection,
              displayTitle: mappedItem.displayTitle,
              path: `/search/${shopifyCollection.handle}`,
              order: mappedItem.order,
              accent: mappedItem.accent,
              description: mappedItem.description
            };
          })
          .filter((item): item is EnhancedCollection => item !== null)
          .sort((a, b) => a.order - b.order);

        const newState = {
          collections: mappedCollections,
          isLoading: false,
          error: null,
        };

        setState(newState);
        sessionStorage.setItem('collections', JSON.stringify(newState));
      } catch (error) {
        console.error('Error fetching collections:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchCollections, CONSTANTS.TIMING.RETRY_DELAY * retryCount);
        } else {
          setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
        }
      }
    };

    fetchCollections();
    return () => { mounted = false; };
  }, []);

  return state;
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center p-4 bg-[#eaeadf] rounded-xl">
      <h2 className="text-[#6B5E4C] text-lg font-medium mb-2">
        Something went wrong
      </h2>
      <p className="text-[#8C7E6A] text-sm mb-4">
        {error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        aria-label="Retry loading collections"
        className="px-4 py-2 bg-[#6B5E4C] text-white rounded-lg
          hover:bg-[#8C7E6A] transition-colors duration-300"
      >
        Try again
      </button>
    </div>
  );
}

// Update the preloadImage function
const preloadImage = (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const img = new (window.Image || HTMLImageElement)();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

// Main AboutHero component with optimizations and enhancements
const AboutHero = memo(function AboutHero() {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    containerWidth: 0,
    totalWidth: 0,
    isAtStart: true,
    isAtEnd: false
  });
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px 0px'
  });

  // Performance: Use custom hooks
  const { collections, isLoading, error } = useCollections();
  useImagePreloader(images.map(img => img.url));

  // Optimized scroll metrics update
  const updateScrollMetrics = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;
    const isAtStart = scrollPosition <= 1;
    const isAtEnd = Math.ceil(scrollPosition + containerWidth) >= totalWidth - 1;

    setScrollMetrics({
      containerWidth,
      totalWidth,
      isAtStart,
      isAtEnd
    });
  }, [scrollPosition]);

  // Performance: Memoize scroll handler
  const handleScroll = useCallback((direction: 'left' | 'right'): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { containerWidth, totalWidth } = scrollMetrics;
    const scrollAmount = containerWidth * CONSTANTS.SCROLL.MULTIPLIER;
    
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          totalWidth - containerWidth,
          scrollPosition + scrollAmount
        );

    setScrollPosition(newPosition);
    requestAnimationFrame(() => {
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    });
  }, [scrollMetrics, scrollPosition]);

  // Update carousel effect
  useEffect(() => {
    if (isHovering) return;

    let timeoutId: NodeJS.Timeout;
    
    const advanceCarousel = async () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      
      // Preload next image
      try {
        const nextImage = images[nextIndex];
        if (nextImage?.url) {
          await preloadImage(nextImage.url);
        }
      } catch (error) {
        console.warn('Failed to preload image:', error);
      }
      
      setCurrentImageIndex(nextIndex);
      timeoutId = setTimeout(advanceCarousel, CONSTANTS.TIMING.CAROUSEL_INTERVAL);
    };

    timeoutId = setTimeout(advanceCarousel, CONSTANTS.TIMING.CAROUSEL_INTERVAL);
    
    return () => clearTimeout(timeoutId);
  }, [isHovering, currentImageIndex, images]);

  // Optimized resize handler with proper cleanup
  useEffect(() => {
    let resizeTimeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(() => {
        updateScrollMetrics();
      }, CONSTANTS.TIMING.DEBOUNCE_DELAY);
    };

    // Initial metrics update
    const initialTimeoutId = setTimeout(() => {
      updateScrollMetrics();
    }, CONSTANTS.TIMING.METRICS_UPDATE_DELAY);

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutId);
      clearTimeout(initialTimeoutId);
    };
  }, [updateScrollMetrics]);

  // Add a useEffect to update metrics after initial render and when collections change
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateScrollMetrics();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [collections, updateScrollMetrics]); // Add collections as dependency

  // Also update metrics after images load
  useEffect(() => {
    const handleLoad = () => {
      updateScrollMetrics();
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [updateScrollMetrics]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <section 
        ref={sectionRef}
        className={`bg-[#eaeadf] relative overflow-hidden
          opacity-100
        `}
        aria-label="About our store"
      >
        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-white opacity-50 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              {/* Main content area - always at the top */}
              <div className="space-y-6 order-1">
                <h1 className="text-[#6B5E4C] text-4xl font-light leading-tight">
                  Beauty in Simplicity
                  <span className="block mt-1.5 text-2xl text-[#8C7E6A]">
                    Warmth in Minimalism
                  </span>
                </h1>
                
                <div className="space-y-3 text-[#8C7E6A] text-lg">
                  <p>
                    Welcome to our store dedicated to those who find beauty in simplicity and warmth in the minimalist approach.
                  </p>
                  <p className="text-base">
                    We source unique, handmade decors made from eco-friendly materials, working with artisans and small businesses who prioritize quality and sustainability.
                  </p>
                </div>
              </div>

              {/* Mobile/Tablet Image Gallery */}
              <div className="block lg:hidden order-2">
                <div 
                  className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {images.map((image, index) => (
                    <div
                      key={image.url}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                        ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/95 via-[#6B5E4C]/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 transform translate-y-full 
                        group-hover:translate-y-0 transition-all duration-700 ease-out">
                        <div className="overflow-hidden">
                          <p className="text-white text-xl sm:text-2xl font-light leading-relaxed transform 
                            translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                            transition-all duration-700 delay-100 ease-out">
                            {image.text}
                          </p>
                          <p className="text-white/80 mt-2 transform translate-y-full opacity-0 
                            group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                            {image.caption}
                          </p>
                        </div>
                        
                        <div className="w-0 group-hover:w-24 h-[1px] bg-white/60 mt-6 
                          transition-all duration-700 delay-200 ease-out" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation dots */}
                  <div 
                    className="absolute bottom-6 right-6 flex items-center gap-2 z-10"
                    role="tablist"
                    aria-label="Image gallery controls"
                  >
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        role="tab"
                        aria-selected={index === currentImageIndex}
                        aria-label={`View image ${index + 1}: ${image.alt}`}
                        className={`w-2 h-2 rounded-full transition-all duration-300
                          ${index === currentImageIndex 
                            ? 'bg-white w-6' 
                            : 'bg-white/40 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Features section */}
              <div className="order-3">
                <div className="flex gap-3">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="group relative flex-1 overflow-hidden bg-white/80 backdrop-blur rounded-xl
                        transition-all duration-300 hover:bg-[#B5A48B]"
                      style={{ height: '60px' }}
                    >
                      {/* Main content container - always centered */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#6B5E4C] group-hover:text-white 
                          transition-colors duration-300 text-[12px] font-bold tracking-wide">
                          {feature.title}
                        </span>
                      </div>

                      {/* Hover content - slides up from bottom */}
                      <div className="absolute inset-0 flex items-center justify-center
                        bg-[#B5A48B] transform translate-y-full group-hover:translate-y-0 
                        transition-transform duration-300 ease-out">
                        <div className="text-center px-4">
                          <span className="block text-white text-sm font-bold tracking-wide mb-1">
                            {feature.title}
                          </span>
                          <span className="block text-white/90 text-xs font-medium">
                            {feature.description}
                          </span>
                        </div>
                      </div>

                      {/* Background hover effect */}
                      <div className="absolute inset-0 bg-[#B5A48B]/10 transform -skew-x-12 
                        translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Collections section */}
              <div className="flex items-center justify-center order-4 lg:order-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 items-center w-full sm:w-auto">
                  <h2 className={`relative text-[#6B5E4C] text-3xl sm:text-2xl font-medium sm:font-light transform text-center sm:text-left
                    ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    motion-safe:transition-all motion-safe:duration-700 motion-safe:delay-300`}>
                    <span className="relative px-4 py-2">
                      <span className="relative bg-gradient-to-r from-[#4A3F33] to-[#8B7355] bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-2xl
                        before:content-[''] before:absolute before:-top-1 before:left-0 
                        before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#B5A48B]/40 before:to-[#B5A48B]/40
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 
                        after:w-full after:h-[1px] after:bg-gradient-to-r after:from-[#B5A48B]/40 after:via-[#B5A48B]/40 after:to-transparent">
                        Discover Our Collections
                      </span>
                    </span>
                  </h2>
                  
                  <Link
                    href="/collections"
                    className="group/btn relative inline-flex items-center justify-center sm:justify-start gap-2 
                      w-[90%] sm:w-auto px-6 py-3.5
                      bg-[#6B5E4C] text-[#eaeadf] text-sm
                      border border-[#B5A48B]/20
                      hover:bg-[#7B6E5C] hover:border-[#B5A48B]/40 
                      transition-all duration-300 
                      transform hover:-translate-y-0.5
                      overflow-hidden"
                  >
                    <span className="text-sm font-medium relative z-10">Explore Collections</span>
                    <ArrowRight 
                      className="w-3.5 h-3.5 transform translate-x-0
                        group-hover/btn:translate-x-1 transition-transform duration-300
                        relative z-10" 
                    />
                    {/* Shimmer effect overlay */}
                    <div className="absolute top-0 -left-[100%] w-[120%] h-full 
                      bg-gradient-to-r from-transparent via-white/20 to-transparent
                      group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out" />
                  </Link>
                </div>
              </div>

              {/* Quote section */}
              <blockquote className="relative pl-6 order-5 lg:order-4 hidden lg:block">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#B5A48B] to-transparent" />
                <p className="italic text-[#8C7E6A] text-base sm:text-lg">
                  "Simplicity is the ultimate sophistication"
                </p>
                <cite className="block mt-2 text-[#6B5E4C] not-italic">— Leonardo da Vinci</cite>
              </blockquote>
            </div>

            {/* Desktop Image Gallery - Right Column */}
            <div className="hidden lg:block lg:col-span-7">
              <div 
                className="relative h-[500px] rounded-3xl overflow-hidden group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {images.map((image, index) => (
                  <div
                    key={image.url}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                      ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/95 via-[#6B5E4C]/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-12 transform translate-y-full 
                      group-hover:translate-y-0 transition-all duration-700 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-white text-2xl font-light leading-relaxed transform 
                          translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-700 delay-100 ease-out">
                          {image.text}
                        </p>
                        <p className="text-white/80 mt-2 transform translate-y-full opacity-0 
                          group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                          {image.caption}
                        </p>
                      </div>
                      
                      <div className="w-0 group-hover:w-24 h-[1px] bg-white/60 mt-6 
                        transition-all duration-700 delay-200 ease-out" />
                    </div>
                  </div>
                ))}
                
                {/* Enhanced image navigation */}
                <div 
                  className="absolute bottom-6 right-6 flex items-center gap-2 z-10"
                  role="tablist"
                  aria-label="Image gallery controls"
                >
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      role="tab"
                      aria-selected={index === currentImageIndex}
                      aria-label={`View image ${index + 1}: ${image.alt}`}
                      className={`w-2 h-2 rounded-full transition-all duration-300
                        ${index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
});

AboutHero.displayName = 'AboutHero';
CollectionCard.displayName = 'CollectionCard';
ViewAllCard.displayName = 'ViewAllCard';

export default AboutHero;

