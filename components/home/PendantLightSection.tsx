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
import { ProductGallery } from './ProductGallery';
import { ProductOptions } from './ProductOptions';
import { QuantityPicker } from './QuantityPicker';
import { ShareButtons } from './ShareButtons';

// Import hooks, constants and utils
import { Star } from 'lucide-react';
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
              <ProductGallery
                images={product.images}
                title={product.title}
                activeImage={activeImage}
                onImageChange={(index: number) => {
                  setActiveImage(index);
                  scrollToThumbnail(index);
                }}
                isHovering={isHovering}
                setIsHovering={setIsHovering}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />

              {/* Thumbnails */}
              <div className="relative mt-2">
                <motion.div 
                  ref={thumbnailsRef}
                  className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar py-2 px-2"
                >
                  {product.images.map((image, index) => (
                    <motion.button
                      key={image.url}
                      onClick={() => {
                        setActiveImage(index);
                        scrollToThumbnail(index);
                      }}
                      className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden
                        ${activeImage === index 
                          ? 'ring-2 ring-offset-1 ring-[#6B5E4C] opacity-100'
                          : 'opacity-70 hover:opacity-100'} 
                        transition-all duration-200`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes={PRODUCT_CONSTANTS.IMAGE_SIZES.THUMBNAIL}
                      />
                      {activeImage === index && (
                        <div className="absolute inset-0 border-2 border-[#6B5E4C] rounded-lg" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Share Section - without additional border */}
              <div className="mt-6">
                <ShareButtons
                  product={product}
                  shareCount={shareCount}
                  onShare={(platform) => handleShare(platform, product.handle)}
                />
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

                {/* Description and Reviews Section */}
                <div>
                  {/* Star Rating and Reviews Button */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => {
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
                      4.8 (17 reviews)
                    </button>
                  </div>

                  {/* Render Reviews directly below the stars when expanded */}
                  {isReviewsExpanded && (
                    <div className="mt-2">
                      <ProductReviews 
                        productId={product.id}
                        onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)}
                      />
                    </div>
                  )}

                  <div className={`prose prose-neutral max-w-none mt-1 ${
                    !isDescriptionExpanded ? 'line-clamp-3' : ''
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                  </div>
                  
                  {/* Show Read full description button only if reviews are not expanded */}
                  {!isReviewsExpanded && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-[#6B5E4C] hover:text-[#8C7E6A] text-sm font-medium 
                        flex items-center gap-1 mt-2"
                    >
                      {isDescriptionExpanded ? 'Show less' : 'Read full description'}
                    </button>
                  )}
                </div>
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
              {/* Product Tags with border */}
              <div className="pt-6 border-t border-[#6B5E4C]/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B5E4C]">
                    {product.tags.length === 1 ? 'Tag:' : 'Tags:'} {/* Added colon */}
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs 
                                  bg-[#B5A48B]/10 text-[#6B5E4C] rounded-full border border-[#B5A48B]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
};

export default memo(FeaturedProduct);