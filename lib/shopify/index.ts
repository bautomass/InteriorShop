//lib/shopify/index.ts
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  searchCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsByTagQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

// export async function shopifyFetch<T>({
//   cache = 'force-cache',
//   headers,
//   query,
//   tags,
//   variables
// }: {
//   cache?: RequestCache;
//   headers?: HeadersInit;
//   query: string;
//   tags?: string[];
//   variables?: ExtractVariables<T>;
// }): Promise<{ status: number; body: T } | never> {
//   try {
//     // Request setup logging
//     console.log('Shopify Request:', {
//       query: query.slice(0, 100) + '...',
//       variables
//     });

//     const result = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Storefront-Access-Token': key,
//         ...headers
//       },
//       body: JSON.stringify({
//         ...(query && { query }),
//         ...(variables && { variables })
//       }),
//       cache,
//       next: tags ? { tags, revalidate: 60 } : undefined
//     });

//     const body = await result.json();

//     // Enhanced error handling
//     if (body.errors?.length > 0) {
//       console.error('GraphQL Errors:', JSON.stringify(body.errors, null, 2));
//       throw new Error(body.errors.map((e: any) => e.message).join(', '));
//     }

//     if (!result.ok) {
//       throw new Error(`HTTP error! status: ${result.status}`);
//     }

//     if (!body.data) {
//       console.error('Invalid response structure:', body);
//       throw new Error('Invalid API response structure');
//     }

//     return {
//       status: result.status,
//       body
//     };
//   } catch (error) {
//     console.error('Shopify fetch error:', {
//       error,
//       query: query.slice(0, 100) + '...',
//       variables
//     });
//     throw error;
//   }
// }
export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      next: tags ? { tags, revalidate: 60 } : undefined
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(body.errors)}`);
    }

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}: ${JSON.stringify(body)}`);
    }

    return {
      status: result.status,
      body
    };
  } catch (error) {
    throw new Error(
      `Shop API Error: ${error instanceof Error ? error.message : 'Unknown error'} | Query: ${query.slice(0, 100)}`
    );
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/collections/${collection.handle}`
    // path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

// export async function addToCart(
//   cartId: string,
//   lines: Array<{ merchandiseId: string; quantity: number }>
// ): Promise<Cart> {
//   try {
//     // Format cart ID
//     const formattedCartId = cartId.startsWith('gid://') ? cartId : `gid://shopify/Cart/${cartId}`;

//     // Debug the incoming merchandiseId
//     console.log('Add to Cart - Original Input:', {
//       cartId: formattedCartId,
//       lines
//     });

//     // Format the lines with proper variant IDs
//     const formattedLines = lines.map((line) => {
//       const variantId = line.merchandiseId;
//       console.log('Processing variant ID:', variantId);

//       // Pass through the full ID if it's already formatted
//       return {
//         merchandiseId: variantId,
//         quantity: line.quantity
//       };
//     });

//     console.log('Add to Cart - Formatted Request:', {
//       cartId: formattedCartId,
//       lines: formattedLines
//     });

//     const res = await shopifyFetch<ShopifyAddToCartOperation>({
//       query: addToCartMutation,
//       variables: {
//         cartId: formattedCartId,
//         lines: formattedLines
//       },
//       cache: 'no-store'
//     });

//     // Check for user errors in the response
//     if (res.body.data?.cartLinesAdd?.userErrors?.length > 0) {
//       const errors = res.body.data.cartLinesAdd.userErrors;
//       throw new Error(`Shopify Error: ${errors.map((e) => e.message).join(', ')}`);
//     }

//     if (!res.body.data?.cartLinesAdd?.cart) {
//       throw new Error(
//         `Cart Error: Invalid Response | Cart ID: ${cartId} | Lines: ${JSON.stringify(lines)} | Response: ${JSON.stringify(res.body)}`
//       );
//     }

//     return reshapeCart(res.body.data.cartLinesAdd.cart);
//   } catch (error) {
//     console.error('Add to Cart Error:', error);
//     throw new Error(
//       `Add to Cart Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
//     );
//   }
// }

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  try {
    // Validate merchandiseId format
    if (!lines?.length || !lines.every(line => 
      typeof line.merchandiseId === 'string' && 
      line.merchandiseId.startsWith('gid://shopify/ProductVariant/')
    )) {
      throw new Error('Invalid merchandiseId format. Expected Shopify Global ID.');
    }

    const formattedCartId = cartId.startsWith('gid://') ? cartId : `gid://shopify/Cart/${cartId}`;

    const res = await shopifyFetch<ShopifyAddToCartOperation>({
      query: addToCartMutation,
      variables: {
        cartId: formattedCartId,
        lines
      },
      cache: 'no-store'
    });

    if (res.body.data?.cartLinesAdd?.userErrors?.length > 0) {
      throw new Error(`Shopify Errors: ${JSON.stringify(res.body.data.cartLinesAdd.userErrors)}`);
    }

    if (!res.body.data?.cartLinesAdd?.cart) {
      throw new Error(`Cart Error: Invalid Response`);
    }

    return reshapeCart(res.body.data.cartLinesAdd.cart);
  } catch (error) {
    console.error('Shopify addToCart - Error:', error);
    throw error;
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart]
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      // path: '/search',
      path: '/collections',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(domain, '').replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: 'no-store',
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: 'no-store'
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function searchCollections({ query }: { query?: string }): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: searchCollectionsQuery,
    tags: [TAGS.collections]
  });

  const collections = removeEdgesAndNodes(res.body.data.collections);
  if (query) {
    const lowerQuery = query.toLowerCase();
    return reshapeCollections(
      collections.filter(
        (collection) =>
          collection.title.toLowerCase().includes(lowerQuery) ||
          collection.description?.toLowerCase().includes(lowerQuery)
      )
    );
  }
  return reshapeCollections(collections);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  console.log('Executing Shopify query for tag:', tag);

  try {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsByTagQuery,
      tags: [TAGS.products],
      variables: {
        query: `tag:${tag}`
      }
    });

    console.log('Raw Shopify response:', res.body);

    if (!res.body.data?.products?.edges) {
      console.error('Unexpected response structure:', res.body);
      return [];
    }

    const products = reshapeProducts(removeEdgesAndNodes(res.body.data.products));
    console.log('Reshaped products:', products);

    return products;
  } catch (error) {
    console.error('Error in getProductsByTag:', error);
    return [];
  }
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
