// app/api/gift-boxes/route.ts
import { getCollectionProducts } from 'lib/shopify';
import { Product, ProductImage, ProductOption } from 'lib/shopify/types';
import { NextResponse } from 'next/server';

interface GiftBoxImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
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

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'gift-boxes-1'
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No gift boxes found' }, { status: 404 });
    }

    const giftBoxes: GiftBox[] = products.map((product: Product) => {
      // Process all images with proper formatting
      const processedImages = product.images.map((image: ProductImage) => ({
        url: image.url,
        altText: image.altText || product.title,
        width: image.width,
        height: image.height
      }));

      // Process variants with their specific images
      const processedVariants = product.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: parseFloat(variant.price.amount),
        selectedOptions: variant.selectedOptions,
        image: variant.image
          ? {
              url: variant.image.url,
              altText: variant.image.altText || `${product.title} - ${variant.title}`,
              width: variant.image.width,
              height: variant.image.height
            }
          : undefined
      }));

      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        featuredImage: product.featuredImage
          ? {
              url: product.featuredImage.url,
              altText: product.featuredImage.altText || product.title,
              width: product.featuredImage.width,
              height: product.featuredImage.height
            }
          : processedImages[0], // Fallback to first image if no featured image
        images: processedImages,
        variants: processedVariants,
        options: product.options,
        selectedVariant: product.selectedVariant
          ? {
              id: product.selectedVariant.id,
              price: parseFloat(product.selectedVariant.price.amount),
              title: product.selectedVariant.title
            }
          : undefined
      };
    });

    // Add cache control headers for better performance
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    };

    return NextResponse.json(giftBoxes, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching gift boxes:', error);

    // Enhanced error handling with more specific error messages
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

// Add rate limiting if needed
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

// // app/api/gift-boxes/route.ts
// import { getCollectionProducts } from 'lib/shopify';
// import { Product, ProductOption } from 'lib/shopify/types';
// import { NextResponse } from 'next/server';

// interface GiftBox {
//   id: string;
//   handle: string;
//   title: string;
//   variants: Array<{
//     id: string;
//     title: string;
//     price: number;
//     selectedOptions: {
//       name: string;
//       value: string;
//     }[];
//   }>;
//   options: ProductOption[];
//   image?: {
//     url: string;
//     altText: string;
//   };
//   selectedVariant?: {
//     id: string;
//     price: number;
//     title: string;
//   };
// }

// export async function GET() {
//   try {
//     const products = await getCollectionProducts({
//       collection: 'gift-boxes-1'
//     });

//     if (!products || products.length === 0) {
//       return NextResponse.json({ error: 'No gift boxes found' }, { status: 404 });
//     }

//     const giftBoxes: GiftBox[] = products.map((product: Product) => ({
//       id: product.id,
//       handle: product.handle,
//       title: product.title,
//       variants: product.variants.map((variant) => ({
//         id: variant.id,
//         title: variant.title,
//         price: parseFloat(variant.price.amount),
//         selectedOptions: variant.selectedOptions
//       })),
//       options: product.options,
//       image: product.featuredImage
//         ? {
//             url: product.featuredImage.url,
//             altText: product.featuredImage.altText || product.title
//           }
//         : undefined
//     }));

//     return NextResponse.json(giftBoxes);
//   } catch (error) {
//     console.error('Error fetching gift boxes:', error);
//     return NextResponse.json(
//       {
//         error: 'Failed to fetch gift boxes',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }
