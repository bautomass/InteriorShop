import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const apiKey = process.env.CURRENCY_API_KEY;
    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].join(',');
    
    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=USD&currencies=${currencies}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    
    // Cache the response for 1 hour
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}