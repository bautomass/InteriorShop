// components/gift-builder/gift-box-selector.tsx
'use client';

import { ErrorBoundary } from '@/components/error-boundary';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ProductOption } from 'lib/shopify/types';
import { Check, ChevronLeft, ChevronRight, Package, RefreshCcw, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGiftBuilder } from './context';

// Enhanced Types
export interface GiftBoxImage {
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
  maxProducts: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: GiftBoxImage;
  featuredImage?: GiftBoxImage;
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

interface GiftBoxCardProps {
  box: GiftBox;
  isSelected: boolean;
  onCustomize: () => void;
  hoveredBox: string | null;
  onHover: (id: string | null) => void;
}

interface ImageGalleryProps {
  images: GiftBoxImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  selectedVariant?: GiftBoxVariant;
  className?: string;
  boxTitle: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  label: string;
  id: string;
}

interface BoxSelectionPayload extends GiftBox {
  variantId: string;
  price: number;
  maxProducts: number;
  selectedOptions: SelectedOptions;
  featuredImage: GiftBoxImage;
  products: any[];
}

// Enhanced Animation Variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const scaleUp = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 25,
      mass: 1
    }
  },
  exit: { opacity: 0, scale: 0.97 }
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

// Enhanced Image Gallery Component
function ImageGallery({
  images,
  selectedIndex,
  onSelect,
  selectedVariant,
  className = '',
  boxTitle
}: ImageGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumb = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedThumb) {
        selectedThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedIndex]);

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

  const currentImages = useMemo(() => {
    if (!images?.length) return [] as GiftBoxImage[];
    return selectedVariant?.image 
      ? [selectedVariant.image, ...images.filter(img => img.url !== selectedVariant.image?.url)]
      : images;
  }, [images, selectedVariant]);

  if (!currentImages.length) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
        <Package className="h-12 w-12 text-primary-300" />
      </div>
    );
  }

  const checkScrollButtons = useCallback(() => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const thumbnails = thumbnailsRef.current;
    if (thumbnails) {
      checkScrollButtons();
      thumbnails.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      if (thumbnails) {
        thumbnails.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      }
    };
  }, [checkScrollButtons]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
      const scrollAmount = thumbnailsRef.current.clientWidth * 0.8;
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Image */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-primary-100/20 bg-gradient-to-b from-primary-50 to-white shadow-lg dark:from-primary-900/50 dark:to-primary-800">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentImages[selectedIndex]?.url || 'fallback'}
            variants={shouldReduceMotion ? fadeIn : scaleUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-full w-full"
            onAnimationComplete={() => setIsLoading(false)}
          >
            <Image
              src={currentImages[selectedIndex]?.url ?? ''}
              alt={currentImages[selectedIndex]?.altText ?? `${boxTitle} - view ${selectedIndex + 1}`}
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

        {/* Enhanced Navigation Arrows */}
        {currentImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:px-4">
            {[
              { direction: 'prev', icon: ChevronLeft },
              { direction: 'next', icon: ChevronRight }
            ].map(({ direction, icon: Icon }) => (
              <motion.button
                key={direction}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (direction === 'prev') {
                    onSelect(selectedIndex === 0 ? currentImages.length - 1 : selectedIndex - 1);
                  } else {
                    onSelect(selectedIndex === currentImages.length - 1 ? 0 : selectedIndex + 1);
                  }
                }}
                className="rounded-full bg-white/90 p-2 text-primary-900 shadow-lg backdrop-blur-sm transition-all 
                  hover:bg-white hover:shadow-xl dark:bg-primary-800/90 dark:text-white dark:hover:bg-primary-700
                  sm:p-3"
                aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} image`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
          <p className="text-xs font-medium text-white">
            {selectedIndex + 1} / {currentImages.length}
          </p>
        </div>
      </div>

      {/* Enhanced Thumbnails */}
      {currentImages.length > 1 && (
        <div className="relative px-1">
          <div className="relative overflow-hidden">
            <motion.div
              ref={thumbnailsRef}
              className="flex gap-2 overflow-x-hidden scroll-smooth pb-3 pt-1 sm:gap-3"
            >
              {currentImages.map((image, index) => (
                <motion.button
                  key={image.url}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(index)}
                  className={`relative aspect-square w-16 flex-none overflow-hidden rounded-lg transition-all sm:w-20
                    ${
                      selectedIndex === index
                        ? 'ring-2 ring-accent-500 ring-offset-2 ring-offset-white dark:ring-offset-primary-900'
                        : 'ring-1 ring-primary-200/50 hover:ring-primary-300 dark:ring-primary-700 dark:hover:ring-primary-600'
                    }`}
                  aria-label={`View ${image.altText || 'gift box image'}`}
                  aria-pressed={selectedIndex === index}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${boxTitle} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    quality={60}
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

            {/* Custom Navigation Arrows */}
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scrollThumbnails('left')}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-lg bg-white/90 p-1.5 shadow-lg backdrop-blur-sm dark:bg-primary-800/90"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
            )}
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scrollThumbnails('right')}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-lg bg-white/90 p-1.5 shadow-lg backdrop-blur-sm dark:bg-primary-800/90"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Modal Component
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
        {/* Enhanced Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
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
          className={`relative mx-auto max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-2xl 
            bg-white shadow-2xl ring-1 ring-primary-900/5 dark:bg-primary-900 dark:ring-white/10
            ${isMobile ? 'max-w-lg' : 'max-w-5xl'}`}
        >
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 border-b border-primary-100 bg-white/90 px-4 py-4 
            backdrop-blur-md dark:border-primary-800 dark:bg-primary-900/90 sm:px-6">
            <div className="flex items-center justify-between">
              <motion.h2
                variants={slideUp}
                className="text-xl font-bold text-primary-900 dark:text-primary-50 sm:text-2xl"
              >
                {title}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 
                  dark:text-primary-400 dark:hover:bg-primary-800"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Custom Scrollbar Implementation */}
          <div 
            className="custom-scrollbar relative max-h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain scroll-smooth
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-primary-200/50
              dark:[&::-webkit-scrollbar-thumb]:bg-primary-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-primary-300/50
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-primary-600/50"
          >
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Custom Dropdown Component to replace Select
const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  id
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div variants={slideUp} className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-primary-700 dark:text-primary-200">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full appearance-none rounded-xl border-2 border-primary-100 bg-white px-4 py-3 text-left text-sm font-medium text-primary-900 shadow-sm transition-all hover:border-primary-200 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/20 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-100 dark:hover:border-primary-600"
        >
          {value || placeholder}
          <ChevronRight className={`absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-primary-400 transition-transform ${isOpen ? 'rotate-[270deg]' : 'rotate-90'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full rounded-xl border border-primary-100 bg-white py-1 shadow-lg dark:border-primary-700 dark:bg-primary-800"
            >
              {options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ backgroundColor: 'rgba(var(--accent-500), 0.1)' }}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    value === option
                      ? 'bg-accent-50 text-accent-900 dark:bg-accent-900/20 dark:text-accent-100'
                      : 'text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-700'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Box Options Selector Component
function BoxOptionsSelector({
  box,
  onComplete,
  initialOptions = {},
  dispatch,
  setOpenModal
}: {
  box: GiftBox;
  onComplete: (variant: GiftBoxVariant, options: SelectedOptions) => void;
  initialOptions?: SelectedOptions;
  dispatch: Dispatch<any>;
  setOpenModal: (id: string | null) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialOptions);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;

  const availableOptions = useMemo(() => {
    const options: { [key: string]: Set<string> } = {};
    
    if (!box?.variants) return options;

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
          options[option.name]!.add(option.value);
        }
      });
    });

    return options;
  }, [box?.variants, selectedOptions]);

  const handleComplete = async (
    box: GiftBox,
    variant: GiftBoxVariant,
    selectedOptions: SelectedOptions,
    dispatch: Dispatch<any>,
    setOpenModal: (id: string | null) => void
  ) => {
    try {
      const payload: BoxSelectionPayload = {
        id: box.id,
        handle: box.handle,
        title: box.title,
        description: box.description,
        images: box.images,
        variantId: variant.id,
        price: variant.price,
        maxProducts: variant.maxProducts || 4,
        selectedOptions,
        featuredImage: variant.image || variant.featuredImage || box.featuredImage,
        products: [],
        variants: box.variants,
        options: box.options
      };

      dispatch({ type: 'SELECT_BOX', payload });
      dispatch({ type: 'SET_STEP', payload: 'products' });
      setOpenModal(null);
    } catch (error) {
      console.error('Error completing selection:', error);
      throw error;
    }
  };

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
    <div className={`${
      isMobile 
        ? 'flex flex-col space-y-6 p-4 sm:p-6'
        : 'grid grid-cols-2 gap-8 p-8'
    }`}>
      {/* Image Gallery - Made sticky only on desktop */}
      <div className={isMobile ? 'order-1' : 'sticky top-8'}>
        <ImageGallery
          images={box.images}
          selectedIndex={selectedImageIndex}
          onSelect={setSelectedImageIndex}
          selectedVariant={selectedVariant || undefined}
          boxTitle={box.title}
        />
      </div>

      {/* Options and Actions - Improved mobile layout */}
      <div className={`space-y-6 ${isMobile ? 'order-2' : ''}`}>
        <motion.div variants={fadeIn} className="space-y-4">
          {/* Options Grid for better mobile layout */}
          <div className={`grid gap-4 ${
            box.options.length > 1 && !isMobile ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {box.options.map((option) => {
              const availableValues: string[] = Array.from(availableOptions[option.name] || new Set());

              return (
                <CustomDropdown
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
          </div>
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

        {/* Fixed bottom button on mobile */}
        <motion.div className={`${
          isMobile 
            ? 'sticky bottom-0 -mx-4 border-t border-primary-100 bg-white p-4 dark:border-primary-800 dark:bg-primary-900 sm:-mx-6 sm:p-6' 
            : ''
        }`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectedVariant && handleComplete(box, selectedVariant, selectedOptions, dispatch, setOpenModal)}
            disabled={!isComplete || isSubmitting}
            className={`w-full rounded-xl px-6 py-3.5 text-sm font-medium shadow-lg transition-all ${
              isSubmitting
                ? 'bg-accent-500 text-white hover:bg-accent-600'
                : isComplete
                  ? 'bg-accent-500 text-white hover:bg-accent-600'
                  : 'bg-primary-100 text-primary-400 dark:bg-primary-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : isComplete ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Confirm Selection
              </span>
            ) : (
              'Select All Options'
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// Updated GiftBoxCard Component
function GiftBoxCard({ box, isSelected, onCustomize, hoveredBox, onHover }: GiftBoxCardProps) {
  const startingPrice = useMemo(() => {
    return Math.min(...box.variants.map((v) => v.price));
  }, [box.variants]);

  return (
    <div className="relative">
      <motion.div 
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md 
          transition-shadow duration-300 hover:shadow-xl dark:bg-primary-900"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute right-4 top-4 z-30 rounded-full bg-accent-500 p-1.5 shadow-lg"
            >
              <Check className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          {box.featuredImage ? (
            <>
              <Image
                src={box.featuredImage.url}
                alt={box.featuredImage.altText || `${box.title} gift box`}
                fill
                className="transform-gpu object-cover transition-all duration-500 will-change-transform 
                  group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 400px"
                priority={true}
              />
              
              {/* Dark Overlay - Separate from button container */}
              <div 
                className="absolute inset-0 bg-black/0 transition-colors duration-300 
                  group-hover:bg-black/30"
              />
              
              {/* Button Container - Separate layer */}
              <div 
                className="absolute inset-0 z-20 flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div 
                  className="transform opacity-0 transition-all duration-300 ease-out 
                    group-hover:translate-y-0 group-hover:opacity-100"
                  style={{ transform: 'translateY(1rem)' }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCustomize();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 
                      text-sm font-medium text-accent-500 shadow-lg 
                      transition-all duration-200
                      hover:bg-white hover:text-accent-600 hover:shadow-xl
                      active:scale-95 active:shadow-md"
                  >
                    <span>Customize Box</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 
                      group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-50 dark:bg-primary-800/50">
              <Package className="h-10 w-10 text-primary-300" />
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 z-20 overflow-hidden rounded-xl bg-white/95 
            shadow-lg backdrop-blur-sm transition-all duration-300
            dark:bg-primary-900/95">
            <div className="px-3.5 py-2">
              <p className="text-base font-medium text-accent-500">
                From ${startingPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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
  return (
    <ErrorBoundary>
      <GiftBoxSelectorContent />
    </ErrorBoundary>
  );
}

function GiftBoxSelectorContent() {
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

  const handleComplete = async (
    box: GiftBox,
    variant: GiftBoxVariant,
    selectedOptions: SelectedOptions,
    dispatch: Dispatch<any>,
    setOpenModal: (id: string | null) => void
  ) => {
    try {
      const payload: BoxSelectionPayload = {
        id: box.id,
        handle: box.handle,
        title: box.title,
        description: box.description,
        images: box.images,
        variantId: variant.id,
        price: variant.price,
        maxProducts: variant.maxProducts || 4,
        selectedOptions,
        featuredImage: variant.image || variant.featuredImage || box.featuredImage,
        products: [],
        variants: box.variants,
        options: box.options
      };

      dispatch({ type: 'SELECT_BOX', payload });
      dispatch({ type: 'SET_STEP', payload: 'products' });
      setOpenModal(null);
    } catch (error) {
      console.error('Error completing selection:', error);
      throw error;
    }
  };

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
      className="mx-auto max-w-[1200px] space-y-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2
          variants={shouldReduceMotion ? fadeIn : slideUp}
          initial="initial"
          animate="animate"
          className="bg-gradient-to-r from-primary-900 via-accent-600 to-accent-500 bg-clip-text text-3xl 
            font-bold text-transparent dark:from-primary-50 dark:via-accent-400 dark:to-accent-500 
            sm:text-4xl"
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

      {/* Grid of Cards */}
      {giftBoxes && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {giftBoxes.map((box) => (
            <GiftBoxCard
              key={box.id}
              box={box}
              isSelected={state.selectedBox?.id === box.id}
              onCustomize={() => setOpenModal(box.id)}
              hoveredBox={hoveredBox}
              onHover={setHoveredBox}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {giftBoxes?.map((box) => (
        <Modal
          key={box.id}
          isOpen={openModal === box.id}
          onClose={() => setOpenModal(null)}
          title={`Customize ${box.title}`}
        >
          <BoxOptionsSelector
            box={box}
            dispatch={dispatch}
            setOpenModal={setOpenModal}
            initialOptions={(state.selectedBox as BoxSelectionPayload)?.selectedOptions ?? {}}
            onComplete={(variant, options) => handleComplete(box, variant, options, dispatch, setOpenModal)}
          />
        </Modal>
      ))}
    </motion.div>
  );
}
