'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FeatureCard } from './components/FeatureCard';
import { MaterialIndicator } from './components/MaterialIndicator';
import { MaterialSelectionPills } from './components/MaterialSelectionPills';
import { MATERIALS, MATERIAL_POSITIONS, WELLNESS_FEATURES } from './constants';
import { useMaterialState } from './hooks/useMaterialState';

export default function MaterialsSection() {
  const {
    selectedMaterial,
    isImageLoaded,
    expandedCard,
    inView,
    ref,
    handleMaterialSelect,
    handleImageLoad,
    handleCardExpand
  } = useMaterialState();

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#F9F7F4] py-24"
      aria-label="Natural Materials Story"
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[80%] w-[60%] bg-[#E5DFD8] opacity-30 blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[60%] w-[40%] bg-[#D4C4B5] opacity-20 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left Column - Image and Materials */}
          <motion.div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white/80 shadow-xl">
              <div className={cn(
                "transition-opacity duration-500",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}>
                <Image
                  src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Material-Story-Image.jpg?v=1736707104"
                  alt="Natural material samples showing wood grain, clay textures, and organic textiles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoad={handleImageLoad}
                />
              </div>

              {/* Material Indicators */}
              <div className="absolute inset-0">
                {MATERIALS.map((material, index) => (
                  <MaterialIndicator
                    key={material.name}
                    material={material}
                    index={index}
                    isSelected={selectedMaterial === index}
                    onSelect={() => handleMaterialSelect(index)}
                    position={MATERIAL_POSITIONS[index] ?? ''}
                  />
                ))}
              </div>
            </div>

            {/* Material Selection Pills */}
            <MaterialSelectionPills
              materials={MATERIALS}
              selectedIndex={selectedMaterial}
              onSelect={handleMaterialSelect}
            />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div className="flex flex-col justify-center lg:pl-8">
            <h2 className="text-3xl font-light text-[#6B5E4C] sm:text-4xl md:text-5xl">
              Natural Materials,<br />
              <span className="font-medium">Enhanced Wellbeing</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-[#8C7E6A]">
              Every material in our collection is thoughtfully chosen to create harmony 
              between your space and nature, promoting both environmental and personal wellness.
            </p>

            {/* Features Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {WELLNESS_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard
                    feature={feature}
                    index={index}
                    isExpanded={expandedCard === index}
                    onClick={() => handleCardExpand(index)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}