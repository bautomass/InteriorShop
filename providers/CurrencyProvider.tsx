'use client';

import { CURRENCY_CONFIG, CurrencyCode, FALLBACK_RATES, fetchExchangeRates } from '@/lib/currency';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true);
      try {
        const latestRates = await fetchExchangeRates();
        setRates(latestRates);

        if (typeof window !== 'undefined') {
          const savedCurrency = localStorage.getItem('currency') as CurrencyCode;
          if (savedCurrency && Object.keys(rates).includes(savedCurrency)) {
            setCurrency(savedCurrency);
          }
        }
      } catch (error) {
        console.error('Error initializing currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();

    const intervalId = setInterval(async () => {
      const latestRates = await fetchExchangeRates();
      setRates(latestRates);
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency);
    }
  }, [currency]);

  const formatPrice = (amountInUSD: number): string => {
    // First convert USD amount to EUR (our new base currency)
    const amountInEUR = amountInUSD / rates.USD;
    // Then convert to target currency
    const convertedAmount = amountInEUR * rates[currency];
    
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    };
  
    return new Intl.NumberFormat(CURRENCY_CONFIG[currency].locale, options)
      .format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice,
      isLoading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}