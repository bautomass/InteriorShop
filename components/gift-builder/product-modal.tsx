import { Product, ProductVariant } from '@/lib/shopify/types';
import { GiftProduct } from '@/types/gift-builder';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: GiftProduct, options: Record<string, string>) => void;
}

export function ProductModal({ product, onClose, onAdd }: ProductModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    if (product?.options?.length > 0) {
      product.options.forEach(option => {
        if (option?.values?.length > 0) {
          initialOptions[option.name] = option.values[0] || '';
        }
      });
    }
    return initialOptions;
  });

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    console.log('Product:', product);
    console.log('Variants:', product.variants);
    
    // Convert variants to array if it's not already
    const variantsArray = Array.isArray(product.variants) 
      ? product.variants 
      : Object.values(product.variants);

    // Find the selected variant based on selected options
    const selectedVariant = (variantsArray as ProductVariant[]).find(variant =>
      variant?.selectedOptions?.every(
        option => selectedOptions[option.name] === option.value
      )
    );

    const giftProduct: GiftProduct = {
      id: product?.id ?? '',
      variantId: selectedVariant?.id ?? (variantsArray[0] as ProductVariant)?.id ?? '',
      title: product?.title ?? '',
      price: selectedVariant 
        ? Number(selectedVariant.price.amount)
        : Number(product?.priceRange?.minVariantPrice?.amount ?? '0'),
      featuredImage: product.featuredImage,
      image: product.featuredImage,
      collection: {
        id: '',
        title: ''
      },
      variant: (selectedVariant ?? variantsArray[0] ?? {
        id: '',
        title: '',
        availableForSale: false,
        selectedOptions: [],
        sku: '',
        price: { amount: '0', currencyCode: 'USD' },
        compareAtPrice: null
      }) as ProductVariant,
      originalProduct: product
    };

    onAdd(giftProduct, selectedOptions);
    onClose();
  };

  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <Dialog.Panel
        as={motion.div}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-primary-900"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-primary-500 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.featuredImage?.url || product.images?.[0]?.url || '/placeholder-image.jpg'}
              alt={product.featuredImage?.altText || product.images?.[0]?.altText || product.title || 'Product image'}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-primary-900 dark:text-primary-100">
                {product.title}
              </Dialog.Title>
            </div>

            {product.options?.map((option: any) => (
              <div key={option.name} className="space-y-2">
                <label className="text-sm font-medium text-primary-700 dark:text-primary-200">
                  {option.name}
                </label>
                <select
                  value={selectedOptions[option.name] || ''}
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  className="w-full rounded-lg border border-primary-200 bg-white px-3 py-2 dark:border-primary-700 dark:bg-primary-800"
                >
                  <option value="">Select {option.name}</option>
                  {option.values?.map((value: any) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="pt-4">
              <button
                onClick={handleAdd}
                className="w-full rounded-lg bg-accent-500 px-4 py-2 font-medium text-white transition-colors hover:bg-accent-600"
              >
                Add to Gift Box
              </button>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
} 