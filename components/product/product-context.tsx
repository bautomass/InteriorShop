//product-context.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

// Enhanced types with proper index signature
interface BaseProductState {
  [key: string]: string | undefined;
}

interface ProductState extends BaseProductState {
  image?: string;
}

interface ProductContextValue {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
}

type UpdateType = 'OPTION' | 'IMAGE';

interface OptimisticUpdate {
  type: UpdateType;
  payload: { [key: string]: string };
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdatingRef = useRef(false);

  // Initialize state with type safety
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      if (value) {
        // Ensure we only set defined values
        params[key] = value;
      }
    });
    return params;
  });

  // Sync with URL params
  useEffect(() => {
    if (!isUpdatingRef.current) {
      const params: ProductState = {};
      searchParams.forEach((value, key) => {
        if (value) {
          // Ensure we only set defined values
          params[key] = value;
        }
      });
      setState(params);
    }
  }, [searchParams]);

  // Type-safe URL update
  const updateURL = useCallback(
    (newState: ProductState) => {
      const newParams = new URLSearchParams();
      Object.entries(newState).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newParams.set(key, value);
        }
      });

      isUpdatingRef.current = true;
      router.push(`?${newParams.toString()}`, { scroll: false });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [router]
  );

  // Type-safe optimistic update
  const performOptimisticUpdate = useCallback(
    (update: OptimisticUpdate) => {
      setState((prevState) => {
        const newState: ProductState = {
          ...prevState,
          ...update.payload
        };

        // Remove undefined or empty values
        Object.keys(newState).forEach((key) => {
          if (newState[key] === undefined || newState[key] === '') {
            delete newState[key];
          }
        });

        updateURL(newState);
        return newState;
      });
    },
    [updateURL]
  );

  const updateOption = useCallback(
    (name: string, value: string) => {
      console.log('UpdateOption called:', { name, value });

      const update: OptimisticUpdate = {
        type: 'OPTION',
        payload: { [name.toLowerCase()]: value }
      };

      performOptimisticUpdate(update);

      const newState = { ...state, [name.toLowerCase()]: value };
      console.log('New state:', newState);

      return newState;
    },
    [state, performOptimisticUpdate]
  );

  const updateImage = useCallback(
    (index: string) => {
      const update: OptimisticUpdate = {
        type: 'IMAGE',
        payload: { image: index }
      };

      performOptimisticUpdate(update);
      return { ...state, image: index };
    },
    [state, performOptimisticUpdate]
  );

  const value = useMemo(
    () => ({
      state,
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
          newParams.set(key.toLowerCase(), value);
        }
      });

      const newURL = `${window.location.pathname}?${newParams.toString()}`;
      console.log('Updating URL to:', newURL);

      // Fixed router.push syntax
      return router.push(newURL, { scroll: false });
    },
    [router]
  );
}
