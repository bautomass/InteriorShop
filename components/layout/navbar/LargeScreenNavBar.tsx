// components/layout/navbar/LargeScreenNavBar.tsx
'use client';

import { useHeaderState } from '@/hooks/useHeaderState';
import { Collection } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import {
  Armchair,
  ArrowUpSquare,
  Check,
  ChevronDown,
  CircleDot,
  DollarSign,
  Flame,
  Flower2,
  Frame,
  Gift,
  Grid,
  Heart,
  Image as ImageIcon,
  Lamp,
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

import { AccountModal } from '@/components/AccountModal';
import type { CurrencyCode } from '@/lib/currency';
import { CURRENCY_CONFIG } from '@/lib/currency';
import { useAuth } from '@/providers/AuthProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

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

interface Currency {
  code: string;
  symbol: string;
}

// Constants
const currencies: { code: CurrencyCode }[] = [
  { code: 'EUR' },
  { code: 'USD' },
  { code: 'GBP' },
  { code: 'CAD' },
  { code: 'AUD' },
  { code: 'JPY' }
];

const promos: PromoItem[] = [
  {
    id: 1,
    text: "Use Code: 'WINTER25' At Checkout For 10% off",
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

// Loading Component
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

// Update BurgerIcon component
const BurgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-7 h-6">
    <span
      className={`absolute left-0 h-[2px] bg-[#6B5E4C] transition-all duration-300 ease-in-out
        ${isOpen ? 'top-3 w-7 rotate-45' : 'top-0.5 w-7 group-hover:w-5'}`}
    />
    <span
      className={`absolute left-0 top-[11px] h-[2px] bg-[#6B5E4C] transition-all duration-300
        ${isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'}`}
    />
    <span
      className={`absolute left-0 h-[2px] bg-[#6B5E4C] transition-all duration-300 ease-in-out
        ${isOpen ? 'top-3 w-7 -rotate-45' : 'top-[21px] w-7 group-hover:w-6'}`}
    />
  </div>
);

// New Component Definitions
const CollectionGridItem = ({ collection, onClose }: { collection: Collection; onClose: () => void }) => (
  <Link
    href={`/collections/${collection.handle}`}
    onClick={onClose}
    className="group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
               hover:bg-neutral-50"
  >
    <span className="flex-shrink-0 p-2 rounded-md bg-neutral-50 text-neutral-500
                    group-hover:bg-white group-hover:text-[#9e896c] transition-colors duration-200">
      {getIcon(collection.handle)}
    </span>
    <div>
      <h3 className="text-sm font-medium text-neutral-700 group-hover:text-[#9e896c] 
                     transition-colors duration-200">
        {collection.title}
      </h3>
    </div>
  </Link>
);

const SidebarLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="flex items-center gap-2 text-neutral-600 hover:text-[#9e896c] 
             transition-colors text-sm py-1 px-2 rounded-md hover:bg-neutral-50
             group relative"
  >
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 
                   bg-[#9e896c] transition-all duration-300 opacity-0 
                   group-hover:h-3 group-hover:opacity-100" />
    {children}
  </Link>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-neutral-400 mb-1 px-2">
    {children}
  </h3>
);

export const DesktopHeader = () => {
  // State
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
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const { currency, setCurrency, isLoading, formatPrice } = useCurrency();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'relevance',
    collections: [] as string[]
  });
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Constants
  const email = 'info@simpleinteriorideas.com';
  const workingHours = 'Mon-Fri: 9-18';

  // Effects
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

  // Search handler
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
        setSearchResults({ products: [], collections: [] });
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults({ products: [], collections: [] });
      return;
    }
    
    debouncedSearch(query);
  };

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
        if ((cart?.lines as any[])?.length > 0) {
          setIsCartOpen(true);
        }
        break;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Don't hide header when menu is open
      if (isNavOpen || isSearchOpen || isAccountOpen || isCartOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      
      // Show header if scrolling up or at top
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } 
      // Hide header if scrolling down and not at top
      else if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }

      setIsScrolled(currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavOpen, isSearchOpen, isAccountOpen, isCartOpen]);

  useEffect(() => {
    if (isNavOpen || isSearchOpen || isAccountOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
      // Store the current scroll position
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore the scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isNavOpen, isSearchOpen, isAccountOpen, isCartOpen]);

  const handleCartHover = (isHovering: boolean) => {
    setIsCartHovered(isHovering);
  };

  // Currency handlers
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.currency-dropdown')) {
      setIsCurrencyOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  const handleCurrencySelect = useCallback((selectedCurrency: CurrencyCode) => {
    setCurrency(selectedCurrency);
    setIsCurrencyOpen(false);
  }, [setCurrency]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="navbar"
      className={`hidden lg:block relative ${
        (isNavOpen || (isSearchOpen && searchQuery) || isAccountOpen || isCartOpen) 
          ? 'h-[100vh]' 
          : 'h-auto'
      }`}
    >
      <div 
        className={`fixed top-0 left-0 right-0 z-[9999] transform transition-transform duration-300
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div 
          className={`w-full backdrop-blur-sm shadow-lg px-8
            relative border-r-[2px] border-white
            before:absolute before:inset-0 before:-z-10 
            before:bg-[#eaeadf]
            before:border-r-[2px] 
            before:border-black/10
            transition-[background,shadow,transform] duration-500
            ${isScrolled 
              ? 'border-b-[2px] rounded-br-[10px] before:border-b-[2px] before:rounded-br-[10px]' 
              : 'border-b-[2px] rounded-br-[10px] before:border-b-[2px] before:rounded-br-[10px]'
            }
            ${(isNavOpen || (isSearchOpen && searchQuery) || isAccountOpen || isCartOpen) 
              ? 'h-screen' 
              : 'h-auto'
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between py-2 container mx-auto">
              {/* Left side with Logo and Burger */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex-shrink-0 ml-0">
                  <Image
                    src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/LOGO-SVG.svg?v=1738779893"
                    alt="Simple Interior Ideas"
                    width={190}
                    height={45}
                    className="h-10 w-auto"
                    priority
                  />
                </Link>
                <div className="h-6 w-px bg-neutral-300"></div>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="flex items-center gap-1 group"
                  aria-label={isNavOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isNavOpen}
                >
                  <BurgerIcon isOpen={isNavOpen} />
                  {isNavOpen && (
                    <span 
                      className="font-serif text-sm tracking-widest transition-colors duration-300 text-[#6B5E4C]"
                    >
                      Close
                    </span>
                  )}
                </button>
              </div>

              {/* Center Promos Section */}
              <div className="flex-1 max-w-md mx-auto">
                <div className="relative h-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPromoIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="flex items-center gap-2 text-sm text-[#6B5E4C]">
                        {promos[currentPromoIndex]?.icon}
                        <span>{promos[currentPromoIndex]?.text}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Icons Section */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Search Icon/Input */}
                <AnimatePresence mode="wait">
                  {!isSearchOpen ? (
                    <motion.button 
                      key="search-icon"
                      onClick={() => handlePanelChange('search')}
                      className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#6B5E4C]"
                      aria-label="Open search"
                      aria-expanded={isSearchOpen}
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
                      className="flex-1 min-w-[280px]"
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

                {/* Account */}
                <div className="relative text-[#6B5E4C]" ref={accountDropdownRef}>
                  <div 
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      if (user) {
                        setIsAccountDropdownOpen(!isAccountDropdownOpen);
                      } else {
                        setIsAccountModalOpen(true);
                      }
                    }}
                  >
                    <button
                      className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative"
                      aria-label={user ? 'Account menu' : 'Sign in'}
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                      </svg>
                      {user && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#9e896c] rounded-full" />
                      )}
                    </button>

                    {/* User Name - Only shown when logged in */}
                    {user && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-neutral-700 hover:text-[#9e896c] transition-colors">
                          {`Hello, ${user.firstName || 'Account'}`}
                        </span>
                        <ChevronDown className={`h-3 w-3 transform transition-transform duration-200 
                          ${isAccountDropdownOpen ? 'rotate-180' : ''} text-[#6B5E4C]`} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Account Dropdown Menu */}
                  {user && isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg 
                                 border border-neutral-200 z-50"
                    >
                      <div className="p-4 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {`${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          We're glad to have you here, {user.firstName}!
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Account Settings
                        </Link>
                        
                        <Link
                          href="/account/orders"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Order History
                        </Link>
                        
                        <button
                          onClick={async () => {
                            try {
                              await signOut();
                              setIsAccountDropdownOpen(false);
                            } catch (error) {
                              console.error('Error signing out:', error);
                            }
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Cart with Hover Preview */}
                <div 
                  className="relative text-[#6B5E4C]"
                  onMouseEnter={() => handleCartHover(true)}
                  onMouseLeave={() => handleCartHover(false)}
                >
                  <button
                    onClick={() => {
                      if ((cart?.lines as any[])?.length > 0) {
                        handlePanelChange('cart');
                      }
                    }}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative"
                    aria-label={`Cart ${cart?.totalQuantity ? `(${cart.totalQuantity} items)` : '(empty)'}`}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {(cart?.totalQuantity ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6B5E4C] rounded-full 
                                     flex items-center justify-center text-white text-xs">
                        {cart?.totalQuantity ?? 0}
                      </span>
                    )}
                  </button>

                  {/* Cart Preview Popup */}
                  <AnimatePresence>
                    {isCartHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -right-[200px] top-full mt-1 w-[400px] bg-white rounded-lg shadow-xl z-50"
                      >
                        {/* Triangle Arrow */}
                        <div 
                          className="absolute -top-2 right-[215px]
                                     w-0 h-0 border-l-[8px] border-l-transparent 
                                     border-r-[8px] border-r-transparent 
                                     border-b-[8px] border-b-white
                                     z-10"
                        />
                        {cart?.lines && (cart.lines as any[]).length > 0 ? (
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-neutral-900">Cart</h3>
                              <span className="text-sm text-neutral-500">
                                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
                              </span>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                              {(cart.lines as any[]).map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                  {item.merchandise.product.featuredImage && (
                                    <div className="relative w-20 h-20 bg-neutral-100 rounded-md overflow-hidden">
                                      <Image
                                        src={item.merchandise.product.featuredImage.url}
                                        alt={item.merchandise.product.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-neutral-900">
                                      {item.merchandise.product.title}
                                    </h4>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      {item.merchandise.title}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-xs text-neutral-500">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="text-sm font-medium text-neutral-900">
                                        {formatPrice(parseFloat(item.cost.totalAmount.amount))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-neutral-200">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium text-neutral-600">Subtotal</span>
                                <span className="text-base font-medium text-neutral-900">
                                  {formatPrice(parseFloat(cart.cost.totalAmount.amount))}
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <Link
                                  href="/cart"
                                  className="block w-full py-2 bg-white border border-[#9e896c] text-[#9e896c] 
                                          rounded-lg hover:bg-[#9e896c]/5 transition-colors text-sm font-medium text-center"
                                  aria-label="View cart details"
                                >
                                  View Cart
                                </Link>
                                <button
                                  onClick={() => {
                                    if (cart?.checkoutUrl) {
                                      window.location.href = cart.checkoutUrl;
                                    }
                                  }}
                                  disabled={!cart?.checkoutUrl}
                                  className="w-full py-2 bg-[#9e896c] text-white rounded-lg 
                                           hover:bg-[#8a775d] transition-colors text-sm font-medium
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Proceed to checkout"
                                >
                                  Checkout
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <div className="mb-4">
                              <ShoppingCart className="w-12 h-12 mx-auto text-neutral-300" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">
                              Your Cart is Empty
                            </h3>
                            <p className="text-sm text-neutral-600 mb-6">
                              Discover our beautiful collections, <br/>find something for your home
                            </p>
                            <Link
                              href="/collections/all-products"
                              className="inline-block px-6 py-2 bg-[#9e896c] text-white rounded-lg 
                                       hover:bg-[#8a775d] transition-colors text-sm font-medium"
                            >
                              Start Shopping
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Separator Line */}
                <div className="h-6 w-px bg-neutral-300"></div>

                {/* Currency Selector */}
                <div className="relative currency-dropdown" 
                     onMouseEnter={() => setIsCurrencyOpen(true)} 
                     onMouseLeave={() => setIsCurrencyOpen(false)}>
                  <button
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
                               hover:bg-black/5 transition-colors disabled:opacity-50
                               text-[#6B5E4C]"
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-[#6B5E4C]">
                      {CURRENCY_CONFIG[currency].symbol}
                    </span>
                    <span>{currency}</span>
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-[#6B5E4C] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronDown className={`h-3 w-3 transform transition-transform duration-200 
                        ${isCurrencyOpen ? 'rotate-180' : ''} text-[#6B5E4C]`} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isCurrencyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 mt-1 w-36 right-[-20px]"
                      >
                        {/* Triangle Arrow */}
                        <div 
                          className="absolute -top-2 left-1/2 -translate-x-1/2 
                                     w-0 h-0 border-l-[8px] border-l-transparent 
                                     border-r-[8px] border-r-transparent 
                                     border-b-[8px] border-b-white"
                        />
                        
                        {/* Dropdown Content */}
                        <div className="relative bg-white rounded-lg shadow-lg ring-1 ring-black/5
                                      backdrop-blur-sm overflow-hidden">
                          <div className="p-1">
                            {currencies.map((curr) => (
                              <button
                                key={curr.code}
                                onClick={() => {
                                  setCurrency(curr.code);
                                  setIsCurrencyOpen(false);
                                }}
                                disabled={isLoading}
                                className={`flex w-full items-center justify-between px-3 py-2 text-left 
                                           text-sm transition-colors rounded-md
                                           ${currency === curr.code 
                                             ? 'bg-[#6B5E4C]/10 text-[#6B5E4C] font-medium' 
                                             : 'text-neutral-700 hover:bg-neutral-50'
                                           }
                                           disabled:opacity-50`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={currency === curr.code ? 'text-[#6B5E4C]' : 'text-neutral-500'}>
                                    {CURRENCY_CONFIG[curr.code].symbol}
                                  </span>
                                  <span>{curr.code}</span>
                                </div>
                                {currency === curr.code && (
                                  <Check className="h-4 w-4 text-[#6B5E4C]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/track-order"
                  className="text-sm hover:underline text-[#6B5E4C]"
                >
                  Track Order
                </Link>
              </div>
            </div>

            {/* Navigation Menu Content */}
            <AnimatePresence>
              {isNavOpen && (
                <div className="flex-1 overflow-hidden border-t border-neutral-200">
                  <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-between">
                      {/* Left side - Collections Grid */}
                      <div className="w-[400px] flex-shrink-0">
                        <h2 className="text-base font-medium text-neutral-900 mb-4">Our Collections</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                          {collections.map((collection) => (
                            <CollectionGridItem 
                              key={collection.handle}
                              collection={collection}
                              onClose={() => setIsNavOpen(false)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Center - Special Products */}
                      <div className="flex-1 min-w-[500px] max-w-[800px] border-l border-r border-neutral-100 px-8 mx-8 relative">
                        <div className="w-[500px] mx-auto">
                          <div className="space-y-6">
                            <div className="featured-container">
                              <h2 className="text-lg text-neutral-900 mb-1">Featured</h2>
                            </div>
                            {/* New Arrivals Box */}
                            <Link
                              href="/collections/new-arrivals"
                              onClick={() => setIsNavOpen(false)}
                              className="block group relative overflow-hidden rounded-lg bg-neutral-50 aspect-[3/2]"
                            >
                              <Image
                                src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/menu-image-2.jpg?v=1737895114"
                                alt="New Arrivals"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent h-32">
                                <span className="px-2 py-1 bg-[#9e896c] text-white text-xs rounded-full w-fit mb-2">
                                  New In
                                </span>
                                <h3 className="text-base font-medium text-white">New Arrivals</h3>
                                <p className="text-xs text-white/90 mt-1">Spring Collection 2024</p>
                              </div>
                            </Link>

                            {/* Sale Box */}
                            <Link
                              href="/collections/sale"
                              onClick={() => setIsNavOpen(false)}
                              className="block group relative overflow-hidden rounded-lg bg-neutral-50 aspect-[3/2]"
                            >
                              <Image
                                src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/menu-image.jpg?v=1737895114"
                                alt="Special Offers"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent h-32">
                                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full w-fit mb-2">
                                  Sale
                                </span>
                                <h3 className="text-base font-medium text-white">Special Offers</h3>
                                <p className="text-xs text-white/90 mt-1">Up to 50% off</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="w-[280px] flex-shrink-0">
                        <div className="space-y-4">
                          {/* Shop Section */}
                          <div>
                            <SectionTitle>Shop</SectionTitle>
                            <div className="space-y-0">
                              <SidebarLink href="/products">All Products</SidebarLink>
                              <SidebarLink href="/collections/new-arrivals">
                                New Arrivals
                                <span className="ml-1 text-xs py-0.5 px-1.5 bg-[#9e896c]/10 text-[#9e896c] rounded-full">
                                  New
                                </span>
                              </SidebarLink>
                              <SidebarLink href="/collections/best-sellers">Best Sellers</SidebarLink>
                              <SidebarLink href="/collections">Collections</SidebarLink>
                              <SidebarLink href="/collections/sale">
                                Sale Items
                                <span className="ml-1 text-xs py-0.5 px-1.5 bg-red-50 text-red-500 rounded-full">
                                  Sale
                                </span>
                              </SidebarLink>
                            </div>
                          </div>

                          {/* Support Section */}
                          <div>
                            <SectionTitle>Support</SectionTitle>
                            <div className="space-y-0">
                              <SidebarLink href="/contact">Contact Us</SidebarLink>
                              <SidebarLink href="/faqs">FAQs</SidebarLink>
                              <SidebarLink href="/shipping">Shipping Info</SidebarLink>
                              <SidebarLink href="/returns">Returns & Exchanges</SidebarLink>
                              <SidebarLink href="/tracking">Track Order</SidebarLink>
                            </div>
                          </div>

                          {/* Company Section */}
                          <div>
                            <SectionTitle>Company</SectionTitle>
                            <div className="space-y-0">
                              <SidebarLink href="/about">About Us</SidebarLink>
                              <SidebarLink href="/our-story">Our Story</SidebarLink>
                              <SidebarLink href="/sustainability">Sustainability</SidebarLink>
                              <SidebarLink href="/careers">Careers</SidebarLink>
                              <SidebarLink href="/terms">Terms of Service</SidebarLink>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="pt-3 mt-3 border-t border-neutral-100">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className="p-1 bg-neutral-50 rounded-md">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </span>
                                <span className="text-sm">{email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className="p-1 bg-neutral-50 rounded-md">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </span>
                                <span className="text-sm">{workingHours}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Search Results Section */}
            <AnimatePresence>
              {isSearchOpen && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-hidden border-t border-neutral-200"
                >
                  <div className="container mx-auto p-4">
                    <div className="h-[calc(100vh-6rem)] overflow-y-auto">
                      {/* Loading State */}
                      {isSearching && (
                        <div className="flex justify-center py-4">
                          <div className="w-6 h-6 border-2 border-[#9e896c] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Results with Filters */}
                      {!isSearching && (searchResults.collections.length > 0 || searchResults.products.length > 0) ? (
                        <div className="space-y-8">
                          {/* Search Filters */}
                          <div className="sticky top-0 z-10 bg-white p-2 border border-[#9e896c]/20">
                            <div className="flex items-center gap-6">
                              {/* Price Range Filter */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#9e896c]">Price:</span>
                                <select 
                                  value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
                                  onChange={(e) => {
                                    const [min, max] = e.target.value.split('-').map(Number).filter((n): n is number => !isNaN(n));
                                    setFilters(prev => ({ ...prev, priceRange: [min || 0, max || 1000] }));
                                  }}
                                  className="text-sm border-2 border-[#9e896c]/20 rounded-md px-2 py-1 bg-white hover:border-[#9e896c]/40 focus:border-[#9e896c] focus:outline-none transition-colors duration-200 cursor-pointer font-medium"
                                >
                                  <option value="0-1000">All Prices</option>
                                  <option value="0-50">Under {CURRENCY_CONFIG[currency].symbol}50</option>
                                  <option value="50-100">{CURRENCY_CONFIG[currency].symbol}50 - {CURRENCY_CONFIG[currency].symbol}100</option>
                                  <option value="100-200">{CURRENCY_CONFIG[currency].symbol}100 - {CURRENCY_CONFIG[currency].symbol}200</option>
                                  <option value="200-1000">{CURRENCY_CONFIG[currency].symbol}200+</option>
                                </select>
                              </div>

                              {/* Sort Filter */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#9e896c]">Sort by:</span>
                                <select
                                  value={filters.sortBy}
                                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                  className="text-sm border-2 border-[#9e896c]/20 rounded-md px-2 py-1 bg-white hover:border-[#9e896c]/40 focus:border-[#9e896c] focus:outline-none transition-colors duration-200 cursor-pointer font-medium"
                                >
                                  <option value="relevance">Relevance</option>
                                  <option value="price-low-high">Price: Low to High</option>
                                  <option value="price-high-low">Price: High to Low</option>
                                  <option value="newest">Newest</option>
                                </select>
                              </div>

                              {/* Results Count */}
                              <div className="ml-auto text-sm font-medium text-neutral-700 bg-[#9e896c]/10 px-2 py-1 rounded-md">
                                {searchResults.products.length + searchResults.collections.length} results
                              </div>
                            </div>
                          </div>

                          {/* Collections Section */}
                          {searchResults.collections.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium text-neutral-500 mb-3">Collections</h3>
                              <div className="grid grid-cols-3 gap-4">
                                {searchResults.collections
                                  .filter(collection => 
                                    filters.collections.length === 0 || 
                                    filters.collections.includes(collection.title)
                                  )
                                  .map((collection) => (
                                    <Link
                                      key={collection.handle}
                                      href={`/collections/${collection.handle}`}
                                      onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                      }}
                                      className="group block p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
                                    >
                                      <h4 className="text-sm font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                        {collection.title}
                                      </h4>
                                      {collection.description && (
                                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
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
                              <div className="grid grid-cols-4 gap-4">
                                {searchResults.products
                                  .filter(product => {
                                    const price = parseFloat(product?.priceRange?.minVariantPrice?.amount ?? '0');
                                    return (
                                      price >= (filters?.priceRange?.[0] ?? 0) &&
                                      price <= (filters?.priceRange?.[1] ?? 1000) &&
                                      (filters?.collections?.length === 0 ||
                                        filters?.collections.some(c => 
                                          product.collections?.some((pc: any) => pc.title === c)
                                        ))
                                    );
                                  })
                                  .sort((a, b) => {
                                    const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount ?? '0');
                                    const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount ?? '0');
                                    
                                    switch (filters.sortBy) {
                                      case 'price-low-high':
                                        return priceA - priceB;
                                      case 'price-high-low':
                                        return priceB - priceA;
                                      case 'newest':
                                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                      default:
                                        return 0;
                                    }
                                  })
                                  .map((product) => (
                                    <Link
                                      key={product.handle}
                                      href={`/product/${product.handle}`}
                                      onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                      }}
                                      className="group block overflow-hidden rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
                                    >
                                      {product.featuredImage && (
                                        <div className="relative aspect-square bg-neutral-100">
                                          <Image
                                            src={product.featuredImage.url}
                                            alt={product.featuredImage.altText || product.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1280px) 25vw, 20vw"
                                          />
                                        </div>
                                      )}
                                      <div className="p-3">
                                        <h4 className="text-sm font-medium text-neutral-900 group-hover:text-[#9e896c] line-clamp-1">
                                          {product.title}
                                        </h4>
                                        <p className="text-sm text-neutral-500 mt-1">
                                          {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
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
                          <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AccountModal 
        isOpen={!user && isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

// Helper function for collection icons
const getIcon = (handle: string) => {
  switch (handle.toLowerCase()) {
    case 'collections':
      return <Grid className="h-5 w-5" />;
    case 'accessories':
      return <Heart className="h-5 w-5" />;
    case 'baskets-rattan':
      return <ShoppingBasket className="h-5 w-5" />;
    case 'best-sellers':
      return <Star className="h-5 w-5" />;
    case 'candles-candle-holders':
      return <Flame className="h-5 w-5" />;
    case 'canvas':
      return <ImageIcon className="h-5 w-5" />;
    case 'carpet-collection':
      return <Square className="h-5 w-5" />;
    case 'blinds-shades-collection':
      return <PanelRightClose className="h-5 w-5" />;
    case 'dried-flowers':
      return <Flower2 className="h-5 w-5" />;
    case 'kitchen-accessories':
      return <UtensilsCrossed className="h-5 w-5" />;
    case 'organic-decoration':
      return <Armchair className="h-5 w-5" />;
    case 'gift-boxes-1':
      return <Gift className="h-5 w-5" />;
    case 'gifts':
      return <Package className="h-5 w-5" />;
    case 'lamps':
      return <Lamp className="h-5 w-5" />;
    case 'decorative-lantern-collection':
      return <Flame className="h-5 w-5" />;
    case 'sale':
      return <Tag className="h-5 w-5" />;
    case 'textiles-collection':
      return <Shirt className="h-5 w-5" />;
    case 'ceramic-vases':
      return <Wine className="h-5 w-5" />;
    case 'wall-decor-collection':
      return <Frame className="h-5 w-5" />;
    case 'anturam-eco-wooden-stools':
      return <ArrowUpSquare className="h-5 w-5" />;
    default:
      return <CircleDot className="h-5 w-5" />;
  }
};

export default DesktopHeader;

