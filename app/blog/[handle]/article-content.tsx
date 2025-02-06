'use client';

import { formatDate } from '@/lib/utils';
import { Article } from 'lib/shopify/types';
import { ArrowLeft, ArrowRight, Calendar, Copy, Facebook, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ArticleContentProps {
  article: Article;
  prevArticle?: Article;
  nextArticle?: Article;
}

function ShareButton({ onClick, icon: Icon, label }: { onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-primary-100 p-3 text-primary-600 transition-all hover:scale-105 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300 dark:hover:bg-primary-700"
      aria-label={label}
    >
      <Icon size={20} />
    </button>
  );
}
function ArticleNavigationCard({ article, type }: { article: Article; type: 'prev' | 'next' }) {
    const isPrev = type === 'prev';
    
    return (
      <Link
        href={`/blog/${article.handle}`}
        className="group relative flex flex-1 items-center gap-6 rounded-2xl bg-primary-100/50 p-6 mt-6 transition-all hover:bg-primary-200/50 dark:bg-primary-800/50 dark:hover:bg-primary-700/50"
      >
        {/* Thumbnail Image + Direction Icon */}
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-primary-200 dark:bg-primary-700">
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {isPrev ? <ArrowLeft className="h-6 w-6 text-primary-400" /> : <ArrowRight className="h-6 w-6 text-primary-400" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
  
        {/* Content */}
        <div className={`flex flex-1 flex-col ${isPrev ? '' : 'items-end text-right'}`}>
          <span className="mb-2 text-sm font-medium text-primary-500 dark:text-primary-400">
            {isPrev ? '← Previous' : 'Next →'}
          </span>
          <h3 className="line-clamp-2 text-lg font-semibold text-primary-900 transition-colors group-hover:text-accent-500 dark:text-primary-50">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-primary-600 dark:text-primary-300">
              {article.excerpt}
            </p>
          )}
        </div>
      </Link>
    );
  }

export function ArticleContent({ article, prevArticle, nextArticle }: ArticleContentProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = (platform: string, url: string) => {
    window.open(url, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

          <time 
            dateTime={article.publishedAt}
            className="flex items-center justify-center gap-2 text-sm text-primary-600 dark:text-primary-300"
          >
            <Calendar size={16} className="text-primary-400" />
            {formatDate(article.publishedAt)}
          </time>
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
        <div className="relative mb-16">
          <div
            className="prose prose-lg mx-auto prose-headings:text-primary-900 prose-p:text-primary-700 prose-a:text-accent-600 prose-strong:text-primary-900 dark:prose-invert dark:prose-headings:text-primary-50 dark:prose-p:text-primary-300 dark:prose-strong:text-primary-50"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="relative mt-16">
          {/* Share Section */}
          <div className="mb-12 text-center">
            <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-primary-500 dark:text-primary-400">
              Share this article
            </h3>
            <div className="flex items-center justify-center gap-4">
              <ShareButton
                onClick={() => handleShare('twitter', `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`)}
                icon={Twitter}
                label="Share on Twitter"
              />
              <ShareButton
                onClick={() => handleShare('facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                icon={Facebook}
                label="Share on Facebook"
              />
              <ShareButton
                onClick={handleCopy}
                icon={Copy}
                label="Copy link"
              />
            </div>
            {copySuccess && (
              <p className="mt-2 text-sm text-accent-500">Link copied to clipboard!</p>
            )}
          </div>

            {/* Article Navigation */}
            {(prevArticle || nextArticle) ? (
            <div className="mb-16 grid gap-4 border-t border-primary-200 pt-16 dark:border-primary-800 sm:grid-cols-2">
                {prevArticle && <ArticleNavigationCard article={prevArticle} type="prev" />}
                {nextArticle && <ArticleNavigationCard article={nextArticle} type="next" />}
            </div>
            ) : (
              <p>No navigation available.</p>
            )}

          {/* Back to Blog */}
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-6 py-2 text-sm font-medium text-primary-900 transition-all hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-50 dark:hover:bg-primary-700"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </footer>

        {/* Subtle Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-primary-900" />
      </article>
    </main>
  );
}
