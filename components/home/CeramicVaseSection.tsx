'use client'

import { Pinterest } from '@/components/icons/Pinterest';
import { X } from '@/components/icons/X';
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import ProductReviews from '@/components/reviews/ProductReviews';
import { useActionState } from '@/hooks/useActionState';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { motion } from 'framer-motion';
import { CircleOff, Facebook, Info, Link as LinkIcon, Mail, Minus, Package, Plus, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useInView } from 'react-intersection-observer';

interface SelectedOptions {
  [key: string]: string;
}

interface VariantImageMapping {
  [key: string]: number;
}

const mobileBlinkAnimation = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    opacity: [1, 0.5, 1],
    transition: {
      opacity: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 0.15 }
    }
  }
};

const getStoredShareCount = () => {
  if (typeof window === 'undefined') return 45;
  
  const stored = localStorage.getItem('vaseShareCount');
  if (!stored) {
    const initialCount = 45;
    localStorage.setItem('vaseShareCount', JSON.stringify({
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
    localStorage.setItem('vaseShareCount', JSON.stringify({
      count: newCount,
      lastUpdated: today.toISOString()
    }));
    return newCount;
  }

  return count;
};

const StyleGuideModal = dynamic(() => import('@/components/modals/StyleGuideModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-full w-full rounded-lg" />,
  ssr: false
});

const FeaturedProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [shareCount, setShareCount] = useState(45);
  const [quantity, setQuantity] = useState(1);
  const { addCartItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [variantImageMap, setVariantImageMap] = useState<VariantImageMapping>({});
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/japandi-simplicity-ceramic-vase-shaped-ornaments');
        const productData = await response.json();
        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setShareCount(getStoredShareCount());
  }, []);

  useEffect(() => {
    if (product) {
      const imageMapping: VariantImageMapping = {
        'White-1': 4,
        'White-2': 3,
        'White-3': 2,
        'Black-1': 7,
        'Black-2': 6,
        'Black-3': 5
      };

      setVariantImageMap(imageMapping);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const defaultOptions: SelectedOptions = {};
      product.options.forEach(option => {
        if (option.values?.[0]) {
          defaultOptions[option.name] = option.values[0];
        }
      });
      setSelectedOptions(defaultOptions);
    }
  }, [product]);

  const highlights = [
    { 
      icon: Package,
      title: "Handcrafted",
      description: "Each piece uniquely made by artisans"
    },
    {
      icon: CircleOff,
      title: "Eco-Friendly",
      description: "Natural materials and sustainable process"
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "Durable construction and finish"
    }
  ];

  const checkScrollButtons = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollToActiveThumbnail = (index: number) => {
    if (thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const thumbnails = container.children;
      if (thumbnails[index]) {
        const thumbnail = thumbnails[index] as HTMLElement;
        const containerWidth = container.clientWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        
        const desiredPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: desiredPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const thumbnailsElement = thumbnailsRef.current;
    
    if (thumbnailsElement) {
      thumbnailsElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (thumbnailsElement) {
        thumbnailsElement.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/products/${product?.handle}#featured-vase`;
    const shareTitle = `Check out this ${product?.title}`;
    const shareText = "Beautiful handcrafted ceramic vase, made by skilled artisans.";

    const newCount = shareCount + 1;
    setShareCount(newCount);
    
    localStorage.setItem('vaseShareCount', JSON.stringify({
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

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));

    if (optionName === "Style") {
      const imageIndex = variantImageMap[value];
      if (imageIndex !== undefined) {
        setActiveImage(imageIndex);
        scrollToActiveThumbnail(imageIndex);
      }
    }
  };

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(
          option => selectedOptions[option.name] === option.value
        )
      );

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  }, [selectedOptions, product]);

  const renderPrice = () => {
    const price = selectedVariant 
      ? selectedVariant.price.amount
      : product?.priceRange.minVariantPrice.amount;
    
    const compareAtPrice = selectedVariant?.compareAtPrice
      ? selectedVariant.compareAtPrice.amount
      : product?.compareAtPriceRange?.minVariantPrice?.amount;
    
    const currencyCode = selectedVariant 
      ? selectedVariant.price.currencyCode
      : product?.priceRange.minVariantPrice.currencyCode;

    const isOnSale = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price || '0');

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          {isOnSale && (
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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -top-4 -left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                       text-white text-[11px] font-medium px-2 py-0.5 rounded-full 
                       shadow-sm cursor-default z-10"
            >
              Sale
            </motion.div>
          )}
          <p className="text-2xl font-medium text-[#B5A48B]">
            ${parseFloat(price || '0').toFixed(2)}
            <span className="text-sm text-[#8C7E6A] ml-2">
              {currencyCode}
            </span>
          </p>
        </div>
        {isOnSale && (
          <>
            <span className="text-sm text-[#8C7E6A] line-through decoration-[#FF6B6B]/40">
              ${parseFloat(compareAtPrice).toFixed(2)} {currencyCode}
            </span>
            <motion.span 
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xs text-[#FF6B6B] font-medium px-2 py-0.5 
                       bg-[#FF6B6B]/10 rounded-full border border-[#FF6B6B]/20"
            >
              Save {Math.round(((parseFloat(compareAtPrice) - parseFloat(price || '0')) / parseFloat(compareAtPrice)) * 100)}%
            </motion.span>
          </>
        )}
      </div>
    );
  };

  const renderProductOptions = () => (
    <div className="space-y-4">
      {product?.options.map((option) => (
        <div key={option.name} className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-[#6B5E4C]">
              {option.name}
            </label>
            {option.name === "Style" && (
              <button
                onClick={() => setIsStyleGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-[#8C7E6A] hover:text-[#6B5E4C] 
                           group transition-colors relative"
              >
                <span className="hover:underline">(STYLE GUIDE)</span>
                <Info className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                                bg-[#6B5E4C] text-white text-xs rounded whitespace-nowrap
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                pointer-events-none">
                  Click to see style guide
                </span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`px-3 py-1.5 text-xs sm:text-sm border rounded-md transition-all duration-200
                    ${isSelected 
                      ? 'border-[#6B5E4C] bg-[#6B5E4C] text-white' 
                      : 'border-[#B5A48B]/20 text-[#6B5E4C] hover:border-[#6B5E4C]'}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !product?.availableForSale) return;

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
              product: product,
              quantity
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
          } else {
            console.error('Add to cart failed:', result);
          }
        })
        .catch((error) => console.error('Add to cart error:', error));
    });
  }, [selectedVariant, product, quantity, formAction, addCartItem]);

  const handleTouchStart = (e: React.TouchEvent): void => {
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product) {
      const newIndex = activeImage === product.images.length - 1 ? 0 : activeImage + 1;
      setActiveImage(newIndex);
      scrollToActiveThumbnail(newIndex);
    }
    if (isRightSwipe && product) {
      const newIndex = activeImage === 0 ? product.images.length - 1 : activeImage - 1;
      setActiveImage(newIndex);
      scrollToActiveThumbnail(newIndex);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const getImagePriority = (index: number): boolean => {
    return product ? (index === activeImage || index === (activeImage + 1) % product.images.length) : false;
  };

  if (loading || !product) {
    return (
      <div className="w-full py-16 bg-[#F9F7F4]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="aspect-square bg-[#E5E1DB] rounded-2xl animate-pulse" />
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-8 w-32 bg-[#E5E1DB] rounded animate-pulse" />
                <div className="h-12 w-3/4 bg-[#E5E1DB] rounded animate-pulse" />
                <div className="h-24 w-full bg-[#E5E1DB] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section ref={ref} className="w-full py-8 sm:py-16 bg-[#F9F7F4] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[80%] h-[80%] bg-[#eaeadf] opacity-90 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl relative">
        <motion.div 
          className="flex flex-col lg:grid lg:grid-cols-2 min-w-0 gap-4 sm:gap-6 lg:gap-16"
        >
          {/* Left Side - Product Details */}
          <motion.div 
            className="flex flex-col min-w-0 justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#6B5E4C] text-white text-xs font-medium rounded-full">
                  Featured
                </span>
                {product?.availableForSale && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                    In Stock
                  </span>
              
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#6B5E4C]">
                {product?.title}
              </h2>

              {renderPrice()}

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => {
                    const fillPercentage = index === 4 ? (4.8 % 1) * 100 : 100;
                    return (
                      <div key={index} className="relative w-4 h-4">
                        <Star className="absolute w-4 h-4 text-gray-200" />
                        <div className="absolute w-4 h-4 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                  className="text-sm text-[#6B5E4C] hover:underline"
                >
                  4.8 (17 reviews)
                </button>
              </div>

              {isReviewsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ProductReviews 
                    productId={product.id} 
                    onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)} 
                  />
                </motion.div>
              )}

              <div 
                className={`prose prose-neutral max-w-none ${
                  !isDescriptionExpanded ? 'line-clamp-3' : ''
                }`}
                dangerouslySetInnerHTML={{ 
                  __html: product?.descriptionHtml || '' 
                }}
              />
                
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[#6B5E4C] hover:text-[#8C7E6A] text-sm font-medium 
                           flex items-center gap-1 transition-colors duration-200"
              >
                {isDescriptionExpanded ? (
                  <>
                    Show less
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
                    Read full description
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

              {renderProductOptions()}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className="p-3 sm:p-4 rounded-lg bg-white/50 backdrop-blur-sm 
                             border border-[#B5A48B]/20 group hover:bg-white/80 
                             transition-all duration-300"
                  >
                    <highlight.icon className="w-6 h-6 text-[#6B5E4C] mb-2 
                      transform group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="font-medium text-[#6B5E4C]">{highlight.title}</h4>
                    <p className="text-sm text-[#8C7E6A]">{highlight.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex h-10 sm:h-12 items-center rounded-md border-2 border-[#6B5E4C]/20 w-[90px] sm:w-[100px]">
                  <button
                    onClick={decrementQuantity}
                    className="flex h-full items-center justify-center px-2 text-[#6B5E4C] 
                             transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="w-8 text-center text-sm font-medium text-[#6B5E4C]">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    className="flex h-full items-center justify-center px-2 text-[#6B5E4C] 
                             transition-colors duration-200 hover:bg-[#6B5E4C]/5"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !product?.availableForSale || isPending}
                  className={`group relative h-10 sm:h-12 flex-1 flex items-center justify-center gap-2 
                             overflow-hidden rounded-md px-6 text-sm font-medium text-white 
                             shadow-md transition-all duration-300 hover:shadow-lg ${
                    !selectedVariant || !product?.availableForSale || isPending
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-[#6B5E4C] hover:bg-[#5A4D3B]'
                  }`}
                >
                  <motion.div
                    variants={mobileBlinkAnimation}
                    initial="initial"
                    animate={isPending ? "initial" : "hover"}
                    className="relative z-10"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </motion.div>
                  <span className="relative z-10 font-medium">
                    {isPending
                      ? 'Adding...'
                      : !selectedVariant
                        ? 'Select options'
                        : !product?.availableForSale
                          ? 'Out of Stock'
                          : 'Add to Cart'}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-[#B5A48B]/10 
                             text-[#6B5E4C] rounded-full border border-[#B5A48B]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div 
            className="flex flex-col min-w-0 gap-2 sm:gap-3 lg:gap-4 order-1 lg:order-2"
          >
            <div 
              className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div 
                animate={{ scale: 1.05 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[activeImage]?.url || product.featuredImage.url}
                  alt={product.images[activeImage]?.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={getImagePriority(activeImage)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              <button
                onClick={() => {
                  const newIndex = activeImage === 0 ? product.images.length - 1 : activeImage - 1;
                  setActiveImage(newIndex);
                  scrollToActiveThumbnail(newIndex);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                          rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                          transition-opacity duration-300 hover:bg-black/60 touch-manipulation"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const newIndex = activeImage === product.images.length - 1 ? 0 : activeImage + 1;
                  setActiveImage(newIndex);
                  scrollToActiveThumbnail(newIndex);
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 
                          rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                          transition-opacity duration-300 hover:bg-black/60"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveImage(index);
                      scrollToActiveThumbnail(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                      ${activeImage === index 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/75'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails Gallery */}
            <div className="relative mt-1 sm:mt-2 mb-1">
              {canScrollLeft && (
                <button
                  onClick={() => {
                    if (thumbnailsRef.current) {
                      thumbnailsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                  className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 
                           items-center justify-center bg-white/80 rounded-full shadow-md 
                           hover:bg-white transition-colors duration-200"
                  aria-label="Scroll thumbnails left"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={() => {
                    if (thumbnailsRef.current) {
                      thumbnailsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                    }
                  }}
                  className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 
                           items-center justify-center bg-white/80 rounded-full shadow-md 
                           hover:bg-white transition-colors duration-200"
                  aria-label="Scroll thumbnails right"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <motion.div 
                ref={thumbnailsRef}
                className="flex gap-1.5 sm:gap-2 px-0.5 sm:px-1 py-2 sm:py-4 overflow-x-auto 
                         scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] 
                         [scrollbar-width:none]"
                onScroll={checkScrollButtons}
              >
                {product.images.map((image, index) => (
                  <motion.div
                    key={image.url}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveImage(index);
                      scrollToActiveThumbnail(index);
                    }}
                    className={`relative w-14 sm:w-16 md:w-20 flex-shrink-0 aspect-square rounded-md 
                              sm:rounded-lg cursor-pointer ${
                      activeImage === index 
                        ? 'ring-2 ring-offset-2 ring-[#6B5E4C]' 
                        : 'opacity-70 hover:opacity-100'
                    } transition-all duration-200`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {activeImage === index && (
                      <div className="absolute inset-0 bg-[#6B5E4C]/10" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#6B5E4C]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B5E4C]">Share this product:</span>
                  <span className="text-xs text-[#8C7E6A] bg-[#6B5E4C]/5 px-2 py-0.5 rounded-full">
                    {shareCount} shares
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    aria-label="Share on X (formerly Twitter)"
                  >
                    <X className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                  <button
                    onClick={() => handleShare('pinterest')}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    aria-label="Share on Pinterest"
                  >
                    <Pinterest className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    aria-label="Share via Email"
                  >
                    <Mail className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                  <div className="w-px h-5 bg-[#6B5E4C]/10" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    aria-label="Copy link"
                  >
                    <LinkIcon className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-auto p-6 
                     border border-[#B5A48B]/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-[#6B5E4C]">Added to Cart!</h3>
                <p className="text-sm text-[#8C7E6A]">{product.title}</p>
                <p className="text-sm font-medium text-[#B5A48B]">
                  ${parseFloat(selectedVariant?.price.amount || '0').toFixed(2)} × {quantity}
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2 px-4 bg-[#6B5E4C] text-white rounded-lg 
                         hover:bg-[#5A4D3B] transition-colors duration-200 text-sm font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isQuickViewOpen && product && (
        <ProductQuickView
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}

      <StyleGuideModal 
        isOpen={isStyleGuideOpen} 
        onClose={() => setIsStyleGuideOpen(false)} 
      />
    </section>
  );
};

export default FeaturedProduct;