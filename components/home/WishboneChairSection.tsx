"use client";

import { cn } from '@/lib/utils';
import { LazyMotion, domAnimation, motion } from 'framer-motion';
import { ChevronRight, Info, X } from 'lucide-react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Image from 'next/image';
import { memo, useCallback, useState } from 'react';
import BackgroundElements from './BackgroundElements';

// Add type and constant at the top of file
type WishboneDetail = {
  src: string;
  alt: string;
  caption: string;
  description: string;
};

const WISHBONE_DETAILS: readonly WishboneDetail[] = [
  {
    src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/wishbone-chair.jpg?v=1733859192",
    alt: "Wishbone chair craftsmanship detail",
    caption: "Traditional Joinery",
    description: "The traditional joinery of this chair represents a masterpiece of woodworking craftsmanship. Each joint is precisely engineered and steam-bent to create the characteristic Y-shaped back that gives the chair its nickname. The complex joinery technique used here combines ancient Danish woodworking traditions with modern precision, requiring over 100 steps to complete. The curved top rail and backrest are made from a single piece of steam-bent wood, showcasing how traditional methods can create both durability and elegant simplicity in design."
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/wishbone-chair-2.jpg?v=1731254593",
    alt: "Wishbone chair paper cord seat weaving",
    caption: "Natural Finish",
    description: "The natural finish highlights the chair's pure Scandinavian aesthetic, allowing the raw beauty of the wood grain to shine through. This finish is not merely decorative – it's a careful treatment that protects the wood while maintaining its organic texture and warmth. The light, natural tone is achieved through careful sanding and finishing processes that enhance the wood's natural characteristics without masking them. This approach reflects the Danish modern principle of honest materials and showcases the beauty of simplicity in design."
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/wishbone-chair-close-up.jpg?v=1731253320",
    alt: "Wishbone chair in natural birch wood",
    caption: "Hand-Woven Seat",
    description: "The seat of this chair features approximately 120 meters of paper cord, meticulously hand-woven in a characteristic envelope pattern. This traditional Danish weaving technique creates a durable, comfortable surface that grows more beautiful with age. The natural paper cord is twisted at high tension to ensure longevity, while the weaving pattern provides optimal support and subtle flexibility. This labor-intensive process takes skilled artisans several hours to complete, resulting in a seat that combines aesthetic beauty with ergonomic comfort."
  }
] as const;

// Add interfaces at the top
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

interface ImageCardProps {
  image: {
    src: string;
    alt: string;
    caption: string;
    description: string;
  };
  index: number;
  onModalOpen: (index: number) => void;
}

// Memoized Modal Component
const InfoModal = memo(function InfoModal({ 
  isOpen, 
  onClose, 
  title, 
  description 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-primary-800 rounded-lg max-w-2xl w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-500 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-xl font-bold mb-4 text-primary-900 dark:text-primary-100">{title}</h3>
        <p className="text-primary-700 dark:text-primary-300">{description}</p>
      </motion.div>
    </motion.div>
  );
});

InfoModal.displayName = 'InfoModal';

// Memoized Image Card Component
const ImageCard = memo(function ImageCard({ 
  image, 
  index, 
  onModalOpen 
}: ImageCardProps) {
  const handleModalOpen = useCallback(() => {
    onModalOpen(index);
  }, [index, onModalOpen]);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.2 }}
      className="relative aspect-square p-2 bg-white/70 dark:bg-primary-800/70 
                 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300
                 group"
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <p className="text-white font-medium text-lg">
            {image.caption}
          </p>
          <button
            onClick={handleModalOpen}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     inline-flex items-center justify-center
                     bg-white/20 hover:bg-white/30
                     backdrop-blur-sm
                     rounded-full p-1
                     focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={`More information about ${image.caption}`}
          >
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ImageCard.displayName = 'ImageCard';

