import { getProductsByTag } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  if (!tag) {
    return NextResponse.json({ error: 'Tag parameter is required' }, { status: 400 });
  }

  try {
    console.log('API Route - Fetching products for tag:', tag);
    const products = await getProductsByTag(tag);
    console.log('API Route - Raw products response:', products);
    
    // Check if products exist and have length
    if (!products || products.length === 0) {
      console.log('API Route - No products found for tag:', tag);
    } else {
      console.log('API Route - Found', products.length, 'products');
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('API Route - Failed to fetch products by tag:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}