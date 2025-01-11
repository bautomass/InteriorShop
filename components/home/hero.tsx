'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useSearch } from '@/hooks/useSearch';
import { Collection } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { debounce } from 'lodash';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, DollarSign, Mail, ShoppingCart, Sparkles, Truck } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Dynamic imports for modal-specific components
const PriceRangeFilter = dynamic(() => import('@/components/filter/PriceRangeFilter').then(mod => mod.PriceRangeFilter), { 
  ssr: false,
  loading: () => <div className="h-[40px] bg-neutral-100 animate-pulse rounded-lg" />
});

const SortSelect = dynamic(() => import('@/components/filter/SortSelect').then(mod => mod.SortSelect), {
  ssr: false,
  loading: () => <div className="h-[40px] w-48 bg-neutral-100 animate-pulse rounded-lg" />
});

// Constants for better organization
const CONSTANTS = {
  ANIMATION: {
    DURATION: 400,
    CAROUSEL_INTERVAL: 7000,
    DEBOUNCE_DELAY: 300,
  }
} as const;

// Add this constant at the top of the file, with other constants
const EXCLUDED_HANDLES: readonly string[] = [
  'all',
  'new-arrivals',
  'top-products',
  'freshfreshfresh',
  'home-collection'
] as const;

// Custom hooks for better organization
const useSlideNavigation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Preload next slide images
    const nextIndex = ((index % totalSlides) + totalSlides) % totalSlides;
    const nextSlide = heroSlides[nextIndex];
    if (nextSlide) {
      const imagesToPreload = [nextSlide.image, nextSlide.mobileImage].filter(Boolean);
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

// Image preloader hook
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

interface SlideContent {
  id: string;
  image: string;
  mobileImage: string;
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

interface HeaderState {
  isAccountOpen: boolean;
  isCartOpen: boolean;
  isMenuOpen: boolean;
}

const heroSlides: SlideContent[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/main-hero-slide1.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile_banner_simple_interior_ideas_ec3c6bf6-8b9a-47e4-be91-214ef01ede8f.jpg',
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
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/wall-room.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/arche.jpg',
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
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/table-sets.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/stool.png',
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
  }
];

// Base Product interface definition
interface BaseProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  images?: Array<{
    url: string;
    altText?: string;
  }>;
}

// Extended interface for products with creation date
interface ExtendedProduct extends BaseProduct {
  createdAt: string;
}

const formatPrice = (amount: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parseFloat(amount));
};

// Add helper function at the top level
const getLoopedIndex = (index: number) => {
  if (index < 0) return heroSlides.length - 1;
  if (index >= heroSlides.length) return 0;
  return index;
};

// Add the style helper function
const getMenuStyles = (style: string | undefined, index: number) => {
  const baseStyles = 'py-3 px-6';
  // Use minimal style for all slides
  return `${baseStyles} hover:pr-12 text-right`;
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

interface HeroProps {}

// Add these constants near the top of the file with other constants
const PROMO_INTERVAL = 5000; // 5 seconds between promo changes

// Add this interface for better type safety
interface PromoItem {
  id: number;
  text: string;
  icon?: React.ReactNode;
}

// Update the promos array with more structured data
const promos: PromoItem[] = [
  {
    id: 1,
    text: "Use Code: 'WINTER24' At Checkout For 15% off",
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    id: 2,
    text: 'Free Worldwide Shipping',
    icon: <Truck className="h-4 w-4" />
  },
  {
    id: 3,
    text: 'Check out Our Collections',
    icon: <Sparkles className="h-4 w-4" />
  }
];

// Add this new component at the top of the file
const BurgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300">
      <span
        className={`bg-neutral-700 h-0.5 w-full transform transition-all duration-300 origin-left
          ${isOpen ? 'rotate-45 translate-x-px' : ''}`}
      />
      <span
        className={`bg-neutral-700 h-0.5 transform transition-all duration-300
          ${isOpen ? 'opacity-0 translate-x-3' : 'w-full'}`}
      />
      <span
        className={`bg-neutral-700 h-0.5 w-full transform transition-all duration-300 origin-left
          ${isOpen ? '-rotate-45 translate-x-px' : ''}`}
      />
    </div>
  </div>
);