const WishboneChairSection = memo(function WishboneChairSection() {
  const [selectedModal, setSelectedModal] = useState<number | null>(null);

  const handleModalClose = useCallback(() => {
    setSelectedModal(null);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full py-8 md:py-12 bg-primary-50 dark:bg-primary-900 overflow-hidden relative">
        <BackgroundElements />
        <div className="container mx-auto px-4 max-w-[1400px]">
          {/* Add Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-12"
          >
            {/* Title and Line */}
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                Wishbone Chair
              </h2>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary-900/20 via-primary-900/40 to-primary-900/20 dark:from-primary-100/20 dark:via-primary-100/40 dark:to-primary-100/20 mt-4" />
            </div>
          </motion.div>

          {/* Top Section with Video and Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 mb-8 md:mb-16">
            {/* Video Container */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden lg:col-span-3 aspect-video bg-primary-200 dark:bg-primary-800 rounded-lg"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Wishbone chair crafting process video"
              >
                <source 
                  src="https://cdn.shopify.com/videos/c/o/v/35164e128ad44b0f8e4c42774bc8d1d8.mp4" 
                  type="video/mp4" 
                />
              </video>
            </motion.div>

            {/* Info Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 self-start"
            >
              <div className="bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm 
                            rounded-lg shadow-lg border border-primary-100/50 dark:border-primary-700/50
                            p-4 md:p-6 space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                             bg-primary-100 dark:bg-primary-700
                             text-primary-800 dark:text-primary-100">
                  Featured Collection
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">
                  The Wishbone Chair: Y-Chair
                </h2>

                <blockquote className="border-l-4 border-primary-300 dark:border-primary-600 
                                   pl-3 italic text-primary-700 dark:text-primary-300 text-sm">
                  "A chair is not a chair until someone sits on it." - Hans J. Wegner (1914, Denmark)
                </blockquote>

                <p className="text-primary-700 dark:text-primary-300 text-sm">
                  Inspired by Wegner's iconic 1950s design, our Wishbone Chair combines traditional craftsmanship 
                  with modern comfort. Each piece features carefully selected birch wood and hand-woven paper cord seating, 
                  creating a timeless addition to any space.
                </p>

                <ul className="space-y-1.5 text-primary-600 dark:text-primary-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-400 dark:bg-primary-500" aria-hidden="true" />
                    Handcrafted from sustainable birch wood
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-400 dark:bg-primary-500" aria-hidden="true" />
                    Traditional paper cord weaving technique
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-400 dark:bg-primary-500" aria-hidden="true" />
                    Ergonomic design for optimal comfort
                  </li>
                </ul>

                <motion.a
                  href="/product/wishbone-chair"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-4 py-2",
                    "bg-primary-900 dark:bg-primary-100",
                    "text-white dark:text-primary-900",
                    "rounded-md",
                    "text-sm font-medium",
                    "transition-colors duration-200",
                    "hover:bg-primary-800 dark:hover:bg-primary-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    "w-fit"
                  )}
                >
                  View Product
                  <ChevronRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section with Three Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-4">
            {WISHBONE_DETAILS.map((image, index) => (
              <ImageCard
                key={image.src}
                image={image}
                index={index}
                onModalOpen={setSelectedModal}
              />
            ))}
          </div>

          <InfoModal
            isOpen={selectedModal !== null}
            onClose={handleModalClose}
            title={selectedModal !== null ? WISHBONE_DETAILS[selectedModal]?.caption ?? '' : ''}
            description={selectedModal !== null ? WISHBONE_DETAILS[selectedModal]?.description ?? '' : ''}
          />
        </div>
      </section>
    </LazyMotion>
  );
});

export default function WishboneChairSectionWrapper() {
  return (
    <ErrorBoundary errorComponent={() => 
      <div className="p-4 text-red-500">Something went wrong. Please try again later.</div>
    }>
      <WishboneChairSection />
    </ErrorBoundary>
  );
}