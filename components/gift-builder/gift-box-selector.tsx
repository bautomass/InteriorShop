// components/gift-builder/gift-box-selector.tsx
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ProductOption } from 'lib/shopify/types';
import { Check, ChevronLeft, ChevronRight, Package, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGiftBuilder } from './context';

// Enhanced Types
interface GiftBoxImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

interface SelectedOptions {
  [key: string]: string;
}

interface GiftBoxVariant {
  id: string;
  title: string;
  price: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: GiftBoxImage;
}

interface GiftBox {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: GiftBoxImage;
  images: GiftBoxImage[];
  variants: GiftBoxVariant[];
  options: ProductOption[];
  selectedVariant?: GiftBoxVariant;
}

// Enhanced Animation Variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1
    }
  },
  exit: { opacity: 0, scale: 0.95 }
};

// API Fetch Function with Enhanced Error Handling and Caching
async function fetchGiftBoxes(): Promise<GiftBox[]> {
  try {
    const response = await fetch('/api/gift-boxes', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No gift boxes found');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Failed to fetch gift boxes (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return data.map((box: any) => ({
      ...box,
      images: box.images || (box.featuredImage ? [box.featuredImage] : []),
      featuredImage: box.featuredImage || box.images?.[0],
      variants: box.variants.map((variant: any) => ({
        ...variant,
        price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price
      }))
    }));
  } catch (error) {
    console.error('Error fetching gift boxes:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch gift boxes');
  }
}

