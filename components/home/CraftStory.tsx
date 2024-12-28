"use client"

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const CraftStory = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const craftSteps = [
    {
      title: "Design Heritage",
      description: "Every piece begins with respect for traditional craftsmanship and modern sensibilities.",
      image: "/api/placeholder/800/600",
      stats: [
        { label: "Years of Tradition", value: "150+" },
        { label: "Master Craftsmen", value: "12" },
        { label: "Design Awards", value: "23" }
      ]
    },
    {
      title: "Material Selection",
      description: "We source only the finest sustainable materials, each carefully chosen for its unique character.",
      image: "/api/placeholder/800/600",
      stats: [
        { label: "Sustainable Sources", value: "100%" },
        { label: "Quality Checks", value: "50+" },
        { label: "Material Types", value: "35" }
      ]
    },
    {
      title: "Handcrafted Care",
      description: "Each piece is crafted by hand, ensuring unparalleled attention to detail and quality.",
      image: "/api/placeholder/800/600",
      stats: [
        { label: "Hours per Piece", value: "40+" },
        { label: "Quality Steps", value: "120" },
        { label: "Year Warranty", value: "25" }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % craftSteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section className="relative min-h-screen bg-primary-900 py-24 dark:bg-primary-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden"><motion.div 
          style={{ opacity }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium text-accent-500">
            Our Craft
          </span>
          <h2 className="text-4xl font-light text-primary-50">
            Craftsmanship That Tells a Story
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <motion.div 
            key={activeStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <img
              src={craftSteps[activeStep].image}
              alt={craftSteps[activeStep].title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
            
            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-4 p-6">
              {craftSteps[activeStep].stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-light text-primary-50">{stat.value}</div>
                  <div className="text-sm text-primary-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 space-y-6">
              {craftSteps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full rounded-lg p-6 text-left transition-all ${
                    activeStep === index
                      ? 'bg-primary-800'
                      : 'hover:bg-primary-800/50'
                  }`}
                >
                  <h3 className="mb-2 text-xl font-light text-primary-50">
                    {step.title}
                  </h3>
                  <p className="text-primary-300">{step.description}</p>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="/our-craft"
                className="group inline-flex items-center gap-2 text-sm text-primary-50"
              >
                Discover Our Process
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftStory;