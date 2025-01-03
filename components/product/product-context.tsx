// //product-context.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ProductState {
  [key: string]: string;
}

export type ProductContextValue = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      // Preserve the original case of the option name
      params[key] = value;
    });
    return params;
  });

  // Keep state in sync with URL params
  useEffect(() => {
    const params: ProductState = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setState(params);
  }, [searchParams]);

  const updateURL = useCallback(
    (newState: ProductState) => {
      const params = new URLSearchParams();
      Object.entries(newState).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const updateOption = useCallback(
    (name: string, value: string) => {
      // Create new state with the updated option
      const newState = {
        ...state,
        [name]: value
      };

      // Update state and URL
      setState(newState);
      updateURL(newState);

      console.log('ProductContext - Updating option:', {
        name,
        value,
        newState
      });

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

// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState
// } from 'react';

// // Enhanced types with proper index signature
// interface BaseProductState {
//   [key: string]: string | undefined;
// }

// interface ProductState extends BaseProductState {
//   image?: string;
// }

// export type ProductContextValue = {
//   state: ProductState;
//   setState: React.Dispatch<React.SetStateAction<ProductState>>;
//   updateOption: (name: string, value: string) => any;
//   updateImage: (index: string) => any;
// };

// type UpdateType = 'OPTION' | 'IMAGE';

// interface OptimisticUpdate {
//   type: UpdateType;
//   payload: { [key: string]: string };
// }

// const ProductContext = createContext<ProductContextValue | undefined>(undefined);

// export function ProductProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Initialize state with type safety
//   const [state, setState] = useState<ProductState>(() => {
//     const params: ProductState = {};
//     searchParams.forEach((value, key) => {
//       params[key] = value;
//     });
//     return params;
//   });

//   // Keep URL and state in sync
//   useEffect(() => {
//     const params: ProductState = {};
//     searchParams.forEach((value, key) => {
//       params[key] = value;
//     });
//     setState(params);
//   }, [searchParams]);

//   const performOptimisticUpdate = useCallback(
//     (update: OptimisticUpdate) => {
//       setState((prevState) => {
//         const newState = { ...prevState, ...update.payload };
//         const newParams = new URLSearchParams(window.location.search);
//         Object.entries(update.payload).forEach(([key, value]) => {
//           if (value) newParams.set(key, value);
//         });
//         router.push(`?${newParams.toString()}`, { scroll: false });
//         return newState;
//       });
//     },
//     [router]
//   );

//   const updateOption = useCallback(
//     (name: string, value: string) => {
//       setState((prevState) => {
//         // Create new state with only the new option
//         const newState = {
//           ...prevState,
//           [name]: value
//         };

//         // Update URL immediately
//         const newParams = new URLSearchParams(window.location.search);
//         newParams.set(name, value);

//         console.log('Updating state and URL:', {
//           name,
//           value,
//           newState,
//           url: `?${newParams.toString()}`
//         });

//         // Update URL without lowercase conversion
//         router.push(`?${newParams.toString()}`, { scroll: false });

//         return newState;
//       });
//     },
//     [router]
//   );

//   const updateImage = useCallback(
//     (index: string) => {
//       const update: OptimisticUpdate = {
//         type: 'IMAGE',
//         payload: { image: index }
//       };

//       performOptimisticUpdate(update);
//       return { ...state, image: index };
//     },
//     [state, performOptimisticUpdate]
//   );

//   const value = useMemo(
//     () => ({
//       state,
//       setState,
//       updateOption,
//       updateImage
//     }),
//     [state, setState, updateOption, updateImage]
//   );

//   return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
// }

// export function useProduct() {
//   const context = useContext(ProductContext);

//   if (context === undefined) {
//     throw new Error('useProduct must be used within a ProductProvider');
//   }

//   return context;
// }

// export function useUpdateURL() {
//   const router = useRouter();

//   return useCallback(
//     (state: ProductState) => {
//       const newParams = new URLSearchParams();

//       Object.entries(state).forEach(([key, value]) => {
//         if (value !== undefined && value !== '') {
//           newParams.set(key.toLowerCase(), value);
//         }
//       });

//       const newURL = `${window.location.pathname}?${newParams.toString()}`;
//       console.log('Updating URL to:', newURL);

//       // Fixed router.push syntax
//       return router.push(newURL, { scroll: false });
//     },
//     [router]
//   );
// }
