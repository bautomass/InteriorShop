import { getCollectionProducts } from '@/lib/shopify'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'new-arrivals',
      sortKey: 'CREATED_AT',
      reverse: true
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
} 