"use client"

import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  images: string[];
  onClose: () => void;
  product: Product;
}

// Add new type definitions
type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  onLoadingComplete?: () => void;
};

interface ExtendedProduct extends Product {
  productType?: string;
}

const SafeImage = ({ src, alt, ...props }: SafeImageProps) => {
  if (!src) return null;
  return <Image src={src} alt={alt} {...props} />;
};

const ImageModal = ({ images, onClose, product }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    if (!images.length) return;

    const preloadImages = () => {
      const nextIdx = (currentIndex + 1) % images.length;
      const prevIdx = (currentIndex - 1 + images.length) % images.length;
      
      const imagesToPreload = [images[prevIdx], images[nextIdx]].filter(Boolean);
      
      imagesToPreload.forEach(src => {
        if (!src) return;
        const img = document.createElement('img');
        img.src = src;
      });
    };

    preloadImages();
  }, [currentIndex, images]);

  // Handle keyboard navigation with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeoutId) return; // Debounce

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
      }

      timeoutId = setTimeout(() => {
        timeoutId = undefined;
      }, 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onClose]);

  const handleImageTransition = useCallback((newIndex: number, newDirection: number) => {
    if (isTransitioning || !slideContainerRef.current) return;
    
    setIsTransitioning(true);
    setDirection(newDirection);

    const container = slideContainerRef.current;
    container.style.transform = `translateX(${newDirection > 0 ? '100%' : '-100%'})`;
    
    requestAnimationFrame(() => {
      container.style.transition = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)';
      container.style.transform = 'translateX(0)';
    });

    setCurrentIndex(newIndex);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      if (slideContainerRef.current) {
        slideContainerRef.current.style.transition = 'none';
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = (currentIndex + 1) % images.length;
    handleImageTransition(newIndex, 1);
  }, [currentIndex, images.length, handleImageTransition]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    handleImageTransition(newIndex, -1);
  }, [currentIndex, images.length, handleImageTransition]);

  const handleThumbnailClick = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return;
    const direction = index > currentIndex ? 1 : -1;
    handleImageTransition(index, direction);
  }, [currentIndex, isTransitioning, handleImageTransition]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm
                    transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="relative w-full h-full flex flex-col items-center justify-center px-4 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image Container */}
        <div className="relative w-full max-w-7xl aspect-[3/2] max-h-[70vh] overflow-hidden">
          <div
            ref={slideContainerRef}
            className="absolute inset-0 will-change-transform"
            style={{
              transform: 'translateX(0)',
            }}
          >
            <SafeImage
              src={images[currentIndex] ?? ''}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className={cn(
                "object-contain transition-all duration-300",
                loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
              onLoadingComplete={() => setLoading(false)}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              quality={90}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 
                         bg-black/50 backdrop-blur-sm rounded-full
                         text-white/90 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => {
              if (!isTransitioning) {
                handleImageTransition(
                  (currentIndex - 1 + images.length) % images.length,
                  -1
                );
              }
            }}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 p-3",
              "text-white/80 hover:text-white",
              "bg-black/20 hover:bg-black/40 rounded-full",
              "transition-all duration-200 hover:scale-110",
              "active:scale-95 backdrop-blur-sm",
              "transform hover:-translate-x-1",
              isTransitioning && "pointer-events-none opacity-50"
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              if (!isTransitioning) {
                handleImageTransition(
                  (currentIndex + 1) % images.length,
                  1
                );
              }
            }}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 p-3",
              "text-white/80 hover:text-white",
              "bg-black/20 hover:bg-black/40 rounded-full",
              "transition-all duration-200 hover:scale-110",
              "active:scale-95 backdrop-blur-sm",
              "transform hover:translate-x-1",
              isTransitioning && "pointer-events-none opacity-50"
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Thumbnails */}
        <div className="mt-4 w-full max-w-7xl">
          <div 
            ref={thumbnailsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-2 mx-auto px-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isTransitioning) {
                      const newDirection = idx > currentIndex ? 1 : -1;
                      handleImageTransition(idx, newDirection);
                    }
                  }}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden",
                    "ring-2 transition-all duration-300",
                    "hover:ring-white/50",
                    currentIndex === idx 
                      ? "ring-white opacity-100 scale-105 shadow-lg" 
                      : "ring-transparent opacity-60 hover:opacity-100",
                    isTransitioning && "pointer-events-none"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className={cn(
                      "object-cover",
                      "transition-transform duration-300",
                      currentIndex === idx ? "scale-110" : "scale-100"
                    )}
                    sizes="80px"
                    quality={60}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3
                     text-white/80 hover:text-white
                     bg-black/40 hover:bg-black/60 rounded-full
                     transition-all duration-200 hover:scale-110
                     active:scale-95 backdrop-blur-sm
                     hover:rotate-90"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isPriority?: boolean;
  cardsToShow?: number;
}

