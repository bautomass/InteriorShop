'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CircleOff, Leaf, LucideIcon, ShieldCheck, Sprout } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Material {
  name: string;
  description: string;
  color: string;
  specs: {
    origin: string;
    sustainability: string;
    properties: string[];
  };
}

const materials: Material[] = [
    {
        name: 'Wild Sage',
        description: 'Hand-harvested Mediterranean herbs, naturally dried and preserved',
        color: '#E5E0DB',
        specs: {
            origin: 'Mediterranean hillsides',
            sustainability: 'Seasonal harvesting cycles',
            properties: ['Aromatherapeutic', 'Long-lasting', 'Natural fragrance']
        }
    },
  {
    name: 'Organic Clay',
    description: 'Pure earthen clay, shaped and finished by artisan hands',
    color: '#BEB5A7',
    specs: {
      origin: 'Local quarries',
      sustainability: 'Natural material, zero waste processing',
      properties: ['Temperature regulating', 'Moisture balancing', 'Non-toxic']
    }
  },
    {
      name: 'Natural Wood',
      description: 'Sustainably sourced raw timber, celebrating natural grain patterns',
      color: '#D4C4B5',
      specs: {
        origin: 'FSC-certified forests',
        sustainability: 'Renewable resource with minimal processing',
        properties: ['Durable', 'Breathable', 'Natural grain variety']
      }
    },
];

const wellnessFeatures = [
  {
    icon: Leaf,
    title: 'Natural Harmony',
    description: 'Materials that bring nature\'s calming presence into your space',
    expandedContent: {
      title: 'The Science of Biophilic Design',
      highlights: [
        'Research shows exposure to natural materials reduces cortisol levels by up to 60%',
        'Increases cognitive function and creativity by 15% through improved air quality',
        'Natural textures trigger parasympathetic nervous system response'
      ],
      keyBenefit: 'Proven to reduce stress and anxiety while improving sleep quality by up to 40%',
      citation: 'Based on Environmental Health Perspectives studies'
    }
  },
  {
    icon: ShieldCheck,
    title: 'Health Conscious',
    description: 'Non-toxic materials promoting better indoor air quality',
    expandedContent: {
      title: 'Advanced Air Purification',
      highlights: [
        'Natural materials actively filter up to 85% of indoor air pollutants',
        'Reduces respiratory irritants by naturally regulating humidity levels',
        'Eliminates off-gassing common in synthetic materials'
      ],
      keyBenefit: 'Creates medical-grade air quality, reducing respiratory issues by up to 30%',
      citation: 'Validated by Indoor Air Quality studies'
    }
  },
  {
    icon: Sprout,
    title: 'Sustainable Living',
    description: 'Eco-friendly choices for a better tomorrow',
    expandedContent: {
      title: 'Environmental Impact',
      highlights: [
        'Carbon negative manufacturing process absorbs more CO2 than produced',
        'Zero waste production cycle with 100% biodegradable materials',
        'Supports regenerative farming practices'
      ],
      keyBenefit: 'Each piece removes 50kg of CO2 from the atmosphere over its lifetime',
      citation: 'Certified by Environmental Product Declaration'
    }
  },
  {
    icon: CircleOff,
    title: 'Zero Toxins',
    description: 'Free from harmful chemicals and synthetic treatments',
    expandedContent: {
      title: 'Clinical Purity Standards',
      highlights: [
        'Exceeds medical-grade material purity requirements',
        'Zero VOCs, formaldehyde, or synthetic binding agents',
        'Antimicrobial properties through natural compounds'
      ],
      keyBenefit: 'Creates a clinical-grade hypoallergenic environment, safe for sensitive individuals',
      citation: 'Verified by Independent Laboratory Testing'
    }
  }
];

interface FeatureCardProps {
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    expandedContent: {
      title: string;
      highlights: string[];
      keyBenefit: string;
      citation: string;
    };
  };
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

