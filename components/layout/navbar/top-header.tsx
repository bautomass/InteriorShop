'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Clock, DollarSign, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// Enhanced Types
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

const email = 'info@simpleinteriorideas.com';
const workingHours = 'Mon-Fri: 9-18';

const promos = [
  "Use Code: 'WINTER24' At Checkout For 15% off",
  'Free Worldwide Shipping',
  <Link key="collections" href="/collections" className="hover:underline">
    Check out Our Collections
  </Link>
] as const;

// Animation variants
const bannerAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.7,
      ease: 'easeIn'
    }
  }
};

export function TopHeader() {
  const [promoIndex, setPromoIndex] = useState<number>(0);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => currencies[0]!);

  // Handle outside clicks for currency dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-button')) {
      setIsCurrencyOpen(false);
    }
  }, []);

  // Setup intervals and event listeners
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 8000);

    document.addEventListener('click', handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle currency selection
  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    setIsCurrencyOpen(false);
  }, []);

  // Handle dropdown toggle
  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCurrencyOpen((prev) => !prev);
  }, []);

  return (
    <div style={{ backgroundColor: '#9e896c' }} className="text-primary-100">
      <div className="mx-auto flex max-w-[95vw] flex-col py-2 sm:flex-row sm:items-center">
        {/* Left Side - Contact Info */}
        <div className="flex items-center justify-center gap-6 border-b border-primary-200/30 py-2 dark:border-primary-700/30 sm:w-1/4 sm:border-0 sm:py-0">
          <span className="flex items-center gap-2 whitespace-nowrap" aria-label="Working hours">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">{workingHours}</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <a href={`mailto:${email}`} className="text-sm hover:text-accent-500">
              {email}
            </a>
          </span>
        </div>

        {/* Center - Promo Banner */}
        <div className="w-full px-4 sm:w-2/4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={promoIndex}
              variants={bannerAnimations}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center text-base font-medium"
            >
              {promos[promoIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side - Currency, Track Order */}
        <div className="flex items-center justify-center gap-6 py-2 sm:w-1/4 sm:py-0">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="dropdown-button flex items-center gap-1 rounded-md p-1 text-sm transition-colors hover:bg-white/10"
              aria-expanded={isCurrencyOpen}
              aria-haspopup="listbox"
              aria-label={`Select currency: ${selectedCurrency.code}`}
            >
              <DollarSign className="h-4 w-4" aria-hidden="true" />
              <span>{selectedCurrency.code}</span>
              <ChevronDown
                className={`h-3 w-3 transform transition-transform duration-200 ${
                  isCurrencyOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {isCurrencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full z-[60] mt-2 w-24 rounded-md bg-white shadow-lg ring-1 ring-black/5"
                >
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-900 transition-colors hover:bg-gray-100"
                      role="option"
                      aria-selected={selectedCurrency.code === currency.code}
                    >
                      <span>{currency.code}</span>
                      {selectedCurrency.code === currency.code && (
                        <Check className="h-4 w-4 text-gray-900" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/tracking"
            className="hidden items-center gap-1 rounded-md p-1 text-sm transition-colors hover:bg-primary-200/50 dark:hover:bg-primary-700/50 sm:flex"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
