// /components/blog/article-card.tsx
import { Article } from '@/lib/shopify/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-primary-800"
    >
      {article.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.image.url}
            alt={article.image.altText || article.title}
            width={800}
            height={450}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 text-xl font-semibold text-primary-900 group-hover:text-primary-600 dark:text-primary-50 dark:group-hover:text-primary-300">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mb-4 line-clamp-2 flex-1 text-primary-600 dark:text-primary-300">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-primary-500 dark:text-primary-400">
          {article.author && <span>By {article.author.name}</span>}
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}