// Enhanced Image Gallery Component with Performance Optimizations
function ImageGallery({
  images,
  selectedIndex,
  onSelect,
  selectedVariant,
  className = ''
}: {
  images: GiftBoxImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  selectedVariant?: GiftBoxVariant;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
      } else if (e.key === 'ArrowRight') {
        onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
      }
    },
    [selectedIndex, images.length, onSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const currentImages = selectedVariant?.image
    ? [selectedVariant.image, ...images.filter((img) => img.url !== selectedVariant.image?.url)]
    : images;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-primary-100/20 bg-gradient-to-b from-primary-50 to-white shadow-lg dark:from-primary-900/50 dark:to-primary-800">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentImages[selectedIndex].url}
            variants={shouldReduceMotion ? fadeIn : scaleUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-full w-full"
            onAnimationComplete={() => setIsLoading(false)}
          >
            <Image
              src={currentImages[selectedIndex].url}
              alt={currentImages[selectedIndex].altText}
              fill
              className={`transform-gpu object-cover transition-transform duration-700 will-change-transform ${
                !isLoading && 'group-hover:scale-105'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={selectedIndex === 0}
              quality={90}
              onLoad={() => setIsLoading(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-100/50 dark:bg-primary-800/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {currentImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                onSelect(selectedIndex === 0 ? currentImages.length - 1 : selectedIndex - 1)
              }
              className="rounded-full bg-white/90 p-3 text-primary-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-primary-800/90 dark:text-white dark:hover:bg-primary-700"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                onSelect(selectedIndex === currentImages.length - 1 ? 0 : selectedIndex + 1)
              }
              className="rounded-full bg-white/90 p-3 text-primary-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-primary-800/90 dark:text-white dark:hover:bg-primary-700"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        )}
      </div>

      {currentImages.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary-200 dark:scrollbar-thumb-primary-700 flex gap-3 overflow-x-auto px-1 pb-2"
        >
          {currentImages.map((image, index) => (
            <motion.button
              key={image.url}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(index)}
              className={`relative aspect-square w-20 flex-none overflow-hidden rounded-lg transition-all ${
                selectedIndex === index
                  ? 'ring-2 ring-accent-500 ring-offset-2'
                  : 'ring-1 ring-primary-200/50 hover:ring-primary-300'
              }`}
              aria-label={`View ${image.altText}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                className="object-cover"
                sizes="80px"
                quality={60} // Lower quality for thumbnails
              />
              {selectedIndex === index && (
                <motion.div
                  layoutId="selectedOverlay"
                  className="absolute inset-0 bg-accent-500/10"
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Enhanced Modal Component with Responsive Layout
const Modal = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          variants={shouldReduceMotion ? fadeIn : scaleUp}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`relative mx-auto max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-primary-900 ${isMobile ? 'max-w-lg' : 'max-w-5xl'} `}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 border-b border-primary-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-primary-800 dark:bg-primary-900/80">
            <div className="flex items-center justify-between">
              <motion.h2
                variants={slideUp}
                className="text-2xl font-bold text-primary-900 dark:text-primary-50"
              >
                {title}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-800"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="custom-scrollbar max-h-[calc(90vh-4rem)] overflow-y-auto">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Enhanced Select Component
const Select = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  id
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  label: string;
  id: string;
}) => {
  return (
    <motion.div variants={slideUp} className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-primary-700 dark:text-primary-200"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border-2 border-primary-100 bg-white px-4 py-3 pr-10 text-sm font-medium text-primary-900 shadow-sm transition-all hover:border-primary-200 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-100 dark:hover:border-primary-600 dark:focus:border-accent-400 dark:focus:ring-accent-400/20"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-90 transform text-primary-400" />
      </div>
    </motion.div>
  );
};

// Enhanced Box Options Selector Component
function BoxOptionsSelector({
  box,
  onComplete,
  initialOptions = {}
}: {
  box: GiftBox;
  onComplete: (variant: GiftBoxVariant, options: SelectedOptions) => void;
  initialOptions?: SelectedOptions;
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialOptions);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const availableOptions = useMemo(() => {
    const options: { [key: string]: Set<string> } = {};

    box.variants.forEach((variant) => {
      variant.selectedOptions.forEach((option) => {
        if (!options[option.name]) {
          options[option.name] = new Set();
        }

        const isValidOption = variant.selectedOptions.every(
          (opt) =>
            opt.name === option.name ||
            !selectedOptions[opt.name] ||
            selectedOptions[opt.name] === opt.value
        );

        if (isValidOption) {
          options[option.name].add(option.value);
        }
      });
    });

    return options;
  }, [box.variants, selectedOptions]);

  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedOptions).length !== box.options.length) return null;

    return box.variants.find((variant) =>
      variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
    );
  }, [box.variants, box.options.length, selectedOptions]);

  const isComplete = Object.keys(selectedOptions).length === box.options.length;

  const handleOptionSelect = useCallback((name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className={`${isMobile ? 'space-y-6 p-6' : 'grid grid-cols-2 gap-8 p-8'}`}>
      {/* Image Gallery */}
      <ImageGallery
        images={box.images}
        selectedIndex={selectedImageIndex}
        onSelect={setSelectedImageIndex}
        selectedVariant={selectedVariant}
        className={isMobile ? '' : 'sticky top-8'}
      />

      {/* Options and Actions */}
      <div className="space-y-6">
        <motion.div variants={fadeIn} className="space-y-4">
          {box.options.map((option) => {
            const availableValues = Array.from(availableOptions[option.name] || new Set());

            return (
              <Select
                key={option.name}
                id={`${box.id}-${option.name}`}
                label={option.name}
                value={selectedOptions[option.name] || ''}
                onChange={(value) => handleOptionSelect(option.name, value)}
                options={availableValues}
                placeholder={`Select ${option.name}`}
              />
            );
          })}
        </motion.div>

        {selectedVariant && (
          <motion.div
            variants={fadeIn}
            className="rounded-xl border border-primary-100 bg-primary-50/50 p-6 text-center dark:border-primary-700 dark:bg-primary-800/50"
          >
            <p className="text-sm font-medium text-primary-600 dark:text-primary-300">
              Selected Option Price
            </p>
            <p className="mt-2 text-3xl font-bold text-accent-500">
              ${selectedVariant.price.toFixed(2)}
            </p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectedVariant && onComplete(selectedVariant, selectedOptions)}
          disabled={!isComplete}
          className={`mt-6 w-full rounded-xl px-6 py-3.5 text-sm font-medium shadow-lg transition-all ${
            isComplete
              ? 'bg-accent-500 text-white hover:bg-accent-600'
              : 'bg-primary-100 text-primary-400 dark:bg-primary-800'
          }`}
          aria-label={isComplete ? 'Confirm selection' : 'Complete all options to continue'}
        >
          {isComplete ? (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Confirm Selection
            </span>
          ) : (
            'Select All Options'
          )}
        </motion.button>
      </div>
    </div>
  );
}
// Enhanced Gift Box Card Component
function GiftBoxCard({
  box,
  isSelected,
  onCustomize,
  hoveredBox,
  onHover
}: {
  box: GiftBox;
  isSelected: boolean;
  onCustomize: () => void;
  hoveredBox: string | null;
  onHover: (id: string | null) => void;
}) {
  const startingPrice = useMemo(() => {
    return Math.min(...box.variants.map((v) => v.price));
  }, [box.variants]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-accent-500/5 dark:bg-primary-900 ${isSelected ? 'ring-4 ring-accent-500 dark:ring-accent-400' : 'hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-700'} `}
    >
      {/* Selection Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -right-3 -top-3 z-20 flex h-16 w-16"
          >
            <div className="absolute inset-0 rotate-45 transform bg-accent-500" />
            <Check className="relative z-10 m-auto h-6 w-6 -rotate-45 transform text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Container */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        onMouseEnter={() => onHover(box.id)}
        onMouseLeave={() => onHover(null)}
      >
        {box.featuredImage ? (
          <>
            <Image
              src={box.featuredImage.url}
              alt={box.featuredImage.altText}
              fill
              className="transform-gpu object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={true}
            />
            <motion.div
              initial={false}
              animate={{ opacity: hoveredBox === box.id ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity"
            />
            {/* Image Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary-900/10" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
            <Package className="h-12 w-12 text-primary-400" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm dark:bg-primary-900/90">
          <p className="text-xs font-medium text-primary-500 dark:text-primary-400">From</p>
          <p className="text-lg font-bold text-accent-500">${startingPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">{box.title}</h3>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCustomize}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-accent-600"
          aria-label={`Customize ${box.title}`}
        >
          <span>Customize Box</span>
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// Loading Skeleton Component with Enhanced Animation
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
        <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-primary-900"
          >
            <div className="aspect-[4/3] animate-pulse bg-primary-100 dark:bg-primary-800" />
            <div className="space-y-4 p-6">
              <div className="h-6 w-3/4 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-primary-100 dark:bg-primary-800" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Error State Component
function ErrorState({ error, refetch }: { error: Error; refetch: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-6 rounded-2xl border-2 border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-sm dark:border-red-800/50 dark:bg-red-900/10"
    >
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <X className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <p className="text-lg font-medium text-red-600 dark:text-red-400">{error.message}</p>
        <p className="mt-1 text-sm text-red-500/80 dark:text-red-400/80">
          Please try again or contact support if the issue persists.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => refetch()}
        className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-accent-600"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </motion.button>
    </motion.div>
  );
}

// Main Component
export function GiftBoxSelector() {
  const { state, dispatch } = useGiftBuilder();
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    data: giftBoxes,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['giftBoxes'],
    queryFn: fetchGiftBoxes,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const getMaxProducts = useCallback((variantTitle: string) => {
    if (variantTitle.toLowerCase().includes('small')) return 3;
    if (variantTitle.toLowerCase().includes('medium')) return 6;
    return 10;
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} refetch={refetch} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2
          variants={shouldReduceMotion ? fadeIn : slideUp}
          initial="initial"
          animate="animate"
          className="bg-gradient-to-r from-primary-900 via-accent-600 to-accent-500 bg-clip-text text-4xl font-bold text-transparent dark:from-primary-50 dark:via-accent-400 dark:to-accent-500"
        >
          Choose Your Gift Box
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? fadeIn : slideUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="mt-2 text-lg text-primary-600 dark:text-primary-300"
        >
          Select and customize your perfect gift box
        </motion.p>
      </div>

      {/* Gift Box Grid */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2"
      >
        {giftBoxes?.map((box) => (
          <React.Fragment key={box.id}>
            <GiftBoxCard
              box={box}
              isSelected={state.selectedBox?.id === box.id}
              onCustomize={() => setOpenModal(box.id)}
              hoveredBox={hoveredBox}
              onHover={setHoveredBox}
            />

            <Modal
              isOpen={openModal === box.id}
              onClose={() => setOpenModal(null)}
              title={`Customize ${box.title}`}
            >
              <BoxOptionsSelector
                box={box}
                initialOptions={
                  state.selectedBox?.id === box.id ? state.selectedBox.selectedOptions : {}
                }
                onComplete={(variant, options) => {
                  dispatch({
                    type: 'SELECT_BOX',
                    payload: {
                      ...box,
                      variantId: variant.id,
                      price: variant.price,
                      maxProducts: getMaxProducts(variant.title),
                      selectedOptions: options
                    }
                  });
                  dispatch({ type: 'SET_STEP', payload: 2 });
                  setOpenModal(null);
                }}
              />
            </Modal>
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
}
// // components/gift-builder/gift-box-selector.tsx
// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { AnimatePresence, motion } from 'framer-motion';
// import { ProductOption } from 'lib/shopify/types';
// import { Check, ChevronLeft, ChevronRight, Package, ShoppingBag, X } from 'lucide-react';
// import Image from 'next/image';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useGiftBuilder } from './context';

// // Types
// interface GiftBoxImage {
//   url: string;
//   altText: string;
//   width?: number;
//   height?: number;
// }

// interface SelectedOptions {
//   [key: string]: string;
// }

// interface GiftBoxVariant {
//   id: string;
//   title: string;
//   price: number;
//   selectedOptions: {
//     name: string;
//     value: string;
//   }[];
//   image?: GiftBoxImage;
// }

// interface GiftBox {
//   id: string;
//   handle: string;
//   title: string;
//   description: string;
//   featuredImage: GiftBoxImage;
//   images: GiftBoxImage[];
//   variants: GiftBoxVariant[];
//   options: ProductOption[];
//   selectedVariant?: GiftBoxVariant;
// }

// // Animation variants
// const fadeIn = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1 },
//   exit: { opacity: 0 }
// };

// const slideUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   exit: { opacity: 0, y: -20 }
// };

// const scaleUp = {
//   initial: { opacity: 0, scale: 0.95 },
//   animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
//   exit: { opacity: 0, scale: 0.95 }
// };

// async function fetchGiftBoxes(): Promise<GiftBox[]> {
//   try {
//     const response = await fetch('/api/gift-boxes', {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Cache-Control': 'no-cache'
//       }
//     });

//     if (!response.ok) {
//       if (response.status === 404) {
//         throw new Error('No gift boxes found');
//       }
//       const errorData = await response.json().catch(() => null);
//       throw new Error(errorData?.error || `Failed to fetch gift boxes (${response.status})`);
//     }

//     const data = await response.json();
//     if (!Array.isArray(data)) {
//       throw new Error('Invalid response format');
//     }

//     return data.map((box: any) => ({
//       ...box,
//       images: box.images || (box.featuredImage ? [box.featuredImage] : []),
//       featuredImage: box.featuredImage || box.images?.[0],
//       variants: box.variants.map((variant: any) => ({
//         ...variant,
//         price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price
//       }))
//     }));
//   } catch (error) {
//     console.error('Error fetching gift boxes:', error);
//     throw error instanceof Error ? error : new Error('Failed to fetch gift boxes');
//   }
// }

// // Enhanced Image Gallery Component
// function ImageGallery({
//   images,
//   selectedIndex,
//   onSelect,
//   selectedVariant
// }: {
//   images: GiftBoxImage[];
//   selectedIndex: number;
//   onSelect: (index: number) => void;
//   selectedVariant?: GiftBoxVariant;
// }) {
//   const handleKeyPress = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.key === 'ArrowLeft') {
//         onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
//       } else if (e.key === 'ArrowRight') {
//         onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
//       }
//     },
//     [selectedIndex, images.length, onSelect]
//   );

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [handleKeyPress]);

//   const currentImages = selectedVariant?.image
//     ? [selectedVariant.image, ...images.filter((img) => img.url !== selectedVariant.image?.url)]
//     : images;

//   return (
//     <div className="space-y-4">
//       <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-primary-100/20 bg-gradient-to-b from-primary-50 to-white shadow-lg dark:from-primary-900/50 dark:to-primary-800">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentImages[selectedIndex].url}
//             variants={scaleUp}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             className="relative h-full w-full"
//           >
//             <Image
//               src={currentImages[selectedIndex].url}
//               alt={currentImages[selectedIndex].altText}
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-105"
//               sizes="(max-width: 768px) 100vw, 50vw"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//           </motion.div>
//         </AnimatePresence>

//         {currentImages.length > 1 && (
//           <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() =>
//                 onSelect(selectedIndex === 0 ? currentImages.length - 1 : selectedIndex - 1)
//               }
//               className="rounded-full bg-white/90 p-3 text-primary-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-primary-800/90 dark:text-white dark:hover:bg-primary-700"
//               aria-label="Previous image"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() =>
//                 onSelect(selectedIndex === currentImages.length - 1 ? 0 : selectedIndex + 1)
//               }
//               className="rounded-full bg-white/90 p-3 text-primary-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-primary-800/90 dark:text-white dark:hover:bg-primary-700"
//               aria-label="Next image"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </motion.button>
//           </div>
//         )}
//       </div>

//       {currentImages.length > 1 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex gap-3 overflow-x-auto px-1 pb-2"
//         >
//           {currentImages.map((image, index) => (
//             <motion.button
//               key={image.url}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => onSelect(index)}
//               className={`relative aspect-square w-20 flex-none overflow-hidden rounded-lg transition-all ${
//                 selectedIndex === index
//                   ? 'ring-2 ring-accent-500 ring-offset-2'
//                   : 'ring-1 ring-primary-200/50 hover:ring-primary-300'
//               }`}
//               aria-label={`View ${image.altText}`}
//               aria-pressed={selectedIndex === index}
//             >
//               <Image
//                 src={image.url}
//                 alt={image.altText}
//                 fill
//                 className="object-cover"
//                 sizes="80px"
//               />
//               {selectedIndex === index && (
//                 <motion.div
//                   layoutId="selectedOverlay"
//                   className="absolute inset-0 bg-accent-500/10"
//                 />
//               )}
//             </motion.button>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// }
// // Enhanced Modal Component
// const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }) => {
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };

//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('keydown', handleEscape);
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//       window.removeEventListener('keydown', handleEscape);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
//       >
//         {/* Backdrop */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm"
//           onClick={onClose}
//         />

//         {/* Modal Container */}
//         <motion.div
//           role="dialog"
//           aria-modal="true"
//           variants={scaleUp}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-primary-900"
//           style={{ maxHeight: 'calc(100vh - 2rem)' }} // Ensure modal doesn't exceed viewport height
//         >
//           {/* Fixed Header */}
//           <div className="sticky top-0 z-10 border-b border-primary-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-primary-800 dark:bg-primary-900/80">
//             <div className="flex items-center justify-between">
//               <motion.h2
//                 variants={slideUp}
//                 className="text-2xl font-bold text-primary-900 dark:text-primary-50"
//               >
//                 {title}
//               </motion.h2>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={onClose}
//                 className="rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-800"
//                 aria-label="Close modal"
//               >
//                 <X className="h-5 w-5" />
//               </motion.button>
//             </div>
//           </div>

//           {/* Scrollable Content */}
//           <div className="custom-scrollbar max-h-[calc(100vh-10rem)] overflow-y-auto px-6 pb-6">
//             {children}
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// const globalStyles = `
//   .custom-scrollbar {
//     scrollbar-width: thin;
//     scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
//   }

//   .custom-scrollbar::-webkit-scrollbar {
//     width: 6px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: transparent;
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background-color: rgba(0, 0, 0, 0.2);
//     border-radius: 3px;
//   }

//   .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//     background-color: rgba(255, 255, 255, 0.2);
//   }
// `;

// // Enhanced Select Component
// const Select = ({
//   value,
//   onChange,
//   options,
//   placeholder,
//   label,
//   id
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
//   placeholder: string;
//   label: string;
//   id: string;
// }) => {
//   return (
//     <motion.div variants={slideUp} className="space-y-2">
//       <label
//         htmlFor={id}
//         className="block text-sm font-medium text-primary-700 dark:text-primary-200"
//       >
//         {label}
//       </label>
//       <div className="relative">
//         <select
//           id={id}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full appearance-none rounded-xl border-2 border-primary-100 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-primary-900 shadow-sm transition-colors focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-100 dark:focus:border-accent-400 dark:focus:ring-accent-400/20"
//         >
//           <option value="" disabled>
//             {placeholder}
//           </option>
//           {options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//         <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-90 transform text-primary-400" />
//       </div>
//     </motion.div>
//   );
// };

// // Enhanced Box Options Selector Component
// function BoxOptionsSelector({
//   box,
//   onComplete,
//   initialOptions = {}
// }: {
//   box: GiftBox;
//   onComplete: (variant: GiftBoxVariant, options: SelectedOptions) => void;
//   initialOptions?: SelectedOptions;
// }) {
//   const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialOptions);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const availableOptions = useMemo(() => {
//     const options: { [key: string]: Set<string> } = {};

//     box.variants.forEach((variant) => {
//       variant.selectedOptions.forEach((option) => {
//         if (!options[option.name]) {
//           options[option.name] = new Set();
//         }

//         const isValidOption = variant.selectedOptions.every(
//           (opt) =>
//             opt.name === option.name ||
//             !selectedOptions[opt.name] ||
//             selectedOptions[opt.name] === opt.value
//         );

//         if (isValidOption) {
//           options[option.name].add(option.value);
//         }
//       });
//     });

//     return options;
//   }, [box.variants, selectedOptions]);

//   const selectedVariant = useMemo(() => {
//     if (Object.keys(selectedOptions).length !== box.options.length) return null;

//     return box.variants.find((variant) =>
//       variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
//     );
//   }, [box.variants, box.options.length, selectedOptions]);

//   const isComplete = Object.keys(selectedOptions).length === box.options.length;

//   const handleOptionSelect = useCallback((name: string, value: string) => {
//     setSelectedOptions((prev) => ({ ...prev, [name]: value }));
//   }, []);

//   return (
//     <motion.div variants={slideUp} initial="initial" animate="animate" className="space-y-6">
//       <ImageGallery
//         images={box.images}
//         selectedIndex={selectedImageIndex}
//         onSelect={setSelectedImageIndex}
//         selectedVariant={selectedVariant}
//       />

//       <motion.div variants={fadeIn} className="space-y-4">
//         {box.options.map((option) => {
//           const availableValues = Array.from(availableOptions[option.name] || new Set());

//           return (
//             <Select
//               key={option.name}
//               id={`${box.id}-${option.name}`}
//               label={option.name}
//               value={selectedOptions[option.name] || ''}
//               onChange={(value) => handleOptionSelect(option.name, value)}
//               options={availableValues}
//               placeholder={`Select ${option.name}`}
//             />
//           );
//         })}
//       </motion.div>

//       {selectedVariant && (
//         <motion.div
//           variants={fadeIn}
//           className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-center dark:border-primary-700 dark:bg-primary-800/50"
//         >
//           <p className="text-sm font-medium text-primary-600 dark:text-primary-300">
//             Selected Option Price
//           </p>
//           <p className="mt-1 text-3xl font-bold text-accent-500">
//             ${selectedVariant.price.toFixed(2)}
//           </p>
//         </motion.div>
//       )}

//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => selectedVariant && onComplete(selectedVariant, selectedOptions)}
//         disabled={!isComplete}
//         className={`mt-6 w-full rounded-xl px-6 py-3 text-sm font-medium shadow-lg transition-all ${
//           isComplete
//             ? 'bg-accent-500 text-white hover:bg-accent-600'
//             : 'bg-primary-100 text-primary-400 dark:bg-primary-800'
//         }`}
//         aria-label={isComplete ? 'Confirm selection' : 'Complete all options to continue'}
//       >
//         {isComplete ? (
//           <span className="flex items-center justify-center gap-2">
//             <ShoppingBag className="h-4 w-4" />
//             Confirm Selection
//           </span>
//         ) : (
//           'Select All Options'
//         )}
//       </motion.button>
//     </motion.div>
//   );
// }
// // Enhanced Gift Box Card Component
// function GiftBoxCard({
//   box,
//   isSelected,
//   onCustomize,
//   hoveredBox,
//   onHover
// }: {
//   box: GiftBox;
//   isSelected: boolean;
//   onCustomize: () => void;
//   hoveredBox: string | null;
//   onHover: (id: string | null) => void;
// }) {
//   const startingPrice = useMemo(() => {
//     return Math.min(...box.variants.map((v) => v.price));
//   }, [box.variants]);

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl ${
//         isSelected
//           ? 'dark:ring-offset-primary-950 ring-4 ring-accent-500 ring-offset-4'
//           : 'hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-700'
//       }`}
//     >
//       <AnimatePresence>
//         {isSelected && (
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0, opacity: 0 }}
//             className="absolute -right-2 -top-2 z-10 rounded-full bg-accent-500 p-2.5 shadow-lg"
//           >
//             <Check className="h-4 w-4 text-white" />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div
//         className="relative aspect-[4/3] overflow-hidden"
//         onMouseEnter={() => onHover(box.id)}
//         onMouseLeave={() => onHover(null)}
//       >
//         {box.featuredImage ? (
//           <>
//             <Image
//               src={box.featuredImage.url}
//               alt={box.featuredImage.altText}
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-110"
//               sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
//               priority={true}
//             />
//             <motion.div
//               initial={false}
//               animate={{ opacity: hoveredBox === box.id ? 1 : 0 }}
//               className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity"
//             />
//           </>
//         ) : (
//           <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
//             <Package className="h-12 w-12 text-primary-400" />
//           </div>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col bg-white p-6 dark:bg-primary-900">
//         <div className="flex items-start justify-between gap-4">
//           <h3 className="text-xl font-bold text-primary-900 dark:text-primary-50">{box.title}</h3>
//           <div className="text-right">
//             <p className="text-sm font-medium text-primary-500 dark:text-primary-400">From</p>
//             <p className="text-lg font-bold text-accent-500">${startingPrice.toFixed(2)}</p>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onCustomize}
//           className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-accent-600"
//           aria-label={`Customize ${box.title}`}
//         >
//           <span>Customize Box</span>
//           <ChevronRight className="h-4 w-4" />
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// // Loading Skeleton Component
// function LoadingSkeleton() {
//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
//         <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
//       </div>
//       <div className="grid gap-6 md:grid-cols-2">
//         {[1, 2].map((i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-primary-900"
//           >
//             <div className="aspect-[4/3] animate-pulse bg-primary-100 dark:bg-primary-800" />
//             <div className="space-y-4 p-6">
//               <div className="h-6 w-3/4 animate-pulse rounded-lg bg-primary-100 dark:bg-primary-800" />
//               <div className="h-10 w-full animate-pulse rounded-xl bg-primary-100 dark:bg-primary-800" />
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Error State Component
// function ErrorState({ error, refetch }: { error: Error; refetch: () => void }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-sm dark:border-red-800/50 dark:bg-red-900/10"
//     >
//       <p className="text-lg font-medium text-red-600 dark:text-red-400">{error.message}</p>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => refetch()}
//         className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-accent-600"
//       >
//         <RefreshCcw className="h-4 w-4" />
//         Try Again
//       </motion.button>
//     </motion.div>
//   );
// }

// // Main Component
// export function GiftBoxSelector() {
//   const { state, dispatch } = useGiftBuilder();
//   const [hoveredBox, setHoveredBox] = useState<string | null>(null);
//   const [openModal, setOpenModal] = useState<string | null>(null);

//   const {
//     data: giftBoxes,
//     isLoading,
//     error,
//     refetch
//   } = useQuery({
//     queryKey: ['giftBoxes'],
//     queryFn: fetchGiftBoxes,
//     staleTime: 5 * 60 * 1000,
//     retry: 2,
//     refetchOnWindowFocus: false
//   });

//   const getMaxProducts = useCallback((variantTitle: string) => {
//     if (variantTitle.toLowerCase().includes('small')) return 3;
//     if (variantTitle.toLowerCase().includes('medium')) return 6;
//     return 10;
//   }, []);

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   if (error) {
//     return <ErrorState error={error} refetch={refetch} />;
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
//       <div className="text-center">
//         <motion.h2
//           variants={slideUp}
//           initial="initial"
//           animate="animate"
//           className="bg-gradient-to-r from-primary-900 to-accent-600 bg-clip-text text-4xl font-bold text-transparent dark:from-primary-50 dark:to-accent-400"
//         >
//           Choose Your Gift Box
//         </motion.h2>
//         <motion.p
//           variants={slideUp}
//           initial="initial"
//           animate="animate"
//           transition={{ delay: 0.1 }}
//           className="mt-2 text-lg text-primary-600 dark:text-primary-300"
//         >
//           Select and customize your perfect gift box
//         </motion.p>
//       </div>

//       <motion.div
//         variants={fadeIn}
//         initial="initial"
//         animate="animate"
//         className="grid gap-6 md:grid-cols-2"
//       >
//         {giftBoxes?.map((box) => (
//           <React.Fragment key={box.id}>
//             <GiftBoxCard
//               box={box}
//               isSelected={state.selectedBox?.id === box.id}
//               onCustomize={() => setOpenModal(box.id)}
//               hoveredBox={hoveredBox}
//               onHover={setHoveredBox}
//             />

//             <Modal
//               isOpen={openModal === box.id}
//               onClose={() => setOpenModal(null)}
//               title={`Customize ${box.title}`}
//             >
//               <BoxOptionsSelector
//                 box={box}
//                 initialOptions={
//                   state.selectedBox?.id === box.id ? state.selectedBox.selectedOptions : {}
//                 }
//                 onComplete={(variant, options) => {
//                   dispatch({
//                     type: 'SELECT_BOX',
//                     payload: {
//                       ...box,
//                       variantId: variant.id,
//                       price: variant.price,
//                       maxProducts: getMaxProducts(variant.title),
//                       selectedOptions: options
//                     }
//                   });
//                   dispatch({ type: 'SET_STEP', payload: 2 });
//                   setOpenModal(null);
//                 }}
//               />
//             </Modal>
//           </React.Fragment>
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// }
