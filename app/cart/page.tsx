'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Cart, Product } from '@/lib/shopify/types';
import CartModal from 'components/cart/modal';
import { motion } from 'framer-motion';
import { Lock, RotateCcw, Truck } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const [cart, setCart] = useState<Cart | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { recentItems } = useRecentlyViewed();

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
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

  const addToCart = async (product: Product) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          merchandiseId: product.variants?.[0]?.id || '',
          quantity: 1
        })
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const calculateDiscountedPrice = (originalPrice: string) => {
    const price = parseFloat(originalPrice);
    const discountedPrice = price * (1 - DISCOUNT_PERCENTAGE / 100);
    return discountedPrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F6F3]">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#6B5E4C] mb-4">Your Shopping Cart</h1>
          <p className="text-[#8C7E6A]">
            {cart?.totalQuantity 
              ? `You have ${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is empty'}
          </p>
        </motion.div>

        {/* Main Content with Trust Badges */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Content - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden">
                <div className="p-6">
                  <CartModal initialCart={cart} isCartPage={true} />
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
        {recentItems?.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#6B5E4C]">Complete Your Collection</h2>
              <p className="text-[#8C7E6A] mt-2">
                Special Offer: 10% OFF these items when added to cart!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentItems.slice(0, 7).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-lg shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      10% OFF
                    </div>
                    
                    <Image
                      src={product.featuredImage?.url || ''}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-6 py-2 text-sm font-medium text-[#6B5E4C] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#F8F6F3]"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#6B5E4C] group-hover:text-[#9e896c] truncate">
                      {product.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-red-500 font-medium">
                        ${calculateDiscountedPrice(product.priceRange.minVariantPrice.amount)}
                      </span>
                      <span className="text-sm text-[#8C7E6A] line-through">
                        ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
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