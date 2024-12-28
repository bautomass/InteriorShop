'use client';

import { PriceRangeFilter } from '@/components/filter/PriceRangeFilter';
import { SortSelect } from '@/components/filter/SortSelect';
import { SidebarMenu } from '@/components/layout/SidebarMenu';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearch } from '@/hooks/useSearch';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const mainNavItems = [
  {
    label: 'New Arrivals',
    href: '/collections/new-arrivals',
    featured: true,
    subItems: [
      { label: 'Latest Drops', href: '/collections/latest-drops' },
      { label: 'Coming Soon', href: '/collections/coming-soon' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
    ]
  },
  {
    label: 'Collections',
    href: '/collections',
    subItems: [
      { label: 'Necklaces', href: '/collections/necklaces' },
      { label: 'Bracelets', href: '/collections/bracelets' },
      { label: 'Rings', href: '/collections/rings' },
      { label: 'Earrings', href: '/collections/earrings' },
    ]
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const modalSearchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { results, isLoading, error, performSearch } = useSearch();
  const [sortBy, setSortBy] = useState('created_desc');
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results.products];

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('input')
      ) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isSidebarOpen]);

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

  const renderContent = () => {
    return (
      <div className="relative">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                     ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-4 md:py-6">
              <div className="flex items-center gap-4 w-1/4">
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
              <nav className="hidden md:flex items-center justify-center flex-1">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors"
                  >
                    MENU
                  </button>
                  <Link href="/blog" className="text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors">
                    BLOG
                  </Link>
                  <Link href="/track-order" className="text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors">
                    TRACK ORDER
                  </Link>
                  <Link href="/faq" className="text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors">
                    FAQ'S
                  </Link>
                  <Link href="/support" className="text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors">
                    SUPPORT
                  </Link>
                </div>
              </nav>

              <div className="w-1/4 flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-20"
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
                          <button 
                            className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(true)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeLinecap="round"/>
                            </svg>
                          </button>
                          <button 
                            className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                            aria-label="Profile"
                            onClick={() => setIsAccountOpen(true)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeLinecap="round"/>
                            </svg>
                          </button>
                          <button 
                            className="rounded-md p-1.5 text-white transition-all duration-300 hover:bg-white/20 active:scale-95" 
                            aria-label="Cart"
                            onClick={() => setIsCartOpen(true)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17Z" strokeLinecap="round"/>
                            </svg>
                          </button>
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
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
                                          {results.collections.slice(0, 3).map((collection) => (
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
                                        {results.products.slice(0, 5).map((product) => (
                                          <Link
                                            key={product.id}
                                            href={`/products/${product.handle}`}
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
                          className="flex items-center gap-3 whitespace-nowrap pr-1"
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
                          <span className="text-sm text-white">
                            {cart?.totalQuantity || 0} {cart?.totalQuantity === 1 ? 'item' : 'items'}
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
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center gap-2 whitespace-nowrap pr-1"
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-[#6B5E4C]/5"
                  >
                    <X className="w-6 h-6 text-[#6B5E4C]" />
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
                        onClick={() => setIsMobileMenuOpen(false)}
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
                              onClick={() => setIsMobileMenuOpen(false)}
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

        {showSearchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[50]"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 overflow-hidden pt-[10vh] pb-[10vh] z-[60]"
            >
              <div className="relative w-full h-full max-w-4xl mx-auto">
                <div className="h-full bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
                  <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
                    <div className="p-6">
                      <div className="relative">
                        <input
                          ref={modalSearchInputRef}
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 text-lg text-neutral-900 bg-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:bg-white transition-all pr-12"
                          />
                        <button
                          onClick={closeModal}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
  
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
  
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6">
                      {results.collections.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-lg font-medium text-neutral-900 mb-4">Collections</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.collections.map((collection) => (
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
                                href={`/products/${product.handle}`}
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

        {isSidebarOpen && (
          <SidebarMenu 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {error && (
          <div className="fixed bottom-4 right-4 p-4 bg-red-50 text-red-600 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    );
  };

  return renderContent();
}