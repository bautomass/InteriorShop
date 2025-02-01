// components/cart/sections/RecentlyViewed.tsx
'use client';

import { Product } from '@/lib/shopify/types';
import { useCurrency } from '@/providers/CurrencyProvider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RecentlyViewedProps {
  products: Product[];
  isAddingToCart: { [key: string]: boolean };
  onAddToCart: (product: Product) => Promise<void>;
  calculateDiscountedPrice: (price: string) => string;
}

export default function RecentlyViewed({ 
  products, 
  isAddingToCart, 
  onAddToCart, 
  calculateDiscountedPrice 
}: RecentlyViewedProps) {
  const { formatPrice } = useCurrency();

  if (products.length === 0) return null;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }} 
      className="mt-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#6B5E4C]">Complete Your Collection</h2>
        <p className="text-[#8C7E6A] mt-2">
          Special Offer: 10% OFF these items when added to cart!
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-6 max-w-[2100px]">
          {products.slice(0, 7).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdding={isAddingToCart[product.id] || false}
              onAdd={onAddToCart}
              calculateDiscountedPrice={calculateDiscountedPrice}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[#6B5E4C] font-medium">
          Free shipping on all orders!
        </p>
      </div>
    </motion.div>
  );
}

// Helper component for product card
function ProductCard({ 
  product, 
  isAdding, 
  onAdd, 
  calculateDiscountedPrice,
  formatPrice 
}: {
  product: Product;
  isAdding: boolean;
  onAdd: (product: Product) => Promise<void>;
  calculateDiscountedPrice: (price: string) => string;
  formatPrice: (price: number) => string;
}) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <motion.div
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
          <DiscountBadge />
          
          <Image
            src={product.featuredImage?.url || ''}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
          
          <AddToCartButton 
            product={product}
            isAdding={isAdding}
            onAdd={onAdd}
          />
        </div>
        
        <ProductInfo 
          product={product}
          calculateDiscountedPrice={calculateDiscountedPrice}
          formatPrice={formatPrice}
        />
      </motion.div>
    </Tooltip.Provider>
  );
}

function DiscountBadge() {
  return (
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
  );
}

function AddToCartButton({ 
  product, 
  isAdding, 
  onAdd 
}: {
  product: Product;
  isAdding: boolean;
  onAdd: (product: Product) => Promise<void>;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(product);
          }}
          disabled={isAdding}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs xl:px-3 xl:py-1 xl:text-[10px] font-medium text-[#6B5E4C] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#F8F6F3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAdding ? (
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
  );
}

function ProductInfo({ 
  product, 
  calculateDiscountedPrice,
  formatPrice 
}: {
  product: Product;
  calculateDiscountedPrice: (price: string) => string;
  formatPrice: (price: number) => string;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className="p-3 xl:p-2">
          <h3 className="font-medium text-[#6B5E4C] group-hover:text-[#9e896c] truncate text-sm xl:text-xs">
            {product.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-red-500 font-medium text-sm xl:text-xs">
              {formatPrice(parseFloat(calculateDiscountedPrice(product.priceRange.minVariantPrice.amount)))}
            </span>
            <span className="text-xs xl:text-[10px] text-[#8C7E6A] line-through">
              {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
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
  );
}