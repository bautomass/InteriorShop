'use client';

import { PriceRangeFilter } from '@/components/filter/PriceRangeFilter';
import { SortSelect } from '@/components/filter/SortSelect';
import { useDebounce } from '@/hooks/use-debounce';
import { useHeaderState } from '@/hooks/useHeaderState';
import { useSearch } from '@/hooks/useSearch';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

const heroSlides: SlideContent[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile_image_banner.jpg',
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
    id: 'slide-2',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/simple-room-chair.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/room.jpg',
    alt: 'Modern Room Design',
    title: 'Transform Your Space',
    subtitle: 'Discover timeless elegance',
    menu: {
      items: [
        { label: 'Dining Sets', link: '/collections/dining', description: 'Gather in elegance' },
        { label: 'Table Collection', link: '/collections/tables', description: 'Centerpiece designs' },
        { label: 'Seating Solutions', link: '/collections/chairs', description: 'Comfort meets style' }
      ],
      position: 'left',
      style: 'modern',
      alignment: 'center'
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
  },
  {
    id: 'slide-5',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/chair_f650c3ec-9c09-4940-9ee0-926176e22986.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/chair.jpg',
    alt: 'Comfort Redefined',
    title: 'Comfort Redefined',
    subtitle: 'Experience luxury in every detail',
    menu: {
      items: [
        { label: 'Luxury Seating', link: '/collections/luxury', description: 'Premium comfort' },
        { label: 'Designer Chairs', link: '/collections/designer-chairs', description: 'Iconic pieces' },
        { label: 'Custom Orders', link: '/collections/custom', description: 'Made for you' }
      ],
      position: 'right',
      style: 'classic',
      alignment: 'center'
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
      return 'right-16 top-24';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const controls = useAnimation();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>();
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    let targetIndex = index;
    if (targetIndex < 0) targetIndex = heroSlides.length - 1;
    if (targetIndex >= heroSlides.length) targetIndex = 0;
    
    setCurrentSlide(targetIndex);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, heroSlides.length]);

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

  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      
      if (!isPaused) {
        autoPlayRef.current = setInterval(() => {
          goToSlide((currentSlide + 1) % heroSlides.length);
        }, 5000);
      }
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, currentSlide, goToSlide, heroSlides.length]);

  return (
    <>
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
                    className="hidden object-cover md:block"
                    sizes="100vw"
                  />
                  <Image
                    src={slide.mobileImage}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    quality={90}
                    className="object-cover md:hidden"
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
                      <Image
                        src={slide.lampImage}
                        alt="Decorative lamp"
                        width={180}
                        height={400}
                        className="w-full"
                      />
                    </motion.div>
                  )}

                  {/* Slide Menu with Title */}
                  <motion.div
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
                            className={`relative block transition-all duration-500 py-3.5 px-7 rounded-lg 
                                     ${slide.menu.position === 'right' ? 'hover:pr-14' : 'hover:pl-14'} 
                                     hover:bg-white/5`}
                          >
                            <span className="block text-2xl font-light tracking-wide text-white/90 
                                           group-hover:text-white transition-colors duration-500">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block mt-1 text-sm text-white/60 group-hover:text-white/80 
                                             transition-colors duration-500 font-light tracking-wide">
                                {item.description}
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
                          className={`object-contain transition-all duration-500 ease-out
                                     ${isActive ? 'scale-105 brightness-110' : 'hover:scale-105 brightness-90 hover:brightness-100'}`}
                          sizes="(max-width: 768px) 176px, 112px"
                          quality={isActive ? 95 : 80}
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
                          
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-white
                                     origin-left shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                            onAnimationComplete={() => {
                              goToSlide(currentSlide + 1);
                            }}
                          />
                          
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r 
                                     from-transparent via-white/30 to-transparent
                                     transform -skew-x-12 pointer-events-none"
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

