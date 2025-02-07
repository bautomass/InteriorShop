//MobileHeader
'use client';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Collection } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import {
    ArrowRight,
    Clock,
    DollarSign,
    Mail,
    Minus,
    ShoppingCart,
    Sparkles,
    Truck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { HeaderState } from './types';

// Constants
const EXCLUDED_HANDLES: readonly string[] = [
  'all',
  'new-arrivals',
  'top-products',
  'freshfreshfresh',
  'home-collection'
] as const;

const PROMO_INTERVAL = 5000;
const SCROLL_THROTTLE_MS = 16;
const INTERSECTION_THRESHOLD = 0.1;
const CACHE_TIMEOUT = 5 * 60 * 1000;

const promos = [
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

// Memoized Components
const BurgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-7 h-6">
    <span
      className={`absolute left-0 h-[2px] bg-[#6B5E4C] transition-all duration-300 ease-in-out
        ${isOpen ? 'top-3 w-7 rotate-45' : 'top-0.5 w-7'}`}
    />
    <span
      className={`absolute left-0 top-[11px] h-[2px] bg-[#6B5E4C] transition-all duration-300
        ${isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'}`}
    />
    <span
      className={`absolute left-0 h-[2px] bg-[#6B5E4C] transition-all duration-300 ease-in-out
        ${isOpen ? 'top-3 w-7 -rotate-45' : 'top-[21px] w-7'}`}
    />
  </div>
);

// Static Footer Content
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

// Collections Cache Hook
const useCachedCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const cacheKey = 'mobile-hero-collections';
      
      // Try cache first
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TIMEOUT) {
            setCollections(data);
            return;
          }
        }
      } catch (e) {
        console.error('Cache error:', e);
      }

      // Fetch fresh data if needed
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        const filtered = data.collections.filter(
          (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
        );
        
        setCollections(filtered);
        
        // Update cache
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: filtered, timestamp: Date.now() })
          );
        } catch (e) {
          console.error('Cache save error:', e);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  return collections;
};

// Main Header Component
interface MobileHeaderProps {
  className?: string;
}

