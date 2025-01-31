// /components/home/hooks/useProductVariant.ts
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { useEffect, useState } from 'react';
import type { SelectedOptions } from '../types';

export const useProductVariant = (product: Product | null) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product) {
      const defaultOptions: SelectedOptions = {};
      product.options.forEach(option => {
        if (option.values?.[0]) {
          defaultOptions[option.name] = option.values[0];
        }
      });
      setSelectedOptions(defaultOptions);
    }
  }, [product]);

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(
          option => selectedOptions[option.name] === option.value
        )
      );
      setSelectedVariant(matchingVariant || null);
    }
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  return {
    selectedOptions,
    selectedVariant,
    handleOptionChange
  };
};