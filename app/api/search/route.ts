import { getProducts, searchCollections } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ products: [], collections: [] });
  }

  try {
    const [products, collections] = await Promise.all([
      getProducts({ 
        query: query.trim(),
        sortKey: 'RELEVANCE'
      }),
      searchCollections({ 
        query: query.trim() 
      })
    ]);

    const response = {
      products: products.map(product => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        priceRange: product.priceRange,
        featuredImage: product.featuredImage,
        createdAt: product.createdAt
      })),
      collections: collections.map(collection => ({
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
        image: collection.image
      }))
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error', products: [], collections: [] },
      { status: 500 }
    );
  }
}
