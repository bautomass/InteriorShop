'use client';

import { PriceRangeFilter } from '@/components/filter/PriceRangeFilter';
import { SortSelect } from '@/components/filter/SortSelect';
import { SidebarMenu } from '@/components/layout/SidebarMenu';
import { useDebounce } from '@/hooks/use-debounce';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useSearch } from '@/hooks/useSearch';
import type {
  Collection as ShopifyCollection,
  Image as ShopifyImage,
  Product as ShopifyProduct
} from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const formatPrice = (amount: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parseFloat(amount));
};

const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideIn: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  }
} as const;

const mainNavItems = [
  {
    label: 'New Arrivals',
    href: '/collections/new-arrivals',
    featured: true,
    subItems: [
      { label: 'Latest Drops', href: '/collections/latest-drops' },
      { label: 'Coming Soon', href: '/collections/coming-soon' },
      { label: 'Best Sellers', href: '/collections/best-sellers' }
    ]
  },
  {
    label: 'Collections',
    href: '/collections',
    subItems: [
      { label: 'Necklaces', href: '/collections/necklaces' },
      { label: 'Bracelets', href: '/collections/bracelets' },
      { label: 'Rings', href: '/collections/rings' },
      { label: 'Earrings', href: '/collections/earrings' }
    ]
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

// Define Money type
interface LocalMoney {
  amount: string;
  currencyCode?: string;
}

// Update Collection interface to match search results
interface LocalCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
  };
}

// Update Product interface to match search results
interface LocalProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: LocalMoney;
    maxVariantPrice: LocalMoney;
  };
}

// Update SearchResult interface
interface SearchResult {
  products: LocalProduct[];
  collections: LocalCollection[];
}

// Update type guard function
function isShopifyImage(image: unknown): image is ShopifyImage {
  return Boolean(
    image &&
      typeof image === 'object' &&
      'url' in image &&
      'altText' in image &&
      'width' in image &&
      'height' in image &&
      typeof (image as ShopifyImage).url === 'string'
  );
}

// Extended Product type for sorting
interface SortableProduct extends LocalProduct {
  createdAt: string;
}

// Update hasCreatedAt function
function hasCreatedAt(product: LocalProduct): product is SortableProduct {
  return 'createdAt' in product && typeof (product as SortableProduct).createdAt === 'string';
}

// Add these type definitions after the existing interfaces
type PriceRange = 'Under $50' | '$50 - $100' | '$100 - $200' | '$200+' | null;
type SortOption = 'price_asc' | 'price_desc' | 'created_asc' | 'created_desc' | null;

interface HeaderState {
  isScrolled: boolean;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  isCartOpen: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  showSearchModal: boolean;
  searchQuery: string;
  priceRange: PriceRange;
  sortBy: SortOption;
}

