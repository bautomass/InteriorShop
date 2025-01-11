import { useHeaderState } from '@/hooks/useHeaderState';
import { Collection } from '@/lib/shopify/types';
import { useCart } from 'components/cart/cart-context';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import { ArrowRight, Clock, DollarSign, Mail, ShoppingCart, Sparkles, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// Constants
const EXCLUDED_HANDLES = [
  'all',
  'new-arrivals',
  'top-products',
  'freshfreshfresh',
  'home-collection'
] as string[];

const PROMO_INTERVAL = 5000; // 5 seconds between promo changes

// Types
interface PromoItem {
  id: number;
  text: string;
  icon?: React.ReactNode;
}

interface Cart {
  items: any[];
  // Add other cart properties as needed
}

// Promos data
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

// Burger Icon Component
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

export const MobileMenuHeader = () => {
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

  // Constants
  const email = 'info@simpleinteriorideas.com';
  const workingHours = 'Mon-Fri: 9-18';

  // Update the container class to include account and cart states
  const containerExpandedClass = (isNavOpen || (isSearchOpen && searchQuery) || isAccountOpen || isCartOpen) ? 'h-screen' : 'h-auto';

  return (
    <div className="absolute top-0 left-0 right-0 z-[9999]">
      <div className={`bg-white w-full transition-all duration-300 ${containerExpandedClass}`}>
        {/* Promo Banner */}
        <div className="bg-neutral-100 py-2 px-4">
          <div className="flex items-center justify-center space-x-2">
            {promos[currentPromoIndex]?.icon}
            <p className="text-sm text-neutral-700">{promos[currentPromoIndex]?.text}</p>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-neutral-200">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Menu Button */}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <BurgerIcon isOpen={isNavOpen} />
            </button>

            {/* Logo */}
            <Link href="/" className="transform -translate-x-3">
              <Image
                src="/logo.svg"
                alt="Simple Interior Ideas"
                width={140}
                height={24}
                className="h-6 w-auto"
              />
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => handlePanelChange('cart')}
              className="relative focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6 text-neutral-700" />
              {(cart?.lines?.length ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart?.lines?.length ?? 0}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Panel */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-neutral-200"
            >
              <div className="px-6 py-6">
                <nav className="space-y-6">
                  {/* Collections */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-neutral-400">Collections</h3>
                    <div className="space-y-3">
                      {collections.map((collection) => (
                        <Link
                          key={collection.handle}
                          href={`/collections/${collection.handle}`}
                          className="block text-neutral-700 hover:text-neutral-900"
                        >
                          <div className="flex items-center justify-between">
                            <span>{collection.title}</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-neutral-400">Contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${email}`}>{email}</a>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <Clock className="h-4 w-4" />
                        <span>{workingHours}</span>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Panel */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-neutral-200"
            >
              {/* Search input and results implementation */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Panel */}
        <AnimatePresence>
          {isAccountOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-neutral-200"
            >
              {/* Account panel implementation */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Panel */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-neutral-200"
            >
              {/* Cart panel implementation */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileMenuHeader; 