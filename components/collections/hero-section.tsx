// components/collections/hero-section.tsx
'use client';

import { motion } from 'framer-motion';

export function CollectionsHero() {
  return (
    <div className="mb-8 relative w-full min-h-[300px] lg:flex lg:items-center lg:justify-between lg:gap-12">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full opacity-10 dark:opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23534238' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px'
          }} 
        />
        
        <div className="absolute right-0 top-0 w-1/3 h-full 
                        bg-gradient-to-l from-[#C7BAA8]/20 to-transparent 
                        dark:from-[#8B7355]/20" />
        
        <div className="absolute inset-0 opacity-50 dark:opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='0' height='0' viewBox='0 0 0 0' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '0px 0px'
          }} 
        />
      </div>

      <div className="lg:text-left text-center lg:w-1/2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl lg:text-6xl"
        >
          Quality Furniture
          <br />
          for Modern Spaces
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg text-primary-700 dark:text-primary-200 lg:pr-8"
        >
          Elevate your space with our premium furniture selection. 
          We combine contemporary design with exceptional craftsmanship 
          to create lasting pieces for your home.
        </motion.p>
      </div>
    </div>
  );
}
