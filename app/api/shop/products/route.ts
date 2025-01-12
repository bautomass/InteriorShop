import { shopifyFetch } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the GraphQL query to Shopify
    const response = await shopifyFetch({
      query: body.query,
      variables: body.variables,
      cache: 'no-store'
    });

    // Return the Shopify response
    return NextResponse.json(response);

  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
} 