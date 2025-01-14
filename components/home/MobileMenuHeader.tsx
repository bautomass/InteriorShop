//MobileMenuHeader
'use client';

import { useHeaderState } from '@/hooks/useHeaderState';
import { Collection } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import {
  Armchair,
  ArrowRight,
  ArrowUpSquare,
  CircleDot,
  Clock,
  DollarSign,
  Flame,
  Flower2,
  Frame,
  Gift,
  Grid,
  Heart,
  Image as ImageIcon,
  Lamp,
  Mail,
  Package,
  PanelRightClose,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Square,
  Star,
  Tag,
  Truck,
  UtensilsCrossed,
  Wine
} from 'lucide-react';

import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Constants
const EXCLUDED_HANDLES: readonly string[] = [
  'all',
  'new-arrivals',
  'top-products',
  'freshfreshfresh',
  'home-collection'
] as const;

const PROMO_INTERVAL = 5000;

// Types
interface PromoItem {
  id: number;
  text: string;
  icon?: React.ReactNode;
}

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

// Memoize static components
const BurgerIcon = memo(({ isOpen }: { isOpen: boolean }) => (
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
));

BurgerIcon.displayName = 'BurgerIcon';

const LoadingChair = memo(() => (
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
));

LoadingChair.displayName = 'LoadingChair';

// 1. Memoized Icon Components
const IconComponents = {
  Grid: memo(() => <Grid className="h-4 w-4" />),
  Heart: memo(() => <Heart className="h-4 w-4" />),
  ShoppingBasket: memo(() => <ShoppingBasket className="h-4 w-4" />),
  Star: memo(() => <Star className="h-4 w-4" />),
  // ... add other icons as needed
} as const;

