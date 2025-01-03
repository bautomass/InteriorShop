'use client';

import { useActionState } from '@/hooks/useActionState';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Cart, Product } from '@/lib/shopify/types';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import CartModal from 'components/cart/modal';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Lock, RotateCcw, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const TRUST_BADGES = [
  {
    title: 'Free Shipping',
    description: 'On all orders',
    icon: Truck
  },
  {
    title: 'Secure Payments',
    description: 'SSL encryption',
    icon: Lock
  },
  {
    title: 'Easy Returns',
    description: '30 day returns',
    icon: RotateCcw
  }
];

const DISCOUNT_PERCENTAGE = 10;

export default function CartPage() {
  const [serverCart, setServerCart] = useState<Cart | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { recentItems } = useRecentlyViewed();
  const [message, formAction] = useActionState(addItem, null);
  const [isAddingToCart, setIsAddingToCart] = useState<{[key: string]: boolean}>({});
  const { cart: contextCart, addCartItem } = useCart();
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setServerCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const activeCart = contextCart || serverCart;

  const addToCart = async (product: Product) => {
    try {
      const defaultVariant = product.variants[0];
      
      if (!defaultVariant?.id) {
        console.error('No variant available for product:', product.title);
        return;
      }

      setIsAddingToCart(prev => ({ ...prev, [product.id]: true }));
      
      const result = await formAction({
        merchandiseId: defaultVariant.id,
        quantity: 1,
        attributes: [{ key: '_discount', value: '10' }]
      });

      if (result === 'Success') {
        const discountedVariant = {
          ...defaultVariant,
          price: {
            ...defaultVariant.price,
            amount: calculateDiscountedPrice(defaultVariant.price.amount)
          }
        };

        addCartItem({
          variant: discountedVariant,
          product,
          quantity: 1
        });
        
        setTimeout(() => {
          setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const calculateDiscountedPrice = (originalPrice: string) => {
    const price = parseFloat(originalPrice);
    const discountedPrice = price * (1 - DISCOUNT_PERCENTAGE / 100);
    return discountedPrice.toFixed(2);
  };

  const displayedRecentItems = useMemo(() => {
    if (!recentItems?.length) return [] as Product[];
    // Remove the last viewed item and filter out undefined products
    const validProducts = recentItems
      .slice(0, -1)
      .filter((item): item is Product => 
        item !== undefined && 
        item.id !== undefined && 
        item.variants !== undefined &&
        item.title !== undefined
      );
    return validProducts;
  }, [recentItems]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F6F3]">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 relative"
      >
        {/* Navigation Buttons - Responsive positioning */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-3 mb-8 sm:mb-0 sm:justify-start sm:absolute sm:left-6 sm:top-14 lg:left-8 z-10"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 
              text-sm rounded-lg bg-white shadow-sm ring-1 ring-[#6B5E4C]/5 
              transition-all duration-200 hover:shadow-md hover:bg-[#F8F6F3] text-[#6B5E4C]
              min-w-[100px] sm:min-w-0"
          >
            <ArrowLeft 
              className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              strokeWidth={1.5} 
            />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 
              text-sm rounded-lg bg-white shadow-sm ring-1 ring-[#6B5E4C]/5 
              transition-all duration-200 hover:shadow-md hover:bg-[#F8F6F3] text-[#6B5E4C]
              min-w-[100px] sm:min-w-0"
          >
            <Home 
              className="w-4 h-4 transition-transform group-hover:scale-110" 
              strokeWidth={1.5} 
            />
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </motion.div>

        {/* Header - Adjusted margin for mobile */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#6B5E4C] mb-4">Your Shopping Cart</h1>
          {isLoading ? (
            <p className="text-[#8C7E6A]">Loading cart...</p>
          ) : (
            <p className="text-[#8C7E6A]">
              {activeCart?.lines?.length 
                ? `You have ${activeCart.lines.length} ${activeCart.lines.length === 1 ? 'item' : 'items'} in your cart`
                : 'Your cart is empty'}
            </p>
          )}
        </motion.div>

        {/* Main Content with Trust Badges */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Content - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden">
                <div className="p-6">
                  <CartModal 
                    initialCart={activeCart} 
                    isCartPage={true} 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges - Takes up 1 column on large screens */}
          <motion.div variants={itemVariants} className="space-y-6 lg:pl-8">
            {TRUST_BADGES.map((badge) => (
              <div 
                key={badge.title}
                className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 flex items-center space-x-4"
              >
                <div className="flex-shrink-0 text-[#6B5E4C]">
                  <badge.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[#6B5E4C] font-medium">{badge.title}</h3>
                  <p className="text-sm text-[#8C7E6A]">{badge.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Recently Viewed Section */}
        {displayedRecentItems.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#6B5E4C]">Complete Your Collection</h2>
              <p className="text-[#8C7E6A] mt-2">
                Special Offer: 10% OFF these items when added to cart!
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-6 max-w-[2100px]">
                {displayedRecentItems.slice(0, 7).map((product) => (
                  <Tooltip.Provider delayDuration={200}>
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ 
                        y: -4,
                        transition: { 
                          type: "spring",
                          stiffness: 300,
                          damping: 10
                        }
                      }}
                      className="group relative bg-white rounded-lg shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                              10% OFF
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-[200px] text-[#6B5E4C] z-50"
                              sideOffset={5}
                            >
                              Special discount applied when adding to cart from your recently viewed items!
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                        
                        <Image
                          src={product.featuredImage?.url || ''}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              disabled={isAddingToCart[product.id]}
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs xl:px-3 xl:py-1 xl:text-[10px] font-medium text-[#6B5E4C] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#F8F6F3] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isAddingToCart[product.id] ? (
                                <span className="flex items-center gap-1">
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                  >
                                    Added!
                                  </motion.span>
                                </span>
                              ) : (
                                'Add to Cart'
                              )}
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-[200px] text-[#6B5E4C] z-50"
                              sideOffset={5}
                            >
                              Click to add this item to your cart with a 10% discount!
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                      
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="p-3 xl:p-2">
                            <h3 className="font-medium text-[#6B5E4C] group-hover:text-[#9e896c] truncate text-sm xl:text-xs">
                              {product.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-red-500 font-medium text-sm xl:text-xs">
                                ${calculateDiscountedPrice(product.priceRange.minVariantPrice.amount)}
                              </span>
                              <span className="text-xs xl:text-[10px] text-[#8C7E6A] line-through">
                                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-[250px] text-[#6B5E4C] z-50"
                            sideOffset={5}
                          >
                            <p className="font-medium mb-1">{product.title}</p>
                            <p className="text-xs text-[#8C7E6A]">{product.description?.slice(0, 100)}...</p>
                            <Tooltip.Arrow className="fill-white" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </motion.div>
                  </Tooltip.Provider>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[#6B5E4C] font-medium">
                Free shipping on all orders!
              </p>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-center border-t border-[#6B5E4C]/10 pt-12"
        >
          <h3 className="text-lg font-medium text-[#6B5E4C] mb-2">Need Assistance?</h3>
          <p className="text-sm text-[#8C7E6A] mb-4">
            Our customer service team is here to help you with any questions.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/contact" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
              Contact Us
            </a>
            <a href="/shipping" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
              Shipping Info
            </a>
            <a href="/returns" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
              Returns Policy
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 