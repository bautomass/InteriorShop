'use client';

import { addItem } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import { useActionState } from '@/hooks/useActionState';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { CheckCircle, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

interface ProductVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (variantId: string, quantity: number) => void;
}

export const ProductVariantModal = ({ isOpen, onClose, product, onAddToCart }: ProductVariantModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const { addCartItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentVariant = useMemo(() => 
    product.variants.find(v => v.id === selectedVariant),
    [selectedVariant, product.variants]
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedVariant('');
      setQuantity(1);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !currentVariant) return;
    startTransition(() => {
      formAction({
        merchandiseId: selectedVariant,
        quantity
      }).then((result) => {
        if (result === 'Success') {
          addCartItem({
            variant: currentVariant,
            product,
            quantity
          });
          setShowSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      }).catch(console.error);
    });
  }, [selectedVariant, currentVariant, quantity, formAction, addCartItem, product, onClose]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {showSuccess ? (
          <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-center shadow-xl transition-all">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Added to Cart!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {quantity}x {product.title} - {currentVariant?.title}
                </p>
              </div>
            </motion.div>
          </Dialog.Panel>
        ) : (
          <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
            {/* Rest of the modal content */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <Dialog.Title className="text-xl font-medium text-gray-900">
                  Select Options
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">{product.title}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-[4fr,1fr] gap-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-700">Available Options</h3>
                <div className="grid grid-cols-5 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={cn(
                        'flex flex-col items-start rounded-md border p-2 text-left transition-all',
                        selectedVariant === variant.id
                          ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-500'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <span className="text-sm font-medium text-gray-900">{variant.title}</span>
                      <span className="mt-0.5 text-sm text-gray-500">
                        ${parseFloat(variant.price.amount).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                {currentVariant && (
                  <div className="rounded-md bg-white p-3">
                    <p className="text-sm font-medium text-gray-900">Selected: {currentVariant.title}</p>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(currentVariant.price.amount).toFixed(2)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <div className="mt-1 flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="rounded-md border bg-white p-2 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="rounded-md border bg-white p-2 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {currentVariant && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${(parseFloat(currentVariant.price.amount) * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isPending}
                  className={cn(
                    'mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all',
                    !selectedVariant || isPending
                      ? 'cursor-not-allowed bg-gray-300'
                      : 'bg-primary-600 hover:bg-primary-700'
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isPending ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        )}
      </div>
    </Dialog>
  );
}; 