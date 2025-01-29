// lib/shopify/client/customerAuth.ts
import { SHOPIFY_GRAPHQL_API_ENDPOINT, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../constants';

export async function shopifyFetch({
  query,
  variables,
  headers,
  cache = 'force-cache'
}: {
  query: string;
  variables?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<{ status: number; body: any }> {
  try {
    const result = await fetch(SHOPIFY_GRAPHQL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        ...headers
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { revalidate: 900 } // 15 minutes
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch from Shopify');
  }
}