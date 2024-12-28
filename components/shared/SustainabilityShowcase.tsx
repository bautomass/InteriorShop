'use client';

import { motion } from 'framer-motion';
import { Leaf, Recycle, Shield, TreePine } from 'lucide-react';
import Image from 'next/image';

export function SustainabilityShowcase() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Eco-Friendly Materials',
      description: 'Our products are crafted using sustainable and biodegradable materials, minimizing environmental impact.'
    },
    {
      icon: <Recycle className="w-6 h-6" />,
      title: 'Sustainable Packaging',
      description: 'We use 100% recyclable packaging materials and minimize waste in our shipping process.'
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      title: 'Tree Planting Initiative',
      description: 'For every purchase, we contribute to global reforestation efforts through our planting partners.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Ethical Production',
      description: 'We ensure fair labor practices and responsible manufacturing throughout our supply chain.'
    }
  ];

  return (
    <section 
      className="w-full bg-[#FAF7F2] py-16 md:py-24"
      aria-label="Sustainability Commitment"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#6B5E4C] mb-6">
              Committed to a{' '}
              <span className="text-[#4A8B4A] font-medium">
                Sustainable Future
              </span>
            </h2>
            
            <p className="text-[#8C7E6A] mb-8 leading-relaxed">
              We believe in creating beautiful products that don't compromise our planet's future. 
              Our commitment to sustainability goes beyond just products – it's woven into every 
              aspect of our business.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E8E4D8] flex items-center justify-center text-[#4A8B4A]">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-[#6B5E4C] font-medium mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#8C7E6A]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-auto"
          >
            <Image
              src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/eco-friendly-manufacturing.jpg?v=1734706093"
              alt="Sustainable and eco-friendly manufacturing process"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover"
              priority={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 