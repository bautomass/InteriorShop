// app/api/stools/route.ts
import { getCollectionProducts } from '@/lib/shopify'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await getCollectionProducts({
      collection: 'anturam-eco-wooden-stools', 
      sortKey: 'CREATED_AT',
      reverse: true
    })

    if (!products) {
      return NextResponse.json(
        { error: 'No stools found' }, 
        { status: 404 }
      )
    }

    console.log(`Fetched ${products.length} stool products`)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching stools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}