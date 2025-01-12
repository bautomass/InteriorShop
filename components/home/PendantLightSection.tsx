'use client'
import { Pinterest } from '@/components/icons/Pinterest';
import { X } from '@/components/icons/X';
import { useActionState } from '@/hooks/useActionState';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { motion } from 'framer-motion';
import { CircleOff, Facebook, Info, Link as LinkIcon, Mail, Minus, Package, Plus, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState, useTransition } from 'react';

const SizeGuideModal = dynamic(() => import('@/components/modals/SizeGuideModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-full w-full rounded-lg" />,
  ssr: false
});

const ProductReviews = dynamic(() => import('@/components/reviews/ProductReviews'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-24 w-full rounded-lg" />,
  ssr: false
});

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

interface SelectedOptions {
  [key: string]: string;
}

const getStoredShareCount = () => {
  if (typeof window === 'undefined') return 67; // Initial default count
  
  const stored = localStorage.getItem('pendantShareCount');
  if (!stored) {
    const initialCount = 67; // Start with 67 shares
    localStorage.setItem('pendantShareCount', JSON.stringify({
      count: initialCount,
      lastUpdated: new Date().toISOString()
    }));
    return initialCount;
  }

  const { count, lastUpdated } = JSON.parse(stored);
  const lastUpdate = new Date(lastUpdated);
  const today = new Date();
  
  // Check if it's a new day
  if (lastUpdate.toDateString() !== today.toDateString()) {
    // Random increment between 1-3
    const increment = Math.floor(Math.random() * 3) + 1;
    const newCount = count + increment;
    localStorage.setItem('pendantShareCount', JSON.stringify({
      count: newCount,
      lastUpdated: today.toISOString()
    }));
    return newCount;
  }

  return count;
};

const FeaturedProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [shareCount, setShareCount] = useState(67);
  const [quantity, setQuantity] = useState(1);
  const { addCartItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/minimalist-japanese-wabi-sabi-pendant-light');
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
  }, []);

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

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(
          option => selectedOptions[option.name] === option.value
        )
      );
      setSelectedVariant(matchingVariant || null);

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  }, [selectedOptions, product]);

  useEffect(() => {
    setShareCount(getStoredShareCount());
  }, []);

  const highlights = [
    { 
      icon: Package,
      title: "Artisan Crafted",
      description: "Handmade by skilled Japanese artisans"
    },
    {
      icon: CircleOff,
      title: "Zero Waste",
      description: "Sustainable materials and packaging"
    },
    {
      icon: ShieldCheck,
      title: "5-Year Warranty",
      description: "Quality guaranteed craftsmanship"
    }
  ];

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));

    if (optionName === "Body Color") {
      switch (value) {
        case 'A - Grey':
          setActiveImage(2);
          break;
        case 'B - Grey':
          setActiveImage(3);
          break;
        case 'A - White':
          setActiveImage(4);
          break;
        case 'B - White':
          setActiveImage(5); 
          break;
      }
      scrollToActiveThumbnail(activeImage);
    }
  };

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
            {option.name === "Size" && (
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-[#8C7E6A] hover:text-[#6B5E4C] 
                           group transition-colors relative"
              >
                <span className="hover:underline">(SIZE GUIDE)</span>
                <Info className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                                 bg-[#6B5E4C] text-white text-xs rounded whitespace-nowrap
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                 pointer-events-none">
                  Click to see size guide
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
                  className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200
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
        
        // Calculate the center position for the thumbnail
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
    const shareUrl = `${window.location.origin}/products/${product?.handle || ''}#featured-pendant`;
    const shareTitle = `Check out this ${product?.title || 'product'}`;
    const shareText = "Beautiful Japanese-inspired pendant light, handcrafted by skilled artisans.";

    // Increment share count immediately for better UX
    const newCount = shareCount + 1;
    setShareCount(newCount);
    
    // Update localStorage
    localStorage.setItem('pendantShareCount', JSON.stringify({
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
          // You might want to add a toast notification here
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

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
    <>
      <section className="w-full min-w-0 py-8 sm:py-16 bg-[#F9F7F4] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#eaeadf] opacity-90 blur-[150px] pointer-events-none" />
        
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 max-w-7xl relative">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-w-0 gap-4 sm:gap-6 lg:gap-16">
            <div className="flex flex-col min-w-0 justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
              <div className="space-y-4 min-w-0 w-full">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#6B5E4C] text-white text-xs font-medium rounded-full 
                                 transition-colors duration-200 hover:bg-[#5A4D3B]">
                    Featured
                  </span>
                  {product?.availableForSale && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                      In Stock
                    </span>
                  )}
                  <motion.span 
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full
                             flex items-center gap-1 relative overflow-hidden group"
                  >
                    <motion.div
                      initial={{ opacity: 0.6 }}
                      animate={{ 
                        opacity: [0.6, 1, 0.6],
                        transition: {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
                    />
                    <span className="relative z-10">Catching On</span>
                    <motion.span
                      initial={{ rotate: -10 }}
                      animate={{ 
                        rotate: [0, 10, 0],
                        transition: {
                          duration: 0.3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="relative z-10"
                    >
                      🔥
                    </motion.span>
                  </motion.span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#6B5E4C]">
                  {product?.title}
                </h2>

                {renderPrice()}

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      // Calculate fill percentage for the last star
                      const fillPercentage = index === 4 ? (4.8 % 1) * 100 : 100;
                      return (
                        <div key={index} className="relative w-4 h-4">
                          {/* Background star (empty) */}
                          <Star className="absolute w-4 h-4 text-gray-200" />
                          {/* Foreground star (filled) */}
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
                    4.8 (37 reviews)
                  </button>
                </div>

                <div 
                  className={`prose prose-neutral max-w-none ${
                    !isDescriptionExpanded ? 'line-clamp-3' : ''
                  }`}
                  dangerouslySetInnerHTML={{ 
                    __html: product.descriptionHtml 
                  }}
                />

                {isReviewsExpanded && (
                  <ProductReviews 
                    productId={product.id} 
                    onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)} 
                  />
                )}

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

                <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
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
                    <div className="w-8 text-center text-sm font-medium text-[#6B5E4C]">{quantity}</div>
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
                    className="group relative h-10 sm:h-12 flex-1 flex items-center justify-center gap-2 
                               overflow-hidden rounded-md px-6 text-sm font-medium text-white 
                               shadow-md transition-all duration-200 hover:shadow-lg 
                               disabled:cursor-not-allowed disabled:bg-gray-400
                               enabled:bg-[#6B5E4C] enabled:hover:bg-[#5A4D3B]"
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
                      {isPending ? 'Adding...' : 'Add to Cart'}
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
            </div>

            <div className="flex flex-col min-w-0 gap-2 sm:gap-3 lg:gap-4 order-2 lg:order-1">
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
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                            bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
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
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                            bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
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

              <div className="relative mt-1 sm:mt-2 mb-1">
                {canScrollLeft && (
                  <button
                    onClick={() => {
                      if (thumbnailsRef.current) {
                        thumbnailsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                      }
                    }}
                    className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center 
                               bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-200"
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
                    className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center 
                               bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-200"
                    aria-label="Scroll thumbnails right"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <motion.div 
                  ref={thumbnailsRef}
                  className="flex gap-1.5 sm:gap-2 px-0.5 sm:px-1 py-2 sm:py-4 overflow-x-auto scroll-smooth 
                             [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                      className="relative w-14 sm:w-16 md:w-20 flex-shrink-0 aspect-square rounded-md sm:rounded-lg 
                                 ${activeImage === index 
                                   ? 'ring-2 ring-offset-2 ring-[#6B5E4C]' 
                                   : 'opacity-70 hover:opacity-100'} 
                                 transition-all duration-200`"
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
                <div className="flex items-center justify-between gap-2">
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
                    >
                      <Facebook className="w-5 h-5 text-[#6B5E4C]" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-[#6B5E4C]" />
                    </button>
                    <button
                      onClick={() => handleShare('pinterest')}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    >
                      <Pinterest className="w-5 h-5 text-[#6B5E4C]" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    >
                      <Mail className="w-5 h-5 text-[#6B5E4C]" />
                    </button>
                    <div className="w-px h-5 bg-[#6B5E4C]/10" />
                    <button
                      onClick={() => handleShare('copy')}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
                    >
                      <LinkIcon className="w-5 h-5 text-[#6B5E4C]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
};

export default memo(FeaturedProduct);