'use client';

import { ProductVariant } from '@/lib/shopify/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ProductState {
  [key: string]: string;
}

export type ProductContextValue = {
  state: ProductState;
  setState: React.Dispatch<React.SetStateAction<ProductState>>;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({
  children,
  variants = []
}: {
  children: React.ReactNode;
  variants?: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params or default variant
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // If no params and we have variants, set default variant
    if (Object.keys(params).length === 0 && variants.length > 0) {
      const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
      if (defaultVariant) {
        defaultVariant.selectedOptions.forEach((option) => {
          params[option.name] = option.value;
        });
      }
    }

    return params;
  });

  // Set default variant options in URL if not present
  useEffect(() => {
    if (Object.keys(state).length > 0) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      let hasUpdates = false;

      Object.entries(state).forEach(([key, value]) => {
        if (!searchParams.has(key)) {
          newSearchParams.set(key, value);
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        router.push(`?${newSearchParams.toString()}`, { scroll: false });
      }
    }
  }, [state, router, searchParams]);

  const updateURL = useCallback(
    (newState: ProductState) => {
      const newSearchParams = new URLSearchParams();

      Object.entries(newState).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        }
      });

      console.log('Updating URL with state:', newState);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router]
  );

  const updateOption = useCallback(
    (name: string, value: string) => {
      console.log('Updating option:', { name, value });

      const newState = {
        ...state,
        [name]: value
      };

      setState(newState);
      updateURL(newState);

      return newState;
    },
    [state, updateURL]
  );

  const updateImage = useCallback(
    (index: string) => {
      const newState = {
        ...state,
        image: index
      };
      setState(newState);
      updateURL(newState);
      return newState;
    },
    [state, updateURL]
  );

  const value = useMemo(
    () => ({
      state,
      setState,
      updateOption,
      updateImage
    }),
    [state, updateOption, updateImage]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();
  return useCallback(
    (state: ProductState) => {
      const newParams = new URLSearchParams();
      Object.entries(state).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newParams.set(key, value);
        }
      });
      return router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router]
  );
}
