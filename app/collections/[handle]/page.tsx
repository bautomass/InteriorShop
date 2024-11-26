import { GridTileImage } from 'components/grid/tile';
import { defaultSort, sorting } from 'lib/constants';
import { getCollectionProductsQuery, getCollectionQuery } from 'lib/shopify/queries/collection';
import { shopifyFetch } from 'lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
        width: number;
        height: number;
      };
    }>;
  };
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
  const { data } = await shopifyFetch({
    query: getCollectionQuery,
    variables: {
      handle: params.handle
    }
  });

  const collection = data.collection;

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
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { sort } = searchParams;
  const { handle } = params;

  const sortKey = sorting.find((item) => item.slug === sort)?.sortKey || defaultSort.sortKey;
  const reverse = sorting.find((item) => item.slug === sort)?.reverse || defaultSort.reverse;

  // Fetch collection data
  const { data } = await shopifyFetch({
    query: getCollectionProductsQuery,
    variables: {
      handle,
      sortKey,
      reverse
    }
  });

  const collection = data.collection;

  if (!collection) {
    notFound();
  }

  const products = collection.products.edges.map(({ node }: { node: Product }) => node);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
      {/* Collection Header */}
      <div className="mb-8">
        {collection.image && (
          <div className="relative mb-6 aspect-[21/9] overflow-hidden rounded-2xl">
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              width={collection.image.width || 2100}
              height={collection.image.height || 900}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

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
      </div>

      {/* Sort Options */}
      <div className="mb-8 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-primary-700 dark:text-primary-200">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort || defaultSort.slug}
            className="rounded-md border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm dark:border-primary-700 dark:bg-primary-800"
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('sort', e.target.value);
              window.location.href = url.toString();
            }}
          >
            {sorting.map((option) => (
              <option key={option.slug || 'default'} value={option.slug || ''}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800"
              />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const firstImage = product.images.edges[0]?.node;

            return (
              <Link key={product.handle} href={`/products/${product.handle}`}>
                <GridTileImage
                  src={firstImage?.url || ''}
                  alt={firstImage?.altText || product.title}
                  width={600}
                  height={600}
                  label={{
                    title: product.title,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode,
                    position: 'bottom'
                  }}
                />
              </Link>
            );
          })}
        </div>
      </Suspense>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-800/50">
          <div className="text-center">
            <h2 className="mb-2 text-lg font-medium text-primary-900 dark:text-primary-50">
              No Products Found
            </h2>
            <p className="text-primary-700 dark:text-primary-200">
              This collection is currently empty. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
