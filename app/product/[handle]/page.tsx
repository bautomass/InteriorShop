// app/product/[handle]/page.tsx
import { ProductDetails } from '@/components/product/product-details';
import { ProductGallery } from '@/components/product/product-gallery';
import { RecentlyViewedTracker } from '@/components/product/RecentlyViewedTracker';
import { ProductProvider } from 'components/product/product-context';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, lazy } from 'react';

// Lazy loaded components
const CollectionsShowcase = lazy(() => import('@/components/shared/CollectionsShowcase').then(mod => ({ default: mod.CollectionsShowcase })));
const SustainabilityShowcase = lazy(() => import('@/components/shared/SustainabilityShowcase').then(mod => ({ default: mod.SustainabilityShowcase })));
const RelatedProductsClient = lazy(() => import('@/components/product/related-products').then(mod => ({ default: mod.RelatedProductsClient })));
const ProductTabs = lazy(() => import('@/components/product/product-tabs').then(mod => ({ default: mod.ProductTabs })));

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);
  
  // Enhanced meta description
  const metaDescription = `${product.seo.description || product.description} - Shop ${product.title} at Modern Living. Free Shipping Available. Sustainable Design.`;

  return {
    title: `${product.seo.title || product.title}`,
    description: metaDescription,
    keywords: `${product.title}, ${product.tags.join(', ')}, modern furniture, sustainable design, home decor`,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
        'max-snippet': 155,
        'max-image-preview': 'large',
        'max-video-preview': -1
      }
    },
    openGraph: {
      title: product.seo.title || product.title,
      description: metaDescription,
      type: 'website',
      images: url ? [{ url, width, height, alt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo.title || product.title,
      description: metaDescription
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_VERCEL_URL}/product/${params.handle}`
    }
  };
}

function RelatedProductsContent({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <div className="mt-8 px-4 sm:px-6 md:px-8">
      <Suspense fallback={<div>Loading related products...</div>}>
        <RelatedProductsClient products={products} />
      </Suspense>
    </div>
  );
}

async function RelatedProductsSection({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);
  return <RelatedProductsContent products={relatedProducts} />;
}

function RelatedProductsLoader() {
  return (
    <div className="mt-8 w-full animate-pulse px-4 sm:px-6 md:px-8">
      <div className="h-64 rounded-lg bg-gray-200 sm:h-80 md:h-96" />
    </div>
  );
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    sku: product.variants[0]?.sku,
    mpn: product.variants[0]?.sku,
    brand: {
      '@type': 'Brand',
      name: 'Modern Living'
    },
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
      offerCount: product.variants.length,
      seller: {
        '@type': 'Organization',
        name: 'Modern Living'
      },
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };

  return (
    <ProductProvider variants={product.variants}>
      <RecentlyViewedTracker product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@id': process.env.NEXT_PUBLIC_VERCEL_URL,
                  name: 'Home'
                }
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@id': `${process.env.NEXT_PUBLIC_VERCEL_URL}/product`,
                  name: 'Products'
                }
              },
              {
                '@type': 'ListItem',
                position: 3,
                item: {
                  '@id': `${process.env.NEXT_PUBLIC_VERCEL_URL}/product/${params.handle}`,
                  name: product.title
                }
              }
            ]
          })
        }}
      />
      <div className="relative mx-auto max-w-screen-2xl px-0 pb-16 pt-16 sm:px-4 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute right-0 top-0 h-[60%] w-full bg-[#eaeadf] opacity-90 blur-[100px] sm:h-[80%] sm:w-[80%] sm:blur-[150px]" />
        
        <div className="relative mx-auto flex max-w-[1400px] flex-col p-4 sm:p-6 md:p-8 lg:flex-row lg:gap-26 lg:p-12">
          <div className="mx-auto h-full w-full sm:max-w-[550px] lg:basis-[45%]">
            <ProductGallery images={product.images} product={product} />
          </div>

          <div className="mt-8 sm:mt-10 lg:mt-0 lg:basis-[45%]">
            <ProductDetails product={product} />
          </div>
        </div>

        <div className="mt-8 px-4 sm:px-6 md:px-8">
          <Suspense fallback={<div>Loading product details...</div>}>
            <ProductTabs />
          </Suspense>
        </div>

        <Suspense fallback={<RelatedProductsLoader />}>
          {/* @ts-expect-error Server Component */}
          <RelatedProductsSection id={product.id} />
        </Suspense>

        <div className="mt-12 px-4 sm:mt-16 sm:px-6 md:px-8">
          <Suspense fallback={<div>Loading collections...</div>}>
            <CollectionsShowcase />
          </Suspense>
        </div>
        <div className="mt-8 px-4 sm:mt-12 sm:px-6 md:px-8">
          <Suspense fallback={<div>Loading sustainability info...</div>}>
            <SustainabilityShowcase />
          </Suspense>
        </div>
      </div>
    </ProductProvider>
  );
}
