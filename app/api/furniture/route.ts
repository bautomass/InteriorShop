// app/api/furniture/route.ts
import { getCollectionProducts } from '@/lib/shopify'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'organic-decoration', // Your actual Shopify collection handle
      sortKey: 'CREATED_AT',
      reverse: true
    })

    if (!products) {
      return NextResponse.json(
        { error: 'No products found' }, 
        { status: 404 }
      )
    }

    console.log(`Fetched ${products.length} furniture products`)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching furniture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}