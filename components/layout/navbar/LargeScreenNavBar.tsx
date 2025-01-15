//LargeScreenNavBar
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
const currencies: readonly Currency[] = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' }
] as const;

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

// Add BurgerIcon component at the top
const BurgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-6 h-6">
    <span
      className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-200
                ${isOpen ? 'top-3 rotate-45' : 'top-1'}`}
    />
    <span
      className={`absolute left-0 w-full h-0.5 bg-current top-3 
                ${isOpen ? 'opacity-0' : 'opacity-100'} 
                transition-opacity duration-200`}
    />
    <span
      className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-200
                ${isOpen ? 'top-3 -rotate-45' : 'top-5'}`}
    />
  </div>
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => currencies[0]!);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

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
      } finally {
        setIsSearching(false);
      }
    }, 100),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
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
        setIsCartOpen(true);
        break;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
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
  }, []);

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

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    setIsCurrencyOpen(false);
  }, []);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isNavOpen]);

  return (
    <div 
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
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 container mx-auto">
              {/* Left side with Logo and Burger */}
              <div className="flex items-center gap-4">
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
                <Link href="/" className="flex-shrink-0 ml-6">
                  <span className="text-xl font-semibold text-neutral-900">Simple Interior Ideas</span>
                </Link>
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
                      <div className="flex items-center gap-2 text-sm">
                        {promos[currentPromoIndex]?.icon}
                        <span>{promos[currentPromoIndex]?.text}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Icons Section */}
              <div className="flex items-center gap-4">
                {/* Search Icon/Input */}
                <AnimatePresence mode="wait">
                  {!isSearchOpen ? (
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

                {/* Currency Selector */}
                <div className="relative currency-dropdown">
                  <button
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center gap-1 rounded-md p-1 text-sm hover:bg-white/10 transition-colors"
                    aria-label={`Select currency (currently ${selectedCurrency.code})`}
                    aria-expanded={isCurrencyOpen}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>{selectedCurrency.code}</span>
                    <ChevronDown className={`h-3 w-3 transform transition-transform 
                                          duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isCurrencyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full z-50 mt-2 w-24 rounded-md 
                                 bg-white shadow-lg ring-1 ring-black/5"
                      >
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => handleCurrencySelect(currency)}
                            className="flex w-full items-center justify-between px-4 py-2 
                                     text-left text-sm text-gray-900 transition-colors 
                                     hover:bg-gray-100"
                          >
                            <span>{currency.code}</span>
                            {selectedCurrency.code === currency.code && (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/tracking"
                  className="text-sm hover:underline"
                >
                  Track Order
                </Link>

                {/* Account */}
                <button
                  onClick={() => handlePanelChange('account')}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Account"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                  </svg>
                </button>

                {/* Cart with Hover Preview */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleCartHover(true)}
                  onMouseLeave={() => handleCartHover(false)}
                >
                  <button
                    onClick={() => handlePanelChange('cart')}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative"
                    aria-label={`Cart ${cart?.totalQuantity ? `(${cart.totalQuantity} items)` : '(empty)'}`}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {(cart?.totalQuantity ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9e896c] rounded-full 
                                     flex items-center justify-center text-white text-xs">
                        {cart?.totalQuantity ?? 0}
                      </span>
                    )}
                  </button>

                  {/* Cart Preview Popup */}
                  <AnimatePresence>
                    {isCartHovered && cart?.lines && (cart.lines as any[]).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-lg shadow-xl z-50"
                      >
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
                                      sizes="80px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-neutral-900">
                                    {item.merchandise.product.title}
                                  </h4>
                                  <p className="text-sm text-neutral-500 mt-1">
                                    {item.merchandise.title}
                                  </p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-neutral-500">
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="text-sm font-medium text-neutral-900">
                                      ${parseFloat(item.cost.totalAmount.amount).toFixed(2)}
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
                                ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full py-2 bg-white border border-[#9e896c] text-[#9e896c] 
                                         rounded-lg hover:bg-[#9e896c]/5 transition-colors text-sm font-medium"
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
                                className="w-full py-2 bg-[#9e896c] text-white rounded-lg 
                                         hover:bg-[#8a775d] transition-colors text-sm font-medium
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Checkout
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Navigation Menu Content */}
            <AnimatePresence>
              {isNavOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-hidden border-t border-neutral-200"
                >
                  <div className="container mx-auto p-4">
                    <div className="flex gap-8">
                      {/* Left side - Collections Grid */}
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          {collections.map((collection) => (
                            <Link
                              key={collection.handle}
                              href={`/collections/${collection.handle}`}
                              onClick={() => setIsNavOpen(false)}
                              className="group relative block py-3 px-4 rounded-lg transition-all duration-300
                                       hover:bg-neutral-50 border border-transparent hover:border-neutral-100"
                            >
                              <div className="relative z-10 flex items-center gap-2">
                                <span className="text-neutral-400 group-hover:text-[#9e896c] transition-colors duration-300">
                                  {getIcon(collection.handle)}
                                </span>
                                <h3 className="text-sm font-medium text-neutral-600 transition-colors duration-300
                                           group-hover:text-[#9e896c]">
                                  {collection.title}
                                </h3>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="w-[320px] border-l border-neutral-100 pl-8">
                        <div className="space-y-8">
                          {/* Shop Section */}
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-400 mb-3">Shop</h3>
                            <ul className="space-y-2">
                              <li>
                                <Link href="/products" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  All Products
                                </Link>
                              </li>
                              <li>
                                <Link href="/collections/new-arrivals" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  New Arrivals
                                </Link>
                              </li>
                              <li>
                                <Link href="/collections/best-sellers" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Best Sellers
                                </Link>
                              </li>
                              <li>
                                <Link href="/collections" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Collections
                                </Link>
                              </li>
                              <li>
                                <Link href="/collections/sale" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Sale Items
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* Support Section */}
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-400 mb-3">Support</h3>
                            <ul className="space-y-2">
                              <li>
                                <Link href="/contact" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Contact Us
                                </Link>
                              </li>
                              <li>
                                <Link href="/faqs" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  FAQs
                                </Link>
                              </li>
                              <li>
                                <Link href="/shipping" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Shipping Info
                                </Link>
                              </li>
                              <li>
                                <Link href="/returns" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Returns & Exchanges
                                </Link>
                              </li>
                              <li>
                                <Link href="/tracking" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Track Order
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* Company Section */}
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-400 mb-3">Company</h3>
                            <ul className="space-y-2">
                              <li>
                                <Link href="/about" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  About Us
                                </Link>
                              </li>
                              <li>
                                <Link href="/our-story" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Our Story
                                </Link>
                              </li>
                              <li>
                                <Link href="/sustainability" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Sustainability
                                </Link>
                              </li>
                              <li>
                                <Link href="/careers" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Careers
                                </Link>
                              </li>
                              <li>
                                <Link href="/terms" className="text-neutral-600 hover:text-[#9e896c] transition-colors text-sm">
                                  Terms of Service
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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

                      {/* Results */}
                      {!isSearching && (searchResults.collections.length > 0 || searchResults.products.length > 0) ? (
                        <div className="space-y-8">
                          {/* Collections Section */}
                          {searchResults.collections.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium text-neutral-500 mb-3">Collections</h3>
                              <div className="grid grid-cols-3 gap-4">
                                {searchResults.collections.map((collection) => (
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
                                {searchResults.products.map((product) => (
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
                                          fill={true}
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
          </div>
        </div>
      </div>
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