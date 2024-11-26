// components/collections/collection-card.tsx
'use client';

import { Collection } from '@/types/shopify';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useRef, useState } from 'react';

interface CollectionCardProps {
  collection: Collection;
  layout?: 'grid' | 'list';
}

function CollectionCardComponent({ collection, layout = 'grid' }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Only calculate scroll progress for list view
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    try {
      const stored = localStorage.getItem('viewedCollections');
      const viewedCollections = stored ? JSON.parse(stored) : [];
      const newCollection = {
        handle: collection.handle,
        title: collection.title,
        image: collection.image,
        timestamp: Date.now()
      };
      const filtered = viewedCollections.filter((c: any) => c.handle !== collection.handle);
      filtered.unshift(newCollection);
      localStorage.setItem('viewedCollections', JSON.stringify(filtered.slice(0, 10)));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  }, [collection]);

  if (layout === 'list') {
    return (
      <motion.div ref={cardRef} style={{ opacity, scale }}>
        <Link
          href={`/collections/${collection.handle}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group relative flex h-full overflow-hidden rounded-2xl border border-primary-200 bg-white/80 backdrop-blur-sm transition-all hover:border-accent-500 hover:shadow-lg dark:border-primary-700 dark:bg-primary-800/80"
        >
          {/* Image Section */}
          <div className="relative w-72 flex-shrink-0 overflow-hidden">
            {collection.image ? (
              <>
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                  priority={false}
                />
                <motion.div
                  initial={false}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
                >
                  <motion.div
                    initial={false}
                    animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-4 left-4 flex items-center gap-2 text-white"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">View Collection</span>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                <span className="text-primary-400 dark:text-primary-600">No image available</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <motion.h2
                initial={false}
                animate={{ color: isHovered ? 'var(--accent-500)' : 'currentColor' }}
                className="mb-2 text-2xl font-bold text-primary-900 dark:text-primary-50"
              >
                {collection.title}
              </motion.h2>
              {collection.description && (
                <p className="line-clamp-2 text-base text-primary-700 dark:text-primary-200">
                  {collection.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-primary-100 pt-4 dark:border-primary-700">
              <time
                dateTime={collection.updatedAt}
                className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-300"
              >
                <Clock className="h-4 w-4" />
                {new Date(collection.updatedAt).toLocaleDateString()}
              </time>
              <motion.div
                initial={false}
                animate={{ x: isHovered ? 5 : 0 }}
                className="flex items-center gap-1 text-accent-500"
              >
                <span>Explore</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <Link
      href={`/collections/${collection.handle}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-primary-200 bg-white/80 backdrop-blur-sm transition-all hover:border-accent-500 hover:shadow-lg dark:border-primary-700 dark:bg-primary-800/80"
    >
      {/* Image Section with Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {collection.image ? (
          <>
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              width={800}
              height={500}
              className="h-full w-full object-cover transition duration-300"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={false}
              quality={75}
              loading="lazy"
            />
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
            >
              <motion.div
                initial={false}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                className="absolute bottom-4 left-4 flex items-center gap-2 text-white"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">View Collection</span>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
            <span className="text-primary-400 dark:text-primary-600">No image available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <motion.h2
            initial={false}
            animate={{ color: isHovered ? 'var(--accent-500)' : 'currentColor' }}
            className="mb-2 text-2xl font-bold text-primary-900 dark:text-primary-50"
          >
            {collection.title}
          </motion.h2>
          {collection.description && (
            <p className="mb-4 line-clamp-2 text-base text-primary-700 dark:text-primary-200">
              {collection.description}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-primary-100 pt-4 dark:border-primary-700">
          <time
            dateTime={collection.updatedAt}
            className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-300"
          >
            <Clock className="h-4 w-4" />
            {new Date(collection.updatedAt).toLocaleDateString()}
          </time>
          <motion.div
            initial={false}
            animate={{ x: isHovered ? 5 : 0 }}
            className="flex items-center gap-1 text-accent-500"
          >
            <span>Explore</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </Link>
  );
}

export default memo(CollectionCardComponent);
