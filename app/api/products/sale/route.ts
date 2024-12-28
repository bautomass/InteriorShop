import { getProducts } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use existing getProducts without the 'first' parameter
    const products = await getProducts({
      sortKey: 'PRICE',
      reverse: false,
      query: 'compare_at_price:>0'
    });

    // Filter to ensure we only get products that are actually on sale
    const saleProducts = products.filter(product => 
      product.compareAtPriceRange?.minVariantPrice &&
      parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 
      parseFloat(product.priceRange.minVariantPrice.amount)
    );

    console.log(`Found ${saleProducts.length} products on sale`);
    return NextResponse.json({ products: saleProducts });
  } catch (error) {
    console.error('Error in /api/products/sale:', error);
    return NextResponse.json({ error: 'Error fetching sale products' }, { status: 500 });
  }
} 