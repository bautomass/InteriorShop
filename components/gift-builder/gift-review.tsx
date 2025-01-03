'use client';

import { addItem } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Package, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useGiftBuilder } from './context';

export function GiftReview() {
  const { state, dispatch } = useGiftBuilder();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cart } = useCart();

  const handleAddToCart = async () => {
    if (!state.selectedBox || state.selectedProducts.length === 0) return;

    setIsAddingToCart(true);
    try {
      // Add gift box first
      const boxResult = await addItem(null, {
        merchandiseId: state.selectedBox.variantId,
        quantity: 1
      });

      if (boxResult === 'Error adding item to cart') {
        throw new Error('Failed to add gift box to cart');
      }

      // Add selected items
      for (const item of state.selectedProducts) {
        const itemResult = await addItem(null, {
          merchandiseId: item.variantId,
          quantity: 1
        });

        if (itemResult === 'Error adding item to cart') {
          throw new Error(`Failed to add ${item.title} to cart`);
        }
      }

      // Success - move to next step
      toast.success('Gift bundle added to cart!');
      dispatch({ type: 'SET_STEP', payload: 4 });
    } catch (error) {
      console.error('Error adding gift to cart:', error);
      toast.error('Failed to add gift to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-50">
          Review Your Gift
        </h2>
        <p className="mt-2 text-primary-600 dark:text-primary-300">
          Review your selections before adding to cart
        </p>
      </div>

      {/* Selected Box */}
      <div className="rounded-lg border border-primary-200 bg-white p-6 dark:border-primary-700 dark:bg-primary-800">
        <h3 className="mb-4 text-lg font-semibold text-primary-900 dark:text-primary-50">
          Selected Gift Box
        </h3>
        {state.selectedBox && (
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              {state.selectedBox.image?.url ? (
                <Image
                  src={state.selectedBox.image.url}
                  alt={state.selectedBox.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                  <Package className="h-8 w-8 text-primary-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-primary-900 dark:text-primary-50">
                {state.selectedBox.title}
              </h4>
              <p className="text-sm text-primary-600 dark:text-primary-300">
                Contains {state.selectedProducts.length} items
              </p>
              <p className="mt-1 font-semibold text-accent-500">
                ${state.selectedBox.price.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Products */}
      <div className="rounded-lg border border-primary-200 bg-white p-6 dark:border-primary-700 dark:bg-primary-800">
        <h3 className="mb-4 text-lg font-semibold text-primary-900 dark:text-primary-50">
          Selected Products
        </h3>
        <div className="space-y-4">
          {state.selectedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                {product.image ? (
                  <Image
                    src={product.image.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-primary-100 dark:bg-primary-800">
                    <Package className="h-6 w-6 text-primary-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary-900 dark:text-primary-50">
                  {product.title}
                </h4>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !state.selectedBox || state.selectedProducts.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-3 font-medium text-white transition-colors hover:bg-accent-600 disabled:bg-primary-200 dark:disabled:bg-primary-700"
        >
          {isAddingToCart ? (
            <>
              Adding to Cart...
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Gift className="h-5 w-5" />
              </motion.div>
            </>
          ) : (
            <>
              Add to Cart
              <ShoppingCart className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