// Update MobileHero component to restore original styling
const MobileHero = () => {
  const { cart } = useCart();
  const { updateState } = useHeaderState();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    collections: any[];
  }>({ products: [], collections: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);  // Add this line

  // Fetch collections when menu opens
  useEffect(() => {
    if (isNavOpen) {
      fetch('/api/collections')
        .then(res => res.json())
        .then(data => {
          const filteredCollections = data.collections.filter(
            (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
          );
          setCollections(filteredCollections);
        })
        .catch(error => console.error('Error fetching collections:', error));
    }
  }, [isNavOpen]);

  // Add this near the top of the MobileHero component
  useEffect(() => {
    // Preload collections
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => {
        const filteredCollections = data.collections.filter(
          (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
        );
        setCollections(filteredCollections);
        setLoading(false);  // Add this line
      })
      .catch(error => {
        console.error('Error prefetching collections:', error);
        setLoading(false);  // Add this line
      });
  }, []); // Run once on mount

  const email = 'info@simpleinteriorideas.com';
  const workingHours = 'Mon-Fri: 9-18';
  const currencies = [
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
    { code: 'GBP', symbol: '£' }
  ] as const;

  // Add this effect for promo rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
    }, PROMO_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Add this useEffect for scroll control
  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNavOpen]);

  // Add debounced search handler
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults({ products: [], collections: [] });
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Update the search button click handler
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    // Focus the input after a short delay to allow animation
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Add this useEffect to prevent body scrolling when search is open
  useEffect(() => {
    if (isSearchOpen && searchQuery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, searchQuery]);

  // Update the container class to include account and cart states
  const containerExpandedClass = (isNavOpen || (isSearchOpen && searchQuery) || isAccountOpen || isCartOpen) ? 'h-screen' : 'h-auto';

  // Add this function to handle panel switching
  const handlePanelChange = (panel: 'search' | 'account' | 'cart') => {
    // Close all panels first
    setIsSearchOpen(false);
    setIsAccountOpen(false);
    setIsCartOpen(false);
    setSearchQuery('');

    // Open the selected panel
    switch (panel) {
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'account':
        setIsAccountOpen(true);
        break;
      case 'cart':
        setIsCartOpen(true);
        break;
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[80vh] lg:hidden">
      <Image
        src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-banner.png?v=1736585444"
        alt="Mobile Hero"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Mobile Navigation Container */}
      <div className={`${isScrolled ? 'fixed bottom-0' : 'absolute top-0'} left-0 right-0 z-[9999] transition-[top,bottom] duration-300`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full backdrop-blur-sm shadow-lg 
                     relative border-r-[3px] border-white
                     before:absolute before:inset-0 before:-z-10 
                     before:bg-[#eaeadf]
                     before:border-r-[3px] 
                     before:border-black/10
                     transition-[background,shadow,transform] duration-500
                     ${isScrolled ? 'border-t-[3px] border-l-[3px] rounded-tl-[24px] rounded-tr-[24px] before:border-t-[3px] before:border-l-[3px] before:rounded-tl-[24px] before:rounded-tr-[24px]' : 'border-b-[3px] rounded-br-[24px] before:border-b-[3px] before:rounded-br-[24px]'}
                     ${containerExpandedClass}`}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center gap-2.5"
              aria-label="Toggle menu"
            >
              <BurgerIcon isOpen={isNavOpen} />
              <span className={`text-sm font-medium transition-colors duration-300 
                ${isNavOpen ? 'text-[#9e896c]' : 'text-neutral-700'}`}>
                {isNavOpen ? 'Close' : 'Menu'}
              </span>
            </button>

            {/* Icons Section */}
            <div className="flex items-center gap-4">
              {/* Search Icon/Input */}
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.button 
                    key="search-icon"
                    onClick={() => handlePanelChange('search')}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-input"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 min-w-[160px]"
                  >
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        placeholder="Search..."
                        className="w-full px-4 py-2 rounded-lg bg-neutral-100/80 
                                 placeholder-neutral-500 focus:outline-none focus:ring-2 
                                 focus:ring-[#9e896c] text-neutral-900"
                      />
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 
                                 rounded-full hover:bg-neutral-200/80 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Account Icon */}
              <button 
                onClick={() => handlePanelChange('account')}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                </svg>
              </button>

              {/* Cart Icon */}
              <button 
                onClick={() => handlePanelChange('cart')}
                className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {(cart?.totalQuantity ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9e896c] rounded-full flex items-center justify-center text-white text-xs">
                    {cart?.totalQuantity ?? 0}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Results Section */}
          <AnimatePresence>
            {isSearchOpen && searchQuery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-neutral-200 flex-1 overflow-hidden"
              >
                <div className="h-[calc(100vh-80px)] overflow-y-auto overscroll-contain pb-safe-area-inset-bottom">
                  <div className="p-4 space-y-6">
                    {/* Loading State */}
                    {isSearching && (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-[#9e896c] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Results */}
                    {!isSearching && (searchResults.collections.length > 0 || searchResults.products.length > 0) ? (
                      <div className="space-y-8">
                        {/* Collections Section */}
                        {searchResults.collections.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-neutral-500 mb-3">Collections</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {searchResults.collections.map((collection) => (
                                <Link
                                  key={collection.handle}
                                  href={`/collections/${collection.handle}`}
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="group relative block overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 transition-all"
                                >
                                  <h4 className="text-sm font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                    {collection.title}
                                  </h4>
                                  {collection.description && (
                                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                                      {collection.description}
                                    </p>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Products Section */}
                        {searchResults.products.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-neutral-500 mb-3">Products</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {searchResults.products.map((product) => (
                                <Link
                                  key={product.handle}
                                  href={`/product/${product.handle}`}
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="group relative block overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-all"
                                >
                                  {product.featuredImage && (
                                    <div className="relative aspect-square bg-neutral-100">
                                      <Image
                                        src={product.featuredImage.url}
                                        alt={product.featuredImage.altText || product.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, 33vw"
                                      />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    <h4 className="text-sm font-medium text-neutral-900 group-hover:text-[#9e896c] line-clamp-1">
                                      {product.title}
                                    </h4>
                                    <p className="text-sm text-neutral-500 mt-1">
                                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : !isSearching && searchQuery ? (
                      <div className="text-center py-8">
                        <p className="text-neutral-600">No results found</p>
                        <p className="text-sm text-neutral-400 mt-1">Try adjusting your search</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account Panel */}
          <AnimatePresence>
            {isAccountOpen && (
              <motion.div>
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 px-4 pt-2">
                  <h2 className="text-lg font-medium text-neutral-800">Account</h2>
                  <button
                    onClick={() => setIsAccountOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="h-[calc(100vh-80px)] overflow-y-auto overscroll-contain pb-safe-area-inset-bottom">
                  <div className="p-4 space-y-6">
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-medium text-neutral-800">Account</h2>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            // Add login logic here
                            setIsAccountOpen(false);
                          }}
                          className="w-full py-2.5 px-4 rounded-lg bg-[#9e896c] text-white hover:bg-[#8a775d] transition-colors"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => {
                            // Add signup logic here
                            setIsAccountOpen(false);
                          }}
                          className="w-full py-2.5 px-4 rounded-lg border border-[#9e896c] text-[#9e896c] hover:bg-[#9e896c]/5 transition-colors"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Panel */}
          <AnimatePresence>
            {isCartOpen && (
              <motion.div>
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3 px-4 pt-2">
                  <h2 className="text-lg font-medium text-neutral-800">Shopping Cart</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="h-[calc(100vh-80px)] overflow-y-auto overscroll-contain pb-safe-area-inset-bottom">
                  <div className="p-4 space-y-6">
                    {/* Cart Header */}
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                      <h2 className="text-lg font-medium text-neutral-800">Shopping Cart</h2>
                      <span className="text-sm text-neutral-500">
                        ({cart?.totalQuantity || 0} items)
                      </span>
                    </div>

                    {/* Cart Items */}
                    {cart?.lines && (cart.lines as any[]).length > 0 ? (
                      <div className="space-y-4">
                        {(cart.lines as any[]).map((item: any) => (
                          <div key={item.id} className="flex gap-4 p-3 bg-white rounded-lg border border-neutral-200">
                            {item.merchandise.product.featuredImage && (
                              <div className="relative w-20 h-20 bg-neutral-100 rounded-md overflow-hidden">
                                <Image
                                  src={item.merchandise.product.featuredImage.url}
                                  alt={item.merchandise.product.title}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-neutral-800">
                                {item.merchandise.product.title}
                              </h3>
                              <p className="text-sm text-neutral-500 mt-1">
                                {item.merchandise.title}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-neutral-800">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm font-medium text-neutral-800">
                                  ${parseFloat(item.cost.totalAmount.amount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Cart Footer */}
                        <div className="space-y-3 pt-4 border-t border-neutral-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-600">Subtotal</span>
                            <span className="text-base font-medium text-neutral-800">
                              ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (cart?.checkoutUrl) {
                                window.location.href = cart.checkoutUrl;
                              }
                            }}
                            disabled={!cart?.checkoutUrl}
                            className="w-full py-3 px-4 rounded-lg bg-[#9e896c] text-white hover:bg-[#8a775d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-600">Your cart is empty</p>
                        <p className="text-sm text-neutral-400 mt-1">Add some items to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content that only shows when menu is open */}
          {isNavOpen && (
            <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Container for all content */}
              {/* Promos Section - Adjusted width */}
              <div className="w-[calc(100%-3px)] relative h-12 overflow-hidden bg-gradient-to-r from-neutral-50/50 to-white/50 border-b border-neutral-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPromoIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex items-center justify-center px-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      {(() => {
                        const currentPromo = promos[currentPromoIndex % promos.length];
                        return (
                          <>
                            {currentPromo?.icon}
                            <span className="font-medium">{currentPromo?.text}</span>
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <motion.div
                  key={`progress-${currentPromoIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: PROMO_INTERVAL / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-[#9e896c]/20 origin-left"
                />
              </div>

              {/* Collections Grid */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <LoadingChair />
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {collections.map((collection) => (
                      <Link
                        key={collection.handle}
                        href={`/collections/${collection.handle}`}
                        onClick={() => setIsNavOpen(false)}
                        className="group relative block overflow-hidden rounded-[12px] border border-neutral-100 bg-white/80 p-2.5 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-md"
                      >
                        <div className="relative z-10">
                          <h3 className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-[#9e896c]">
                            {collection.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Navigation - Adjusted width */}
              <div className="w-[calc(100%-3px)] border-t border-neutral-100 bg-neutral-50/50">
                <div className="px-4 py-4">
                  <div className="space-y-3">
                    {[
                      { title: 'Help & Information', items: [
                        { label: 'FAQs', href: '/faqs' },
                        { label: 'Shipping Info', href: '/shipping' },
                        { label: 'Returns & Exchanges', href: '/returns' },
                      ]},
                      { title: 'Legal', items: [
                        { label: 'Privacy Policy', href: '/privacy' },
                        { label: 'Terms & Conditions', href: '/terms' },
                        { label: 'Cookie Policy', href: '/cookies' },
                      ]},
                    ].map((section) => (
                      <div key={section.title} className="space-y-1.5">
                        <h3 className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                          {section.title}
                        </h3>
                        <div className="space-y-1.5">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between py-0.5 text-xs text-neutral-600 hover:text-[#9e896c] transition-all duration-200"
                            >
                              <span className="font-medium">{item.label}</span>
                              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Info Section - Adjusted position */}
              <div className="w-[calc(100%-3px)] px-4 py-4 mb-[15px] bg-gradient-to-b from-neutral-50/80 to-white/80 border-t border-neutral-100 rounded-br-[21px]">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  {/* Working Hours */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-[#9e896c]/10">
                      <Clock className="h-3.5 w-3.5 text-[#9e896c]" />
                    </div>
                    <span className="text-sm text-neutral-600">{workingHours}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-neutral-200" />

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-[#9e896c]/10">
                      <Mail className="h-3.5 w-3.5 text-[#9e896c]" />
                    </div>
                    <a 
                      href={`mailto:${email}`} 
                      className="text-sm text-neutral-600 hover:text-[#9e896c] transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Update MobileNavigation component styling
const MobileNavigation = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Reuse the same excluded handles from SidebarMenu
  const EXCLUDED_HANDLES: readonly string[] = [
    'all',
    'new-arrivals',
    'top-products',
    'freshfreshfresh',
    'home-collection'
  ];

  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/collections', {
        next: { revalidate: 0 },
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const { collections } = await response.json();

      const filteredCollections = collections.filter(
        (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
      );

      setCollections(filteredCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen, fetchCollections]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-[12px] bg-neutral-100" />
                ))
              ) : (
                collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    onClick={onClose}
                    className="group relative block overflow-hidden rounded-[12px] border border-neutral-100 bg-white/80 p-3 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="relative z-10">
                      <h3 className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-[#9e896c]">
                        {collection.title}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeroComponent = function Hero({}: HeroProps): JSX.Element {
  useImagePreloader(heroSlides.map(slide => [slide.image, slide.mobileImage]).flat());

  const { results, isLoading, error, performSearch } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const modalSearchInputRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState('created_desc');
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { state, updateState } = useHeaderState();
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { currentSlide, isAnimating, goToSlide } = useSlideNavigation(heroSlides.length);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const controls = useAnimation();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>();
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAndSortedResults = useMemo(() => {
    // First, ensure we have the correct types by mapping the products
    const productsWithDates = results.products.map(product => ({
      ...product,
      createdAt: (product as unknown as { createdAt?: string })?.createdAt || new Date().toISOString()
    })) as ExtendedProduct[];

    let filtered = [...productsWithDates];

    if (priceRange) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        switch (priceRange) {
          case 'Under $50':
            return price < 50;
          case '$50 - $100':
            return price >= 50 && price < 100;
          case '$100 - $200':
            return price >= 100 && price < 200;
          case '$200+':
            return price >= 200;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      
      switch (sortBy) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'created_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [results.products, sortBy, priceRange]);

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch, performSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    performSearch(query);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isSearchOpen && searchQuery) {
        e.preventDefault();
        openModal();
      }
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSearchOpen, searchQuery]);

  useEffect(() => {
    if (showSearchModal && modalSearchInputRef.current) {
      modalSearchInputRef.current.focus();
    }
  }, [showSearchModal]);

  const openModal = () => {
    setShowSearchModal(true);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowSearchModal(false);
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const resetSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('input')  // Exclude the input field
      ) {
        resetSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCartHover = (isHovering: boolean) => {
    setIsCartHovered(isHovering);
  };

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

  const togglePause = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsPaused(prev => {
      const newPausedState = !prev;
      
      if (newPausedState) {
        // Pausing
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      } else {
        // Resuming
        autoPlayRef.current = setInterval(() => {
          goToSlide((currentSlide + 1) % heroSlides.length);
        }, 5000);
      }
      
      return newPausedState;
    });
  }, [goToSlide, currentSlide, heroSlides.length]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    if (!isPaused && !isMenuHovered) {
      autoPlayRef.current = setInterval(() => {
        goToSlide((currentSlide + 1) % heroSlides.length);
      }, 5000);
    }
  }, [isPaused, isMenuHovered, currentSlide, heroSlides.length, goToSlide]);

  const handleMenuHover = (isHovering: boolean) => {
    setIsMenuHovered(isHovering);
    if (isHovering) {
      setProgressKey(prev => prev + 1);
    }
  };

  // Optimize scroll handling
  const handleScroll = useCallback((e: WheelEvent) => {
    if (Math.abs(e.deltaY) > 30) {
      goToSlide(currentSlide + (e.deltaY > 0 ? 1 : -1));
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const element = slideRefs.current[currentSlide];
    if (element) {
      element.addEventListener('wheel', handleScroll, { passive: true });
      return () => element.removeEventListener('wheel', handleScroll);
    }
  }, [currentSlide, handleScroll]);

  // Optimize autoplay
  useEffect(() => {
    if (isMenuHovered) return;
    
    const timer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, CONSTANTS.ANIMATION.CAROUSEL_INTERVAL);
    
    return () => clearInterval(timer);
  }, [currentSlide, isMenuHovered, goToSlide]);

  useEffect(() => {
    const shouldPreventScroll = isSearchOpen || isAccountOpen || isCartOpen || isNavOpen;
    
    if (shouldPreventScroll) {
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isSearchOpen, isAccountOpen, isCartOpen, isNavOpen]);

  return (
    <>
      {/* Mobile Hero */}
      <MobileHero />

      {/* Desktop Hero - hide on mobile */}
      <div className="hidden lg:block">
        <div className={`${isModalOpen ? 'blur-sm transition-all duration-200' : ''}`}>
          <section 
            className="relative h-[90vh] w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Add subtle overlay */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Top Navigation Icons */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-6 top-6 z-20"
            >
              <div className="flex items-center gap-2 rounded-md bg-[#9e896c]/90 px-3 py-2 shadow-lg backdrop-blur-sm h-[40px]">
                <AnimatePresence mode="wait">
                  {!isSearchOpen && !isAccountOpen && !isCartOpen ? (
                    <motion.div 
                      key="icons"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center gap-2"
                    >
                      {/* Default Icons */}
                      <button 
                        className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                        aria-label="Search"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {/* Account and Cart buttons */}
                      <button 
                        className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                        aria-label="Profile"
                        onClick={() => updateState({ isAccountOpen: true })}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" />
                        </svg>
                      </button>
                      <div 
                        className="relative"
                        onMouseEnter={() => handleCartHover(true)}
                        onMouseLeave={() => handleCartHover(false)}
                      >
                        <button 
                          className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                          aria-label="Cart"
                          onClick={() => setIsCartOpen(true)}
                        >
                          <div className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {(cart?.totalQuantity ?? 0) > 0 && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9e896c] rounded-full flex items-center justify-center text-white text-xs">
                                {cart?.totalQuantity ?? 0}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Cart Preview Popup */}
                        <AnimatePresence>
                          {isCartHovered && cart?.lines && (cart.lines as any[]).length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 top-12 w-[290px] md:w-[420px] rounded-lg bg-white p-5 shadow-xl ring-1 ring-black/5"
                              onMouseEnter={() => handleCartHover(true)}
                              onMouseLeave={() => handleCartHover(false)}
                              style={{
                                zIndex: 100,
                                position: 'fixed',
                                right: '24px',
                                top: '64px'
                              }}
                            >
                              {/* Header Section */}
                              <div className="border-b border-[#6B5E4C]/10 pb-3">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-base md:text-lg font-semibold text-[#6B5E4C]">Shopping Cart</h3>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#8C7E6A]">({cart.totalQuantity} items)</span>
                                    <span className="text-sm font-medium text-[#6B5E4C]">{formatPrice(cart.cost.totalAmount.amount)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Items List Section */}
                              <div className="max-h-[40vh] md:max-h-[50vh] overflow-y-auto my-3 pr-2 
                                scrollbar-thin scrollbar-thumb-[#6B5E4C]/20 scrollbar-track-transparent 
                                hover:scrollbar-thumb-[#6B5E4C]/30">
                                {cart.lines.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    layout
                                    className="flex gap-3 md:gap-4 rounded-md p-3 hover:bg-[#6B5E4C]/5 border-b border-[#6B5E4C]/10 last:border-b-0"
                                  >
                                    {/* Product Image */}
                                    {item.merchandise.product.featuredImage && (
                                      <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#F8F7F6]">
                                        <Image
                                          src={item.merchandise.product.featuredImage.url}
                                          alt={item.merchandise.product.title}
                                          fill
                                          className="object-cover"
                                          sizes="(min-width: 768px) 80px, 64px"
                                        />
                                      </div>
                                    )}
                                    
                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-sm md:text-base font-medium text-[#6B5E4C] line-clamp-1">
                                          {item.merchandise.product.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-[#8C7E6A] line-clamp-1 mt-0.5">
                                          Variant: {item.merchandise.title}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs md:text-sm text-[#8C7E6A]">Qty:</span>
                                          <span className="text-xs md:text-sm font-medium text-[#6B5E4C]">{item.quantity}</span>
                                        </div>
                                        <span className="text-sm md:text-base font-medium text-[#6B5E4C]">
                                          {formatPrice(item.cost.totalAmount.amount)}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Footer Actions Section */}
                              <div className="border-t border-[#6B5E4C]/10 pt-3 space-y-2.5">
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-sm md:text-base font-medium text-[#8C7E6A]">Subtotal</span>
                                  <span className="text-base md:text-lg font-semibold text-[#6B5E4C]">
                                    {formatPrice(cart.cost.totalAmount.amount)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setIsCartOpen(true)}
                                  className="w-full rounded-md bg-[#6B5E4C] px-4 py-2.5 text-sm md:text-base font-medium text-white transition-colors hover:bg-[#5A4D3B]"
                                >
                                  View Cart
                                </button>
                                <button
                                  onClick={() => {
                                    if (cart?.checkoutUrl) {
                                      window.location.href = cart.checkoutUrl;
                                    }
                                  }}
                                  disabled={!cart?.checkoutUrl}
                                  className="w-full rounded-md bg-[#6B5E4C]/10 px-4 py-2.5 text-sm md:text-base font-medium text-[#6B5E4C] transition-colors hover:bg-[#6B5E4C]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Checkout
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : isSearchOpen ? (
                    <motion.div 
                      key="search"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative flex items-center justify-between gap-4 pr-2"
                    >
                      <motion.button 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col w-full"
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full appearance-none bg-transparent px-4 py-2 text-white placeholder-white/70 outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:bg-transparent active:bg-transparent"
                          style={{ WebkitAppearance: 'none', boxShadow: 'none' }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                        
                        {/* Search Results Dropdown */}
                        {isSearchOpen && searchQuery && (
                          <motion.div 
                            ref={searchDropdownRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 w-[400px] mt-3 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden z-50 border border-neutral-200"
                            style={{ marginRight: "-13px" }}
                          >
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                              {(results.products.length > 0 || results.collections.length > 0) ? (
                                <>
                                  <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-neutral-200">
                                    <p className="text-sm text-neutral-500">
                                      Found {results.products.length + results.collections.length} results
                                    </p>
                                  </div>

                                  {/* Collections Section */}
                                  {results.collections.length > 0 && (
                                    <div className="divide-y divide-neutral-100">
                                      <div className="px-4 py-2 bg-neutral-50">
                                        <p className="text-sm font-medium text-neutral-600">Collections</p>
                                      </div>
                                      {results.collections.slice(0, 3).map((collection: {
                                        handle: string;
                                        image?: { url: string; altText?: string };
                                        title: string;
                                        description?: string;
                                      }) => (
                                        <Link
                                          key={collection.handle}
                                          href={`/collections/${collection.handle}`}
                                          className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                                          onClick={() => setIsSearchOpen(false)}
                                        >
                                          {collection.image && (
                                            <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                              <Image
                                                src={collection.image.url}
                                                alt={collection.image.altText || collection.title}
                                                fill
                                                sizes="64px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-[#9e896c]">
                                              {collection.title}
                                            </p>
                                            {collection.description && (
                                              <p className="text-sm text-neutral-500 mt-0.5 truncate">
                                                {collection.description}
                                              </p>
                                            )}
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                  )}

                                  {/* Products Section */}
                                  <div className="divide-y divide-neutral-100">
                                    <div className="px-4 py-2 bg-neutral-50">
                                      <p className="text-sm font-medium text-neutral-600">Products</p>
                                    </div>
                                    {results.products.slice(0, 5).map((product: {
                                      id: string;
                                      handle: string;
                                      title: string;
                                      featuredImage?: { url: string; altText?: string };
                                      priceRange: { minVariantPrice: { amount: string } };
                                    }) => (
                                      <Link
                                        key={product.id}
                                        href={`/product/${product.handle}`}
                                        className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                                        onClick={() => setIsSearchOpen(false)}
                                      >
                                        {product.featuredImage && (
                                          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                            <Image
                                              src={product.featuredImage?.url || ''}
                                              alt={product.featuredImage?.altText || product.title}
                                              fill
                                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-[#9e896c]">
                                            {product.title}
                                          </p>
                                          <p className="text-sm text-neutral-500 mt-0.5">
                                            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <div className="p-8 text-center">
                                  <p className="text-neutral-600">No results found</p>
                                  <p className="text-sm text-neutral-400 mt-1">Try adjusting your search</p>
                                </div>
                              )}
                            </div>
                            {(results.products.length + results.collections.length) > 5 && (
                              <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                                <button
                                  onClick={() => openModal()}
                                  className="w-full py-2.5 px-4 text-sm text-center text-white bg-[#9e896c] rounded-lg hover:bg-[#8a775d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2"
                                >
                                  View All {results.products.length + results.collections.length} Results
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  ) : isCartOpen ? (
                    <motion.div 
                      key="cart"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center justify-between gap-4 pr-2"
                    >
                      <motion.button 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 whitespace-nowrap pr-1"
                      >
                        <span className="text-sm text-white">
                          {cart?.totalQuantity ?? 0} {cart?.totalQuantity === 1 ? 'item' : 'items'}
                        </span>
                        <Link 
                          href="/cart"
                          className="text-sm text-white underline-offset-4 hover:underline"
                        >
                          View Cart
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="account"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center justify-between gap-4 pr-2"
                    >
                      <motion.button 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <div className="flex items-center gap-2 whitespace-nowrap pr-1">
                        <motion.button 
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm text-white transition-colors hover:text-white/70"
                          onClick={() => {
                            // Add login logic here
                            setIsAccountOpen(false);
                          }}
                        >
                          Log In
                        </motion.button>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-white/50"
                        >
                          /
                        </motion.span>
                        <motion.button 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-sm text-white transition-colors hover:text-white/70"
                          onClick={() => {
                            // Add signup logic here
                            setIsAccountOpen(false);
                          }}
                        >
                          Sign Up
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Updated Hero Content */}
            <div className="relative h-[90vh] w-full overflow-hidden">
              <div className="flex h-full">
                {heroSlides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    ref={el => slideRefs.current[index] = el}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      left: `${index * 100}%`
                    }}
                    animate={{
                      x: `${-currentSlide * 100}%`
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className="flex-shrink-0"
                  >
                    {/* Background Images */}
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      quality={90}
                      className="hidden md:block object-cover w-full h-full"
                      sizes="100vw"
                    />
                    <Image
                      src={slide.mobileImage}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      quality={90}
                      className="block md:hidden object-cover w-full h-full"
                      sizes="100vw"
                    />

                    {/* Lamp Image (only for first slide) */}
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
                        className="absolute left-[15%] top-[0%] z-10 w-[120px] origin-top md:w-[180px]"
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
                          
                          {/* Interactive Product Dot */}
                          <div className="group absolute bottom-[20%] left-[65%] -translate-x-1/2 translate-y-1/2">
                            {/* Pulsating Dot */}
                            <div className="relative inline-flex">
                              {/* Pulse rings */}
                              <div className="absolute -inset-1.5
                                            w-7 h-7 rounded-full bg-[#dcd5ca]/60
                                            animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite]" />
                              <div className="absolute -inset-1.5
                                            w-7 h-7 rounded-full bg-[#ebe7e0]/50
                                            animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite_1.75s]" />
                              
                              {/* Main dot */}
                              <div className="relative w-4 h-4 rounded-full 
                                            bg-[#ebe7e0] border-2 border-[#9c826b]
                                            shadow-[0_0_10px_rgba(199,186,168,0.8)]
                                            transition-all duration-500 ease-in-out
                                            group-hover:scale-125" />

                              {/* Hover Button */}
                              <div className="absolute left-6 top-2">
                                <motion.div
                                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                  whileHover={{ scale: 1.05 }}
                                  animate={{ opacity: 0, x: -20 }}
                                  className="group-hover:animate-slideIn"
                                >
                                  <Link 
                                    href="/product/sleek-curve-japandi-glow-minimalist-pendant-light"
                                    className="invisible relative flex items-center gap-2 
                                             bg-[#ebe7e0]/95 backdrop-blur-sm shadow-lg rounded-lg p-2
                                             border border-[#b39e86] 
                                             transition-all duration-500 ease-out
                                             group-hover:visible hover:bg-[#dcd5ca]/95"
                                  >
                                    <span className="text-sm font-medium text-[#9c826b] whitespace-nowrap px-1">
                                      View Product
                                    </span>
                                    <svg 
                                      className="w-4 h-4 text-[#9c826b] transition-all duration-300
                                              group-hover:translate-x-1" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                      />
                                    </svg>
                                  </Link>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Slide Menu with Title */}
                    <motion.div
                      onMouseEnter={() => handleMenuHover(true)}
                      onMouseLeave={() => handleMenuHover(false)}
                      initial={{ opacity: 0, x: slide.menu.position === 'left' ? -50 : 50 }}
                      animate={{
                        opacity: currentSlide === index ? 1 : 0,
                        x: currentSlide === index ? 0 : (slide.menu.position === 'left' ? -50 : 50)
                      }}
                      transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className={`absolute ${getMenuPosition(slide.menu, slide.id)} z-20 max-w-[460px] p-7 rounded-xl 
                                 bg-black/10 backdrop-blur-[2px] shadow-2xl shadow-black/5 border border-white/5`}
                    >
                      {/* Title Group with refined typography */}
                      <motion.div
                        className={`mb-7 ${slide.menu.position === 'right' ? 'text-right' : 'text-left'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-[2.5rem] leading-[1.1] tracking-normal text-white font-light 
                                       [text-shadow:_0_1px_2px_rgba(0,0,0,0.1)]">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="mt-3 text-xl text-white/90 font-light tracking-wide">
                            {slide.subtitle}
                          </p>
                        )}
                      </motion.div>

                      {/* Menu Items with adjusted spacing */}
                      <div className="space-y-3">
                        {slide.menu.items.map((item, idx) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (idx * 0.1) }}
                            className={`group cursor-pointer ${
                              slide.menu.position === 'right' ? 'text-right' : 'text-left'
                            }`}
                          >
                            <Link 
                              href={item.link}
                              className={`relative block transition-all duration-500 py-3 px-7 rounded-lg 
                                       ${slide.menu.position === 'right' ? 'hover:pr-14' : 'hover:pl-14'} 
                                       hover:bg-white/5`}
                            >
                              <span className="block text-[1.85rem] font-light tracking-wide text-white/90 
                                             group-hover:text-white transition-colors duration-500 capitalize">
                                {item.label.toLowerCase()}
                              </span>
                              {item.description && (
                                <span className="block mt-1 text-sm text-white/60 group-hover:text-white/80 
                                               transition-colors duration-500 font-light tracking-wide capitalize">
                                  {item.description.toLowerCase()}
                                </span>
                              )}
                              <motion.div
                                className={`absolute ${slide.menu.position === 'right' ? '-right-8' : '-left-8'} 
                                         top-1/2 -translate-y-1/2 w-6 h-[1px] bg-white/40 
                                         origin-${slide.menu.position === 'right' ? 'right' : 'left'} scale-x-0 
                                         group-hover:scale-x-100 group-hover:bg-white transition-all duration-500`}
                                layoutId={`menu-line-${index}-${idx}`}
                              />
                              <motion.div 
                                className={`absolute ${slide.menu.position === 'right' ? 'right-4' : 'left-4'} 
                                         top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/0 
                                         group-hover:bg-white scale-0 group-hover:scale-100 
                                         transition-all duration-500 delay-100`}
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* Enhanced Professional Pagination with Navigation */}
              <div className="absolute bottom-2 right-8 z-20 flex items-center gap-6 perspective-[1200px] transform-gpu scale-90">
                {/* Previous Button */}
                <motion.button
                  onClick={() => goToSlide(currentSlide - 1)}
                  disabled={isAnimating}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm 
                                  group-hover:bg-black/60 transition-all duration-300 -z-10" />
                  <div className="p-3 text-white flex items-center overflow-hidden">
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                    <div className="w-0 group-hover:w-20 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                      <span className="text-sm font-medium pl-2 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 delay-100">
                        Previous
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Thumbnails */}
                <div className="flex items-center gap-1.5 relative">
                  {[...Array(3)].map((_, i) => {
                    const slideIndex = getLoopedIndex(currentSlide - 1 + i);
                    const slide = heroSlides[slideIndex];
                    if (!slide) return null;
                    const isActive = i === 1;
                    
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
                        className={`relative overflow-hidden cursor-pointer
                                   transition-shadow duration-300
                                   ${isActive ? 
                                     'w-44 h-24 shadow-lg hover:shadow-xl z-10' : 
                                     'w-36 h-20 shadow-md hover:shadow-lg z-0'}`}
                      >
                        <div className="absolute inset-0 w-full h-full">
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            priority={isActive}
                            className="object-cover transition-all duration-500 ease-out"
                            sizes="(min-width: 768px) 176px, 144px"
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
                          <>
                            <motion.div
                              layoutId="activeThumb"
                              className="absolute inset-0 border-2 border-white"
                              transition={{ duration: 0.3 }}
                            />
                            
                            {/* Progress Line */}
                            <motion.div
                              key={`progress-${progressKey}-${currentSlide}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isMenuHovered ? 0 : 1 }}
                              transition={{ 
                                duration: isMenuHovered ? 0.3 : 5,
                                ease: "linear"
                              }}
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-white/80
                                         origin-left shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                              onAnimationComplete={() => {
                                if (!isMenuHovered) {
                                  goToSlide(currentSlide + 1);
                                }
                              }}
                            />
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Next Button */}
                <motion.button
                  onClick={() => goToSlide(currentSlide + 1)}
                  disabled={isAnimating}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm 
                                 group-hover:bg-black/60 transition-all duration-300 -z-10" />
                  <div className="p-3 text-white flex items-center overflow-hidden">
                    <div className="w-0 group-hover:w-20 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                      <span className="text-sm font-medium pr-2 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 delay-100">
                        Next
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal outside the blurred wrapper */}
      <AnimatePresence>
        {showSearchModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[50]"
              onClick={() => closeModal()}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 overflow-hidden pt-[10vh] pb-[10vh] z-[60]"
            >
              <div className="relative w-full h-full max-w-4xl mx-auto">
                <div className="h-full bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
                  {/* Search Header */}
                  <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
                    <div className="p-6">
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <input
                            ref={modalSearchInputRef}
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-neutral-900 bg-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:bg-white transition-all pr-12"
                          />
                        </div>
                        
                        {/* Icons Section */}
                        <div className="flex items-center gap-4 ml-4">
                          {/* Profile Icon */}
                          <button
                            onClick={() => updateState({ isAccountOpen: true })}
                            className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" />
                            </svg>
                          </button>

                          {/* Cart Icon with Badge */}
                          <div className="relative">
                            <button
                              onClick={() => updateState({ isCartOpen: true })}
                              className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              {(cart?.totalQuantity ?? 0) > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9e896c] text-xs font-medium text-white"
                                >
                                  {cart?.totalQuantity ?? 0}
                                </motion.span>
                              )}
                            </button>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => closeModal()}
                            className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="px-6 pb-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-48">
                          <SortSelect value={sortBy} onChange={setSortBy} />
                        </div>
                        <div className="relative group">
                          <button className="px-4 py-2 text-sm bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
                            Price Range
                          </button>
                          <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <PriceRangeFilter
                              selectedRange={priceRange}
                              onChange={setPriceRange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {filteredAndSortedResults.length} results
                      </div>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6">
                      {results.collections.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-lg font-medium text-neutral-900 mb-4">Collections</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.collections.map((collection: {
                              handle: string;
                              image?: { url: string; altText?: string };
                              title: string;
                              description?: string;
                            }) => (
                              <Link
                                key={collection.handle}
                                href={`/collections/${collection.handle}`}
                                onClick={() => setShowSearchModal(false)}
                                className="group bg-neutral-50 rounded-lg overflow-hidden hover:bg-neutral-100 transition-colors"
                              >
                                <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                                  {collection.image && (
                                    <Image
                                      src={collection.image.url}
                                      alt={collection.image.altText || collection.title}
                                      fill
                                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium text-neutral-900 group-hover:text-[#9e896c] truncate">
                                    {collection.title}
                                  </h3>
                                  {collection.description && (
                                    <p className="text-sm text-neutral-500 mt-1 truncate">
                                      {collection.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredAndSortedResults.length > 0 && (
                        <div>
                          <h2 className="text-lg font-medium text-neutral-900 mb-4">Products</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAndSortedResults.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                className="group bg-neutral-50 rounded-lg overflow-hidden hover:bg-neutral-100 transition-colors"
                              >
                                <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                                  {product.featuredImage && (
                                    <Image
                                      src={product.featuredImage?.url || ''}
                                      alt={product.featuredImage?.altText || product.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    />
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium text-neutral-900 group-hover:text-[#9e896c] truncate">
                                    {product.title}
                                  </h3>
                                  <p className="text-sm text-neutral-500 mt-0.5">
                                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {!results.collections.length && !filteredAndSortedResults.length && (
                        <div className="text-center py-12">
                          <p className="text-neutral-600">No results found</p>
                          <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';

export default Hero;

// Add this SVG component near the top of the file
const LoadingChair = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-12"
  >
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#9e896c]"
      animate={{
        rotateY: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M7 10h10M7 14h10" />
      <path d="M5 21V8a2 2 0 012-2h10a2 2 0 012 2v13" />
    </motion.svg>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-sm text-[#9e896c] font-medium"
    >
      Loading Collections...
    </motion.p>
    <motion.div
      className="mt-3 h-0.5 w-16 bg-[#9e896c]/20 rounded-full overflow-hidden"
    >
      <motion.div
        className="h-full w-full bg-[#9e896c]"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  </motion.div>
);