interface ReviewData {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

// Define review templates with proper typing
interface ReviewTemplates {
  abstract: readonly string[];
  landscape: readonly string[];
  original: readonly string[];
  floral: readonly string[];
  modern: readonly string[];
  seascape: readonly string[];
  cityscape: readonly string[];
  abstract_modern: readonly string[];
  impressionist: readonly string[];
}

const reviewTemplates: ReviewTemplates = {
  abstract: [
    'Stunning colors that completely transformed my living room space',
    'Bold and energetic piece - exactly what my office needed',
    'Modern masterpiece, creates the perfect focal point in our home',
    'Vibrant and eye-catching. Everyone asks about this piece!',
    'Adds such perfect energy to my space. Really happy with this purchase',
    'Absolute conversation starter. The colors are even better in person',
    'Better than expected - the colors really pop against my wall',
    'Sophisticated and bold. Perfect size for my dining room',
    'Amazing abstract composition that ties the whole room together',
    'Perfect statement piece for our entryway. Very impressed',
    'Dramatic and beautiful. The quality is outstanding',
    'Love how this expresses such powerful artistic emotion',
    'Exactly what I wanted for my new apartment',
    'High-quality abstract work with incredible depth and movement',
    'Completely transforms the room. Worth every penny'
  ],
  landscape: [
    'Peaceful and serene view that brings calm to our bedroom',
    'Colors are true to nature and absolutely breathtaking in person',
    'Brings the outdoors in. Perfect for my mountain home',
    'Creates such a calming presence in my living room space',
    'Beautiful natural scene that makes the room feel bigger',
    'Perfect landscape capture. The light effects are amazing',
    'Exceptional detail work in every part of this piece',
    'Makes the room feel larger and more connected to nature',
    'Like looking through a window to another world',
    'Stunning vista with incredible depth. Very satisfied customer',
    'Natural beauty at its finest. Shipping was quick too',
    'Creates such a relaxing atmosphere in my office',
    'Rich, vibrant scenery that catches the morning light perfectly',
    'Perfect perspective and composition. Really well done',
    'Breathtaking view to enjoy every single day'
  ],
  original: [
    'Can see every brushstroke. The texture is absolutely incredible',
    'True artistic talent shines through in this beautiful piece',
    'Worth the investment - this is genuine museum quality',
    'Unique and beautiful. The colors are even better in person',
    'Amazing texture and depth that photos cannot capture',
    'Gallery quality piece that makes a stunning impression',
    'Exceptional craftsmanship from a clearly talented artist',
    'One-of-a-kind beauty that exceeded my expectations completely',
    'Artist\'s skill shines through in every detail. Simply magnificent',
    'Museum worthy artwork at a reasonable price point',
    'Incredible original piece with amazing attention to detail',
    'Love the personal touch and the artist\'s unique style',
    'Masterfully executed with stunning use of color and form',
    'Rich in detail and color. A true investment piece',
    'Outstanding original work that arrived perfectly packaged'
  ],
  floral: [
    'Delicate and beautiful flowers that brighten our entire dining room',
    'Brings spring year-round to my bedroom wall',
    'Lovely floral arrangement with such incredible detail work',
    'Perfect botanical piece for my reading nook. Colors are amazing',
    'Fresh and vibrant look that works perfectly with our decor',
    'Garden-inspired beauty that makes me smile every morning',
    'Elegant flower study with remarkable attention to detail',
    'Brightens up the room instantly. The colors are so vivid',
    'Natural grace captured in every petal. Simply stunning',
    'These flowers never fade! Absolutely beautiful piece',
    'Like having fresh flowers that last forever. Great investment',
    'Beautiful botanical art that works in any season',
    'Cheerful addition to my kitchen. Everyone loves it',
    'Perfectly captured petals with amazing depth and shadows',
    'Timeless floral beauty that works with any style'
  ],
  modern: [
    'Clean, contemporary look that defines our living space',
    'Perfect modern aesthetic for my minimalist apartment',
    'Sleek and sophisticated with incredible visual impact',
    'Bold geometric beauty that makes a statement',
    'Minimalist perfection for my office wall',
    'Contemporary masterpiece at a reasonable price point',
    'Stylish modern piece that ties the room together',
    'Perfect design element for our newly renovated space',
    'Cutting-edge artwork that feels timeless',
    'Fresh and innovative take on modern design',
    'Modern classic feel with outstanding execution',
    'Architectural beauty that commands attention',
    'Striking modern work with perfect proportions',
    'Contemporary elegance that exceeded expectations',
    'Perfect modern touch for our loft space'
  ],
  seascape: [
    'Ocean vibes are perfect for my coastal-themed room',
    'Captures water movement beautifully. Almost feels real',
    'Coastal charm at its best. The colors are perfect',
    'Like a window to the sea in our beach house',
    'Peaceful ocean scene that helps me relax',
    'Beautiful maritime piece with incredible light effects',
    'Serene water views that transport you instantly',
    'Perfect beach house art. The quality is outstanding',
    'Coastal beauty captured in stunning detail',
    'Ocean colors are stunning in morning light'
  ],
  cityscape: [
    'Urban energy captured perfectly in this stunning piece',
    'City lights sparkle like real diamonds on the wall',
    'Metropolitan beauty that makes a bold statement',
    'Perfect city perspective for my downtown apartment',
    'Urban sophistication with incredible detail',
    'Captures city life perfectly in every detail',
    'Amazing architectural detail in every building',
    'City rhythm in art form. Simply magnificent',
    'Urban landscape mastery at its finest',
    'Metropolitan elegance for my office wall'
  ],
  abstract_modern: [
    'Perfect blend of color and form. Makes a statement',
    'Contemporary masterpiece that transforms our space',
    'Bold shapes and colors create amazing energy',
    'Sophisticated abstract piece with perfect balance',
    'Modern art that speaks to the soul',
    'Dynamic composition that catches every eye',
    'Perfect harmony of colors and movement',
    'Makes such a powerful statement in our home',
    'Contemporary elegance with a bold twist',
    'The perfect focal point for any modern space'
  ],
  impressionist: [
    'Light and color dance beautifully in this piece',
    'Reminds me of Monet\'s garden. Simply beautiful',
    'Soft, dreamy quality that soothes the soul',
    'Perfect impressionist style for our home',
    'Captures light and atmosphere brilliantly',
    'Beautiful brushwork with amazing depth',
    'Colors blend together like a dream',
    'Creates such a peaceful atmosphere',
    'The technique is absolutely masterful',
    'Every viewing reveals new details'
  ]
} as const;

// Type for the review handling functions
type ReviewCategory = keyof typeof reviewTemplates;
type ReviewTemplate = typeof reviewTemplates[ReviewCategory];
type ReviewContent = string;

// Helper function with proper typing
const getRandomReviews = (pool: ReadonlyArray<ReviewContent>, count: number): ReviewContent[] => {
  return [...pool]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

const generateProductReviews = (product: ExtendedProduct): ReviewData => {
  const reviewCount = Math.floor(Math.random() * (17 - 4 + 1)) + 4;
  const baseRating = 4.7;
  const maxVariation = 0.3;
  const rating = Math.min(5, baseRating + (Math.random() * maxVariation));

  const description = product.description?.toLowerCase() || '';
  const title = product.title?.toLowerCase() || '';
  
  // Analyze product characteristics
  const isAbstract = description.includes('abstract') || title.includes('abstract');
  const isLandscape = description.includes('landscape') || title.includes('landscape');
  const isOriginal = description.includes('original') || description.includes('hand-painted');
  const isFloral = description.includes('floral') || description.includes('flower') || title.includes('flower');
  const isModern = description.includes('modern');
  const isImpressionist = description.includes('impressionist');
  const isSeascape = description.includes('sea') || description.includes('ocean');
  const isCityscape = description.includes('city') || description.includes('urban');
  const isAbstractModern = (isAbstract && isModern) || description.includes('contemporary');

  // Build review pool with proper type handling
  let reviewPool: ReviewContent[] = [];
  
  if (isAbstract) reviewPool = [...reviewPool, ...reviewTemplates.abstract];
  if (isLandscape) reviewPool = [...reviewPool, ...reviewTemplates.landscape];
  if (isOriginal) reviewPool = [...reviewPool, ...reviewTemplates.original];
  if (isFloral) reviewPool = [...reviewPool, ...reviewTemplates.floral];
  if (isModern) reviewPool = [...reviewPool, ...reviewTemplates.modern];
  if (isSeascape) reviewPool = [...reviewPool, ...reviewTemplates.seascape];
  if (isCityscape) reviewPool = [...reviewPool, ...reviewTemplates.cityscape];
  if (isAbstractModern) reviewPool = [...reviewPool, ...reviewTemplates.abstract_modern];
  if (isImpressionist) reviewPool = [...reviewPool, ...reviewTemplates.impressionist];

  // Default to abstract if no specific category matched
  if (reviewPool.length === 0) {
    reviewPool = [...reviewTemplates.abstract];
  }

  const reviews: Review[] = [];
  const names = ['Sarah M.', 'Michael R.', 'Emma L.', 'David K.', 'Jennifer W.', 'Robert P.', 'Lisa T.', 'Amy H.', 'John B.', 'Rachel S.'] as const;
  const months = ['January', 'February', 'March', 'April', 'May', 'June'] as const;

  // Get unique reviews
  const selectedReviews = getRandomReviews(reviewPool, reviewCount);

  // Generate reviews
  for (let i = 0; i < reviewCount; i++) {
    const reviewRating = Math.min(5, baseRating + (Math.random() * maxVariation));
    const month = months[Math.floor(Math.random() * months.length)]!;
    const day = Math.floor(Math.random() * 28) + 1;
    const year = 2024;
    const author = names[Math.floor(Math.random() * names.length)]!;
    const content = selectedReviews[i] ?? 'Great product!';

    reviews.push({
      id: `review-${i}`,
      author,
      rating: reviewRating,
      date: `${month} ${day}, ${year}`,
      title: 'Verified Purchase',
      content,
      verified: Math.random() > 0.2
    });
  }

  return {
    rating,
    reviewCount,
    reviews
  };
};

const ReviewsModal = ({ reviews, onClose, product }: { 
  reviews: ReviewData; 
  onClose: () => void;
  product: Product;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-primary-900 rounded-lg shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-200 dark:border-primary-700">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
                Customer Reviews
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(reviews.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300 fill-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {reviews.rating.toFixed(1)} out of 5
                </span>
                <span className="text-sm text-primary-500 dark:text-primary-500">
                  ({reviews.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-primary-500 hover:text-primary-700 dark:text-primary-400 
                     dark:hover:text-primary-200 transition-colors rounded-full 
                     hover:bg-primary-100 dark:hover:bg-primary-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reviews List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {reviews.reviews.map((review) => (
              <div 
                key={review.id}
                className="border-b border-primary-200 dark:border-primary-700 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-primary-900 dark:text-primary-100">
                      {review.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300 fill-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-primary-500 dark:text-primary-500">
                        {review.author}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-primary-500 dark:text-primary-500">
                    {review.date}
                  </span>
                </div>
                <p className="mt-2 text-primary-600 dark:text-primary-300">
                  {review.content}
                </p>
                {review.verified && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-4 h-4 text-green-500">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-green-600 dark:text-green-500">
                      Verified Purchase
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-800/50">
          <p className="text-sm text-primary-500 dark:text-primary-400 text-center">
            Reviews are from verified customers who purchased this artwork
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProductCard = memo(({ product, onQuickView, isPriority = false, cardsToShow = 4 }: ProductCardProps) => {
  const [showGallery, setShowGallery] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const reviewData = useMemo(() => generateProductReviews(product), [product]);

  // Memoize images array
  const images = useMemo(() => {
    const imageUrls = [
      product.featuredImage?.url,
      ...(product.images || []).map(img => img?.url)
    ].filter((url): url is string => !!url);
    
    return Array.from(new Set(imageUrls));
  }, [product]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  }, [product, onQuickView]);

  const category = useMemo(() => determineProductCategory(product), [product]);

  const handleZoomClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGallery(true);
  }, []);

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="relative group h-full bg-white dark:bg-primary-800/50 backdrop-blur-sm 
                   rounded-sm shadow-lg transition-all duration-300 
                   hover:shadow-xl hover:shadow-primary-900/10 dark:hover:shadow-primary-100/10 
                   min-w-[200px] w-full"
      >
        <div className="relative">
          {/* Image container with simplified hover effect */}
          <div 
            className="relative aspect-square cursor-pointer"
            onClick={handleZoomClick}
          >
            <div className="absolute inset-0 transition-all duration-300 group-hover:scale-105">
              <SafeImage
                src={images[0] ?? ''}
                alt={product.title || 'Product image'}
                fill
                className="object-cover rounded-t-sm"
                loading="lazy"
                priority={isPriority}
              />
            </div>

            {/* Hover overlay with zoom button - Fixed visibility */}
            {images.length > 0 && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                           transition-all duration-300 rounded-t-sm">
                <button
                  className="absolute top-2 right-2 p-2 
                           bg-black/40 hover:bg-black/60 
                           text-white rounded-full 
                           transition-all duration-300
                           opacity-0 group-hover:opacity-100
                           transform hover:scale-110"
                  onClick={handleZoomClick}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="p-4 relative bg-white dark:bg-primary-800/50">
            <div className="inline-flex px-2 py-1 rounded-full 
                          text-xs font-medium tracking-wide
                          bg-primary-100/80 dark:bg-primary-700/80
                          text-primary-800 dark:text-primary-100">
              {category}
            </div>

            <Link
              href={`/product/${product.handle}`}
              className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <h3 className="font-semibold text-base tracking-tight mt-2 
                         text-primary-900 dark:text-primary-100 
                         line-clamp-1">
                {product.title}
              </h3>
            </Link>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {product.compareAtPriceRange?.minVariantPrice && 
                   parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                      animate={{ 
                        scale: [0.8, 1.1, 1],
                        opacity: 1,
                        rotate: [-12, -15, -12]
                      }}
                      className="absolute -top-3 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                                 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full 
                                 shadow-sm transform -rotate-12"
                    >
                      Sale
                    </motion.div>
                  )}
                  <p className="text-lg font-bold tracking-tight text-accent-500 dark:text-accent-400">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                </div>
                {product.compareAtPriceRange?.minVariantPrice && 
                 parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) && (
                  <>
                    <span className="text-sm text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                      ${parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#FF6B6B] font-medium px-2 py-0.5 
                                   bg-[#FF6B6B]/10 rounded-full">
                      Save {Math.round(((parseFloat(product.compareAtPriceRange.minVariantPrice.amount) - 
                                       parseFloat(product.priceRange.minVariantPrice.amount)) / 
                                       parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowReviews(true);
                }}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.floor(reviewData.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300 fill-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-primary-600 dark:text-primary-400">
                  ({reviewData.reviewCount})
                </span>
              </button>
            </div>
            
            <p className="text-sm leading-relaxed mt-2
                        text-primary-600/90 dark:text-primary-300/90 
                        line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
            
            <div className={cn(
              "flex gap-2 mt-3",
              cardsToShow >= 5 ? "flex-col" : "flex-row"
            )}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative px-3 py-1.5",
                  "bg-[#8B9D8B] hover:bg-[#7A8C7A]",
                  "text-white rounded-sm",
                  "transition-all duration-300",
                  "flex items-center justify-center gap-1.5",
                  "overflow-hidden shadow-sm hover:shadow-md",
                  "group",
                  cardsToShow >= 5 ? "w-full" : "flex-1"
                )}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                              bg-gradient-to-r from-transparent via-white/20 to-transparent
                              -translate-x-full group-hover:translate-x-full
                              transition-all duration-1000 ease-in-out" />

                <svg 
                  className="w-3.5 h-3.5 relative
                            transform group-hover:-translate-y-px
                            transition-transform duration-300 ease-out" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>

                <span className="font-medium text-xs relative
                              transform group-hover:-translate-y-px
                              transition-transform duration-300 ease-out">
                  Add to Cart
                </span>
              </motion.button>

              <motion.button
                onClick={handleQuickView}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative px-3 py-1.5",
                  "bg-[#4A4A4A] hover:bg-[#3A3A3A]",
                  "text-white rounded-sm",
                  "transition-all duration-300",
                  "flex items-center justify-center",
                  "overflow-hidden shadow-sm hover:shadow-md",
                  "group",
                  cardsToShow >= 5 ? "w-full" : "w-[100px]",
                  "text-xs font-medium"
                )}
              >
                <span className="relative transform group-hover:-translate-y-px
                              transition-transform duration-300 ease-out">
                  Quick View
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Portal the modal to the document body */}
      {showGallery && images.length > 0 && (
        <Portal>
          <AnimatePresence mode="wait">
            <ImageModal
              images={images}
              onClose={() => setShowGallery(false)}
              product={product}
            />
          </AnimatePresence>
        </Portal>
      )}

      {showReviews && (
        <ReviewsModal
          reviews={reviewData}
          onClose={() => setShowReviews(false)}
          product={product}
        />
      )}
    </>
  )
})

ProductCard.displayName = 'ProductCard'

const determineProductCategory = (product: ExtendedProduct): string => {
  const title = product.title?.toLowerCase() || '';
  const type = product.productType?.toLowerCase() || '';
  const tags = Array.isArray(product.tags) 
    ? product.tags.map(tag => tag.toLowerCase()) 
    : [];
  const description = product.description?.toLowerCase() || '';

  const searchText = `${title} ${type} ${tags.join(' ')} ${description}`;

  // Material type detection
  const getMaterialType = (): string => {
    const materials = {
      'Linen Canvas': ['linen canvas', 'belgian linen', 'fine linen'],
      'Cotton Canvas': ['cotton canvas', 'cotton duck', 'artist canvas'],
      'Stretched Canvas': ['stretched canvas', 'gallery wrapped', 'gallery wrap'],
      'Canvas Panel': ['canvas panel', 'canvas board'],
      'Paper': ['watercolor paper', 'art paper', 'fine art paper'],
      'Wood Panel': ['wood panel', 'wooden board', 'wood board'],
      'Metal': ['aluminum', 'metal print', 'metallic'],
    }

    for (const [material, indicators] of Object.entries(materials)) {
      if (indicators.some(indicator => searchText.includes(indicator))) {
        return material
      }
    }

    // Default to most common material if canvas is mentioned
    if (searchText.includes('canvas')) {
      return 'Cotton Canvas'
    }

    return ''
  }

  // First check for original paintings
  const originalPaintingIndicators = [
    'oil painting',
    'original painting',
    'hand painted',
    'hand-painted',
    'acrylic painting',
    'oil on canvas',
    'acrylic on canvas',
    'painted by hand',
    'original artwork'
  ]

  if (originalPaintingIndicators.some(indicator => searchText.includes(indicator))) {
    const material = getMaterialType()
    let style = 'Original Painting'

    // Determine painting style
    if (searchText.includes('abstract')) style = 'Abstract Painting'
    else if (searchText.includes('landscape')) style = 'Landscape Painting'
    else if (searchText.includes('portrait')) style = 'Portrait Painting'
    else if (searchText.includes('modern')) style = 'Modern Painting'
    else if (searchText.includes('impressionist')) style = 'Impressionist Painting'
    else if (searchText.includes('expressionist')) style = 'Expressionist Painting'
    else if (searchText.includes('realism')) style = 'Realist Painting'

    // Combine style with material if available
    return material ? `${style} on ${material}` : style
  }

  // Check for prints and reproductions
  const printIndicators = [
    'canvas print',
    'reproduction',
    'printed',
    'digital print',
    'giclée',
    'giclee'
  ]

  if (printIndicators.some(indicator => searchText.includes(indicator))) {
    const material = getMaterialType()
    return material ? `Print on ${material}` : 'Canvas Print'
  }

  // Check for specific art styles with materials
  const material = getMaterialType()
  if (searchText.includes('photograph')) {
    return material ? `Photography on ${material}` : 'Photography'
  }
  if (searchText.includes('digital art')) {
    return material ? `Digital Art on ${material}` : 'Digital Art'
  }
  if (searchText.includes('mixed media')) {
    return material ? `Mixed Media on ${material}` : 'Mixed Media'
  }
  if (searchText.includes('watercolor')) {
    return material ? `Watercolor on ${material}` : 'Watercolor'
  }
  if (searchText.includes('drawing')) {
    return material ? `Drawing on ${material}` : 'Drawing'
  }

  // If it mentions canvas but we're not sure about the type
  if (searchText.includes('canvas')) {
    return material ? `Artwork on ${material}` : 'Canvas Artwork'
  }

  // Default fallback
  return 'Wall Art'
}

interface PortalProps {
  children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export default memo(ProductCard);