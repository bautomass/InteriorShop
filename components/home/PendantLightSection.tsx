'use client';

import { useActionState } from '@/hooks/useActionState';
import type { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useState, useTransition } from 'react';

// Dynamic imports with loading states
const SizeGuideModal = dynamic(() => import('@/components/modals/SizeGuideModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-full w-full rounded-lg" />,
  ssr: false
});

const ProductReviews = dynamic(() => import('@/components/reviews/ProductReviews'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-24 w-full rounded-lg" />,
  ssr: false
});

// Local component imports
import { AddToCartButton } from './AddToCartButton';
import { ProductOptions } from './ProductOptions';
import { QuantityPicker } from './QuantityPicker';
import { ShareButtons } from './ShareButtons';

// Import hooks, constants and utils
import Image from 'next/image';
import { HIGHLIGHTS, PRODUCT_CONSTANTS } from './constants';
import { useProductGallery } from './hooks/useProductGallery';
import { useProductVariant } from './hooks/useProductVariant';
import { useShare } from './hooks/useShare';
import { getProductPrices } from './utils';

const FeaturedProduct = () => {
  // Core state management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const [isHovering, setIsHovering] = useState(false);

  // Custom hooks
  const { currency, formatPrice } = useCurrency();
  const { addCartItem } = useCart();
  const { selectedOptions, selectedVariant, handleOptionChange } = useProductVariant(product);
  const { shareCount, handleShare } = useShare();
  const {
    activeImage,
    setActiveImage,
    canScrollLeft,
    canScrollRight,
    thumbnailsRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scrollToThumbnail,
    checkScrollButtons
  } = useProductGallery(product?.images.length ?? 0);

  // Fetch product data
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

  // Event handlers
  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !product?.availableForSale) return;

    startTransition(() => {
      formAction({
        merchandiseId: String(selectedVariant.id),
        quantity
      })
        .then((result) => {
          if (result === 'Success' && selectedVariant) {
            addCartItem({
              variant: selectedVariant,
              product: product,
              quantity
            });
          }
        })
        .catch((error) => console.error('Add to cart error:', error));
    });
  }, [selectedVariant, product, quantity, formAction, addCartItem]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Price calculations
  const { price, compareAtPrice, isOnSale } = getProductPrices(selectedVariant, product);

  if (loading || !product) {
    return null;
  }

  return (
    <>
      <section className="w-full min-w-0 py-8 sm:py-16 bg-[#F9F7F4] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#eaeadf] opacity-90 blur-[150px] pointer-events-none" />
        
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 max-w-7xl relative">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-w-0 gap-4 sm:gap-6 lg:gap-16">
            {/* Product Gallery */}
            <div className="order-2 lg:order-1">
              <div 
                className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {product.images.map((image, index) => (
                  <div
                    key={image.url}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                      ${index === activeImage ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      priority={index === activeImage}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={PRODUCT_CONSTANTS.IMAGE_SIZES.MAIN}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/95 via-[#6B5E4C]/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-12 transform translate-y-full 
                      group-hover:translate-y-0 transition-all duration-700 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-white text-2xl font-light leading-relaxed transform 
                          translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-700 delay-100 ease-out">
                          {/* Add your image text here */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation buttons */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImage(index);
                        scrollToThumbnail(index);
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

              {/* Thumbnails */}
              <div className="relative mt-2">
                <motion.div 
                  ref={thumbnailsRef}
                  className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
                >
                  {product.images.map((image, index) => (
                    <motion.button
                      key={image.url}
                      onClick={() => {
                        setActiveImage(index);
                        scrollToThumbnail(index);
                      }}
                      className={`relative flex-shrink-0 w-20 aspect-square rounded-lg 
                        ${activeImage === index ? 'ring-2 ring-[#6B5E4C]' : 'opacity-70 hover:opacity-100'} 
                        transition-all duration-200`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes={PRODUCT_CONSTANTS.IMAGE_SIZES.THUMBNAIL}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col min-w-0 space-y-6 order-1 lg:order-2">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#6B5E4C] text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                  {product.availableForSale && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                      In Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-light text-[#6B5E4C]">{product.title}</h1>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-medium text-[#B5A48B]">
                    {formatPrice(price)}
                  </p>
                  {isOnSale && compareAtPrice && (
                    <>
                      <span className="text-sm text-[#8C7E6A] line-through">
                        {formatPrice(compareAtPrice)}
                      </span>
                      <span className="text-xs text-[#FF6B6B] font-medium px-2 py-0.5 
                        bg-[#FF6B6B]/10 rounded-full">
                        Save {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className={`prose prose-neutral max-w-none ${
                  !isDescriptionExpanded ? 'line-clamp-3' : ''
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                </div>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-[#6B5E4C] hover:text-[#8C7E6A] text-sm font-medium 
                    flex items-center gap-1 mt-2"
                >
                  {isDescriptionExpanded ? 'Show less' : 'Read more'}
                </button>
              </div>

              {/* Product Options */}
              <ProductOptions
                product={product}
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
                onSizeGuideClick={() => setIsSizeGuideOpen(true)}
              />

              {/* Add to Cart Section */}
              <div className="flex items-center gap-3">
                <QuantityPicker
                  quantity={quantity}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                />
                <AddToCartButton
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !product.availableForSale}
                  isPending={isPending}
                />
              </div>

              {/* Product Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HIGHLIGHTS.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-[#B5A48B]/20
                      hover:bg-white/80 transition-all duration-300"
                  >
                    <highlight.icon className="w-6 h-6 text-[#6B5E4C] mb-2" />
                    <h4 className="font-medium text-[#6B5E4C]">{highlight.title}</h4>
                    <p className="text-sm text-[#8C7E6A]">{highlight.description}</p>
                  </div>
                ))}
              </div>

              {/* Share Section */}
              <ShareButtons
                product={product}
                shareCount={shareCount}
                onShare={(platform) => handleShare(platform, product.handle)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {isReviewsExpanded && (
        <ProductReviews 
          productId={product.id}
          onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)}
        />
      )}
    </>
  );
};

export default memo(FeaturedProduct);