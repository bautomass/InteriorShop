// components/gift-builder/gift-summary.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Package, Sparkles, Tag } from 'lucide-react';
import { useGiftBuilder } from './context';

export function GiftSummary() {
  const { state } = useGiftBuilder();
  const { selectedBox, selectedProducts, totalPrice, discount } = state;

  const subtotal = selectedBox
    ? selectedBox.price + selectedProducts.reduce((sum, product) => sum + product.price, 0)
    : 0;

  const discountPercentage = discount ? (discount / subtotal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-8 rounded-2xl border border-primary-200 bg-white p-6 shadow-sm dark:border-primary-700 dark:bg-primary-800"
    >
      <h3 className="flex items-center gap-2 text-lg font-bold text-primary-900 dark:text-primary-50">
        <Gift className="h-5 w-5" />
        Gift Summary
      </h3>

      {/* Selected Box */}
      <div className="mt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-primary-600 dark:text-primary-300">Gift Box:</span>
          </div>
          <div className="text-right">
            <AnimatePresence mode="wait">
              {selectedBox ? (
                <motion.div
                  key="box-selected"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-medium text-primary-900 dark:text-primary-50"
                >
                  {selectedBox.title}
                  <p className="text-sm text-primary-500">${selectedBox.price.toFixed(2)}</p>
                </motion.div>
              ) : (
                <motion.span
                  key="no-box"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary-400"
                >
                  Not selected
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-primary-600 dark:text-primary-300">
              Products ({selectedProducts.length}):
            </span>
          </div>
          <div className="text-right">
            <AnimatePresence mode="wait">
              {selectedProducts.length > 0 ? (
                <motion.div
                  key="products-selected"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-medium text-primary-900 dark:text-primary-50"
                >
                  ${selectedProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                </motion.div>
              ) : (
                <motion.span
                  key="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary-400"
                >
                  No products added
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start justify-between gap-4 text-accent-500"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Discount ({discountPercentage.toFixed(0)}%):</span>
            </div>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </motion.div>
        )}

        {/* Total */}
        <div className="border-t border-primary-100 pt-4 dark:border-primary-700">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-primary-900 dark:text-primary-50">
              Total:
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={totalPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xl font-bold text-primary-900 dark:text-primary-50"
              >
                ${(subtotal - discount).toFixed(2)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progressive Discount Info */}
        {selectedBox && (
          <div className="rounded-lg bg-accent-50 p-4 dark:bg-accent-900/10">
            <h4 className="flex items-center gap-2 font-medium text-accent-700 dark:text-accent-300">
              <Sparkles className="h-4 w-4" />
              Volume Discount
            </h4>
            <div className="mt-2 space-y-1 text-sm text-accent-600 dark:text-accent-300">
              <p>3+ items: 5% off</p>
              <p>5+ items: 10% off</p>
              <p>7+ items: 15% off</p>
              <p>10 items: 20% off</p>
            </div>
            {selectedProducts.length > 0 && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent-200 dark:bg-accent-800">
                <motion.div
                  className="h-full bg-accent-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(selectedProducts.length / selectedBox.maxProducts) * 100}%`
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
