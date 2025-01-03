'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Cart, Product } from '@/lib/shopify/types';
import CartModal from 'components/cart/modal';
import { motion } from 'framer-motion';
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

        {/* Main Cart Content */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden">
            <div className="p-6">
              <CartModal initialCart={cart} isCartPage={true} />
            </div>
          </div>
        </motion.div>

        {/* Recently Viewed Section */}
        {recentItems?.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#6B5E4C]">Complete Your Collection</h2>
              <p className="text-[#8C7E6A] mt-2">
                Don't miss out on these perfect additions to your cart
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentItems.slice(0, 7).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-lg shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.featuredImage?.url || ''}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-6 py-2 text-sm font-medium text-[#6B5E4C] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#F8F6F3]"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#6B5E4C] group-hover:text-[#9e896c] truncate">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#8C7E6A]">
                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[#8C7E6A] text-sm mb-4">
                ✨ These items pair perfectly with your cart selections
              </p>
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