// components/carousel.tsx
import { getCollectionProducts } from 'lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export default async function Carousel() {
  const products = await getCollectionProducts({ collection: 'hidden-homepage-carousel' });
  console.log('Carousel products:', products);
  if (!products?.length) return null;

  // Duplicate products for infinite scroll effect
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="bg-primary-50 dark:bg-primary-900 relative w-full overflow-hidden">
      <div className="flex w-full items-center justify-between px-4 py-4">
        <h2 className="text-primary-900 dark:text-primary-100 text-2xl font-medium">
          Latest Arrivals
        </h2>
      </div>
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.handle}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link href={`/product/${product.handle}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
