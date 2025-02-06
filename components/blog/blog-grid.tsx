'use client';

import { Article } from '@/lib/shopify/types';
import { formatDate } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ExtendedArticle extends Article {
  tags?: string[];
}

interface BlogGridProps {
  articles: ExtendedArticle[];
}

export function BlogGrid({ articles }: BlogGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {articles.map((article, index) => {
        const isHovered = hoveredIndex === index;
        const isAdjacent = hoveredIndex !== null && 
          Math.abs((hoveredIndex % 4) - (index % 4)) <= 1 && 
          Math.abs(Math.floor(hoveredIndex / 4) - Math.floor(index / 4)) <= 1;

        return (
          <Link
            key={article.handle}
            href={`/blog/${article.handle}`}
            className="group relative aspect-square cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Image Container with Parallax */}
            <div className="relative h-full w-full transform-gpu transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02]">
              {article.image ? (
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  width={600}
                  height={600}
                  className={`h-full w-full object-cover transition-all duration-700 ease-out
                    ${isHovered ? 'scale-105 blur-[2px]' : 'scale-100'}
                    ${isAdjacent ? 'scale-[0.98] brightness-[0.7]' : ''}
                  `}
                  priority={index < 4}
                />
              ) : (
                <div className="h-full w-full bg-primary-100 dark:bg-primary-800" />
              )}

              {/* Gradient Overlay with Enhanced Animation */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-700 ease-out
                  ${isHovered ? 'opacity-90' : 'opacity-0'}
                `}
              />

              {/* Premium Border Effect */}
              <div 
                className={`absolute inset-0 border-2 transition-all duration-700 ease-out
                  ${isHovered ? 'border-white/20 scale-95' : 'border-transparent scale-100'}
                `}
              />

              {/* Content with Staggered Animation */}
              <div 
                className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ease-out
                  ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                `}
              >
                {/* Tag with Glow Effect */}
                {article.tags && article.tags.length > 0 && (
                  <span 
                    className="mb-3 inline-block text-sm font-medium text-white/90 transition-colors duration-300"
                    style={{
                      textShadow: isHovered ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
                    }}
                  >
                    {article.tags[0]}
                  </span>
                )}
                
                {/* Title with Staggered Reveal */}
                <h2 className="mb-2 text-lg font-bold text-white transition-transform delay-75 duration-500">
                  {article.title}
                </h2>

                {/* Excerpt with Fade Effect */}
                {article.excerpt && (
                  <p className="mb-4 line-clamp-2 text-sm text-white/80 transition-opacity delay-100 duration-500">
                    {article.excerpt}
                  </p>
                )}

                {/* Footer with Slide-up Animation */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <time 
                    dateTime={article.publishedAt}
                    className="text-xs text-white/70"
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                  <div className="group/arrow relative overflow-hidden rounded-full border border-white/20 p-2">
                    <ArrowUpRight 
                      size={20} 
                      className="text-white transition-all duration-500 group-hover:-translate-y-[150%]" 
                    />
                    <ArrowUpRight 
                      size={20} 
                      className="absolute left-2 top-2 text-white transition-all duration-500 translate-y-[150%] group-hover:translate-y-0" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
