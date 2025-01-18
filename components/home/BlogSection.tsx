'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BlogArticle {
  node: {
    id: string;
    title: string;
    handle: string;
    excerpt?: string;
    publishedAt: string;
    content: string;
    image?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    } | null;
  };
}

interface ApiResponse {
  articles: BlogArticle[];
  error?: string;
}

const BlogSection = () => {
  const [articles, setArticles] = useState<BlogArticle['node'][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog');
        if (!response.ok) throw new Error('Failed to fetch blog articles');
        const data = await response.json() as ApiResponse;
        if (data.error) throw new Error(data.error);
        if (data.articles) {
          const fetchedArticles = data.articles.map(({ node }) => node);
          setArticles(fetchedArticles);
        }
      } catch (error) {
        console.error('Error fetching blog articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to load blog articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const navigateArticles = (direction: 'up' | 'down') => {
    setCurrentIndex(prevIndex => {
      if (direction === 'up') {
        return prevIndex === 0 ? articles.length - 2 : prevIndex - 2;
      } else {
        return prevIndex >= articles.length - 2 ? 0 : prevIndex + 2;
      }
    });
  };

  if (isLoading || error) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 min-h-[500px] flex items-center justify-center">
        {isLoading ? (
          <div className="animate-pulse text-primary-600">Loading...</div>
        ) : (
          <p className="text-red-600">{error}</p>
        )}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f8f7f4] py-6 md:py-12">
      <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#eaeadf] opacity-90 blur-[150px] pointer-events-none" />
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 md:gap-8 lg:gap-12">
          {/* Left content - Mobile Optimized */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-1/3 lg:sticky lg:top-24"
          >
            <div className="relative mb-8 lg:mb-0">
              {/* Decorative line */}
              <div className="absolute top-0 left-0 w-12 md:w-16 h-0.5 bg-[#8B7355]" />
              
              <div className="pt-8 space-y-4 md:space-y-6 lg:space-y-8">
                <div>
                  <span className="inline-block text-[#8B7355] font-medium tracking-wide text-xs md:text-sm uppercase mb-2 md:mb-3">
                    Latest Stories
                  </span>
                  <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-tight">
                    Discover Our Latest
                    <span className="block mt-1 font-medium">Design Insights</span>
                  </h2>
                </div>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-prose">
                  Explore our curated collection of articles featuring modern living ideas, design inspiration, and lifestyle tips.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#8B7355] text-white rounded-full 
                             hover:bg-[#6F5B3E] transition-all duration-300 text-sm md:text-base w-full sm:w-auto justify-center"
                  >
                    View All Articles
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <span className="text-sm text-gray-500 pl-2">
                    {articles.length} Articles
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Right content - Mobile Optimized */}
          <div className="w-full lg:w-2/3">
            <div className="lg:pl-8 xl:pl-12">
              {/* Navigation Button - Top */}
              <div className="relative mb-4 md:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay" />
                <button
                  onClick={() => navigateArticles('up')}
                  className="w-full py-2 md:py-3 flex justify-center items-center 
                           group hover:bg-black/5 transition-all duration-300 backdrop-blur-sm rounded-lg"
                  aria-label="Previous articles"
                >
                  <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-[#8B7355] opacity-100 group-hover:opacity-100 
                                      group-hover:scale-110 transition-all duration-300" />
                </button>
              </div>

              {/* Articles Container - Mobile Optimized */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {articles.slice(currentIndex, currentIndex + 2).map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link href={`/blog/${article.handle}`}>
                          <div className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 
                                      hover:shadow-xl transition-all duration-300">
                            {article.image ? (
                              <>
                                <Image
                                  src={article.image.url}
                                  alt={article.image.altText || article.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                  priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent
                                            opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
                                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 translate-y-full 
                                              group-hover:translate-y-0 transition-transform duration-500">
                                  <motion.h3 
                                    className="text-base md:text-lg font-medium text-white opacity-0 group-hover:opacity-100 
                                             transition-opacity duration-500 delay-100 line-clamp-2"
                                  >
                                    {article.title}
                                  </motion.h3>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No image available</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              {/* Navigation Button - Bottom */}
              <div className="relative mt-4 md:mt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay" />
                <button
                  onClick={() => navigateArticles('down')}
                  className="w-full py-2 md:py-3 flex justify-center items-center 
                           group hover:bg-black/5 transition-all duration-300 backdrop-blur-sm rounded-lg"
                  aria-label="Next articles"
                >
                  <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-[#8B7355] opacity-100 group-hover:opacity-100 
                                        group-hover:scale-110 transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;