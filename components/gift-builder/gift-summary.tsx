// components/gift-builder/gift-summary.tsx
'use client';

import { motion } from 'framer-motion';
import { Gift, Settings2, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useGiftBuilder } from './context';

export function GiftSummary() {
  const { state, dispatch } = useGiftBuilder();
  const { selectedBox, selectedProducts, totalPrice, discount } = state;

  const handleRemoveProduct = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
  };

  const handleEditProduct = (productId: string) => {
    dispatch({ type: 'EDIT_PRODUCT', payload: productId });
  };

  const subtotal = selectedBox
    ? selectedBox.price + selectedProducts.reduce((sum, product) => sum + product.price, 0)
    : 0;
  const remainingSlots = selectedBox ? selectedBox.maxProducts - selectedProducts.length : 0;
  const isBoxFull = selectedBox && remainingSlots === 0;

  // Calculate current discount tier
  const getDiscountTier = (itemCount: number) => {
    if (itemCount >= 10) return 20;
    if (itemCount >= 7) return 15;
    if (itemCount >= 5) return 10;
    if (itemCount >= 3) return 5;
    return 0;
  };

  const currentDiscountTier = getDiscountTier(selectedProducts.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-8 flex max-h-[calc(100vh-6rem)] flex-col rounded-lg border border-primary-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-800"
    >
      {/* Header */}
      <div className="flex-none">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Gift className="h-4 w-4" />
            Gift Summary
          </h3>
          {selectedBox && (
            <span className="text-sm text-primary-500">
              {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} left
            </span>
          )}
        </div>

        {selectedBox && (
          <div className="mt-3 flex items-center gap-3 rounded-md bg-primary-50/50 p-2 dark:bg-primary-800/50">
            {selectedBox.featuredImage && (
              <Image
                src={selectedBox.featuredImage.url}
                alt={selectedBox.title}
                width={40}
                height={40}
                className="rounded object-cover"
              />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium">{selectedBox.title}</div>
              <div className="text-xs text-primary-500">${selectedBox.price.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Product List - Scrollable */}
      <div className="mt-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary-200 dark:scrollbar-thumb-primary-700">
        {selectedProducts.length > 0 && (
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-center gap-2 rounded-md bg-primary-50/30 p-2 text-sm dark:bg-primary-800/30"
              >
                {product.featuredImage && (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    width={32}
                    height={32}
                    className="rounded object-cover"
                  />
                )}
                <span className="flex-1 truncate">{product.title}</span>
                <span className="text-xs text-primary-500">${product.price.toFixed(2)}</span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="h-6 w-6 rounded-full hover:bg-primary-100 dark:hover:bg-primary-700"
                    onClick={() => handleEditProduct(product.id)}
                    aria-label={`Edit ${product.title} options`}
                  >
                    <Settings2 className="h-3.5 w-3.5 m-auto text-primary-500 hover:text-primary-900" />
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 rounded-full hover:bg-primary-100 dark:hover:bg-primary-700"
                    onClick={() => handleRemoveProduct(product.id)}
                    aria-label={`Remove ${product.title}`}
                  >
                    <X className="h-4 w-4 m-auto text-primary-500 hover:text-primary-900" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none">
        {selectedBox && (
          <div className="mt-3 rounded-md bg-accent-50/50 p-2 text-xs dark:bg-accent-900/10">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium text-accent-700 dark:text-accent-300">
                <Sparkles className="h-3 w-3" />
                Volume Discount: {currentDiscountTier}%
              </span>
            </div>
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-accent-200 dark:bg-accent-800">
                <motion.div
                  className="h-full bg-accent-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(selectedProducts.length / selectedBox.maxProducts) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-primary-100 pt-3 dark:border-primary-700">
          {discount > 0 && (
            <span className="text-xs text-accent-500">-${discount.toFixed(2)} discount</span>
          )}
          <span className="text-lg font-bold">${(subtotal - discount).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
