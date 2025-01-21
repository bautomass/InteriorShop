//lib/currency.ts
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export const CURRENCY_CONFIG: Record<CurrencyCode, {
  symbol: string;
  locale: string;
  position: 'before' | 'after';
}> = {
  USD: { symbol: '$', locale: 'en-US', position: 'before' },
  EUR: { symbol: '€', locale: 'de-DE', position: 'before' },
  GBP: { symbol: '£', locale: 'en-GB', position: 'before' },
  CAD: { symbol: '$', locale: 'en-CA', position: 'before' },
  AUD: { symbol: '$', locale: 'en-AU', position: 'before' },
  JPY: { symbol: '¥', locale: 'ja-JP', position: 'before' }
};

// Fallback rates in case API fails
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.96,
  GBP: 0.81,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 148.50
};

export async function fetchExchangeRates() {
  try {
    const response = await fetch('/api/exchange-rates');
    if (!response.ok) throw new Error('Failed to fetch rates');
    
    const data = await response.json();
    
    // Transform the API response to our format
    const rates: Record<CurrencyCode, number> = {
      USD: 1, // Base currency is always 1
      EUR: data.data.EUR.value,
      GBP: data.data.GBP.value,
      CAD: data.data.CAD.value,
      AUD: data.data.AUD.value,
      JPY: data.data.JPY.value
    };

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return FALLBACK_RATES;
  }
}