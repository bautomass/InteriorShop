'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Clock, DollarSign, Globe, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Language = { code: string; name: string };
type Currency = { code: string; symbol: string };

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'lv', name: 'Latviešu' }
];

const currencies: Currency[] = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' }
];

const promos = [
  'Free Worldwide shipping on all orders!',
  'Use code WELCOME20 for 20% off',
  'Holiday season: Order now for timely delivery',
  'New arrivals just dropped'
];

export function TopHeader() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-button')) {
      setIsLangOpen(false);
      setIsCurrencyOpen(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 5000);
    document.addEventListener('click', handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
      {/* Promo Banner - Same for both mobile and desktop */}
      <div className="border-primary-200 dark:border-primary-700 border-b">
        <div className="mx-auto max-w-[90vw]">
          <AnimatePresence mode="wait">
            <motion.p
              key={promoIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-2 text-center text-sm font-medium"
            >
              {promos[promoIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex max-w-[90vw] flex-col py-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side - Contact Info */}
        <div className="border-primary-200/30 dark:border-primary-700/30 flex items-center justify-center gap-6 border-b py-2 sm:border-0 sm:py-0">
          <span className="flex items-center gap-2" aria-label="Working hours">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">Mon-Fri: 9-18</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <a href="mailto:contact@store.com" className="hover:text-accent-500 text-sm">
              info@simpleinteriorideas.com
            </a>
          </span>
        </div>

        {/* Right Side - Language, Currency, Track Order */}
        <div className="flex items-center justify-center gap-6 py-2 sm:py-0">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLangOpen(!isLangOpen);
                setIsCurrencyOpen(false);
              }}
              className="dropdown-button hover:bg-primary-200/50 dark:hover:bg-primary-700/50 flex items-center gap-1 rounded-md p-1 text-sm"
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span>{selectedLang.code.toUpperCase()}</span>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {isLangOpen && (
              <div className="border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-800 absolute right-0 top-full z-[60] mt-1 w-40 rounded-md border py-1 shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                    }}
                    className="hover:bg-primary-200/50 dark:hover:bg-primary-700/50 flex w-full items-center justify-between px-4 py-2 text-left text-sm"
                    role="option"
                    aria-selected={selectedLang.code === lang.code}
                  >
                    {lang.name}
                    {selectedLang.code === lang.code && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLangOpen(false);
              }}
              className="dropdown-button hover:bg-primary-200/50 dark:hover:bg-primary-700/50 flex items-center gap-1 rounded-md p-1 text-sm"
              aria-expanded={isCurrencyOpen}
              aria-haspopup="listbox"
            >
              <DollarSign className="h-4 w-4" aria-hidden="true" />
              <span>{selectedCurrency.code}</span>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {isCurrencyOpen && (
              <div className="border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-800 absolute right-0 top-full z-[60] mt-1 w-32 rounded-md border py-1 shadow-lg">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsCurrencyOpen(false);
                    }}
                    className="hover:bg-primary-200/50 dark:hover:bg-primary-700/50 flex w-full items-center justify-between px-4 py-2 text-left text-sm"
                    role="option"
                    aria-selected={selectedCurrency.code === currency.code}
                  >
                    <span>{currency.code}</span>
                    {selectedCurrency.code === currency.code && (
                      <Check className="h-4 w-4" aria-hidden="true" />
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
