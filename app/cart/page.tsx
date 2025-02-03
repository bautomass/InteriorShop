// pages/cart.tsx
'use client';
import { useCartActions } from '@/components/cart/hooks/useCartActions';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useServerCart } from '@/components/cart/hooks/useServerCart';
import type { Product } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
const CartModal = dynamic(() => import('components/cart/modal'), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
});
const InvoiceSection = dynamic(() => import('@/components/invoice/InvoiceSection'), {
  loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />
});
// Regular imports for smaller components
import CartHeader from '@/components/cart/sections/CartHeader';
import HelpSection from '@/components/cart/sections/HelpSection';
import NavigationButtons from '@/components/cart/sections/NavigationButtons';
import RecentlyViewed from '@/components/cart/sections/RecentlyViewed';
import TrustBadges from '@/components/cart/sections/TrustBadges';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CartPage() {
  const { cart, isLoading } = useServerCart();
  const { recentItems } = useRecentlyViewed();
  const { isAddingToCart, addToCart, calculateDiscountedPrice } = useCartActions();

  // Memoized recent items processing
  const displayedRecentItems = useMemo(() => {
    if (!recentItems?.length) return [] as Product[];
    return recentItems
      .slice(0, -1)
      .filter((item): item is Product => 
        item !== undefined && 
        item.id !== undefined && 
        item.variants !== undefined &&
        item.title !== undefined
      );
  }, [recentItems]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F6F3]">
      <div className="pt-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 relative"
        >
          <NavigationButtons />
          <CartHeader isLoading={isLoading} cart={cart} />
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Content */}
            <div className="lg:col-span-2">
              <motion.div variants={containerVariants} className="mb-8">
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 overflow-hidden">
                  <div className="p-6">
                    <CartModal initialCart={cart} isCartPage={true} />
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Trust Badges and Invoice */}
            <motion.div variants={containerVariants} className="space-y-6 lg:pl-8">
              <TrustBadges />
              {cart && cart.lines && cart.lines.length > 0 && (
                <InvoiceSection 
                  cart={cart} 
                  onDownloadPDF={() => {
                    console.log('Downloading PDF...');
                  }}
                  onDownloadCSV={() => {
                    console.log('Downloading CSV...');
                  }}
                />
              )}
            </motion.div>
          </div>
          {displayedRecentItems.length > 0 && (
            <RecentlyViewed 
              products={displayedRecentItems}
              isAddingToCart={isAddingToCart}
              onAddToCart={addToCart}
              calculateDiscountedPrice={calculateDiscountedPrice}
            />
          )}
          <HelpSection />
        </motion.div>
      </div>
    </div>
  );
}
