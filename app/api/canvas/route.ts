import { getCollectionProducts } from '@/lib/shopify'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'canvas',
      sortKey: 'CREATED_AT',
      reverse: true
    })
    
    if (!products || products.length === 0) {
      return NextResponse.json({ 
        products: [],
        message: 'No products found in collection' 
      })
    }

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error fetching products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 