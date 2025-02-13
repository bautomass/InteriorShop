// /app/api/blog/route.ts
import { getBlogQuery } from '@/lib/shopify/queries/blog';
import { shopifyFetch } from '@/lib/utils';
import { NextResponse } from 'next/server';

interface ShopifyBlogResponse {
  data: {
    blog: {
      articles: {
        edges: any[];
      };
    };
  };
}

export async function GET() {
  try {
    const response = await shopifyFetch({
      query: getBlogQuery,
      variables: {
        handle: 'news', // Your blog handle
        first: 20 // Number of articles to fetch
      },
      cache: 'no-store'
    });

    // Type assertion just for the response.body
    const responseBody = response.body as ShopifyBlogResponse;

    return NextResponse.json({ articles: responseBody.data.blog.articles.edges });
  } catch (error) {
    console.error('Error in blog route:', error);
    return NextResponse.json({ error: 'Failed to fetch blog articles' }, { status: 500 });
  }
}
