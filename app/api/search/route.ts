// app/api/search/route.ts
import { getProducts, searchCollections } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');

    if (!searchQuery) {
      return NextResponse.json({
        products: [],
        collections: []
      });
    }

    // Execute both searches in parallel
    const [products, collections] = await Promise.all([
      getProducts({ 
        query: searchQuery,
        sortKey: 'RELEVANCE'
      }).catch(error => {
        console.error('Product search error:', error);
        return [];
      }),
      searchCollections({ 
        query: searchQuery 
      }).catch(error => {
        console.error('Collection search error:', error);
        return [];
      })
    ]);

    // Format response
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
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : String(error)) : undefined,
        products: [], 
        collections: [] 
      },
      { status: 200 }
    );
  }
}