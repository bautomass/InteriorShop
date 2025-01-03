//components/home/hero.tsx
'use client';

import { PriceRangeFilter } from '@/components/filter/PriceRangeFilter';
import { SortSelect } from '@/components/filter/SortSelect';
import { useDebounce } from '@/hooks/use-debounce';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useSearch } from '@/hooks/useSearch';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

const slideContent = {
  image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile_image_banner.jpg',
  mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile_banner_simple_interior_ideas_ec3c6bf6-8b9a-47e4-be91-214ef01ede8f.jpg',
  lampImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/lamp-el.svg',
  alt: 'Simple Interior Ideas',
};

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

function Hero() {
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

  return (
    <>
      <div className={`${isModalOpen ? 'blur-sm transition-all duration-200' : ''}`}>
        <section className="relative min-h-screen w-full overflow-hidden">
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeLinecap="round"/>
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
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs font-medium text-[#6B5E4C]"
                            >
                              {cart?.totalQuantity ?? 0}
                            </motion.span>
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
                            className="absolute right-0 top-12 w-[280px] md:w-[400px] rounded-lg bg-white p-4 shadow-xl ring-1 ring-black/5"
                            onMouseEnter={() => handleCartHover(true)}
                            onMouseLeave={() => handleCartHover(false)}
                          >
                            <div className="mb-3 flex justify-between text-sm font-medium text-[#6B5E4C]">
                              <span>Cart ({cart.totalQuantity})</span>
                              <span>{formatPrice(cart.cost.totalAmount.amount)}</span>
                            </div>
                            
                            <div className="max-h-[40vh] md:max-h-64 space-y-3 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#6B5E4C]/20">
                              {cart.lines.map((item) => (
                                <motion.div
                                  key={item.id}
                                  layout
                                  className="flex gap-2 md:gap-3 rounded-md p-2 hover:bg-[#6B5E4C]/5"
                                >
                                  {item.merchandise.product.featuredImage && (
                                    <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <Image
                                        src={item.merchandise.product.featuredImage.url}
                                        alt={item.merchandise.product.title}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 768px) 64px, 56px"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-[#6B5E4C] line-clamp-1">
                                      {item.merchandise.product.title}
                                    </p>
                                    <p className="text-xs text-[#8C7E6A] line-clamp-1">
                                      {item.merchandise.title}
                                    </p>
                                    <div className="mt-1 flex items-center justify-between">
                                      <span className="text-xs text-[#6B5E4C]">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="text-xs md:text-sm font-medium text-[#6B5E4C]">
                                        {formatPrice(item.cost.totalAmount.amount)}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            <div className="mt-4 space-y-2">
                              <button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full rounded-md bg-[#6B5E4C] px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white transition-colors hover:bg-[#5A4D3B]"
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
                                className="w-full rounded-md bg-[#6B5E4C]/10 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[#6B5E4C] transition-colors hover:bg-[#6B5E4C]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                                            src={product.featuredImage.url}
                                            alt={product.featuredImage.altText || product.title}
                                            fill
                                            sizes="64px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
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

          {/* Main Hero Content */}
          <div className="relative h-screen w-full">
            {/* Background Image */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={slideContent.image}
                alt={slideContent.alt}
                fill
                priority
                quality={90}
                className="hidden object-cover md:block"
                sizes="100vw"
              />
              <Image
                src={slideContent.mobileImage}
                alt={slideContent.alt}
                fill
                priority
                quality={90}
                className="object-cover md:hidden"
                sizes="100vw"
              />
            </motion.div>

            {/* Lamp Element with Product Dot */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ 
                opacity: 1, 
                y: 0,
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
                  src={slideContent.lampImage}
                  alt=""
                  width={180}
                  height={180}
                  priority
                  className="h-auto w-full"
                />
                
                {/* Interactive Product Dot */}
                <div className="group absolute bottom-[20%] left-[65%] -translate-x-1/2 translate-y-1/2">
                  {/* Pulsating Dot - copied from LampsCollection */}
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
          </div>
        </section>
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
                                onClick={() => setShowSearchModal(false)}
                                className="group bg-neutral-50 rounded-lg overflow-hidden hover:bg-neutral-100 transition-colors"
                              >
                                <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                                  {product.featuredImage && (
                                    <Image
                                      src={product.featuredImage.url}
                                      alt={product.featuredImage.altText || product.title}
                                      fill
                                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium text-neutral-900 group-hover:text-[#9e896c] truncate">
                                    {product.title}
                                  </h3>
                                  <p className="text-sm text-neutral-500 mt-1">
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

export default memo(Hero);

