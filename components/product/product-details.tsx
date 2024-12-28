//Product Details
'use client';

import type { Product, ProductVariant } from '@/lib/shopify/types';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import { Cog, Home, Info, Minus, Plus, RefreshCcw, Shield, ShoppingCart, Star, Truck, X } from 'lucide-react';
import Image from 'next/image';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useInView } from 'react-intersection-observer';
import { TagProductsModal } from './tag-products-modal';

function AnimatedNumber({ number }: { number: number }) {
  return (
    <motion.span
      key={number}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ 
        duration: 0.15,
        ease: "easeInOut",
        opacity: { duration: 0.1 }
      }}
      className="absolute left-1/2 -translate-x-1/2"
    >
      {number}
    </motion.span>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
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

  useEffect(() => {
    if (product) {
      const defaultOptions: { [key: string]: string } = {};
      product.options.forEach(option => {
        if (option.values?.[0]) {
          defaultOptions[option.name] = option.values[0];
        }
      });
      setSelectedOptions(defaultOptions);
    }
  }, [product]);

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(
          option => selectedOptions[option.name] === option.value
        )
      );
      setSelectedVariant(matchingVariant || null);
    }
  }, [selectedOptions, product]);

  useEffect(() => {
    if (product) {
      const initialExpandedState: { [key: string]: boolean } = {};
      product.options.forEach(option => {
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
        localStorage.setItem('productShareCount', JSON.stringify({
          count: initialCount,
          lastUpdated: new Date().toISOString()
        }));
        return initialCount;
      }

      const { count, lastUpdated } = JSON.parse(stored);
      const lastUpdate = new Date(lastUpdated);
      const today = new Date();
      
      if (lastUpdate.toDateString() !== today.toDateString()) {
        const increment = Math.floor(Math.random() * 3) + 1;
        const newCount = count + increment;
        localStorage.setItem('productShareCount', JSON.stringify({
          count: newCount,
          lastUpdated: today.toISOString()
        }));
        return newCount;
      }

      return count;
    };

    setShareCount(getStoredShareCount());
  }, []);

  useEffect(() => {
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

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const toggleOptionExpansion = (optionName: string) => {
    setExpandedOptions(prev => ({
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
            const isSelected = selectedOptions[option.name] === value;
            return (
              <button
                key={value}
                onClick={() => handleOptionChange(option.name, value)}
                className={`px-3 py-1.5 border rounded-md transition-all duration-200 text-sm
                  ${isSelected 
                    ? 'border-[#6B5E4C] bg-[#6B5E4C] text-white' 
                    : 'border-[#B5A48B]/20 text-[#6B5E4C] hover:border-[#6B5E4C]'}`}
              >
                {value}
              </button>
            );
          })}
        </div>
        
        {showExpandButton && (
          <motion.button
            onClick={() => toggleOptionExpansion(option.name)}
            className="mt-2.5 text-[#6B5E4C] hover:text-[#8C7E6A] text-sm
                     flex items-center gap-1.5 transition-colors duration-200"
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
      ? parseFloat(selectedVariant.price.amount)
      : parseFloat(product.priceRange.minVariantPrice.amount);
    
    const compareAtPrice = selectedVariant?.compareAtPrice
      ? parseFloat(selectedVariant.compareAtPrice.amount)
      : product.compareAtPriceRange?.minVariantPrice
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null;
    
    const currencyCode = selectedVariant 
      ? selectedVariant.price.currencyCode
      : product.priceRange.minVariantPrice.currencyCode;
  
    const discountPercentage = compareAtPrice && compareAtPrice > currentPrice
      ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
      : null;
  
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center flex-wrap gap-3"
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
                  ease: "easeOut"
                }}
                className="absolute -top-4 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                           text-white text-[11px] font-medium px-2 py-0.5 rounded-full 
                           shadow-sm cursor-default"
              >
                Sale
              </motion.div>
            )}
            <span className="text-3xl font-medium text-[#6B5E4C]">
              {currentPrice.toFixed(2)} {currencyCode}
            </span>
          </div>
          {compareAtPrice && compareAtPrice > currentPrice && (
            <span className="text-xl text-[#8C7E6A] line-through decoration-[#FF6B6B]/40 decoration-2">
              {compareAtPrice.toFixed(2)} {currencyCode}
            </span>
          )}
        </div>
        {discountPercentage && (
          <motion.span 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="px-3 py-1 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8B8B]/10 
                       text-[#FF6B6B] text-sm font-medium rounded-full 
                       border border-[#FF6B6B]/20 shadow-sm"
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
                <span className="text-[#8C7E6A] ml-1">
                  ({option.values.length} options)
                </span>
              )}
            </label>
          </div>
          {renderOptionValues(option)}
        </div>
      ))}
    </motion.div>
  );

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product.availableForSale) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await formAction(selectedVariant.id, quantity);
        if (result === 'Success') {
          addCartItem({
            variant: selectedVariant,
            product: product,
            quantity: quantity
          });
          console.log('Added to cart successfully with quantity:', quantity);
        } else {
          console.error('Failed to add to cart:', result);
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    });
  };

  const availableVariants = product.variants.filter(
    (variant) => variant.availableForSale
  ).length;

  const shareUrl = `${window.location.origin}/products/${product.handle}`;

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/products/${product.handle}`;
    const shareTitle = `Check out this ${product.title}`;
    const shareText = product.description;

    const newCount = shareCount + 1;
    setShareCount(newCount);
    
    localStorage.setItem('productShareCount', JSON.stringify({
      count: newCount,
      lastUpdated: new Date().toISOString()
    }));

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
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

  const getProductsByTag = async (tag: string) => {
    console.log('Fetching products for tag:', tag);
    const response = await fetch(`/api/products/by-tag?tag=${encodeURIComponent(tag)}`);
    const data = await response.json();
    console.log('API Response:', data);
    return data.products || [];
  };

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag);
    setIsLoadingTagProducts(true);
    setTagProducts([]);
    
    try {
      const tagProducts = await getProductsByTag(tag);
      await new Promise(resolve => setTimeout(resolve, 300));
      setTagProducts(tagProducts);
    } catch (error) {
      console.error('Error fetching tag products:', error);
    } finally {
      setIsLoadingTagProducts(false);
    }
  };

  return (
    <>
      <div ref={ref} className="flex flex-col space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {product.availableForSale ? (
              <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-500/10 text-red-600 text-xs font-medium rounded-full">
                Out of Stock
              </span>
            )}
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-light text-[#6B5E4C]"
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
            Product ID: {selectedVariant?.id.split('/').pop() || product.variants[0]?.id.split('/').pop() || 'N/A'}
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
                <Star
                  key={index}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-[#6B5E4C]">
              5.0 (24 reviews)
            </span>
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
              className="mt-2.5 text-[#6B5E4C] hover:text-[#8C7E6A] text-sm
                       flex items-center gap-1.5 transition-colors duration-200"
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
          <div className="flex gap-4 items-center">
            <div className="flex items-center h-[52px] rounded-md border border-[#6B5E4C]/20">
              <button
                onClick={decrementQuantity}
                className="px-3 h-full flex items-center justify-center text-[#6B5E4C] hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 text-center font-medium text-[#6B5E4C] relative overflow-hidden">
                <div className="relative h-[20px]">
                  <AnimatedNumber number={quantity} />
                </div>
              </div>
              <button
                onClick={incrementQuantity}
                className="px-3 h-full flex items-center justify-center text-[#6B5E4C] hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedVariant || !product.availableForSale || isPending}
              className={`flex-1 px-8 py-4 text-white text-lg font-medium
                       rounded-md transition-all duration-300
                       shadow-lg hover:shadow-xl flex items-center justify-center gap-2
                       relative overflow-hidden group
                       ${(!selectedVariant || !product.availableForSale || isPending)
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="relative z-10">
                {isPending 
                  ? 'Adding...' 
                  : !selectedVariant 
                    ? 'Select options' 
                    : !product.availableForSale 
                      ? 'Out of Stock' 
                      : 'Add to Cart'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Shipping and guarantees info */}
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="flex items-center gap-2 relative group">
              <Truck className="w-4 h-4 text-[#8C7E6A]" />
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="text-sm text-[#6B5E4C] cursor-help">
                      Free Worldwide Shipping
                      <button className="inline-flex ml-1 relative -top-1">
                        <Info className="w-3 h-3 text-[#8C7E6A]" />
                      </button>
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade 
                               data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade 
                               max-w-[300px] rounded-md bg-white p-3 shadow-lg
                               border border-[#B5A48B]/20 z-50"
                      sideOffset={5}
                    >
                      <p className="text-xs text-[#6B5E4C]">
                        Enjoy complimentary worldwide shipping on all orders. 
                        Standard delivery takes 25-40 business days. Express shipping 
                        options available at checkout.
                      </p>
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            
            <div className="flex items-center gap-2 relative group">
              <RefreshCcw className="w-4 h-4 text-[#8C7E6A]" />
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="text-sm text-[#6B5E4C] cursor-help">
                      45 Day Money Back
                      <button className="inline-flex ml-1 relative -top-1">
                        <Info className="w-3 h-3 text-[#8C7E6A]" />
                      </button>
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade 
                               data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade 
                               max-w-[300px] rounded-md bg-white p-3 shadow-lg
                               border border-[#B5A48B]/20 z-50"
                      sideOffset={5}
                    >
                      <p className="text-xs text-[#6B5E4C]">
                        Not completely satisfied? Return your purchase within 45 days 
                        for a full refund. Items must be unused and in original packaging. 
                        Return shipping is on us!
                      </p>
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            
            <div className="flex items-center gap-2 relative group">
              <Shield className="w-4 h-4 text-[#8C7E6A]" />
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="text-sm text-[#6B5E4C] cursor-help">
                      Secure Checkout
                      <button className="inline-flex ml-1 relative -top-1">
                        <Info className="w-3 h-3 text-[#8C7E6A]" />
                      </button>
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade 
                               data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade 
                               max-w-[300px] rounded-md bg-white p-3 shadow-lg
                               border border-[#B5A48B]/20 z-50"
                      sideOffset={5}
                    >
                      <p className="text-xs text-[#6B5E4C]">
                        Shop with confidence using our SSL-encrypted checkout. 
                        We support all major credit cards and secure payment methods. 
                        Your personal data is always protected.
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
            <div className="relative flex flex-col bg-[#F5F3F0]/60 rounded-lg p-4 border border-[#B5A48B]/20">
              {/* Journey steps container */}
              <div className="relative flex justify-between w-full">
                {/* Connection line */}
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#B5A48B]/20" />
                
                {[
                  { icon: ShoppingCart, label: 'Order', desc: 'Place your order' },
                  { icon: Cog, label: 'Process', desc: 'We prepare it' },
                  { icon: Truck, label: 'Ship', desc: 'We send it' },
                  { icon: Home, label: 'Arrive', desc: 'Receive it!' }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#B5A48B] flex items-center justify-center relative z-10">
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-xs font-medium text-[#6B5E4C]">{step.label}</span>
                      <span className="text-[10px] text-[#8C7E6A] text-center max-w-[80px] mt-0.5">
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
                  className="px-2 py-0.5 text-[10px] text-[#8C7E6A] 
                           border-b border-dashed border-[#B5A48B]/40
                           hover:border-[#6B5E4C] transition-colors duration-200
                           cursor-pointer"
                >
                  #{tag.toLowerCase()}
                </button>
              ))}
            </div>
            
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
          </motion.div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 200,
          duration: 0.2
        }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#B5A48B]/20 
                  shadow-lg backdrop-blur-lg bg-white/80 z-50 
                  transform transition-transform duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Product Info with Close Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseStickyBar}
              className="p-2 text-[#6B5E4C] hover:text-[#8C7E6A] transition-colors duration-200"
              aria-label="Close sticky cart"
            >
              <X className="w-5 h-5" />
            </button>

            {product.featuredImage && (
              <div className="relative w-12 h-12 rounded-md overflow-hidden hidden sm:block">
                <Image
                  src={product.featuredImage.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-[#6B5E4C] line-clamp-1">{product.title}</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  {selectedVariant?.compareAtPrice && 
                   parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
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
                        ease: "easeOut"
                      }}
                      className="absolute -top-3 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                                 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full 
                                 shadow-sm cursor-default"
                    >
                      Sale
                    </motion.div>
                  )}
                  <span className="text-sm font-medium text-[#6B5E4C]">
                    {(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount)} {selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode}
                  </span>
                </div>
                {selectedVariant?.compareAtPrice && 
                 parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                  <>
                    <span className="text-xs text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
                      {selectedVariant.compareAtPrice.amount} {selectedVariant.compareAtPrice.currencyCode}
                    </span>
                    <motion.span 
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-xs text-[#FF6B6B] font-medium px-2 py-0.5 
                                 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8B8B]/10 
                                 rounded-full border border-[#FF6B6B]/20"
                    >
                      Save {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}%
                    </motion.span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center h-10 rounded-md border border-[#6B5E4C]/20">
              <button
                onClick={decrementQuantity}
                className="px-2 h-full flex items-center justify-center text-[#6B5E4C] 
                         hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="w-8 text-center font-medium text-[#6B5E4C]">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="px-2 h-full flex items-center justify-center text-[#6B5E4C] 
                         hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedVariant || !product.availableForSale || isPending}
              className={`px-6 py-2.5 text-white text-sm font-medium
                       rounded-md transition-all duration-300
                       shadow-md hover:shadow-lg flex items-center gap-2
                       relative overflow-hidden group
                       ${(!selectedVariant || !product.availableForSale || isPending)
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="relative z-10">
                {isPending 
                  ? 'Adding...' 
                  : !selectedVariant 
                    ? 'Select options' 
                    : !product.availableForSale 
                      ? 'Out of Stock' 
                      : 'Add to Cart'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8C7E6A] to-[#6B5E4C] 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </div>

        {/* Safe Area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.div>
    </>
  );
}

function QuantitySelector({ quantity, onIncrease, onDecrease }: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center h-[52px] rounded-md border border-[#6B5E4C]/20">
      <button
        onClick={onDecrease}
        className="px-3 h-full flex items-center justify-center text-[#6B5E4C] hover:bg-[#6B5E4C]/5 transition-colors duration-200"
        aria-label="Decrease quantity"
        type="button"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-12 text-center font-medium text-[#6B5E4C] relative overflow-hidden">
        <div className="relative h-[20px]">
          <AnimatedNumber number={quantity} />
        </div>
      </div>
      <button
        onClick={onIncrease}
        className="px-3 h-full flex items-center justify-center text-[#6B5E4C] hover:bg-[#6B5E4C]/5 transition-colors duration-200"
        aria-label="Increase quantity"
        type="button"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [quantity, setQuantity] = useState(1);
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const selectedVariantId = variant?.id || (variants.length === 1 ? variants[0]?.id : undefined);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding to cart:', { selectedVariantId, quantity });

    if (!selectedVariantId) {
      console.error('No variant selected');
      return;
    }

    try {
      const result = await formAction(selectedVariantId, quantity);
      console.log('Server action result:', result);
      
      if (result === 'Success' && variant) {
        addCartItem(variant, product);
        console.log('Added to cart successfully');
      } else {
        console.error('Failed to add to cart:', result);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <form onSubmit={handleAddToCart} className="mt-6">
      <div className="flex gap-4 items-center">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => q > 1 ? q - 1 : 1)}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedVariantId || !availableForSale}
          className={`flex-1 px-8 py-4 text-white text-lg font-medium
                   rounded-md transition-all duration-300
                   shadow-lg hover:shadow-xl flex items-center justify-center gap-2
                   ${!selectedVariantId || !availableForSale 
                     ? 'bg-gray-400 cursor-not-allowed' 
                     : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'}`}
        >
          <Plus className="w-5 h-5" />
          Add To Cart
        </motion.button>
      </div>
    </form>
  );
}

