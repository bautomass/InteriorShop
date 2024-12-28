'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Gift, Package, Sparkles, Timer } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { GiftBuilderModal } from './gift-builder-modal';

// Animated Gift Box SVG Component
const AnimatedGiftBox = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="h-full w-full"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        style={{
          rotate: mousePosition.x * 10 - 5,
          translateY: mousePosition.y * 10 - 5
        }}
      >
        {/* Base Box */}
        <motion.path
          d="M50 150 L350 150 L350 350 L50 350 Z"
          fill="#2A3990" // Rich navy blue
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Box Lid */}
        <motion.path
          d="M25 100 L375 100 L375 150 L25 150 Z"
          fill="#1E2B6F" // Darker navy blue
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        
        {/* Ribbon */}
        <motion.path
          d="M200 50 L200 350"
          stroke="#FFD700" // Gold
          strokeWidth="20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        
        <motion.path
          d="M50 200 L350 200"
          stroke="#FFD700"
          strokeWidth="20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        
        {/* Bow */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        >
          <circle cx="200" cy="150" r="30" fill="#FFD700" />
          <path
            d="M170 150 C170 120 200 100 200 100 C200 100 230 120 230 150 C230 180 200 160 200 160 C200 160 170 180 170 150"
            fill="#FFD700"
          />
        </motion.g>
        
        {/* Enhanced Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={80 + (i * 35)}
            cy={75 + (i % 3) * 40}
            r="3"
            fill="#FFF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </motion.svg>
    </motion.div>
  );
};

const features = [
  {
    icon: Package,
    title: 'Elegant Packaging',
    description: 'Premium gift boxes designed to impress from the first glance'
  },
  {
    icon: Gift,
    title: 'Thoughtful Curation',
    description: 'Hand-selected premium items that tell a story and create moments'
  },
  {
    icon: Sparkles,
    title: 'Luxury Experience',
    description: 'Every detail crafted to deliver an unforgettable gifting experience'
  },
  {
    icon: Timer,
    title: 'Effortless Creation',
    description: 'Intuitive builder that brings your vision to life in minutes'
  }
];

export function GiftBuilderSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/50 to-white py-4 dark:from-primary-950 dark:via-primary-900 dark:to-primary-800 lg:py-8"
    >
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-accent-500/10 to-transparent" />
        <div className="absolute right-0 top-1/2 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 bg-gradient-radial from-primary-500/5 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              {/* New Tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center rounded-full bg-accent-500/10 px-4 py-2 text-sm font-medium text-accent-600 dark:text-accent-400"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                NEW: Gift Builder
              </motion.div>

              {/* Main Heading */}
              <h2 className="text-5xl font-bold tracking-tight text-primary-950 dark:text-primary-50 sm:text-6xl lg:text-7xl">
                Make Their{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                    Heart Skip
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 -z-10 h-3 w-full bg-accent-500/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
              </h2>

              <p className="mt-6 text-xl leading-relaxed text-primary-600 dark:text-primary-300">
                Create personalized gifts that show how much you care.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/gift-builder"
                    className="group relative inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/35"
                  >
                    <span>Start Creating</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Gift className="h-6 w-6" />
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary-200 bg-white/80 px-8 py-4 text-lg font-medium text-primary-900 backdrop-blur-sm transition-all hover:bg-white hover:border-primary-300 dark:border-primary-700 dark:bg-primary-800/80 dark:text-primary-50 dark:hover:bg-primary-700"
                  >
                    See How It Works
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Animated Gift Box */}
          <motion.div
            style={{ y }}
            className="relative z-10 hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative aspect-square">
              <AnimatedGiftBox />
            </div>
          </motion.div>
        </div>
      </div>

      <GiftBuilderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