// 2. Static Footer Content
const FooterSections = memo(({ expandedSections, toggleSection }: {
  expandedSections: { [key: string]: boolean };
  toggleSection: (title: 'Help & Information' | 'Legal') => void;
}) => (
  <div className="space-y-3 m-2 bg-neutral-50/80 p-4 border border-neutral-100">
    {[
      {
        title: 'Help & Information',
        items: [
          { label: 'FAQs', href: '/faq' },
          { label: 'Shipping Info', href: '/shipping' },
          { label: 'Returns & Exchanges', href: '/returns' }
        ]
      },
      {
        title: 'Legal',
        items: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Cookie Policy', href: '/cookies' }
        ]
      }
    ].map((section) => (
      <div key={section.title} className="space-y-1.5">
        <button 
          onClick={() => toggleSection(section.title as 'Help & Information' | 'Legal')}
          className="w-full flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-500 transition-colors"
        >
          <span>{section.title}</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${expandedSections[section.title as keyof typeof expandedSections] ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <AnimatePresence>
          {expandedSections[section.title as keyof typeof expandedSections] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between py-2 px-3 text-xs text-neutral-600 
                             hover:text-[#9e896c] transition-all duration-200"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ))}
  </div>
));

FooterSections.displayName = 'FooterSections';

// 3. Performance Constants
const SCROLL_THROTTLE_MS = 16;
const INTERSECTION_THRESHOLD = 0.1;
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// 4. Optimized Image Component
const OptimizedImage = memo(({ src, alt, ...props }: ImageProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry?.isIntersecting ?? false),
      { threshold: INTERSECTION_THRESHOLD }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imageRef}>
      {(isIntersecting || props.priority) && (
        <Image
          src={src}
          alt={alt}
          {...props}
          loading={props.priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// 5. Collections Cache Hook
const useCachedCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const cacheKey = 'mobile-hero-collections';

  useEffect(() => {
    const fetchAndCacheCollections = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TIMEOUT) {
            setCollections(data);
            return;
          }
        }

        // Fetch fresh data
        const res = await fetch('/api/collections');
        const data = await res.json();
        const filtered = data.collections.filter(
          (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
        );
        
        setCollections(filtered);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: filtered, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchAndCacheCollections();
  }, []);

  return collections;
};

// Main component
export const MobileHero = memo(() => {
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
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    'Help & Information': true,
    'Legal': false
  });
  const lastScrollY = useRef(0);
  const isVisible = useRef(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Constants
  const email = 'info@simpleinteriorideas.com';
  const workingHours = 'Mon-Fri: 9-18';

  // Throttle scroll handling
  const handleScroll = useCallback(
    debounce(() => {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setHeaderVisible(currentScrollY < lastScrollY.current || currentScrollY < 100);
        lastScrollY.current = currentScrollY;
      });
    }, SCROLL_THROTTLE_MS),
    []
  );

  // Optimized collections fetch
  useEffect(() => {
    if (isNavOpen) {
      const fetchCollections = async () => {
        try {
          const res = await fetch('/api/collections');
          const data = await res.json();
          const filteredCollections = data.collections.filter(
            (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
          );
          setCollections(filteredCollections);
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      };
      fetchCollections();
    }
  }, [isNavOpen]);

  useEffect(() => {
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => {
        const filteredCollections = data.collections.filter(
          (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
        );
        setCollections(filteredCollections);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error prefetching collections:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
    }, PROMO_INTERVAL);

    return () => clearInterval(timer);
  }, []);

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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

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

  const handlePanelChange = (panel: 'search' | 'account' | 'cart') => {
    setIsSearchOpen(false);
    setIsAccountOpen(false);
    setIsCartOpen(false);
    setSearchQuery('');

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

  // Update scroll effect
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (title: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="relative h-[100vh] lg:hidden">
      {/* Update the header container */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[9999] transform transition-transform duration-300
          ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div 
          className={`w-full backdrop-blur-sm shadow-lg 
            relative border-r-[3px] border-white
            before:absolute before:inset-0 before:-z-10 
            before:bg-[#eaeadf]
            before:border-r-[3px] 
            before:border-black/10
            transition-[background,shadow,transform] duration-500
            ${isScrolled 
              ? 'border-b-[3px] rounded-br-[24px] before:border-b-[3px] before:rounded-br-[24px]' 
              : 'border-b-[3px] rounded-br-[24px] before:border-b-[3px] before:rounded-br-[24px]'
            }
            ${(isNavOpen || (isSearchOpen && searchQuery) || isAccountOpen || isCartOpen) 
              ? 'h-screen' 
              : 'h-auto'
            }`}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center gap-2.5"
              aria-label="Toggle menu"
            >
              <BurgerIcon isOpen={isNavOpen} />
              <span 
                className="text-sm font-medium text-neutral-700"
                style={{
                  transition: 'color 0.3s',
                  color: isNavOpen ? '#9e896c' : ''
                }}
              >
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
                                        fill={true}
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
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
                    {cart?.lines && (cart.lines as any[]).length > 0 ? (
                      <div className="space-y-4">
                        {(cart.lines as any[]).map((item: any) => (
                          <div key={item.id} className="flex gap-4 p-3 bg-white rounded-lg border border-neutral-200">
                            {item.merchandise.product.featuredImage && (
                              <div className="relative w-20 h-20 bg-neutral-100 rounded-md overflow-hidden">
                                <Image
                                  src={item.merchandise.product.featuredImage.url}
                                  alt={item.merchandise.product.title}
                                  fill={true}
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
            <div className="flex flex-col h-[calc(100vh-4rem)]">
              {/* Promos Section */}
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
                <div className="grid grid-cols-2 gap-2 p-3">
                  {collections.map((collection) => {
                    // Icon mapping function
                    const getIcon = (handle: string) => {
                      switch (handle.toLowerCase()) {
                        case 'collections':
                          return <Grid className="h-4 w-4" />;
                        case 'accessories':
                          return <Heart className="h-4 w-4" />;
                        case 'baskets-rattan':
                          return <ShoppingBasket className="h-4 w-4" />;
                        case 'best-sellers':
                          return <Star className="h-4 w-4" />;
                        case 'candles-candle-holders':
                          return <Flame className="h-4 w-4" />;
                        case 'canvas':
                          return <ImageIcon className="h-4 w-4" />;
                        case 'carpet-collection':
                          return <Square className="h-4 w-4" />;
                        case 'blinds-shades-collection':
                          return <PanelRightClose className="h-4 w-4" />;
                        case 'dried-flowers':
                          return <Flower2 className="h-4 w-4" />;
                        case 'kitchen-accessories':
                          return <UtensilsCrossed className="h-4 w-4" />;
                        case 'organic-decoration':
                          return <Armchair className="h-4 w-4" />;
                        case 'gift-boxes-1':
                          return <Gift className="h-4 w-4" />;
                        case 'gifts':
                          return <Package className="h-4 w-4" />;
                        case 'lamps':
                          return <Lamp className="h-4 w-4" />;
                        case 'decorative-lantern-collection':
                          return <Flame className="h-4 w-4" />;
                        case 'sale':
                          return <Tag className="h-4 w-4" />;
                        case 'textiles-collection':
                          return <Shirt className="h-4 w-4" />;
                        case 'ceramic-vases':
                          return <Wine className="h-4 w-4" />;
                        case 'wall-decor-collection':
                          return <Frame className="h-4 w-4" />;
                        case 'anturam-eco-wooden-stools':
                          return <ArrowUpSquare className="h-4 w-4" />;
                        default:
                          return <CircleDot className="h-4 w-4" />;
                      }
                    };

                    return (
                      <Link
                        key={collection.handle}
                        href={`/collections/${collection.handle}`}
                        onClick={() => setIsNavOpen(false)}
                        className="group relative block py-3 px-2.5 transition-all duration-300 border-b border-neutral-100/50"
                      >
                        <div className="relative z-10 flex items-center gap-2">
                          <span className="text-neutral-400 group-hover:text-[#9e896c] transition-colors duration-300">
                            {getIcon(collection.handle)}
                          </span>
                          <h3 className="text-[13px] font-medium text-neutral-600 transition-colors duration-300
                                        group-hover:text-[#9e896c] group-hover:translate-x-0.5">
                            {collection.title}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              </div>

              {/* Footer Navigation */}
              <FooterSections 
                expandedSections={expandedSections} 
                toggleSection={toggleSection} 
              />

              {/* Bottom Info Section */}
              <div className="w-[calc(100%-3px)] px-3.5 py-4 mb-[15px] bg-gradient-to-b from-neutral-50/80 
                to-white/80 border-t border-neutral-100 rounded-br-[21px]">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {/* Working Hours */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-[#9e896c]/10 flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 text-[#9e896c]" />
                  </div>
                  <span className="text-xs text-neutral-600 truncate">{workingHours}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 justify-end">
                  <div className="p-1.5 rounded-full bg-[#9e896c]/10 flex-shrink-0">
                    <Mail className="h-3.5 w-3.5 text-[#9e896c]" />
                  </div>
                  <a 
                    href={`mailto:${email}`} 
                    className="text-xs text-neutral-600 hover:text-[#9e896c] transition-colors truncate"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Buttons */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex">
        <Link
          href="/story"
          className="flex-1 py-4 bg-white/90 backdrop-blur-sm text-[#9e896c] 
                     text-sm font-medium hover:bg-[#9e896c] hover:text-white 
                     transition-all duration-300 text-center"
        >
          Our Story
        </Link>
        <Link
          href="/collections/all-products"
          className="flex-1 py-4 bg-[#9e896c]/90 backdrop-blur-sm text-white 
                     text-sm font-medium hover:bg-[#9e896c] 
                     transition-all duration-300 text-center"
        >
          All Products
        </Link>
      </div>

      <OptimizedImage
        src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-image.webp?v=1736699557"
        alt="Mobile Hero"
        fill={true}
        priority
        className="object-cover"
        sizes="100vw"
        quality={90}
      />
    </div>
  );
});

MobileHero.displayName = 'MobileHero';

export default MobileHero;