const FeatureCard = ({ feature, index, isExpanded, onClick }: FeatureCardProps) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300 cursor-pointer",
        isExpanded ? "bg-white/80 p-8" : "bg-white/50 p-6"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <feature.icon className="h-8 w-8 text-[#6B5E4C]" />
          <ChevronDown className={cn(
            "h-5 w-5 text-[#6B5E4C] transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )} />
        </div>
        <h3 className="mt-4 text-lg font-medium text-[#6B5E4C]">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm text-[#8C7E6A]">
          {feature.description}
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border-t border-[#6B5E4C]/20 pt-4"
            >
              <h4 className="text-md font-semibold text-[#6B5E4C]">
                {feature.expandedContent.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {feature.expandedContent.highlights.map((highlight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start text-sm text-[#8C7E6A]"
                  >
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6B5E4C]" />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 rounded-lg bg-[#6B5E4C]/5 p-3"
              >
                <p className="text-sm font-medium text-[#6B5E4C]">
                  Key Benefit:
                </p>
                <p className="mt-1 text-sm text-[#8C7E6A]">
                  {feature.expandedContent.keyBenefit}
                </p>
                <p className="mt-2 text-xs text-[#8C7E6A]/70 italic">
                  {feature.expandedContent.citation}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function MaterialsSection() {
  const [selectedMaterial, setSelectedMaterial] = useState(2);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

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
          <motion.div
            className="relative"
          >
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
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>

              {/* Material Indicators */}
              <div className="absolute inset-0">
                {materials.map((material, index) => {
                  const positions = [
                    'left-[30%] top-[32.5%]',
                    'right-[45%] top-[45%]',
                    'left-[30%] bottom-[35%]'
                  ];

                  return (
                    <div
                      key={material.name}
                      className={cn(
                        'absolute inline-flex group',
                        positions[index]
                      )}
                    >
                      <motion.button
                        initial={false}
                        animate={selectedMaterial === index ? {
                          scale: [1, 1.2, 1],
                          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
                        } : {}}
                        onClick={() => setSelectedMaterial(index)}
                        className="relative z-10"
                        aria-label={`View ${material.name} details`}
                      >
                        {/* Animated rings */}
                        <div className={cn(
                          "absolute -inset-1 rounded-full",
                          selectedMaterial === index ? "animate-ping bg-[#dcd5ca]/60" : ""
                        )} />
                        
                        {/* Main dot */}
                        <div className={cn(
                          "h-4 w-4 rounded-full border-2 transition-all duration-300",
                          selectedMaterial === index
                            ? "border-[#9c826b] bg-[#ebe7e0] scale-125"
                            : "border-[#9c826b] bg-white/80"
                        )} />
                      </motion.button>

                      {/* Info popup */}
                      <div className={cn(
                        "absolute left-full top-1/2 ml-2 min-w-[200px] -translate-y-1/2 rounded-lg border border-[#b39e86] bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 z-20",
                        selectedMaterial === index
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-4 opacity-0 pointer-events-none"
                      )}>
                        <h4 className="text-lg font-medium text-[#9c826b]">
                          {material.name}
                        </h4>
                        <p className="mt-1 text-sm text-[#9c826b]/80">
                          {material.description}
                        </p>
                        <div className="mt-3 space-y-2 text-xs">
                          <p><span className="font-medium">Origin:</span> {material.specs.origin}</p>
                          <p><span className="font-medium">Sustainability:</span> {material.specs.sustainability}</p>
                          <div className="flex flex-wrap gap-1">
                            {material.specs.properties.map(prop => (
                              <span
                                key={prop}
                                className="rounded-full bg-[#9c826b]/10 px-2 py-0.5 text-[10px] font-medium text-[#9c826b]"
                              >
                                {prop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Material Selection Pills - Moved here */}
            <div className="mt-8 flex gap-3 lg:hidden">
              {materials.map((material, index) => (
                <button
                  key={material.name}
                  onClick={() => setSelectedMaterial(index)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    selectedMaterial === index
                      ? "bg-[#6B5E4C] text-white"
                      : "bg-white/50 text-[#6B5E4C]"
                  )}
                >
                  {material.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="flex flex-col justify-center lg:pl-8"
          >
            <h2 className="text-3xl font-light text-[#6B5E4C] sm:text-4xl md:text-5xl">
              Natural Materials,
              <br />
              <span className="font-medium">Enhanced Wellbeing</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-[#8C7E6A]">
              Every material in our collection is thoughtfully chosen to create harmony 
              between your space and nature, promoting both environmental and personal wellness.
            </p>

            {/* Features Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {wellnessFeatures.map((feature, index) => (
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
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
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