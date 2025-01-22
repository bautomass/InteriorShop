//lib/currency.ts
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export const CURRENCY_CONFIG: Record<CurrencyCode, {
  symbol: string;
  locale: string;
  position: 'before' | 'after';
}> = {
  USD: { symbol: '$', locale: 'en-US', position: 'before' },
  EUR: { symbol: '€', locale: 'de-DE', position: 'after' },
  GBP: { symbol: '£', locale: 'en-GB', position: 'before' },
  CAD: { symbol: '$', locale: 'en-CA', position: 'before' },
  AUD: { symbol: '$', locale: 'en-AU', position: 'before' },
  JPY: { symbol: '¥', locale: 'ja-JP', position: 'before' }
};

// Fallback rates in case API fails
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.04,
  GBP: 0.85,
  CAD: 1.41,
  AUD: 1.58,
  JPY: 154.44
};

export async function fetchExchangeRates() {
  try {
    const response = await fetch('/api/exchange-rates');
    if (!response.ok) throw new Error('Failed to fetch rates');
    
    const data = await response.json();
    
    const rates: Record<CurrencyCode, number> = {
      EUR: 1,
      USD: 1 / data.data.EUR.value,
      GBP: data.data.GBP.value / data.data.EUR.value,
      CAD: data.data.CAD.value / data.data.EUR.value,
      AUD: data.data.AUD.value / data.data.EUR.value,
      JPY: data.data.JPY.value / data.data.EUR.value
    };

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return FALLBACK_RATES;
  }
}