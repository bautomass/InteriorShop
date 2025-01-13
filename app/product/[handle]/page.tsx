// app/product/[handle]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// import { NavigationHeader } from '@/components/layout/navigation-header';
import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
import { Footer } from '@/components/layout/site-footer';
import { ProductDetails } from '@/components/product/product-details';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductTabs } from '@/components/product/product-tabs';
import { RecentlyViewedTracker } from '@/components/product/RecentlyViewedTracker';
import { RelatedProductsClient } from '@/components/product/related-products';
import { CollectionsShowcase } from '@/components/shared/CollectionsShowcase';
import { SustainabilityShowcase } from '@/components/shared/SustainabilityShowcase';
import { ProductProvider } from 'components/product/product-context';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

// Separate component for related products content
function RelatedProductsContent({ products }: { products: any[] }) {
  if (!products.length) return null;
  return <RelatedProductsClient products={products} />;
}

// Server Component to fetch and render related products
async function RelatedProductsSection({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);
  return <RelatedProductsContent products={relatedProducts} />;
}

// Loading fallback component
function RelatedProductsLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-[400px] rounded-lg bg-gray-200" />
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
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider variants={product.variants}>
      <LargeScreenNavBar />
      <RecentlyViewedTracker product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="relative mx-auto max-w-screen-2xl px-4 pb-24 pt-20">
        <div className="pointer-events-none absolute right-0 top-0 h-[80%] w-[80%] bg-[#eaeadf] opacity-90 blur-[150px]" />
        <div className="lg:gap-26 relative mx-auto flex max-w-[1400px] flex-col p-8 md:p-12 lg:flex-row">
          <div className="mx-auto h-full w-full max-w-[550px] basis-full lg:basis-[45%]">
            <ProductGallery images={product.images} product={product} />
          </div>
          <div className="basis-full lg:basis-[45%]">
            <ProductDetails product={product} />
          </div>
        </div>
        <ProductTabs />
        <Suspense fallback={<RelatedProductsLoader />}>
          {/* @ts-expect-error Server Component */}
          <RelatedProductsSection id={product.id} />
        </Suspense>
        <CollectionsShowcase className="mt-16" />
        <SustainabilityShowcase />
      </div>
      <Footer />
    </ProductProvider>
  );
}
