'use client';

import type { Cart } from '@/lib/shopify/types';
import CartModal from 'components/cart/modal';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw, Shield, Truck } from 'lucide-react';
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

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Free Shipping',
    description: 'On orders over $150'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Payment',
    description: '128-bit SSL encryption'
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: 'Easy Returns',
    description: '30-day return policy'
  }
];

export default function CartPage() {
  const [cart, setCart] = useState<Cart | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
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
    }
    fetchCart();
  }, []);

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

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Cart Content - Now full width */}
          <motion.div 
            variants={itemVariants}
            className="w-full"
          >
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden">
              <div className="p-6">
                <CartModal initialCart={cart} isCartPage={true} />
              </div>
            </div>
          </motion.div>

          {/* Order Summary & Features */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            {/* Order Summary */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-[#6B5E4C] mb-4">Order Summary</h2>
              {cart && (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C7E6A]">Subtotal</span>
                      <span className="font-medium text-[#6B5E4C]">
                        ${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C7E6A]">Estimated Shipping</span>
                      <span className="font-medium text-[#6B5E4C]">
                        {parseFloat(cart.cost.subtotalAmount.amount) >= 150 ? 'Free' : '$9.99'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C7E6A]">Estimated Tax</span>
                      <span className="font-medium text-[#6B5E4C]">
                        ${(parseFloat(cart.cost.subtotalAmount.amount) * 0.1).toFixed(2)}
                      </span>
                    </div>
                    {Array.isArray(cart?.discountCodes) && cart.discountCodes.length > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount Applied</span>
                        <span>-${parseFloat(cart.discountCodes?.[0]?.amount ?? '0').toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-[#6B5E4C]/10 pt-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#6B5E4C] font-semibold">Total</span>
                      <span className="text-[#6B5E4C] font-semibold">
                        ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#F8F6F3] rounded-md p-3 mb-4 text-sm">
                    {parseFloat(cart.cost.subtotalAmount.amount) >= 150 ? (
                      <p className="text-green-600">✓ Your order qualifies for free shipping!</p>
                    ) : (
                      <p className="text-[#8C7E6A]">
                        Add ${(150 - parseFloat(cart.cost.subtotalAmount.amount)).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>
                  <button className="w-full mb-3 bg-[#6B5E4C] text-white py-3 px-4 rounded-md hover:bg-[#5A4D3B] transition-colors flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="text-center text-xs text-[#8C7E6A] mt-4">
                    <p className="mb-2">Secure Checkout</p>
                    <div className="flex justify-center gap-2">
                      <Image src="/visa.svg" alt="Visa" width={32} height={20} />
                      <Image src="/mastercard.svg" alt="Mastercard" width={32} height={20} />
                      <Image src="/amex.svg" alt="American Express" width={32} height={20} />
                      <Image src="/paypal.svg" alt="PayPal" width={32} height={20} />
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Features */}
            <motion.div 
              variants={itemVariants}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 p-4 flex items-center gap-4"
                >
                  <div className="text-[#6B5E4C]">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-[#6B5E4C]">{feature.title}</h3>
                    <p className="text-sm text-[#8C7E6A]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Recently Viewed Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#6B5E4C]">Complete Your Collection</h2>
            <p className="text-[#8C7E6A] mt-2">
              Items you recently viewed - Don't miss out on these perfect additions to your cart
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed?.slice(0, 7).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F8F6F3]">
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
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-6 py-2 text-sm font-medium text-[#6B5E4C] opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium text-[#6B5E4C] group-hover:text-[#9e896c]">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#8C7E6A]">
                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {recentlyViewed?.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-[#8C7E6A] text-sm mb-4">
                  ✨ Complete your look with these perfectly matching pieces
                </p>
                <p className="text-[#6B5E4C] font-medium">
                  Free shipping on all orders!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center border-t border-[#6B5E4C]/10 pt-12"
        >
          <h3 className="text-lg font-medium text-[#6B5E4C] mb-2">Need Assistance?</h3>
          <p className="text-sm text-[#8C7E6A] mb-4">
            Our customer service team is here to help you with any questions.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/contact" className="text-sm text-[#6B5E4C] hover:text-[#5A4D3B] underline">
              Contact Us
            </a>
            <a href="/shipping" className="text-sm text-[#6B5E4C] hover:text-[#5A4D3B] underline">
              Shipping Info
            </a>
            <a href="/returns" className="text-sm text-[#6B5E4C] hover:text-[#5A4D3B] underline">
              Returns Policy
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 