const MobileHeader = memo(({ className }: MobileHeaderProps) => {
  // Move all hooks to the top
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { cart } = useCart();
  const { updateState: updateHeaderState } = useHeaderState();
  const [state, setState] = useState<HeaderState>({
    isSearchOpen: false,
    isCartOpen: false,
    isNavOpen: false,
    isAccountOpen: false,
    searchQuery: '',
    collections: [],
    currentPromoIndex: 0,
    headerVisible: true,
    lastScrollY: 0,
    isScrolled: false,
    isSearching: false,
    searchResults: {
      collections: [],
      products: []
    },
    expandedSections: {
      'Help & Information': true,
      'Legal': false
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const collections = useCachedCollections();

  // Constants
  const email = 'info@simpleinteriorideas.com';
  const workingHours = 'Mon-Fri: 9-18';

  // Define all callbacks
  const handleScroll = useCallback(
    debounce(() => {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setState(prev => ({
          ...prev,
          headerVisible: currentScrollY < prev.lastScrollY || currentScrollY < 100,
          lastScrollY: currentScrollY,
          isScrolled: currentScrollY > 0
        }));
      });
    }, SCROLL_THROTTLE_MS),
    []
  );

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setState(prev => ({ ...prev, searchResults: { products: [], collections: [] } }));
        return;
      }

      setState(prev => ({ ...prev, isSearching: true }));
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setState(prev => ({ ...prev, searchResults: data }));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setState(prev => ({ ...prev, isSearching: false }));
      }
    }, 300),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setState(prev => ({ ...prev, searchQuery: query }));
    debouncedSearch(query);
  };

  const handlePanelChange = (panel: 'search' | 'account' | 'cart') => {
    setState(prev => ({
      ...prev,
      isSearchOpen: panel === 'search',
      isAccountOpen: panel === 'account',
      isCartOpen: panel === 'cart',
      isNavOpen: false,
      searchQuery: panel === 'search' ? prev.searchQuery : ''
    }));
  };

  const toggleSection = (title: keyof typeof state.expandedSections) => {
    setState(prev => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [title]: !prev.expandedSections[title]
      }
    }));
  };

  // Effects
  useEffect(() => {
    if (collections.length > 0) {
      setState(prev => ({ ...prev, collections }));
    }
  }, [collections]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({ ...prev, currentPromoIndex: (prev.currentPromoIndex + 1) % promos.length }));
    }, PROMO_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (state.isNavOpen || state.isSearchOpen || state.isAccountOpen || state.isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isNavOpen, state.isSearchOpen, state.isAccountOpen, state.isCartOpen]);

  // Icon mapping function
  const getIcon = (handle: string) => {
    return <Minus className="h-4 w-4" />;
  };

  // Early return after all hooks
  if (!isMobile) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] ${className}`}>
      <div 
        className={`w-full backdrop-blur-sm shadow-lg 
          relative border-r-[2px] border-white
          before:absolute before:inset-0 before:-z-10 
          before:bg-[#eaeadf]
          before:border-r-[2px] 
          before:border-black/10
          transition-[background,shadow,transform] duration-500
          ${state.isScrolled 
            ? 'border-b-[2px] rounded-br-[10px] before:border-b-[2px] before:rounded-br-[10px]' 
            : 'border-b-[2px] rounded-br-[10px] before:border-b-[2px] before:rounded-br-[10px]'
          }
          ${(state.isNavOpen || (state.isSearchOpen && state.searchQuery) || state.isAccountOpen || state.isCartOpen) 
            ? 'h-screen' 
            : 'h-auto'
          }`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => setState(prev => ({ ...prev, isNavOpen: !prev.isNavOpen }))}
            className="flex items-center gap-2.5"
            aria-label={state.isNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={state.isNavOpen}
          >
            <BurgerIcon isOpen={state.isNavOpen} />
          </button>

          {/* Icons Section */}
          <div className="flex items-center gap-2">
            {/* Search Icon/Input */}
            <AnimatePresence mode="wait">
              {!state.isSearchOpen ? (
                <motion.button 
                  key="search-icon"
                  onClick={() => handlePanelChange('search')}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Search"
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
                      value={state.searchQuery}
                      onChange={handleSearchInput}
                      placeholder="Search..."
                      className="w-full px-4 py-2 rounded-lg bg-neutral-100/80 
                               placeholder-neutral-500 focus:outline-none focus:ring-2 
                               focus:ring-[#9e896c] text-neutral-900"
                    />
                    <button
                      onClick={() => setState(prev => ({ ...prev, isSearchOpen: false, searchQuery: '' }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 
                               rounded-full hover:bg-neutral-200/80 transition-colors"
                      aria-label="Close search"
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
              aria-label="Account"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => handlePanelChange('cart')}
              className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
              aria-label={`Cart ${cart?.totalQuantity ? `(${cart.totalQuantity} items)` : '(empty)'}`}
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

        {/* Navigation Content */}
        {state.isNavOpen && (
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Promos Section */}
            <div className="w-[calc(100%-3px)] relative h-12 overflow-hidden bg-gradient-to-r from-neutral-50/50 to-white/50 border-b border-neutral-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentPromoIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex items-center justify-center px-4"
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    {(() => {
                      const currentPromo = promos[state.currentPromoIndex % promos.length];
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
                key={`progress-${state.currentPromoIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: PROMO_INTERVAL / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 w-full bg-[#9e896c]/20 origin-left"
              />
            </div>

            {/* Collections Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-3">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    onClick={() => setState(prev => ({ ...prev, isNavOpen: false }))}
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
                ))}
              </div>
            </div>

            {/* Footer Navigation */}
            <FooterSections 
              expandedSections={state.expandedSections} 
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

        {/* Search Results */}
        <AnimatePresence>
          {state.isSearchOpen && state.searchQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-neutral-200 flex-1 overflow-hidden"
            >
              <div className="h-[calc(100vh-80px)] overflow-y-auto overscroll-contain pb-safe-area-inset-bottom">
                <div className="p-4 space-y-6">
                  {/* Loading State */}
                  {state.isSearching && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-[#9e896c] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Results */}
                  {!state.isSearching && (state.searchResults.collections.length > 0 || state.searchResults.products.length > 0) ? (
                    <div className="space-y-8">
                      {/* Collections Section */}
                      {state.searchResults.collections.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-neutral-500 mb-3">Collections</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {state.searchResults.collections.map((collection) => (
                              <Link
                                key={collection.handle}
                                href={`/collections/${collection.handle}`}
                                onClick={() => {
                                  setState(prev => ({ ...prev, isSearchOpen: false, searchQuery: '' }));
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
                      {state.searchResults.products.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-neutral-500 mb-3">Products</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {state.searchResults.products.map((product) => (
                              <Link
                                key={product.handle}
                                href={`/product/${product.handle}`}
                                onClick={() => {
                                  setState(prev => ({ ...prev, isSearchOpen: false, searchQuery: '' }));
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
                  ) : !state.isSearching && state.searchQuery ? (
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
          {state.isAccountOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3 px-4 pt-2">
                <h2 className="text-lg font-medium text-neutral-800">Account</h2>
                <button
                  onClick={() => setState(prev => ({ ...prev, isAccountOpen: false }))}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close account panel"
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
                          setState(prev => ({ ...prev, isAccountOpen: false }));
                        }}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#9e896c] text-white hover:bg-[#8a775d] transition-colors"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setState(prev => ({ ...prev, isAccountOpen: false }));
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
          {state.isCartOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3 px-4 pt-2">
                <h2 className="text-lg font-medium text-neutral-800">Shopping Cart</h2>
                <button
                  onClick={() => setState(prev => ({ ...prev, isCartOpen: false }))}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close cart panel"
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
      </div>
    </div>
  );
});

MobileHeader.displayName = 'MobileHeader';

export default MobileHeader;