// /app/collections/[handle]/page.tsx
import PaginatedProductGrid from '@/components/collections/PaginatedProductGrid';
import { SortOptions } from '@/components/collections/sort-options';
import { ScrollHandler } from '@/components/ScrollHandler'; 
import { Footer } from '@/components/layout/site-footer';
import { defaultSort, sorting } from 'lib/constants';
import { getCollectionProductsQuery, getCollectionQuery } from 'lib/shopify/queries/collection';
import { shopifyFetch } from 'lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Add shopifyFetch types
interface ShopifyFetchParams {
  query: string;
  variables?: any;
  cache?: RequestCache;
  tags?: string[];
}

// Updated Image types
interface ShopifyImage {
  url: string;
  altText?: string;
}

interface ImageEdge {
  node: ShopifyImage;
}

// Types
interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ImageEdge[];
  };
  featuredImage?: ShopifyImage;
  productType?: string;
  tags?: string[];
}

interface Collection {
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
  seo: {
    title: string;
    description: string;
  };
}

interface CollectionPageProps {
  params: {
    handle: string;
  };
  searchParams: {
    sort?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const response = (await shopifyFetch({
      query: getCollectionQuery,
      variables: {
        handle: resolvedParams.handle
      },
      tags: ['collections'],
      cache: 'force-cache'
    } as ShopifyFetchParams)) as { body: { data: { collection: Collection | null } } };

    const collection = response.body.data.collection;

    if (!collection) {
      return {
        title: 'Collection Not Found',
        description: 'The collection you are looking for does not exist.'
      };
    }

    return {
      title: collection.seo.title || collection.title,
      description: collection.seo.description || collection.description
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'There was an error loading the collection.'
    };
  }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  // Use Promise.all to await all params concurrently
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);

  const sort = resolvedSearchParams.sort;
  const handle = resolvedParams.handle;

  // Improved sort validation
  const sortOption = sorting.find((item) => item.slug === sort);
  const sortKey = sortOption?.sortKey || defaultSort.sortKey;
  const reverse = sortOption?.reverse ?? defaultSort.reverse;

  try {
    // Fetch collection data with proper error handling
    const response = (await shopifyFetch({
      query: getCollectionProductsQuery,
      variables: {
        handle,
        sortKey,
        reverse
      },
      tags: ['collections', 'products'],
      cache: 'force-cache'
    } as ShopifyFetchParams)) as { body: { data: { collection: Collection | null } } };

    const collection = response.body.data.collection;

    if (!collection) {
      console.error('Collection not found:', handle);
      notFound();
    }

    const products = collection.products.edges.map(({ node }) => ({
      ...node,
      images: node.images.edges.map((edge: ImageEdge) => ({
        url: edge.node.url,
        altText: edge.node.altText
      }))
    }));

    return (
      <>
        <ScrollHandler />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: collection.title,
              description: collection.description
            })
          }}
        />
        <main className="relative min-h-screen bg-primary-50 pb-20 dark:bg-primary-900">
          {/* Background Gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/50" />
          </div>

          <div className="relative mx-auto max-w-[90rem]">
            {/* Collection Header */}
            <div className="px-4 py-12 sm:px-6 lg:px-8">
              <div className="mb-6">
                {collection.image ? (
                  <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-black/20" />
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      width={collection.image.width || 2100}
                      height={collection.image.height || 900}
                      className="h-full w-full object-cover"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-8 text-white">
                      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                        {collection.title}
                      </h1>
                      {collection.description && (
                        <p className="mx-auto max-w-2xl text-lg text-primary-100">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl">
                      {collection.title}
                    </h1>
                    {collection.description && (
                      <p className="mx-auto max-w-2xl text-lg text-primary-700 dark:text-primary-200">
                        {collection.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sort Section - Dynamic positioning */}
            <div 
              id="sticky-sort"
              className="sticky z-10 bg-primary-50/80 px-4 py-6 backdrop-blur-sm transition-all dark:bg-primary-900/80 sm:px-6 lg:px-8"
              style={{
                top: 'var(--header-offset, 0px)',
                marginTop: '-24px'
              }}
            >
              <SortOptions 
                currentValue={sort} 
                productCount={products.length} 
              />
            </div>

            {/* Products Grid Section */}
            <div className="px-4 pt-6 sm:px-6 lg:px-8">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="group relative animate-pulse">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-primary-100 dark:bg-primary-800" />
                        <div className="mt-4 h-4 w-3/4 rounded bg-primary-100 dark:bg-primary-800" />
                        <div className="mt-2 h-4 w-1/2 rounded bg-primary-100 dark:bg-primary-800" />
                      </div>
                    ))}
                  </div>
                }
              >
                {products.length > 0 ? (
                  <PaginatedProductGrid
                    products={products}
                    initialProductCount={8}
                    productsPerLoad={8}
                  />
                ) : (
                  <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-white/50 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50">
                    <div className="text-center">
                      <h2 className="mb-2 text-xl font-medium text-primary-900 dark:text-primary-50">
                        No Products Found
                      </h2>
                      <p className="text-primary-700 dark:text-primary-200">
                        This collection is currently empty. Please check back later.
                      </p>
                    </div>
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error loading collection:', error);
    notFound();
  }
}
