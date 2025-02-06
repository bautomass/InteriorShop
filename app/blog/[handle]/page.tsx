import { getBlogQuery } from 'lib/shopify/queries/blog';
import { Article } from 'lib/shopify/types';
import { shopifyFetch } from 'lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleContent } from './article-content';

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
      query: getBlogQuery,
      variables: {
        handle: 'news',
        first: 20
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
      query: getBlogQuery,
      variables: {
        handle: 'news',
        first: 20
      },
      cache: 'force-cache'
    })) as BlogResponse;

    const articles = response.body.data.blog?.articles?.edges || [];
    const currentIndex = articles.findIndex((edge) => edge.node.handle === handle);
    
    if (currentIndex === -1) {
      notFound();
    }

    const article = articles[currentIndex]?.node;
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1]?.node : undefined;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1]?.node : undefined;

    return <ArticleContent 
      article={article!}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    />;
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
