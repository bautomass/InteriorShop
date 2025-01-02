//product-context.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

// Enhanced types with proper index signature
interface BaseProductState {
  [key: string]: string | undefined;
}

interface ProductState extends BaseProductState {
  image?: string;
}

export type ProductContextValue = {
  state: ProductState;
  setState: React.Dispatch<React.SetStateAction<ProductState>>;
  updateOption: (name: string, value: string) => any;
  updateImage: (index: string) => any;
};

type UpdateType = 'OPTION' | 'IMAGE';

interface OptimisticUpdate {
  type: UpdateType;
  payload: { [key: string]: string };
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state with type safety
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  });

  // Keep URL and state in sync
  useEffect(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setState(params);
  }, [searchParams]);

  const performOptimisticUpdate = useCallback(
    (update: OptimisticUpdate) => {
      setState((prevState) => {
        const newState = { ...prevState, ...update.payload };
        const newParams = new URLSearchParams(window.location.search);
        Object.entries(update.payload).forEach(([key, value]) => {
          if (value) newParams.set(key, value);
        });
        router.push(`?${newParams.toString()}`, { scroll: false });
        return newState;
      });
    },
    [router]
  );

  const updateOption = useCallback(
    (name: string, value: string) => {
      setState((prevState) => {
        // Create new state with only the new option
        const newState = {
          ...prevState,
          [name]: value
        };

        // Update URL immediately
        const newParams = new URLSearchParams(window.location.search);
        newParams.set(name, value);
        
        console.log('Updating state and URL:', { 
          name, 
          value, 
          newState,
          url: `?${newParams.toString()}`
        });

        // Update URL without lowercase conversion
        router.push(`?${newParams.toString()}`, { scroll: false });

        return newState;
      });
    },
    [router]
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
      setState,
      updateOption,
      updateImage
    }),
    [state, setState, updateOption, updateImage]
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
