// app/api/gift-boxes/route.ts
import { getCollectionProducts } from 'lib/shopify';
import { Image, Product, ProductOption, ProductVariant } from 'lib/shopify/types';
import { NextResponse } from 'next/server';

interface GiftBoxImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface GiftBoxVariant {
  id: string;
  title: string;
  price: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: GiftBoxImage;
}

interface GiftBox {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: GiftBoxImage;
  images: GiftBoxImage[];
  variants: GiftBoxVariant[];
  options: ProductOption[];
  selectedVariant?: {
    id: string;
    price: number;
    title: string;
  };
}

const DEFAULT_IMAGE: GiftBoxImage = {
  url: '/default-image.jpg',
  altText: 'Default Product Image',
  width: 800,
  height: 800
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'gift-boxes-1'
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No gift boxes found' }, { status: 404 });
    }

    const giftBoxes = products.map((product: Product): GiftBox => {
      const processedImages: GiftBoxImage[] = product.images.map(
        (image: Image): GiftBoxImage => ({
          url: image.url,
          altText: image.altText,
          width: image.width,
          height: image.height
        })
      );

      const processedVariants = product.variants.map(
        (variant: ProductVariant): GiftBoxVariant => ({
          id: variant.id,
          title: variant.title,
          price: parseFloat(variant.price.amount),
          selectedOptions: variant.selectedOptions
        })
      );

      const featuredImage = (() => {
        if (product.featuredImage) {
          return {
            url: product.featuredImage.url,
            altText: product.featuredImage.altText,
            width: product.featuredImage.width,
            height: product.featuredImage.height
          };
        }
        if (processedImages.length > 0) {
          return processedImages[0];
        }
        return DEFAULT_IMAGE;
      })() as GiftBoxImage;

      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        featuredImage,
        images: processedImages,
        variants: processedVariants,
        options: product.options,
        selectedVariant: undefined
      };
    });

    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    };

    return NextResponse.json(giftBoxes, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching gift boxes:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred while fetching gift boxes';

    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json(
      {
        error: 'Failed to fetch gift boxes',
        details: errorMessage,
        timestamp: new Date().toISOString(),
        path: '/api/gift-boxes'
      },
      {
        status: statusCode,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
