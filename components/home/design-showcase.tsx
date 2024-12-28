'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const designs = [
  {
    title: 'Minimalist Living',
    description: 'Transform your space into a serene sanctuary where clean lines and natural textures create perfect harmony. Our minimalist designs eliminate clutter while maximizing both function and sophistication.',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/1_b9e2bfec-0308-4e1e-aee0-443bce25e8c4.jpg?v=1733071036',
    cta: 'Discover Minimalist Spaces',
    link: '/designs/minimalist',
    badge: {
      text: 'Less is More',
      iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    },
    theme: {
      border: 'border-slate-200 dark:border-slate-700',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
      accent: 'text-slate-600 dark:text-slate-400',
      button: 'bg-slate-900 hover:bg-slate-800 text-slate-50 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900',
      hover: 'group-hover:border-slate-300 dark:group-hover:border-slate-600',
      gradient: 'from-slate-50 to-white dark:from-slate-900/20 dark:to-slate-800/20'
    }
  },
  {
    title: 'Japandi Style',
    description: 'Experience the perfect fusion of Scandinavian functionality and Japanese elegance. This hybrid style brings warmth to modern living, combining muted colors with sustainable materials.',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_91c1c07c-d26f-4597-aec8-c0cea52e6e5e.jpg?v=1733071036',
    cta: 'Explore Japandi Collections',
    link: '/designs/japandi',
    badge: {
      text: 'Zen Fusion',
      iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    },
    theme: {
      border: 'border-amber-200 dark:border-amber-700',
      badge: 'bg-amber-50 dark:bg-amber-800 text-amber-800 dark:text-amber-100 border-amber-200 dark:border-amber-700',
      accent: 'text-amber-600 dark:text-amber-400',
      button: 'bg-amber-900 hover:bg-amber-800 text-amber-50 dark:bg-amber-100 dark:hover:bg-amber-200 dark:text-amber-900',
      hover: 'group-hover:border-amber-300 dark:group-hover:border-amber-600',
      gradient: 'from-amber-50 to-white dark:from-amber-900/20 dark:to-amber-800/20'
    }
  },
  {
    title: 'Wabi-Sabi Beauty',
    description: 'Embrace the extraordinary in the imperfect. Our Wabi-Sabi designs celebrate authentic materials and time-worn textures, creating spaces that tell stories and evolve beautifully with time.',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/3_f387cf42-ec26-43aa-848e-8ad8d2994f9f.jpg?v=1733071036',
    cta: 'View Wabi-Sabi Designs',
    link: '/designs/wabi-sabi',
    badge: {
      text: 'Perfect Imperfection',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    theme: {
      border: 'border-rose-200 dark:border-rose-700',
      badge: 'bg-rose-50 dark:bg-rose-800 text-rose-800 dark:text-rose-100 border-rose-200 dark:border-rose-700',
      accent: 'text-rose-600 dark:text-rose-400',
      button: 'bg-rose-900 hover:bg-rose-800 text-rose-50 dark:bg-rose-100 dark:hover:bg-rose-200 dark:text-rose-900',
      hover: 'group-hover:border-rose-300 dark:group-hover:border-rose-600',
      gradient: 'from-rose-50 to-white dark:from-rose-900/20 dark:to-rose-800/20'
    }
  }
];

export function DesignShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.1,
        duration: 0.5,
        ease: [0.21, 1.11, 0.81, 0.99],
      },
    }),
  };

  return (
    <section 
      className="py-24 bg-primary-50 dark:bg-primary-900"
      aria-labelledby="design-philosophy-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          id="design-philosophy-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16 text-primary-900 dark:text-primary-50"
        >
          Design Philosophy
        </motion.h2>

        <div 
          className="grid gap-12 md:grid-cols-3"
          role="list"
          aria-label="Design styles showcase"
        >
          {designs.map((design, index) => (
            <motion.div
              key={design.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className="group relative"
              role="listitem"
            >
              {/* Card Container */}
              <div className={`
                relative
                border-2 ${design.theme.border} ${design.theme.hover}
                rounded-2xl bg-gradient-to-br ${design.theme.gradient}
                transition-all duration-500 ease-out
                transform-gpu
                ${hoveredIndex === index ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-lg'}
              `}>
                {/* Badge - Updated positioning */}
                <div 
                  className={`
                    absolute z-20 right-0 -top-4 translate-x-2
                    flex items-center
                    border ${design.theme.badge}
                    px-3 py-1.5 text-sm
                    rounded-full
                    shadow-lg
                    transform transition-all duration-300
                    group-hover:translate-x-4
                  `}
                  aria-label={`${design.badge.text} badge`}
                >
                  <span className="font-bold uppercase tracking-wide">{design.badge.text}</span>
                </div>

                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={design.image}
                    alt={`${design.title} design example`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`
                      object-cover
                      rounded-2xl
                      transition-transform duration-700 ease-out
                      ${hoveredIndex === index ? 'scale-110 blur-[2px]' : 'scale-100'}
                    `}
                    loading="lazy"
                  />
                  
                  {/* Content Overlay */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 20,
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-primary-900/95 via-primary-900/80 to-primary-900/40 backdrop-blur-sm"
                  >
                    <div className="p-8 text-center">
                      <motion.h3 
                        className="text-3xl font-bold mb-4 text-primary-50"
                        initial={false}
                        animate={{
                          y: hoveredIndex === index ? 0 : 10,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {design.title}
                      </motion.h3>
                      <motion.p 
                        className="mb-6 leading-relaxed text-primary-200"
                        initial={false}
                        animate={{
                          y: hoveredIndex === index ? 0 : 10,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {design.description}
                      </motion.p>
                      <motion.div
                        initial={false}
                        animate={{
                          y: hoveredIndex === index ? 0 : 10,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Link
                          href={design.link}
                          className={`
                            inline-flex items-center justify-center
                            rounded-full ${design.theme.button}
                            px-8 py-3
                            text-sm font-medium
                            transition-all duration-300
                            hover:scale-105 
                            focus:outline-none focus:ring-2
                            focus:ring-offset-2 focus:ring-current
                          `}
                          aria-label={design.cta}
                        >
                          {design.cta}
                          <motion.span 
                            className="ml-2"
                            initial={false}
                            animate={{ x: hoveredIndex === index ? 5 : 0 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            href="/search"
            className="
              relative inline-flex items-center justify-center
              rounded-full bg-primary-900 dark:bg-primary-50
              px-8 py-4 text-base font-medium
              text-primary-50 dark:text-primary-900
              transition-all duration-300
              hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2
              focus:ring-primary-900 dark:focus:ring-primary-50
              focus:ring-offset-2
            "
          >
            <span className="absolute inset-0 rounded-full bg-primary-50/20 dark:bg-primary-900/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
            Explore All Designs
            <motion.span 
              className="ml-2"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

