// /app/blog/page.tsx
import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import { getBlogQuery } from 'lib/shopify/queries/blog';
import { shopifyFetch } from 'lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BlogGrid } from '../../components/blog/blog-grid';
import { BlogHero } from '../../components/blog/hero-section';
import { SearchBar } from '../../components/blog/search-bar';

export const metadata: Metadata = {
  title: 'Blog | Modern Living',
  description: 'Explore our latest articles, tips, and insights about modern living and design.',
  openGraph: {
    title: 'Blog | Modern Living',
    description: 'Explore our latest articles, tips, and insights about modern living and design.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Living Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Modern Living',
    description: 'Explore our latest articles, tips, and insights about modern living and design.'
  }
};

interface PageProps {
  searchParams: {
    q?: string;
    sort?: string;
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  // Properly resolve searchParams
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const searchQuery = resolvedSearchParams?.q ?? '';
  const sortOption = resolvedSearchParams?.sort ?? '';
  
  let articles = [];

  try {
    const response = await shopifyFetch({
      query: getBlogQuery,
      variables: {
        handle: 'news', // Your blog handle
        first: 20 // Number of articles to fetch
      },
      cache: 'no-store'
    });

    if (response?.body?.data?.blog?.articles?.edges) {
      articles = response.body.data.blog.articles.edges.map(({ node }) => node);

      // Apply search filter if query exists
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        articles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting if specified
      if (sortOption) {
        switch (sortOption) {
          case 'date-desc':
            articles.sort((a, b) => 
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
            break;
          case 'date-asc':
            articles.sort((a, b) => 
              new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
            );
            break;
          case 'title-asc':
            articles.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            articles.sort((a, b) => b.title.localeCompare(a.title));
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-primary-50 pb-20 dark:bg-primary-900">
      <NavigationHeader />
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/50"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Suspense>
          <BlogHero />
        </Suspense>

        {/* Search Bar */}
        <Suspense>
          <SearchBar />
        </Suspense>

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-sm text-primary-600 dark:text-primary-300">
            Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
            {searchQuery && (
              <span className="ml-1">
                for "<span className="font-medium text-accent-500">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Blog Grid */}
        <section aria-label="Blog Articles">
          <BlogGrid articles={articles} />
        </section>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-white/50 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-medium text-primary-900 dark:text-primary-50">
                No Articles Found
              </h2>
              <p className="text-primary-700 dark:text-primary-200">
                {searchQuery
                  ? `No articles found for "${searchQuery}". Try a different search term.`
                  : 'Please check back later for new articles.'}
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}