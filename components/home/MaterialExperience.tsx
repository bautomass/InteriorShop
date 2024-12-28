"use client"
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const MaterialExperience = () => {
  const [activeMaterial, setActiveMaterial] = useState(null);
  
  const materials = [
    {
      name: "Solid Oak",
      category: "Wood",
      description: "Sustainably harvested European oak, known for its durability and distinctive grain patterns.",
      properties: ["Sustainable", "Durable", "Natural Variation"],
      care: "Regular dusting and occasional oiling maintains its beauty",
      image: "/api/placeholder/800/500",
      color: "bg-[#DEB887]"
    },
    {
      name: "Natural Linen",
      category: "Textile",
      description: "100% organic linen, woven in small batches by master craftspeople.",
      properties: ["Breathable", "Hypoallergenic", "Ages Beautifully"],
      care: "Machine washable in cold water, becomes softer with each wash",
      image: "/api/placeholder/800/500",
      color: "bg-[#F5F5DC]"
    },
    {
      name: "Raw Concrete",
      category: "Mineral",
      description: "Hand-finished concrete with natural imperfections that create unique patterns.",
      properties: ["Heat Resistant", "Unique Patina", "Versatile"],
      care: "Seal annually to maintain finish and prevent staining",
      image: "/api/placeholder/800/500",
      color: "bg-[#CDC5BF]"
    },
    {
      name: "Brass",
      category: "Metal",
      description: "Recycled brass that develops a beautiful patina over time.",
      properties: ["Recyclable", "Antimicrobial", "Living Finish"],
      care: "Allow natural patina or polish to maintain shine",
      image: "/api/placeholder/800/500",
      color: "bg-[#B5A642]"
    }
  ];

  return (
    <section className="bg-primary-900 py-24 dark:bg-primary-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-light text-primary-50">Material Stories</h2>
          <p className="mt-4 text-lg text-primary-300">
            Explore the natural materials that bring our pieces to life
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {materials.map((material, index) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group cursor-pointer overflow-hidden rounded-2xl ${
                activeMaterial === material.name ? 'row-span-2' : ''
              }`}
            >
              <div
                className="relative aspect-video overflow-hidden"
                onClick={() => setActiveMaterial(
                  activeMaterial === material.name ? null : material.name
                )}
              >
                <img
                  src={material.image}
                  alt={material.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${material.color}`} />
                    <span className="text-sm font-medium text-primary-200">
                      {material.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-light text-primary-50">{material.name}</h3>
                </div>
                <button
                  className="absolute right-4 top-4 rounded-full bg-primary-50/10 p-2 backdrop-blur-sm transition-all hover:bg-primary-50/20"
                  aria-label={activeMaterial === material.name ? 'Show less' : 'Show more'}
                >
                  {activeMaterial === material.name ? (
                    <Minus className="h-4 w-4 text-primary-50" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary-50" />
                  )}
                </button>
              </div>
              
              <AnimatePresence>
                {activeMaterial === material.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-primary-800 p-6"
                  >
                    <p className="mb-4 text-primary-200">{material.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {material.properties.map((property) => (
                        <span
                          key={property}
                          className="rounded-full bg-primary-700 px-3 py-1 text-sm text-primary-200"
                        >
                          {property}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-lg bg-primary-700/50 p-4">
                      <h4 className="mb-2 font-medium text-primary-50">Care Instructions</h4>
                      <p className="text-sm text-primary-200">{material.care}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaterialExperience;