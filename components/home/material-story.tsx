// components/home/material-story.tsx
'use client';

import { motion } from 'framer-motion';

export function MaterialStory() {
  return (
    <section className="bg-primary-900 dark:bg-primary-950 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square"
          >
            <img
              src="/api/placeholder/800/800"
              alt="Natural materials"
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-primary-50 text-4xl font-light">Materials with Meaning</h2>
            <div className="text-primary-200 space-y-8">
              <p className="text-lg">
                Every piece in our collection celebrates natural materials and traditional
                craftsmanship, embodying the essence of Wabi-Sabi aesthetics.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-primary-50 mb-2 text-xl font-medium">Natural Wood</h3>
                  <p>Sustainably sourced hardwoods with unique grain patterns.</p>
                </div>
                <div>
                  <h3 className="text-primary-50 mb-2 text-xl font-medium">Raw Stone</h3>
                  <p>Locally quarried marble and limestone with natural variations.</p>
                </div>
                <div>
                  <h3 className="text-primary-50 mb-2 text-xl font-medium">Pure Linen</h3>
                  <p>Organic textiles that age beautifully over time.</p>
                </div>
                <div>
                  <h3 className="text-primary-50 mb-2 text-xl font-medium">Artisan Clay</h3>
                  <p>Hand-thrown ceramics with unique textures and glazes.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
