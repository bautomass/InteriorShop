// components/home/featured-collection.tsx
import { getCollectionProducts } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.handle}`} className="group">
      <div className="bg-primary-100 dark:bg-primary-800 aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.featuredImage.url}
          alt={product.title}
          width={500}
          height={500}
          className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-primary-900 dark:text-primary-100 text-sm font-medium">
          {product.title}
        </h3>
        <p className="text-primary-600 dark:text-primary-300 text-sm">
          {product.priceRange.maxVariantPrice.amount}{' '}
          {product.priceRange.maxVariantPrice.currencyCode}
        </p>
      </div>
    </Link>
  );
}

export default async function FeaturedCollection() {
  const products = await getCollectionProducts({ collection: 'featured' });
  console.log('Featured products:', products);
  if (!products?.length) return null;

  return (
    <section className="bg-primary-50 dark:bg-primary-900 px-4 py-16">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-primary-900 dark:text-primary-50 text-3xl font-medium">
            Featured Collection
          </h2>
          <p className="text-primary-600 dark:text-primary-300 mt-4">
            Discover our carefully curated pieces
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
