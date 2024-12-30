
// // app/api/anturam-stools/route.ts
import { getCollectionProducts } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching Anturam stools collection...');
    const products = await getCollectionProducts({
      collection: 'anturam-eco-wooden-stools',
      sortKey: 'CREATED_AT',
      reverse: true
    });
    
    console.log('Products fetched:', products?.length || 0);
    
    if (!products || products.length === 0) {
      console.log('No products found');
      return NextResponse.json({ 
        products: [],
        message: 'No products found in collection' 
      });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}








// export async function GET() {
//   try {
//     const products = await getCollectionProducts({
//       collection: 'anturam-eco-wooden-stools',
//       sortKey: 'CREATED_AT',
//       reverse: true
//     })
    
//     if (!products || products.length === 0) {
//       return NextResponse.json({ 
//         products: [],
//         message: 'No products found in collection' 
//       })
//     }

//     return NextResponse.json({ products })
//   } catch (error) {
//     return NextResponse.json(
//       { 
//         error: 'Error fetching products',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// } 