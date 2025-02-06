//components/product/product-details.tsx
'use client';

import { useActionState } from '@/hooks/useActionState';
import type { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import {
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
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
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
  const [shareCount, setShareCount] = useState(67);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyBarClosed, setStickyBarClosed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagProducts, setTagProducts] = useState<Product[]>([]);
  const [isLoadingTagProducts, setIsLoadingTagProducts] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const selectedVariant = useMemo(() => {
    if (!Object.keys(state).length) return null;

    return product.variants.find((variant) =>
      variant.selectedOptions.every((option) => state[option.name] === option.value)
    );
  }, [state, product.variants]);

  useEffect(() => {
    console.log('ProductDetails - Selected variant:', {
      variantId: selectedVariant?.id,
      state,
      productOptions: product.options
    });
  }, [selectedVariant, state, product.options]);

  useEffect(() => {
    if (product) {
      const initialExpandedState: { [key: string]: boolean } = {};
      product.options.forEach((option) => {
        initialExpandedState[option.name] = false;
      });
      setExpandedOptions(initialExpandedState);
    }
  }, [product]);

  useEffect(() => {
    const getStoredShareCount = () => {
      if (typeof window === 'undefined') return 67;

      const stored = localStorage.getItem('productShareCount');
      if (!stored) {
        const initialCount = 67;
        localStorage.setItem(
          'productShareCount',
          JSON.stringify({
            count: initialCount,
            lastUpdated: new Date().toISOString()
          })
        );
        return initialCount;
      }

      const { count, lastUpdated } = JSON.parse(stored);
      const lastUpdate = new Date(lastUpdated);
      const today = new Date();

      if (lastUpdate.toDateString() !== today.toDateString()) {
        const increment = Math.floor(Math.random() * 3) + 1;
        const newCount = count + increment;
        localStorage.setItem(
          'productShareCount',
          JSON.stringify({
            count: newCount,
            lastUpdated: today.toISOString()
          })
        );
        return newCount;
      }

      return count;
    };

    setShareCount(getStoredShareCount());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (stickyBarClosed) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show sticky bar when user has scrolled 80% of the page
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      setShowStickyBar(scrollPercentage > 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyBarClosed]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/products/${product.handle}`);
    }
  }, [product.handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    updateOption(optionName, value);
  };

  const toggleOptionExpansion = (optionName: string) => {
    setExpandedOptions((prev) => ({
      ...prev,
      [optionName]: !prev[optionName]
    }));
  };

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
          } else {
            console.error('Add to cart failed:', result);
          }
        })
        .catch((error) => console.error('Add to cart error:', error));
    });
  }, [selectedVariant, product, quantity, formAction, addCartItem]);

  const availableVariants = product.variants.filter((variant) => variant.availableForSale).length;

  const handleShare = async (platform: string) => {
    if (typeof window === 'undefined') return;
    
    const shareTitle = `Check out this ${product.title}`;
    const shareText = product.description;

    const newCount = shareCount + 1;
    setShareCount(newCount);

    localStorage.setItem(
      'productShareCount',
      JSON.stringify({
        count: newCount,
        lastUpdated: new Date().toISOString()
      })
    );

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
        break;
      case 'pinterest':
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

  const handleCloseStickyBar = () => {
    setShowStickyBar(false);
    setStickyBarClosed(true);
  };

  const handleTagClick = async (tag: string) => {
    console.log('Component - Tag clicked:', tag);
    setSelectedTag(tag);
    setIsLoadingTagProducts(true);
    setTagProducts([]);

    try {
      const url = `/api/products/by-tag?tag=${encodeURIComponent(tag)}`;
      console.log('Component - Fetching from:', url);
      
      const response = await fetch(url);
      console.log('Component - Response status:', response.status);
      
      const data = await response.json();
      console.log('Component - Full response data:', data);

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (data.products && Array.isArray(data.products)) {
        console.log('Component - Setting products array of length:', data.products.length);
        setTagProducts(data.products);
      } else {
        console.log('Component - Invalid products data:', data);
        setTagProducts([]);
      }
    } catch (error) {
      console.error('Component - Error in handleTagClick:', error);
      setTagProducts([]);
    } finally {
      setIsLoadingTagProducts(false);
    }
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
          </motion.div>

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

          {/* Rating Stars */}
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
            <span className="text-sm text-[#6B5E4C]">5.0 (24 reviews)</span>
          </motion.div>

          {/* Product Options - Moved here */}
          {renderProductOptions()}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-base font-medium text-[#6B5E4C]">Product Description</h3>
            <div
              className="prose prose-neutral max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: isDescriptionExpanded
                  ? product.descriptionHtml
                  : product.descriptionHtml.slice(0, 185) + '...'
              }}
            />

            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2.5 flex items-center gap-1.5 text-sm text-[#6B5E4C] transition-colors duration-200 hover:text-[#8C7E6A]"
            >
              {isDescriptionExpanded ? (
                <>
                  <span>Show less</span>
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
                  <span>Read full description</span>
                  <motion.span
                    initial={{ rotate: 180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↓
                  </motion.span>
                </>
              )}
            </button>
          </motion.div>

          {/* Add to Cart Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
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

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedVariant || !product.availableForSale || isPending}
              className={`group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg ${
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

          {/* Shipping and guarantees info */}
          <div className="mt-4 flex items-center justify-between px-2">
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
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
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
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
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
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade z-50 max-w-[300px] rounded-md border border-[#B5A48B]/20 bg-white p-3 shadow-lg"
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

          {/* After cart button and shipping info */}
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

          {/* Tags */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs font-medium text-[#6B5E4C]">
              {product.tags.length > 1 ? 'Product Tags:' : 'Product Tag:'}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {product.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer border-b border-dashed border-[#B5A48B]/40 px-2 py-0.5 text-[10px] text-[#8C7E6A] transition-colors duration-200 hover:border-[#6B5E4C]"
                >
                  #{tag.toLowerCase()}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar - Mobile Optimized */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 transform border-t border-[#B5A48B]/20 bg-white/80 backdrop-blur-lg"
      >
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 p-3 sm:p-4">
          {/* Product Info with Close Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseStickyBar}
              className="p-2 text-[#6B5E4C] transition-colors duration-200 hover:text-[#8C7E6A]"
              aria-label="Close sticky cart"
            >
              <X className="h-5 w-5" />
            </button>

            {product.featuredImage && (
              <div className="relative hidden h-12 w-12 overflow-hidden rounded-md sm:block">
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
                <div className="relative">
                  {selectedVariant?.compareAtPrice &&
                    parseFloat(selectedVariant.compareAtPrice.amount) >
                      parseFloat(selectedVariant.price.amount) && (
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
                        className="absolute -left-2 -top-3 cursor-default rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                      >
                        Sale
                      </motion.div>
                    )}
                  <span className="text-sm font-medium text-[#6B5E4C]">
                    {formatPrice(parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount))}
                  </span>
                </div>
                {selectedVariant?.compareAtPrice &&
                  parseFloat(selectedVariant.compareAtPrice.amount) >
                    parseFloat(selectedVariant.price.amount) && (
                    <>
                      <span className="text-xs text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                        {formatPrice(parseFloat(selectedVariant.compareAtPrice.amount))}
                      </span>
                      <motion.span
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="rounded-full border border-[#FF6B6B]/20 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8B8B]/10 px-2 py-0.5 text-xs font-medium text-[#FF6B6B]"
                      >
                        Save{' '}
                        {Math.round(
                          ((parseFloat(selectedVariant.compareAtPrice.amount) -
                            parseFloat(selectedVariant.price.amount)) /
                            parseFloat(selectedVariant.compareAtPrice.amount)) *
                            100
                        )}
                        %
                      </motion.span>
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart - Mobile Optimized */}
          <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
            <div className="flex h-8 sm:h-10 items-center rounded-md border border-[#6B5E4C]/20">
              <button
                onClick={decrementQuantity}
                className="flex h-full items-center justify-center px-1.5 sm:px-2 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                aria-label="Decrease quantity"
              >
                <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
              <div className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium text-[#6B5E4C]">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="flex h-full items-center justify-center px-1.5 sm:px-2 text-[#6B5E4C] transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                aria-label="Increase quantity"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedVariant || !product.availableForSale || isPending}
              className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-md px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg ${
                !selectedVariant || !product.availableForSale || isPending
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
