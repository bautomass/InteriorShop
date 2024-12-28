'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Clock, DollarSign, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Currency = { code: string; symbol: string };

const currencies: Currency[] = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' }
];

const email = 'info@simpleinteriorideas.com';
const workingHours = 'Mon-Fri: 9-18';

const promos = [
  "Use Code: 'WINTER24' At Checkout For 15% off",
  'Free Worldwide Shipping',
  <Link key="collections" href="/collections" className="hover:underline">
    Check out Our Collections
  </Link>,
];

export function TopHeader() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-button')) {
      setIsCurrencyOpen(false);
    }
  }, []);

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

  return (
    <div style={{ backgroundColor: '#9e896c' }} className="text-primary-100">
      {/* Main Content */}
      <div className="mx-auto flex max-w-[95vw] flex-col py-2 sm:flex-row sm:items-center">
        {/* Left Side - Contact Info */}
        <div className="border-primary-200/30 dark:border-primary-700/30 flex items-center justify-center gap-6 border-b py-2 sm:w-1/4 sm:border-0 sm:py-0">
          <span className="flex items-center gap-2 whitespace-nowrap" aria-label="Working hours">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">{workingHours}</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <a href="mailto:contact@store.com" className="hover:text-accent-500 text-sm">
              {email}
            </a>
          </span>
        </div>

        {/* Center - Promo Banner */}
        <div className="w-full sm:w-2/4 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: {
                  duration: 0.7,
                  ease: "easeIn"
                }
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                setIsCurrencyOpen(!isCurrencyOpen);
              }}
              className="dropdown-button flex items-center gap-1 rounded-md p-1 text-sm hover:bg-white/10 transition-colors"
              aria-expanded={isCurrencyOpen}
              aria-haspopup="listbox"
            >
              <DollarSign className="h-4 w-4" aria-hidden="true" />
              <span>{selectedCurrency.code}</span>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {isCurrencyOpen && (
              <div className="absolute right-0 top-full z-[60] mt-2 w-24 rounded-md bg-white shadow-lg">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                    role="option"
                    aria-selected={selectedCurrency.code === currency.code}
                  >
                    <span>{currency.code}</span>
                    {selectedCurrency.code === currency.code && (
                      <Check className="h-4 w-4 text-gray-900" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/tracking"
            className="hover:bg-primary-200/50 dark:hover:bg-primary-700/50 hidden items-center gap-1 rounded-md p-1 text-sm sm:flex"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
