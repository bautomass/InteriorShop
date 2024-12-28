// components/home/material-story.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

// Separate types for better reusability
type MaterialType = {
  title: string;
  shortDescription: string;
  fullDescription: string;
};

interface MaterialCardProps extends MaterialType {
  isOpen: boolean;
  onToggle: () => void;
}

// Memoize decorative element to prevent unnecessary re-renders
const DecorativePattern = memo(({ isOpen }: { isOpen: boolean }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    transition={{ duration: 0.3, delay: isOpen ? 0.2 : 0 }}
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.03) 50%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.03) 50%, transparent 52%)
      `,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 0 0',
    }}
  >
    <div className="absolute inset-0" 
         style={{
           background: `
             linear-gradient(135deg, 
             rgba(255, 255, 255, 0.02) 0%,
             transparent 50%,
             rgba(0, 0, 0, 0.03) 100%)
           `
         }}
    />
  </motion.div>
));
DecorativePattern.displayName = 'DecorativePattern';

// Memoize the MaterialCard component
const MaterialCard = memo(function MaterialCard({ 
  title, 
  shortDescription, 
  fullDescription, 
  isOpen, 
  onToggle 
}: MaterialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Memoize handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }, [onToggle]);

  return (
    <motion.div 
      ref={cardRef}
      className="relative h-[220px] group"
      initial={false}
      animate={{ 
        height: isOpen ? 'auto' : '220px',
        scale: isOpen ? 1.02 : 1
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        scale: {
          duration: 0.3,
          ease: [0.34, 1.56, 0.64, 1]
        }
      }}
    >
      <div 
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyPress}
        className="relative p-6 rounded-xl w-full h-full overflow-hidden
                  bg-gradient-to-br from-primary-800/30 to-primary-800/20
                  border border-primary-700/20 backdrop-blur-sm
                  transition-all duration-300
                  hover:border-primary-700/30
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <DecorativePattern isOpen={isOpen} />
        <div className="relative z-10">
          <div 
            className="flex items-center justify-between cursor-pointer gap-4"
            onClick={onToggle}
          >
            <motion.h3 
              className="text-primary-50 text-lg font-medium leading-tight"
              layout="position"
            >
              {title}
            </motion.h3>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-50 text-xl font-light 
                       hover:text-primary-200 transition-colors
                       flex-shrink-0 w-8 h-8 flex items-center justify-center
                       rounded-full bg-primary-800/40 hover:bg-primary-800/60"
              aria-label={isOpen ? `Collapse ${title} section` : `Expand ${title} section`}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? '−' : '+'}
              </motion.span>
            </motion.button>
          </div>
          
          <AnimatePresence>
            <motion.div 
              className="relative"
              layout="position"
            >
              <div className="mt-3 text-sm text-primary-200">
                <p className="leading-relaxed">{shortDescription}</p>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3, delay: 0.1 }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-4 p-4 rounded-lg bg-primary-800/40 text-primary-300 text-sm
                             origin-top transform-gpu"
                  >
                    {fullDescription}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

// Memoize the materials data
const MATERIALS_DATA = [
  {
    title: "Natural Wood",
    shortDescription: "Hardwoods naturally regulate indoor humidity and create a calming environment through biophilic connection.",
    fullDescription: "Scientific studies show that wood in living spaces can lower blood pressure and stress levels. The porous structure helps filter air pollutants and maintain optimal indoor humidity levels between 40-60%. Wood's natural variations in grain patterns and colors create unique aesthetic qualities in each piece."
  },
  {
    title: "Raw Stone",
    shortDescription: "Natural stone acts as a thermal mass regulator, helping maintain consistent room temperatures.",
    fullDescription: "Stone's high thermal mass properties allow it to absorb heat during warm periods and release it when temperatures drop. Research indicates that stone surfaces can reduce temperature fluctuations by up to 25% compared to synthetic materials, contributing to natural climate control."
  },
  {
    title: "Pure Linen",
    shortDescription: "Linen offers natural antimicrobial and hypoallergenic properties with exceptional durability.",
    fullDescription: "Laboratory testing confirms linen can absorb up to 20% of its weight in moisture while staying dry to touch. The hollow fiber structure provides natural temperature regulation. Studies show its antimicrobial properties can reduce bacterial growth by up to 89%."
  },
  {
    title: "Artisan Clay",
    shortDescription: "Traditional ceramics excel in heat retention and provide natural food preservation benefits.",
    fullDescription: "Scientific testing demonstrates that traditional ceramics retain heat up to 20% longer than modern synthetic alternatives. The natural porosity of clay enables moisture regulation, which can enhance food preservation and flavor development."
  }
] as const;

export function MaterialStory() {
  const materials = useMemo(() => MATERIALS_DATA, []);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenCardIndex(openCardIndex === index ? null : index);
  }, [openCardIndex]);

  return (
    <section 
      className="bg-primary-900 dark:bg-primary-950 py-16 sm:py-24"
      aria-labelledby="materials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square"
          >
            <Image
              src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/real-materials_1.jpg?v=1732907424"
              alt="Natural materials showcasing wood, stone, linen, and clay craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
              loading="eager"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 mb-8">
              <h2 id="materials-heading" className="text-primary-50 text-3xl sm:text-4xl font-light">
                Materials with Meaning
              </h2>
              <p className="text-primary-200 text-base sm:text-lg">
                Natural materials and traditional craftsmanship, embodying timeless aesthetics while providing
                tangible benefits for well-being and environment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((material, index) => (
                <MaterialCard
                  key={material.title}
                  {...material}
                  isOpen={openCardIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}