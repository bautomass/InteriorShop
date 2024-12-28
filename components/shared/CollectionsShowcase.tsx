'use client';

import { Collection } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CollectionsShowcaseProps {
  className?: string;
}

export function CollectionsShowcase({ className = '' }: CollectionsShowcaseProps) {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        
        // Randomly select 4 collections
        const shuffled = data.collections.sort(() => 0.5 - Math.random());
        setCollections(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  if (!collections.length) return null;

  return (
    <div className={`w-full max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8 ${className} relative z-[1]`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-light text-[#6B5E4C]">
            Explore Our Collections
          </h2>
          <Compass className="w-5 h-5 text-[#B5A48B] animate-pulse" />
        </div>
        <p className="mt-2 text-[#8C7E6A]">
          Discover more categories that might interest you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.handle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              href={`/collections/${collection.handle}`}
              className="group block relative overflow-hidden rounded-lg aspect-[3/4] z-[2]"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 z-[15]" />
              
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 z-[10]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[#FAF7F2] z-[10]" />
              )}
              
              <div className="absolute inset-0 z-[20] flex flex-col justify-end p-6">
                <motion.h3 
                  className="text-white text-xl font-medium mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {collection.title}
                </motion.h3>
                
                {collection.description && (
                  <motion.p 
                    className="text-white/90 text-sm line-clamp-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {collection.description}
                  </motion.p>
                )}
                
                <motion.span 
                  className="mt-4 inline-block text-white text-sm border-b border-white/50 pb-1
                           group-hover:border-white transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Explore Collection →
                </motion.span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 