'use client'
import { ProductQuickView } from '@/components/quickview/ProductQuickView';
import type { Product } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const SaleProductCard = ({ product }: { product: Product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const discount = Math.round(
    ((parseFloat(product.compareAtPriceRange!.minVariantPrice.amount) - 
      parseFloat(product.priceRange.minVariantPrice.amount)) / 
      parseFloat(product.compareAtPriceRange!.minVariantPrice.amount)) * 100
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group relative bg-white dark:bg-primary-900/50 rounded-lg overflow-hidden
                   shadow-lg hover:shadow-xl transition-all duration-500"
      >
        {/* Animated Sale Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
            rotate: [-12, -15, -12]
          }}
          className="absolute top-3 left-3 z-20 bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B] 
                     text-white text-sm font-medium px-3 py-1 rounded-full 
                     shadow-lg transform -rotate-12"
        >
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Save {discount}%
          </span>
        </motion.div>

        {/* Image Section */}
        <div className="relative aspect-square">
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-cover transform transition-transform duration-700 
                       group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 
                         line-clamp-1 group-hover:text-accent-500 transition-colors">
            {product.title}
          </h3>

          {/* Price Display */}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold text-[#FF6B6B]">
              ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
            </span>
            <span className="text-lg text-primary-400 line-through decoration-[#FF6B6B]/40">
              ${parseFloat(product.compareAtPriceRange!.minVariantPrice.amount).toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 px-4 py-2 bg-primary-900 dark:bg-primary-100 
                         text-white dark:text-primary-900 rounded-md text-sm font-medium
                         hover:bg-primary-800 dark:hover:bg-primary-200 
                         transition-colors duration-300"
            >
              Quick View
            </button>
            <Link
              href={`/product/${product.handle}`}
              className="flex items-center justify-center px-4 py-2 
                         border border-primary-900 dark:border-primary-100
                         text-primary-900 dark:text-primary-100 rounded-md text-sm font-medium
                         hover:bg-primary-900 hover:text-white 
                         dark:hover:bg-primary-100 dark:hover:text-primary-900
                         transition-all duration-300 group/btn"
            >
              <span>View</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>

      {isQuickViewOpen && (
        <ProductQuickView
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
};

export const SaleProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        console.log('Fetching sale products...');
        const response = await fetch('/api/products/sale');
        const data = await response.json();
        console.log('Received data:', data);
        if (data.products) {
          const saleProducts = data.products.filter((product: Product) => 
            product.compareAtPriceRange?.minVariantPrice &&
            parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 
            parseFloat(product.priceRange.minVariantPrice.amount)
          );
          console.log('Filtered sale products:', saleProducts);
          setProducts(saleProducts);
        }
      } catch (error) {
        console.error('Error fetching sale products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 dark:text-primary-100
                     bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B]">
          Special Offers
        </h2>
        <p className="mt-4 text-lg text-primary-600 dark:text-primary-300">
          Discover our exclusive collection of premium lighting at unbeatable prices.
        </p>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            } : { opacity: 0, y: 20 }}
          >
            <SaleProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { 
          opacity: 1, 
          y: 0,
          transition: { delay: 0.5 }
        } : { opacity: 0, y: 20 }}
        className="mt-12 text-center"
      >
        <Link
          href="/sale"
          className="inline-flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-[#FF6B6B] to-[#FF8B8B]
                     text-white rounded-full text-lg font-medium
                     hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300"
        >
          View All Sale Items
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
};

export default SaleProductsSection; 