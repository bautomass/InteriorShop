// components/collections/hero-section.tsx
'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function CollectionsHero() {
  return (
    <div className="mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative inline-block"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-500">
          <Sparkles className="h-4 w-4" />
          Explore Our Latest Collections
          <motion.span
            className="absolute -right-1 -top-1 flex h-3 w-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500"></span>
          </motion.span>
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 mt-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl lg:text-6xl"
      >
        Modern Living,
        <br />
        Timeless Collections
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-auto max-w-2xl text-lg text-primary-700 dark:text-primary-200"
      >
        Discover our thoughtfully curated collections of contemporary furniture and decor pieces.
        Each piece is selected to help transform your space into a modern sanctuary.
      </motion.p>
    </div>
  );
}
