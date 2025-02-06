// /app/blog/[handle]/page.tsx
import { formatDate } from '@/lib/utils';
import { getArticleQuery } from 'lib/shopify/queries/blog';
import { Article } from 'lib/shopify/types';
import { shopifyFetch } from 'lib/utils';
import { Calendar, User } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    handle: string;
  };
}

interface BlogResponse {
  body: {
    data: {
      blog: {
        articles: {
          edges: Array<{
            node: Article;
          }>;
        };
      };
    };
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle ?? '';

  try {
    const response = (await shopifyFetch({
      query: getArticleQuery,
      variables: {
        blogHandle: 'news',
        articleHandle: handle
      },
      cache: 'force-cache'
    })) as BlogResponse;

    const article = response.body.data.blog?.articles?.edges?.[0]?.node;

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The article you are looking for does not exist.'
      };
    }

    return {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'There was an error loading the article.'
    };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle ?? '';

  try {
    const response = (await shopifyFetch({
      query: getArticleQuery,
      variables: {
        blogHandle: 'news',
        articleHandle: handle
      },
      cache: 'force-cache'
    })) as BlogResponse;

    const article = response.body.data.blog?.articles?.edges?.[0]?.node;

    if (!article) {
      notFound();
    }

    return (
      <main className="relative min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-primary-900">
        <article className="relative mx-auto max-w-4xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
          {/* Hero Image */}
          {article.image && (
            <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-2xl bg-primary-100 dark:bg-primary-800">
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={article.image.width || 2100}
                height={article.image.height || 900}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          )}

          {/* Article Header */}
          <header className="relative mb-12 text-center">
            <h1 className="mb-6 bg-gradient-to-b from-primary-900 to-primary-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-primary-50 dark:to-primary-200 sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm text-primary-600 dark:text-primary-300">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary-400" />
                  <span>{article.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary-400" />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </div>
            </div>
          </header>

          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="mb-12">
              <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-primary-600 dark:text-primary-300">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="relative">
            <div
              className="prose prose-lg mx-auto prose-headings:text-primary-900 prose-p:text-primary-700 prose-a:text-accent-600 prose-strong:text-primary-900 dark:prose-invert dark:prose-headings:text-primary-50 dark:prose-p:text-primary-300 dark:prose-strong:text-primary-50"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Subtle Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-primary-900" />
        </article>
      </main>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