// Add these helper functions after the type guards
const renderImage = (image: unknown, alt: string) => {
  if (isShopifyImage(image)) {
    return (
      <Image
        src={image.url}
        alt={image.altText || alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }
  return null;
};

const renderCollectionImage = (collection: LocalCollection | ShopifyCollection, alt: string) => {
  if (!collection.image) return null;

  const imageUrl =
    typeof collection.image === 'object' && 'url' in collection.image ? collection.image.url : null;

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={
        typeof collection.image === 'object' && 'altText' in collection.image
          ? collection.image.altText || alt
          : alt
      }
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const renderProductImage = (product: LocalProduct | ShopifyProduct, alt: string) => {
  if (!product.featuredImage) return null;

  const imageUrl =
    typeof product.featuredImage === 'object' && 'url' in product.featuredImage
      ? product.featuredImage.url
      : null;

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={
        typeof product.featuredImage === 'object' && 'altText' in product.featuredImage
          ? product.featuredImage.altText || alt
          : alt
      }
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
};

// Update type guard for SortableProduct
function isSortableProduct(product: LocalProduct): product is SortableProduct {
  return 'createdAt' in product && typeof (product as SortableProduct).createdAt === 'string';
}

export function NavigationHeader() {
  const { state, updateState } = useHeaderState();
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const modalSearchInputRef = useRef<HTMLInputElement>(null);
  const { cart } = useCart();
  const [isCartHovered, setIsCartHovered] = useState(false);
  const cartTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useDebounce(state.searchQuery, 300);
  const { results, isLoading, error, performSearch } = useSearch();

  // Replace individual state hooks with single state object
  useEffect(() => {
    const handleScroll = () => {
      updateState({ isScrolled: window.scrollY > 20 });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('input')
      ) {
        updateState({
          isSearchOpen: false,
          searchQuery: ''
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [updateState]);

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch, performSearch]);

  const handleModalOpen = () => {
    updateState({ showSearchModal: true });
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    updateState({ showSearchModal: false });
    document.body.style.overflow = '';
  };

  // Update filteredAndSortedResults in NavigationHeader component
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results.products].filter((product): product is ShopifyProduct => {
      return Boolean(
        product &&
          'id' in product &&
          'handle' in product &&
          'title' in product &&
          'priceRange' in product &&
          typeof product.priceRange === 'object' &&
          product.priceRange !== null &&
          'minVariantPrice' in product.priceRange &&
          typeof product.priceRange.minVariantPrice === 'object' &&
          product.priceRange.minVariantPrice !== null &&
          'amount' in product.priceRange.minVariantPrice &&
          'createdAt' in product &&
          typeof (product as any).createdAt === 'string'
      );
    });

    if (state.priceRange) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        switch (state.priceRange) {
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

      switch (state.sortBy) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'created_asc':
          return (
            new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime()
          );
        case 'created_desc':
          return (
            new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [results.products, state.sortBy, state.priceRange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && state.isSearchOpen && state.searchQuery) {
        e.preventDefault();
        handleModalOpen();
      }
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isSearchOpen, state.searchQuery]);

  useEffect(() => {
    if (state.showSearchModal && modalSearchInputRef.current) {
      modalSearchInputRef.current.focus();
    }
  }, [state.showSearchModal]);

  useEffect(() => {
    if (state.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [state.isSidebarOpen]);

  // Add new function to handle cart hover
  const handleCartHover = (isHovering: boolean) => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }

    if (!isHovering) {
      cartTimeoutRef.current = setTimeout(() => {
        setIsCartHovered(false);
      }, 300); // Delay to prevent accidental mouseout
    } else {
      setIsCartHovered(true);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  const renderContent = () => {
    return (
      <div className="relative">
        <header
          className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${state.isScrolled ? 'bg-white/80 shadow-sm backdrop-blur-lg' : 'bg-transparent'}`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between py-4 md:py-6">
              <div className="flex w-1/4 items-center gap-4">
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <nav className="hidden flex-1 items-center justify-center md:flex">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => updateState({ isSidebarOpen: true })}
                    className="text-[#6B5E4C] transition-colors hover:text-[#8C7E6A]"
                  >
                    MENU
                  </button>
                  <Link
                    href="/blog"
                    className="text-[#6B5E4C] transition-colors hover:text-[#8C7E6A]"
                  >
                    BLOG
                  </Link>
                  <Link
                    href="/track-order"
                    className="text-[#6B5E4C] transition-colors hover:text-[#8C7E6A]"
                  >
                    TRACK ORDER
                  </Link>
                  <Link
                    href="/faq"
                    className="text-[#6B5E4C] transition-colors hover:text-[#8C7E6A]"
                  >
                    FAQ'S
                  </Link>
                  <Link
                    href="/support"
                    className="text-[#6B5E4C] transition-colors hover:text-[#8C7E6A]"
                  >
                    SUPPORT
                  </Link>
                </div>
              </nav>

              <div className="flex w-1/4 justify-end">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-20"
                >
                  <div className="flex h-[40px] items-center gap-2 rounded-md bg-[#9e896c]/90 px-3 py-2 shadow-lg backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                      {!state.isSearchOpen && !state.isAccountOpen && !state.isCartOpen ? (
                        <motion.div
                          key="icons"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex items-center gap-2"
                        >
                          <button
                            className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                            aria-label="Search"
                            onClick={() => updateState({ isSearchOpen: true })}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                            aria-label="Profile"
                            onClick={() => updateState({ isAccountOpen: true })}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <div 
                            className="relative"
                            onMouseEnter={() => handleCartHover(true)}
                            onMouseLeave={() => handleCartHover(false)}
                          >
                            <button
                              className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                              aria-label={`Cart with ${cart?.totalQuantity || 0} items`}
                              onClick={() => updateState({ isCartOpen: true })}
                            >
                              <ShoppingCart className="h-5 w-5" />
                              {cart?.totalQuantity ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs font-medium text-[#6B5E4C]"
                                >
                                  {cart.totalQuantity}
                                </motion.span>
                              ) : null}
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
                                      onClick={() => updateState({ isCartOpen: true })}
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
                      ) : state.isSearchOpen ? (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="relative flex items-center justify-between gap-4 pr-2"
                        >
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                            onClick={() => {
                              updateState({
                                isSearchOpen: false,
                                searchQuery: ''
                              });
                            }}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </motion.button>
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex w-full flex-col"
                          >
                            <input
                              type="text"
                              placeholder="Search..."
                              className="w-full appearance-none border-none bg-transparent px-4 py-2 text-white placeholder-white/70 outline-none ring-0 focus:border-none focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent"
                              style={{ WebkitAppearance: 'none', boxShadow: 'none' }}
                              value={state.searchQuery}
                              onChange={(e) => updateState({ searchQuery: e.target.value })}
                              autoFocus
                            />

                            {/* Search Results Dropdown */}
                            {state.isSearchOpen && state.searchQuery && (
                              <motion.div
                                ref={searchDropdownRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full z-50 mt-3 w-[400px] overflow-hidden rounded-lg border border-neutral-200 bg-white/95 shadow-2xl backdrop-blur-md"
                                style={{ marginRight: '-13px' }}
                              >
                                <div className="custom-scrollbar max-h-[60vh] overflow-y-auto">
                                  {results.products.length > 0 || results.collections.length > 0 ? (
                                    <>
                                      <div className="sticky top-0 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md">
                                        <p className="text-sm text-neutral-500">
                                          Found{' '}
                                          {results.products.length + results.collections.length}{' '}
                                          results
                                        </p>
                                      </div>

                                      {/* Collections Section */}
                                      {results.collections.length > 0 && (
                                        <div className="divide-y divide-neutral-100">
                                          <div className="bg-neutral-50 px-4 py-2">
                                            <p className="text-sm font-medium text-neutral-600">
                                              Collections
                                            </p>
                                          </div>
                                          {results.collections.slice(0, 3).map((collection) => (
                                            <Link
                                              key={collection.handle}
                                              href={`/collections/${collection.handle}`}
                                              className="group flex items-center gap-4 p-4 transition-colors hover:bg-neutral-50"
                                              onClick={() => updateState({ isSearchOpen: false })}
                                            >
                                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                                {renderCollectionImage(
                                                  collection,
                                                  collection.title
                                                )}
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                                  {collection.title}
                                                </p>
                                                {collection.description && (
                                                  <p className="mt-0.5 truncate text-sm text-neutral-500">
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
                                        <div className="bg-neutral-50 px-4 py-2">
                                          <p className="text-sm font-medium text-neutral-600">
                                            Products
                                          </p>
                                        </div>
                                        {results.products.slice(0, 5).map((product) => (
                                          <Link
                                            key={product.id}
                                            href={`/products/${product.handle}`}
                                            className="group flex items-center gap-4 p-4 transition-colors hover:bg-neutral-50"
                                            onClick={() => updateState({ isSearchOpen: false })}
                                          >
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                              {renderProductImage(product as any, product.title)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-sm font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                                {product.title}
                                              </p>
                                              <p className="mt-0.5 text-sm text-neutral-500">
                                                $
                                                {parseFloat(
                                                  product.priceRange.minVariantPrice.amount
                                                ).toFixed(2)}
                                              </p>
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="p-8 text-center">
                                      <p className="text-neutral-600">No results found</p>
                                      <p className="mt-1 text-sm text-neutral-400">
                                        Try adjusting your search
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {results.products.length + results.collections.length > 5 && (
                                  <div className="border-t border-neutral-200 bg-neutral-50 p-4">
                                    <button
                                      onClick={() => handleModalOpen()}
                                      className="w-full rounded-lg bg-[#9e896c] px-4 py-2.5 text-center text-sm text-white transition-colors hover:bg-[#8a775d] focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:ring-offset-2"
                                    >
                                      View All{' '}
                                      {results.products.length + results.collections.length} Results
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      ) : state.isCartOpen ? (
                        <motion.div
                          key="cart"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex items-center gap-3 whitespace-nowrap pr-1"
                        >
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                            onClick={() => updateState({ isCartOpen: false })}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </motion.button>
                          <span className="text-sm text-white">
                            {cart?.totalQuantity || 0}{' '}
                            {cart?.totalQuantity === 1 ? 'item' : 'items'}
                          </span>
                          <Link
                            href="/cart"
                            className="text-sm text-white underline-offset-4 hover:underline"
                          >
                            View Cart
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="account"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex items-center gap-2 whitespace-nowrap pr-1"
                        >
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-md p-1 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
                            onClick={() => updateState({ isAccountOpen: false })}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </motion.button>
                          <motion.button
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-white transition-colors hover:text-white/70"
                            onClick={() => {
                              // Add login logic here
                              updateState({ isAccountOpen: false });
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
                              updateState({ isAccountOpen: false });
                            }}
                          >
                            Sign Up
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {state.isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => updateState({ isMobileMenuOpen: false })}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute bottom-0 right-0 top-0 w-[80%] max-w-sm bg-white"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => updateState({ isMobileMenuOpen: false })}
                    className="rounded-full p-2 hover:bg-[#6B5E4C]/5"
                  >
                    <X className="h-6 w-6 text-[#6B5E4C]" />
                  </button>
                </div>
                <nav className="mt-8">
                  {mainNavItems.map((item) => (
                    <div key={item.label} className="mb-4">
                      <Link
                        href={item.href}
                        className={`text-lg font-medium ${
                          item.featured ? 'text-[#B5A48B]' : 'text-[#6B5E4C]'
                        }`}
                        onClick={() => updateState({ isMobileMenuOpen: false })}
                      >
                        {item.label}
                      </Link>
                      {item.subItems && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block text-sm text-[#8C7E6A]"
                              onClick={() => updateState({ isMobileMenuOpen: false })}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}

        {state.showSearchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[50] bg-black/50"
              onClick={handleModalClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] overflow-hidden pb-[10vh] pt-[10vh]"
            >
              <div className="relative mx-auto h-full w-full max-w-4xl">
                <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-xl">
                  <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
                    <div className="p-6">
                      <div className="relative">
                        <input
                          ref={modalSearchInputRef}
                          type="text"
                          placeholder="Search products..."
                          value={state.searchQuery}
                          onChange={(e) => updateState({ searchQuery: e.target.value })}
                          className="w-full rounded-lg bg-neutral-100 px-4 py-3 pr-12 text-lg text-neutral-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e896c]"
                        />
                        <button
                          onClick={handleModalClose}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 px-6 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-48">
                          <SortSelect
                            value={state.sortBy}
                            onChange={(value) => updateState({ sortBy: value })}
                          />
                        </div>
                        <div className="group relative">
                          <button className="rounded-lg bg-neutral-100 px-4 py-2 text-sm transition-colors hover:bg-neutral-200">
                            Price Range
                          </button>
                          <div className="invisible absolute left-0 top-full mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white p-4 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                            <PriceRangeFilter
                              selectedRange={state.priceRange}
                              onChange={(value) => updateState({ priceRange: value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {filteredAndSortedResults.length} results
                      </div>
                    </div>
                  </div>

                  <div className="custom-scrollbar flex-1 overflow-y-auto">
                    <div className="p-6">
                      {results.collections.length > 0 && (
                        <div className="mb-8">
                          <h2 className="mb-4 text-lg font-medium text-neutral-900">Collections</h2>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {results.collections.map((collection) => (
                              <Link
                                key={collection.handle}
                                href={`/collections/${collection.handle}`}
                                onClick={() => updateState({ showSearchModal: false })}
                                className="group overflow-hidden rounded-lg bg-neutral-50 transition-colors hover:bg-neutral-100"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                                  {renderCollectionImage(collection, collection.title)}
                                </div>
                                <div className="p-4">
                                  <h3 className="truncate font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                    {collection.title}
                                  </h3>
                                  {collection.description && (
                                    <p className="mt-1 truncate text-sm text-neutral-500">
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
                          <h2 className="mb-4 text-lg font-medium text-neutral-900">Products</h2>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedResults.map((product) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.handle}`}
                                onClick={() => updateState({ showSearchModal: false })}
                                className="group overflow-hidden rounded-lg bg-neutral-50 transition-colors hover:bg-neutral-100"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                                  {renderProductImage(product, product.title)}
                                </div>
                                <div className="p-4">
                                  <h3 className="truncate font-medium text-neutral-900 group-hover:text-[#9e896c]">
                                    {product.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-neutral-500">
                                    $
                                    {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(
                                      2
                                    )}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {!results.collections.length && !filteredAndSortedResults.length && (
                        <div className="py-12 text-center">
                          <p className="text-neutral-600">No results found</p>
                          <p className="mt-1 text-sm text-neutral-400">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {state.isSidebarOpen && (
          <SidebarMenu
            isOpen={state.isSidebarOpen}
            onClose={() => updateState({ isSidebarOpen: false })}
          />
        )}

        {error && (
          <div className="fixed bottom-4 right-4 rounded-lg bg-red-50 p-4 text-red-600 shadow-lg">
            {error}
          </div>
        )}
      </div>
    );
  };

  return renderContent();
}
