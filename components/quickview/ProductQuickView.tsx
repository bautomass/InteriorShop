// components/quickview/ProductQuickView.tsx
import { useActionState } from '@/hooks/useActionState'
import type { Product, ProductVariant } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { addItem } from 'components/cart/actions'
import { useCart } from 'components/cart/cart-context'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CreditCard, ShoppingCart, Star, X } from 'lucide-react'
import { memo, useCallback, useEffect, useState, useTransition } from 'react'
import { ProductGallery } from './ProductGallery'
import { TrustBadges } from './TrustBadges'

interface ProductQuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

interface ExtendedProductVariant extends ProductVariant {
  image?: {
    url: string
  }
}

const getProductRating = (productId: string): number => {
  if (typeof window === 'undefined') return 4.7
  
  const storageKey = `product_rating_${productId}`
  const storedRating = localStorage.getItem(storageKey)
  
  if (storedRating) {
    return parseFloat(storedRating)
  }

  // Generate random rating between 4.7 and 5.0
  const randomRating = (Math.random() * 0.3 + 4.7).toFixed(1)
  localStorage.setItem(storageKey, randomRating)
  return parseFloat(randomRating)
}

export const ProductQuickView = memo(({ product, isOpen, onClose }: ProductQuickViewProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedVariant, setSelectedVariant] = useState<ExtendedProductVariant | null>(null)
  const [rating, setRating] = useState<number>(0)
  const shortDescription = product.description.slice(0, 200)
  const hasLongDescription = product.description.length > 200
  const { addCartItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);

  useEffect(() => {
    const defaultOptions: Record<string, string> = {}
    product.options?.forEach(option => {
      if (option.values.length > 0 && option.name) {
        defaultOptions[option.name] = option.values[0] ?? ''
      }
    })
    setSelectedOptions(defaultOptions)
  }, [product])

  const findMatchingVariant = useCallback(() => {
    return (product.variants as ExtendedProductVariant[]).find(variant => {
      return variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      )
    }) || null
  }, [selectedOptions, product.variants])

  useEffect(() => {
    setSelectedVariant(findMatchingVariant())
  }, [findMatchingVariant])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRating(getProductRating(product.id))
    }
  }, [product.id])

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant || !product.availableForSale) return;

    startTransition(() => {
      const variantId = String(selectedVariant.id);

      formAction({
        merchandiseId: variantId,
        quantity: 1
      })
        .then((result) => {
          if (result === 'Success' && selectedVariant) {
            addCartItem({
              variant: selectedVariant,
              product,
              quantity: 1
            });
            // Optional: Close modal after adding to cart
            onClose();
          } else {
            console.error('Add to cart failed:', result);
          }
        })
        .catch((error) => console.error('Add to cart error:', error));
    });
  }, [selectedVariant, product, formAction, addCartItem, onClose]);

  const handleBuyNow = useCallback(async () => {
    if (!selectedVariant || !product.availableForSale) return;

    try {
      // First add to cart
      const result = await formAction({
        merchandiseId: String(selectedVariant.id),
        quantity: 1
      });

      if (result === 'Success') {
        // Then redirect to checkout
        const response = await fetch('/api/checkout');
        const { checkoutUrl } = await response.json();
        
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          console.error('No checkout URL returned');
        }
      }
    } catch (error) {
      console.error('Buy now error:', error);
    }
  }, [selectedVariant, product.availableForSale, formAction]);

  const findVariantByImage = useCallback((imageUrl: string) => {
    return (product.variants as ExtendedProductVariant[]).find(variant => 
      variant.image?.url === imageUrl || 
      product.images.findIndex(img => img.url === imageUrl) === 0
    )
  }, [product.variants, product.images])

  const handleImageClick = useCallback((imageUrl: string) => {
    const matchingVariant = findVariantByImage(imageUrl)
    if (matchingVariant) {
      const newOptions: Record<string, string> = {}
      matchingVariant.selectedOptions.forEach(option => {
        if (option.name) {
          newOptions[option.name] = option.value
        }
      })
      setSelectedOptions(newOptions)
    }
  }, [findVariantByImage])

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const toggleDescription = useCallback(() => {
    setIsDescriptionExpanded(prev => !prev)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-4 sm:py-8"
          onClick={handleBackdropClick}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="bg-white dark:bg-primary-950 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute right-4 top-4 z-50 rounded-full p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-100 
                       bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 
                       transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 p-3 sm:p-6">
              <div className="lg:sticky lg:top-0 w-full">
                <div className="aspect-square w-full max-w-[80vw] sm:max-w-full mx-auto">
                  <ProductGallery 
                    product={product} 
                    onImageClick={handleImageClick}
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Product Info */}
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">
                    {product.title}
                  </h2>
                  
                  {/* Rating Display */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "h-4 w-4",
                            index < Math.floor(rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : index < rating
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-300 dark:text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Updated Trust Badges implementation */}
                  <div className="py-2">
                    <TrustBadges product={product} />
                  </div>

                  <p className="text-xl font-bold text-accent-600 dark:text-accent-400">
                    ${selectedVariant 
                      ? parseFloat(selectedVariant.price.amount).toFixed(2)
                      : parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)
                    }
                  </p>
                  <motion.div 
                    initial={false}
                    animate={{ height: isDescriptionExpanded ? 'auto' : 'auto' }}
                    className="relative prose dark:prose-invert max-w-none"
                  >
                    <motion.p
                      initial={false}
                      animate={{ opacity: 1 }}
                      className="text-primary-800 dark:text-primary-200"
                    >
                      {isDescriptionExpanded ? product.description : shortDescription}
                      {!isDescriptionExpanded && hasLongDescription && '...'}
                    </motion.p>
                    {hasLongDescription && (
                      <motion.button
                        onClick={toggleDescription}
                        className="flex items-center gap-1 text-sm text-accent-500 hover:text-accent-600 mt-2"
                      >
                        {isDescriptionExpanded ? (
                          <>Show Less <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>Read More <ChevronDown className="h-4 w-4" /></>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                </div>

                {/* Product Options */}
                {product.options?.filter(option => option.values.length > 0).map((option) => (
                  <div key={option.id} className="space-y-2">
                    <label className="block text-xs font-medium text-primary-900 dark:text-primary-100">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {option.values.map((value) => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={cn(
                            "px-3 py-1.5 border rounded-md text-sm",
                            "text-primary-800 dark:text-primary-200",
                            "border-primary-200 dark:border-primary-800",
                            "hover:border-primary-900 dark:hover:border-primary-100",
                            "transition-all duration-200",
                            selectedOptions[option.name] === value && "border-primary-900 dark:border-primary-100 bg-primary-50 dark:bg-primary-900"
                          )}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white dark:bg-primary-950 pt-2 sm:pt-3 border-t border-primary-100 dark:border-primary-800">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || !product.availableForSale || isPending}
                      className={cn(
                        "flex-1 flex items-center justify-center",
                        "px-3 py-2 sm:px-6 sm:py-3",
                        "text-xs sm:text-base",
                        "bg-primary-900 hover:bg-primary-800 dark:bg-primary-100 dark:hover:bg-primary-200",
                        "text-white dark:text-primary-900",
                        "rounded-md transition-all duration-200",
                        (!selectedVariant || !product.availableForSale || isPending) && 
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      {isPending ? 'Adding...' : 'Add to Cart'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={!selectedVariant || !product.availableForSale || isPending}
                      className={cn(
                        "flex-1 flex items-center justify-center",
                        "px-3 py-2 sm:px-6 sm:py-3",
                        "text-xs sm:text-base",
                        "bg-accent-500 hover:bg-accent-600",
                        "text-white rounded-md",
                        "transition-all duration-200",
                        (!selectedVariant || !product.availableForSale || isPending) && 
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <CreditCard className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Buy Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})

ProductQuickView.displayName = 'ProductQuickView'