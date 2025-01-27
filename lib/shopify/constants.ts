// lib/shopify/constants.ts

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable is not set');
  }
  
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is not set');
  }
  
  export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  export const SHOPIFY_GRAPHQL_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;