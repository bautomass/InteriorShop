// components/home/design-showcase.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const designs = [
  {
    title: 'Minimalist Living',
    description: 'Clean lines meet natural textures',
    image: '/api/placeholder/600/800'
  },
  {
    title: 'Japandi Style',
    description: 'Scandinavian simplicity meets Japanese aesthetics',
    image: '/api/placeholder/600/800'
  },
  {
    title: 'Wabi-Sabi Beauty',
    description: 'Finding perfection in imperfection',
    image: '/api/placeholder/600/800'
  }
];

export function DesignShowcase() {
  return (
    <section className="bg-primary-50 dark:bg-primary-900 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-900 dark:text-primary-50 text-4xl font-light"
          >
            Design Philosophy
          </motion.h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {designs.map((design, index) => (
            <motion.div
              key={design.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-primary-200 dark:bg-primary-800 aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={design.image}
                  alt={design.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-primary-900 dark:text-primary-50 text-2xl font-medium">
                  {design.title}
                </h3>
                <p className="text-primary-600 dark:text-primary-300 mt-2">{design.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/search"
            className="bg-primary-900 text-primary-50 hover:bg-primary-800 dark:bg-primary-50 dark:text-primary-900 dark:hover:bg-primary-200 inline-block rounded-full px-8 py-3 text-sm font-medium"
          >
            Explore All Designs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
