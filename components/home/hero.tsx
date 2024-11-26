'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="relative min-h-screen bg-primary-50 pb-16 dark:bg-primary-900 sm:pb-24"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary-200),transparent)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[90vw] grid-cols-1 items-start gap-8 px-4 pb-8 pt-16 sm:pb-12 sm:pt-24 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1 text-sm font-medium text-accent-500">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              New Collection Available
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl lg:text-6xl xl:text-7xl">
              Modern Living,
              <br />
              <span className="text-accent-500">Timeless Design</span>
            </h1>
            <p className="max-w-xl text-lg text-primary-700 dark:text-primary-200 sm:text-xl">
              Elevate your space with our curated collection of contemporary furniture and decor
              pieces that blend form, function, and sustainable craftsmanship.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-primary-50 transition-all hover:bg-accent-600"
            >
              Shop Collection
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/gift-builder"
              className="group relative inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-6 py-3 text-sm font-semibold text-primary-900 transition-all hover:scale-105 hover:border-accent-500 hover:bg-accent-500 hover:text-primary-50 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50"
            >
              <Gift className="h-4 w-4" aria-hidden="true" />
              Build Custom Gift
              <motion.span
                className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-primary-50"
                whileHover={{ scale: 1.1, rotate: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                New
              </motion.span>
            </Link>
          </motion.div>

          {/* Gift Builder Promo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-auto rounded-2xl border border-primary-200 bg-primary-50/50 p-4 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-accent-500/10 p-2">
                <Gift className="h-6 w-6 text-accent-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary-900 dark:text-primary-50">
                  Custom Gift Builder
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-200">
                  Create personalized gift sets from our collection. Mix and match items, add custom
                  engravings, and choose premium packaging.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Featured Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-4 grid gap-4 lg:grid-cols-3"
            role="region"
            aria-label="Featured collections"
          >
            <Link
              href="/collections/wooden-blocks"
              className="group flex flex-col rounded-xl border border-primary-200 bg-primary-50/50 transition-all hover:border-accent-500 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-800/50"
              aria-label="Shop artisan wooden blocks collection"
            >
              <div className="border-b border-primary-200/50 bg-primary-100/30 p-3 dark:border-primary-700/50 dark:bg-primary-800/30">
                <span className="text-xs font-medium text-accent-500">Limited Collection</span>
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex flex-col gap-2 p-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-primary-50">
                    Wooden Blocks
                  </h3>
                  <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                    Handcrafted geometric art pieces
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent-500">From €89</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-primary-50">
                    Explore{' '}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </motion.div>
            </Link>

            <Link
              href="/collections/lamps"
              className="group flex flex-col rounded-xl border border-primary-200 bg-primary-50/50 transition-all hover:border-accent-500 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-800/50"
              aria-label="Shop designer lamps collection"
            >
              <div className="border-b border-primary-200/50 bg-primary-100/30 p-3 dark:border-primary-700/50 dark:bg-primary-800/30">
                <span className="text-xs font-medium text-accent-500">New Arrivals</span>
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="flex flex-col gap-2 p-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-primary-50">
                    Designer Lamps
                  </h3>
                  <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                    Modern lighting solutions
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent-500">From €129</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-primary-50">
                    Explore{' '}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </motion.div>
            </Link>

            <Link
              href="/collections/vases"
              className="group flex flex-col rounded-xl border border-primary-200 bg-primary-50/50 transition-all hover:border-accent-500 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-800/50"
              aria-label="Shop ceramic vases collection"
            >
              <div className="border-b border-primary-200/50 bg-primary-100/30 p-3 dark:border-primary-700/50 dark:bg-primary-800/30">
                <span className="text-xs font-medium text-accent-500">Artisan Crafted</span>
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="flex flex-col gap-2 p-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-primary-50">
                    Ceramic Vases
                  </h3>
                  <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                    Unique handmade pieces
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent-500">From €59</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-primary-50">
                    Explore{' '}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group aspect-square overflow-hidden rounded-2xl bg-primary-100 dark:bg-primary-800"
            >
              <Image
                src={`/api/placeholder/600/600?text=Furniture${i}`}
                alt={`Furniture showcase ${i}`}
                width={600}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading={i <= 2 ? 'eager' : 'lazy'}
                priority={i <= 2}
                quality={90}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
