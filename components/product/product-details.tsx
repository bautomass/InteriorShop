//components/product/product-details.tsx
'use client';

import { useActionState } from '@/hooks/useActionState';
import type { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Cog,
  Home,
  Info,
  Minus,
  Plus,
  RefreshCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useInView } from 'react-intersection-observer';
import { TagProductsModal } from './tag-products-modal';

export function ProductDetails({ product }: { product: Product }) {
  const { state, updateOption } = useProduct();
  const { formatPrice } = useCurrency();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [expandedOptions, setExpandedOptions] = useState<{ [key: string]: boolean }>({});
  const [quantity, setQuantity] = useState(1);
  const { addCartItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyBarClosed, setStickyBarClosed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagProducts, setTagProducts] = useState<Product[]>([]);
  const [isLoadingTagProducts, setIsLoadingTagProducts] = useState(false);
  const [lastCheckedHours, setLastCheckedHours] = useState<number | null>(null);
  const [ratingData, setRatingData] = useState<{ rating: string; reviewCount: number } | null>(null);
  const addToCartButtonRef = useRef(null);
  const { ref: addToCartInView, inView: isAddToCartVisible } = useInView({
    threshold: 0,
  });

  // Memoize expensive initial computations
  const memoizedVariants = useMemo(() => product.variants, [product.variants]);
  const memoizedOptions = useMemo(() => product.options, [product.options]);

  // Memoize selected variant calculation
  const selectedVariant = useMemo(() => {
    if (!Object.keys(state).length) return null;
    return memoizedVariants.find((variant) =>
      variant.selectedOptions.every((option) => state[option.name] === option.value)
    );
  }, [state, memoizedVariants]);

  // Optimize scroll and resize handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (stickyBarClosed) return;

      // Debounce scroll handler
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          setShowStickyBar(!isAddToCartVisible);
        } else {
          const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
          setShowStickyBar(scrollPercentage > 0.8);
        }
      }, 100);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setShowStickyBar(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimeout);
      clearTimeout(resizeTimeout);
    };
  }, [stickyBarClosed, isAddToCartVisible]);

  // Local Storage operations in one effect
  useEffect(() => {
    const storedHours = localStorage.getItem(`lastCheckedHours_${product.id}`);
    const storedRating = localStorage.getItem(`rating_${product.id}`);
    const storedReviewCount = localStorage.getItem(`reviewCount_${product.id}`);

    if (storedHours) {
      setLastCheckedHours(Number(storedHours));
    } else {
      const randomHours = Math.floor(Math.random() * 21) + 3;
      setLastCheckedHours(randomHours);
      localStorage.setItem(`lastCheckedHours_${product.id}`, String(randomHours));
    }

    if (storedRating && storedReviewCount) {
      setRatingData({ rating: storedRating, reviewCount: Number(storedReviewCount) });
    } else {
      const newRatingData = generateRating();
      if (newRatingData) {
        setRatingData(newRatingData);
        localStorage.setItem(`rating_${product.id}`, newRatingData.rating);
        localStorage.setItem(`reviewCount_${product.id}`, String(newRatingData.reviewCount));
      }
    }

    const handleBeforeUnload = () => {
      localStorage.setItem(`lastCheckedHours_${product.id}`, String(lastCheckedHours));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [product.id, lastCheckedHours]);

  // Initialize options state once
  useEffect(() => {
    if (memoizedOptions) {
      const initialExpandedState = Object.fromEntries(
        memoizedOptions.map(option => [option.name, false])
      );
      setExpandedOptions(initialExpandedState);
    }
  }, [memoizedOptions]);

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    updateOption(optionName, value);
  }, [updateOption]);

  const toggleOptionExpansion = useCallback((optionName: string) => {
    setExpandedOptions(prev => ({
      ...prev,
      [optionName]: !prev[optionName]
    }));
  }, []);

  const renderOptionValues = (option: any) => {
    const isExpanded = expandedOptions[option.name];
    const values = option.values;
    const showExpandButton = values.length > 4;
    const displayedValues = isExpanded ? values : values.slice(0, 4);

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {displayedValues.map((value: string) => {
            const isSelected = state[option.name] === value;
            return (
              <button
                key={value}
                onClick={() => handleOptionChange(option.name, value)}
                className={`px-3 py-1 text-xs transition-all duration-200 relative
                  border rounded-md group
                  ${isSelected 
                    ? 'border-[#6B5E4C] text-[#6B5E4C]' 
                    : 'border-[#B5A48B]/30 text-[#8C7E6A] hover:border-[#6B5E4C] hover:text-[#6B5E4C]'}`}
              >
                <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-lg transition-all duration-200
                  ${isSelected ? 'bg-[#6B5E4C] scale-100' : 'bg-[#6B5E4C] scale-0 group-hover:scale-75'}`}
                />
                {value}
              </button>
            );
          })}
        </div>

        {showExpandButton && (
          <motion.button
            onClick={() => toggleOptionExpansion(option.name)}
            className="mt-2.5 flex items-center gap-1.5 text-sm text-[#6B5E4C] transition-colors duration-200 hover:text-[#8C7E6A]"
          >
            {isExpanded ? (
              <>
                <span>Show less options</span>
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  ↑
                </motion.span>
              </>
            ) : (
              <>
                <span>Show {values.length - 4} more options</span>
                <motion.span
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ↓
                </motion.span>
              </>
            )}
          </motion.button>
        )}
      </div>
    );
  };
  
  const renderPrice = () => {
    const currentPrice = selectedVariant
      ? selectedVariant.price.amount
      : product.priceRange.minVariantPrice.amount;
  
    const compareAtPrice = selectedVariant?.compareAtPrice
      ? selectedVariant.compareAtPrice.amount
      : product.compareAtPriceRange?.minVariantPrice
        ? product.compareAtPriceRange.minVariantPrice.amount
        : null;
  
    const discountPercentage =
      compareAtPrice && parseFloat(compareAtPrice) > parseFloat(currentPrice)
        ? Math.round(((parseFloat(compareAtPrice) - parseFloat(currentPrice)) / parseFloat(compareAtPrice)) * 100)
        : null;
  
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {discountPercentage && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                animate={{
                  scale: [0.8, 1.1, 1],
                  opacity: 1,
                  rotate: [-12, -15, -12]
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: -15,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut'
                }}
                className="absolute -left-2 -top-4 cursor-default rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
              >
                Sale
              </motion.div>
            )}
            <span className="text-3xl font-medium text-[#6B5E4C]">
              {formatPrice(parseFloat(currentPrice))}
            </span>
          </div>
          {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(currentPrice) && (
            <span className="text-xl text-[#8C7E6A] line-through decoration-[#FF6B6B]/40 decoration-2">
              {formatPrice(parseFloat(compareAtPrice))}
            </span>
          )}
        </div>
        {discountPercentage && (
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="rounded-full border border-[#FF6B6B]/20 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8B8B]/10 px-3 py-1 text-sm font-medium text-[#FF6B6B]"
          >
            Save {discountPercentage}%
          </motion.span>
        )}
      </motion.div>
    );
  };

  const renderProductOptions = () => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-3"
    >
      {product.options.map((option) => (
        <div key={option.name} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-medium text-[#6B5E4C]">
              {option.name}
              {option.values.length > 1 && (
                <span className="ml-1 text-[#8C7E6A]">({option.values.length} options)</span>
              )}
            </label>
          </div>
          {renderOptionValues(option)}
        </div>
      ))}
    </motion.div>
  );

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !product.availableForSale) return;

    startTransition(() => {
      const variantId = String(selectedVariant.id);

      formAction({
        merchandiseId: variantId,
        quantity: quantity
      })
        .then((result) => {
          if (result === 'Success' && selectedVariant) {
            addCartItem({
              variant: selectedVariant,
              product,
              quantity
            });
          }
        })
        .catch(() => {});
    });
  }, [selectedVariant, product, quantity, formAction, addCartItem]);

  const availableVariants = product.variants.filter((variant) => variant.availableForSale).length;

  const handleCloseStickyBar = () => {
    setShowStickyBar(false);
    setStickyBarClosed(true);
  };

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag);
    setIsLoadingTagProducts(true);
    setTagProducts([]);

    try {
      const url = `/api/products/by-tag?tag=${encodeURIComponent(tag)}`;
      const response = await fetch(url);
      const data = await response.json();

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (data.products && Array.isArray(data.products)) {
        setTagProducts(data.products);
      } else {
        setTagProducts([]);
      }
    } catch (error) {
      setTagProducts([]);
    } finally {
      setIsLoadingTagProducts(false);
    }
  };

  const generateRating = () => {
    // Randomly decide if the product has a rating (20% chance of no rating)
    if (Math.random() < 0.2) return null;

    // Generate a random rating between 4.7 and 5.0
    const rating = (Math.random() * (5.0 - 4.7) + 4.7).toFixed(1);
    // Generate a random review count between 1 and 37
    const reviewCount = Math.floor(Math.random() * 37) + 1;

    return { rating, reviewCount };
  };

  return (
    <>
      <div ref={ref} className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          {/* Stock Status - Mobile Optimized */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            {product.availableForSale ? (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                In Stock
              </span>
            ) : (
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600">
                Out of Stock
              </span>
            )}
            {/* Informational text about stock check */}
            <span className="text-xs text-blue-600 ml-2">
              Stock status checked: {lastCheckedHours} hour{lastCheckedHours === 1 ? '' : 's'} ago
            </span>
          </motion.div>

          {/* Rating Section - Moved here */}
          {ratingData && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-[#6B5E4C]">{ratingData.rating} ({ratingData.reviewCount} reviews)</span>
            </motion.div>
          )}

          {/* Product Title - Mobile Optimized */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-light text-[#6B5E4C] sm:text-xl md:text-2xl lg:text-3xl"
          >
            {product.title}
          </motion.h1>

          {/* Product ID and SKU display */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.32 }}
            className="text-[10px] text-[#8C7E6A]/60"
          >
            Product ID:{' '}
            {selectedVariant?.id.split('/').pop() ||
              product.variants[0]?.id.split('/').pop() ||
              'N/A'}
            <span className="mx-2">·</span>
            SKU: {selectedVariant?.sku || product.variants[0]?.sku || 'N/A'}
          </motion.p>

          {/* Price - Moved here */}
          {renderPrice()}

          {/* Product Options - Moved here */}
          {renderProductOptions()}

          {/* Add to Cart Button */}
          <div className="flex w-full items-center gap-4 mt-2">
            <div className="flex-shrink-0 h-10 items-center rounded-md border border-[#6B5E4C]/20">
              <div className="flex h-10 w-full sm:w-auto items-center rounded-md border border-[#6B5E4C]/20">
                <button
                  onClick={decrementQuantity}
                  className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="w-12 text-center text-sm font-medium text-[#6B5E4C]">
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  className="flex h-full items-center justify-center px-3 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <motion.button
                ref={addToCartInView}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedVariant || !product.availableForSale || isPending}
                className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg ${
                  !selectedVariant || !product.availableForSale || isPending
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="relative z-10">
                  {isPending
                    ? 'Adding...'
                    : !selectedVariant
                      ? 'Select options'
                      : !product.availableForSale
                        ? 'Out of Stock'
                        : 'Add to Cart'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            </div>
          </div>

          {/* Shipping and guarantees info - Moved here */}
          <div className="mt-4">
            <div className="block sm:hidden">
              <div className="flex overflow-x-auto gap-3 pb-2 px-2 no-scrollbar">
                {[
                  { icon: Truck, text: "Free Worldwide Shipping", tooltip: "Enjoy complimentary worldwide shipping on all orders. Standard delivery takes 25-40 business days. Express shipping options available at checkout." },
                  { icon: RefreshCcw, text: "45 Day Money Back", tooltip: "Not completely satisfied? Return your purchase within 45 days for a full refund. Items must be unused and in original packaging. Return shipping is on us!" },
                  { icon: Shield, text: "Secure Checkout", tooltip: "Shop with confidence using our SSL-encrypted checkout. We support all major credit cards and secure payment methods. Your personal data is always protected." }
                ].map((Item, i) => (
                  <div key={i} className="flex-shrink-0 bg-[#F5F3F0] p-3 rounded-md flex items-center gap-2 min-w-[200px] justify-center">
                    <Item.icon className="h-4 w-4 text-[#8C7E6A]" />
                    <div className="flex items-center gap-1.5">
                      <Tooltip.Provider delayDuration={0}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span className="cursor-help text-xs text-[#6B5E4C]">{Item.text}</span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className="z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg">
                              <p className="text-xs text-[#6B5E4C]">{Item.tooltip}</p>
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                      <button className="relative -top-1 inline-flex" aria-label="More info">
                        <Info className="h-3 w-3 text-[#8C7E6A]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Version - Same as original */}
            <div className="hidden sm:flex items-center justify-between px-4">
              <div className="group relative flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#8C7E6A]" />
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="cursor-help text-sm text-[#6B5E4C]">
                        Free Worldwide Shipping
                        <button className="relative -top-1 ml-1 inline-flex">
                          <Info className="h-3 w-3 text-[#8C7E6A]" />
                        </button>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
                        sideOffset={5}
                      >
                        <p className="text-xs text-[#6B5E4C]">
                          Enjoy complimentary worldwide shipping on all orders. Standard delivery
                          takes 25-40 business days. Express shipping options available at checkout.
                        </p>
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              <div className="group relative flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-[#8C7E6A]" />
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="cursor-help text-sm text-[#6B5E4C]">
                        45 Day Money Back
                        <button className="relative -top-1 ml-1 inline-flex">
                          <Info className="h-3 w-3 text-[#8C7E6A]" />
                        </button>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
                        sideOffset={5}
                      >
                        <p className="text-xs text-[#6B5E4C]">
                          Not completely satisfied? Return your purchase within 45 days for a full
                          refund. Items must be unused and in original packaging. Return shipping is
                          on us!
                        </p>
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              <div className="group relative flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#8C7E6A]" />
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="cursor-help text-sm text-[#6B5E4C]">
                        Secure Checkout
                        <button className="relative -top-1 ml-1 inline-flex">
                          <Info className="h-3 w-3 text-[#8C7E6A]" />
                        </button>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
                        sideOffset={5}
                      >
                        <p className="text-xs text-[#6B5E4C]">
                          Shop with confidence using our SSL-encrypted checkout. We support all major
                          credit cards and secure payment methods. Your personal data is always
                          protected.
                        </p>
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
          </div>
          {/* Product Description */}
          <motion.div className="border rounded-lg overflow-hidden">
            <motion.button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className={`w-full flex items-center gap-3 p-4 transition-all duration-300 ${
                isDescriptionExpanded ? 'bg-[#6B5E4C] text-white' : 'bg-[#F5F3F0] text-[#6B5E4C] hover:bg-[#F0EDE8]'
              }`}
            >
              <motion.div
                animate={{ rotate: isDescriptionExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
              <h3 className="text-base font-medium">Product Description</h3>
            </motion.button>

            <AnimatePresence>
              {isDescriptionExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t"
                >
                  <div className="p-4 prose prose-neutral max-w-none text-sm" 
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Journey steps - Moved here */}
          <div className="mt-6">
            <div className="relative flex flex-col rounded-lg border border-[#B5A48B]/20 bg-[#F5F3F0]/60 p-4">
              {/* Journey steps container */}
              <div className="relative flex w-full justify-between">
                {/* Connection line */}
                <div className="absolute left-0 right-0 top-4 h-[2px] bg-[#B5A48B]/20" />

                {[
                  { icon: ShoppingCart, label: 'Order', desc: 'Place your order' },
                  { icon: Cog, label: 'Process', desc: 'We prepare it' },
                  { icon: Truck, label: 'Ship', desc: 'We send it' },
                  { icon: Home, label: 'Arrive', desc: 'Receive it!' }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#B5A48B]">
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-2 flex flex-col items-center">
                      <span className="text-xs font-medium text-[#6B5E4C]">{step.label}</span>
                      <span className="mt-0.5 max-w-[80px] text-center text-[10px] text-[#8C7E6A]">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags - Moved here */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2 relative max-w-full"
          >
            <span className="text-xs font-medium text-[#6B5E4C] whitespace-nowrap flex-shrink-0">
              {product.tags.length > 1 ? 'Product Tags:' : 'Product Tag:'}
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="flex overflow-x-auto gap-1.5 sm:gap-2 pb-1 sm:pb-0 no-scrollbar">
                {product.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="flex-shrink-0 cursor-pointer border-b border-dashed border-[#B5A48B]/40 px-2 py-0.5 text-[10px] text-[#8C7E6A] transition-colors duration-200 hover:border-[#6B5E4C] whitespace-nowrap"
                  >
                    #{tag.toLowerCase()}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  const container = document.querySelector('#tags-container');
                  if (container) {
                    container.scrollLeft += 200;
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full bg-gradient-to-l from-white flex items-center justify-end"
              >
                <ChevronRight className="h-4 w-4 text-[#6B5E4C]" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 transform border-t border-[#B5A48B]/20 bg-white/80 backdrop-blur-lg"
      >
        <div className="mx-auto w-full px-4 py-3">
          {/* Desktop Version */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseStickyBar}
                className="p-2 text-[#6B5E4C] transition-colors duration-200 hover:text-[#8C7E6A]"
              >
                <X className="h-5 w-5" />
              </button>

              {product.featuredImage && (
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="line-clamp-1 text-sm font-medium text-[#6B5E4C]">{product.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#6B5E4C]">
                    {formatPrice(parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount))}
                  </span>
                  {selectedVariant?.compareAtPrice && (
                    <span className="text-xs text-[#8C7E6A] line-through">
                      {formatPrice(parseFloat(selectedVariant.compareAtPrice.amount))}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 items-center rounded-md border border-[#6B5E4C]/20">
                <button onClick={decrementQuantity} className="px-3 text-[#6B5E4C] hover:bg-[#6B5E4C]/5">
                  <Minus className="h-3 w-3" />
                </button>
                <div className="w-8 text-center text-sm font-medium text-[#6B5E4C]">{quantity}</div>
                <button onClick={incrementQuantity} className="px-3 text-[#6B5E4C] hover:bg-[#6B5E4C]/5">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedVariant || !product.availableForSale || isPending}
                className={`group relative flex items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-md ${
                  !selectedVariant || !product.availableForSale || isPending
                    ? 'bg-gray-400'
                    : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{isPending ? 'Adding...' : 'Add to Cart'}</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Version - Simplified */}
          <div className="flex sm:hidden items-center justify-between gap-2">
            <div className="flex h-10 items-center rounded-md border border-[#6B5E4C]/20">
              <button onClick={decrementQuantity} className="px-3 text-[#6B5E4C] hover:bg-[#6B5E4C]/5">
                <Minus className="h-3 w-3" />
              </button>
              <div className="w-8 text-center text-sm font-medium text-[#6B5E4C]">{quantity}</div>
              <button onClick={incrementQuantity} className="px-3 text-[#6B5E4C] hover:bg-[#6B5E4C]/5">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedVariant || !product.availableForSale || isPending}
              className={`group flex-1 relative flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white shadow-md ${
                !selectedVariant || !product.availableForSale || isPending
                  ? 'bg-gray-400'
                  : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isPending ? 'Adding...' : 'Add to Cart'}</span>
            </motion.button>
          </div>
        </div>

        {/* Safe Area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.div>

      {/* Tag Products Modal */}
      <TagProductsModal
        isOpen={!!selectedTag}
        onClose={() => {
          setSelectedTag(null);
          setTagProducts([]);
        }}
        tag={selectedTag || ''}
        products={tagProducts}
        isLoading={isLoadingTagProducts}
      />
    </>
  );
}