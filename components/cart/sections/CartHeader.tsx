// components/cart/sections/CartHeader.tsx
import type { Cart } from '@/lib/shopify/types';
import { motion } from 'framer-motion';

interface CartHeaderProps {
  isLoading: boolean;
  cart?: Cart;
}

export default function CartHeader({ isLoading, cart }: CartHeaderProps) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }} 
      className="text-center mb-12"
    >
      <h1 className="text-4xl font-bold text-[#6B5E4C] mb-4">Your Shopping Cart</h1>
      {isLoading ? (
        <p className="text-[#8C7E6A]">Loading cart...</p>
      ) : (
        <p className="text-[#8C7E6A]">
          {cart?.lines?.length 
            ? `You have ${cart.lines.length} ${cart.lines.length === 1 ? 'item' : 'items'} in your cart`
            : 'Your cart is empty'}
        </p>
      )}
    </motion.div>
  );
}