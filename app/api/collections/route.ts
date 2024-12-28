//api/collections/route.ts
import { getCollections } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collections = await getCollections();
    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error in collections route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' }, 
      { status: 500 }
    );
  }
}

