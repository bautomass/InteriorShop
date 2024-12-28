// /components/blog/blog-grid.tsx
import { Article } from '@/lib/shopify/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogGridProps {
  articles: Article[];
}

export function BlogGrid({ articles }: BlogGridProps) {
  // Get featured article (first one)
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="space-y-8">
      {/* Featured Article - Now with reduced size and new design */}
      {featuredArticle && (
        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl dark:bg-primary-800">
          <div className="grid max-w-5xl gap-6 md:grid-cols-5">
            <div className="relative aspect-[16/9] overflow-hidden md:col-span-2">
              {featuredArticle.image ? (
                <Image
                  src={featuredArticle.image.url}
                  alt={featuredArticle.image.altText || featuredArticle.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-primary-100 dark:bg-primary-700" />
              )}
              <div className="absolute left-4 top-4 rotate-2 transition-transform group-hover:-rotate-2">
                <span className="rounded-full bg-accent-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                  Featured
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 md:col-span-3">
              <Link href={`/blog/${featuredArticle.handle}`} className="group-hover:text-accent-500">
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-primary-900 transition-all group-hover:text-accent-500 dark:text-primary-50">
                  {featuredArticle.title}
                </h2>
              </Link>
              {featuredArticle.excerpt && (
                <p className="mb-4 line-clamp-2 text-base text-primary-600 dark:text-primary-300">
                  {featuredArticle.excerpt}
                </p>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-primary-500 dark:text-primary-400">
                  {featuredArticle.author && (
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{featuredArticle.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <time dateTime={featuredArticle.publishedAt}>
                      {formatDate(featuredArticle.publishedAt)}
                    </time>
                  </div>
                  {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={16} />
                      <span>{featuredArticle.tags[0]}</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/blog/${featuredArticle.handle}`}
                  className="inline-flex items-center text-sm font-medium text-accent-500 transition-colors hover:text-accent-600"
                >
                  Read More
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid - Now with enhanced animations and layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regularArticles.map((article, index) => (
          <Link
            key={article.handle}
            href={`/blog/${article.handle}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-primary-800"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent-500/10 to-primary-500/10">
              {article.image ? (
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                />
              ) : (
                <div className="h-full w-full bg-primary-100 dark:bg-primary-700" />
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="absolute left-4 top-4 rotate-1 transition-transform group-hover:-rotate-2">
                  <span className="rounded-full bg-primary-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm dark:bg-primary-700/70">
                    {article.tags[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="mb-2 text-xl font-bold text-primary-900 transition-colors group-hover:text-accent-500 dark:text-primary-50">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-primary-600 dark:text-primary-300">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-primary-500 dark:text-primary-400">
                {article.author && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{article.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}