'use client'
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import ProductReviews from '@/components/reviews/ProductReviews';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import { ArrowRight, CircleOff, Package, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SelectedOptions {
  [key: string]: string;
}

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
  
  // Check if it's a new day
  if (lastUpdate.toDateString() !== today.toDateString()) {
    // Random increment between 1-3
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
  }, []);

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

    // Increment share count immediately for better UX
    const newCount = shareCount + 1;
    setShareCount(newCount);
    
    // Update localStorage
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

    // Update image based on variant selection
    if (optionName === "Style") {  // Assuming the option name is "Style"
      switch (value) {
        case 'White-1':
          setActiveImage(0); // Index of white-1 image
          break;
        case 'White-2':
          setActiveImage(1); // Index of white-2 image
          break;
        case 'White-3':
          setActiveImage(2); // Index of white-3 image
          break;
        case 'Black-1':
          setActiveImage(3); // Index of black-1 image
          break;
        case 'Black-2':
          setActiveImage(4); // Index of black-2 image
          break;
        case 'Black-3':
          setActiveImage(5); // Index of black-3 image
          break;
      }
      scrollToActiveThumbnail(activeImage);
    }
  };

  // Add this useEffect to update the selected variant when options change
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
    
    const currencyCode = selectedVariant 
      ? selectedVariant.price.currencyCode
      : product?.priceRange.minVariantPrice.currencyCode;

    return (
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-medium text-[#B5A48B]"
      >
        ${parseFloat(price || '0').toFixed(2)}
        <span className="text-sm text-[#8C7E6A] ml-2">
          {currencyCode}
        </span>
      </motion.p>
    );
  };

  const renderProductOptions = () => (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-4"
    >
      {product?.options.map((option) => (
        <div key={option.name} className="space-y-2">
          <label className="block text-sm font-medium text-[#6B5E4C]">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`px-4 py-2 border rounded-md transition-all duration-200
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
    </motion.div>
  );

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
      
      <div className="container mx-auto px-4 max-w-7xl relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16"
        >
          {/* Left Side - Product Details */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-6 sm:space-y-8 order-1"
          >
            {/* Product details content */}
            <div className="space-y-4">
              {/* Featured and In Stock badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="px-3 py-1 bg-[#6B5E4C] text-white text-xs font-medium rounded-full">
                  Featured
                </span>
                {product?.availableForSale && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                    In Stock
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[#6B5E4C]"
              >
                {product?.title}
              </motion.h2>

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
                      className={`w-4 h-4 ${
                        index < 4 || (index === 4 && 0.9 >= 0.5)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                  className="text-sm text-[#6B5E4C] hover:underline"
                >
                  4.9 (128 reviews)
                </button>
              </motion.div>

              {/* Reviews Section */}
              {isReviewsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ProductReviews 
                    isExpanded={isReviewsExpanded}
                    onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)}
                  />
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
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
              </motion.div>

              {renderPrice()}
            </div>

            {/* Product Options */}
            {renderProductOptions()}

            {/* Highlights */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  className="p-4 rounded-lg bg-white/50 backdrop-blur-sm 
                           border border-[#B5A48B]/20 group hover:bg-white/80 
                           transition-all duration-300"
                >
                  <highlight.icon className="w-6 h-6 text-[#6B5E4C] mb-2 
                    transform group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-medium text-[#6B5E4C]">{highlight.title}</h4>
                  <p className="text-sm text-[#8C7E6A]">{highlight.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsQuickViewOpen(true)}
                className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-[#6B5E4C] text-white 
                           rounded-md hover:bg-[#5A4D3B] transition-colors duration-300"
              >
                Quick View
              </motion.button>
              <motion.button
                onClick={() => window.location.href = `/product/${product!.handle}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 
                           py-3 sm:py-4 border border-[#6B5E4C] text-[#6B5E4C] rounded-md 
                           group hover:bg-[#6B5E4C] hover:text-white transition-all duration-300"
              >
                View Details
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Tags */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-1.5 sm:gap-2"
            >
              {product?.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 sm:px-3 py-1 text-xs bg-[#B5A48B]/10 text-[#6B5E4C] 
                           rounded-full border border-[#B5A48B]/20"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:gap-4 order-2"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group">
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
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              {/* Image Navigation Arrows */}
              <button
                onClick={() => {
                  const newIndex = activeImage === 0 ? product.images.length - 1 : activeImage - 1;
                  setActiveImage(newIndex);
                  scrollToActiveThumbnail(newIndex);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                          bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                          sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 
                          hover:bg-black/60 touch-manipulation"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                          bg-black/40 backdrop-blur-sm flex items-center justify-center text-white 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                          hover:bg-black/60"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Background gradient for indicators */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              {/* Dots Navigation */}
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
              {/* Left Arrow */}
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

              {/* Right Arrow */}
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
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 px-1 py-2 sm:py-4 overflow-x-auto scroll-smooth 
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
                    className={`relative w-16 sm:w-20 flex-shrink-0 aspect-square rounded-md sm:rounded-lg 
                               ${activeImage === index 
                                 ? 'ring-2 ring-offset-2 ring-[#6B5E4C]' 
                                 : 'opacity-70 hover:opacity-100'} 
                               transition-all duration-200`}
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
          </motion.div>
        </motion.div>
      </div>

      {isQuickViewOpen && product && (
        <ProductQuickView
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </section>
  );
};

export default FeaturedProduct; 