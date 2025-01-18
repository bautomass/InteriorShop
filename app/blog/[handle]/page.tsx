// /app/blog/[handle]/page.tsx
import { formatDate } from '@/lib/utils';
import { getArticleQuery } from 'lib/shopify/queries/blog';
import { Article } from 'lib/shopify/types';
import { shopifyFetch } from 'lib/utils';
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
      <main className="relative min-h-screen bg-primary-50 pb-20 dark:bg-primary-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/50" />
        </div>

        <article className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {article.image && (
            <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-3xl">
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={article.image.width || 2100}
                height={article.image.height || 900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}

          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-sm text-primary-600 dark:text-primary-300">
              {article.author && <span>By {article.author.name}</span>}
              <span>•</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
          </header>

          {article.excerpt && (
            <div className="mb-8">
              <p className="text-lg text-primary-700 dark:text-primary-200">{article.excerpt}</p>
            </div>
          )}

          <div
            className="prose prose-lg mx-auto dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
