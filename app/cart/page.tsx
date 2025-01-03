'use client';

import type { Cart } from '@/lib/shopify/types';
import CartModal from 'components/cart/modal';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | undefined>();

  useEffect(() => {
    async function fetchCart() {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    }
    fetchCart();
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[80vh] bg-gradient-to-b from-white to-[#F8F6F3]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          variants={childVariants}
          className="flex items-center gap-4 border-b border-[#6B5E4C]/10 pb-8"
        >
          <div className="relative">
            <ShoppingBag className="h-8 w-8 text-[#6B5E4C]" />
            {cart?.totalQuantity ? (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B5E4C] text-xs font-medium text-white">
                {cart.totalQuantity}
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#6B5E4C]">Shopping Cart</h1>
        </motion.div>

        <motion.div 
          variants={childVariants}
          className="mt-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#6B5E4C]/5"
        >
          <CartModal initialCart={cart} isCartPage={true} />
        </motion.div>

        <motion.div 
          variants={childVariants}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#8C7E6A]">
            Need help? <a href="/contact" className="underline hover:text-[#6B5E4C]">Contact us</a> or check our{' '}
            <a href="/shipping" className="underline hover:text-[#6B5E4C]">shipping information</a>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
} 