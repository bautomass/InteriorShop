import { useCallback, useRef, useState } from 'react';

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  featuredImage?: {
    url: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  [key: string]: unknown;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
  };
  [key: string]: unknown;
}

interface SearchResults {
  products: Product[];
  collections: Collection[];
}

interface SearchError extends Error {
  name: string;
  message: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({
    products: [],
    collections: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');

  const clearSearch = useCallback(() => {
    setResults({ products: [], collections: [] });
    setError(null);
  }, []);

  const performSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        clearSearch();
        return;
      }

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      lastQueryRef.current = trimmedQuery;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Only update if this is still the latest query
        if (trimmedQuery === lastQueryRef.current) {
          setResults({
            products: data.products || [],
            collections: data.collections || []
          });
        }
      } catch (err) {
        const error = err as SearchError;

        // Don't handle aborted requests
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Search error:', error);
        setError('An error occurred while searching. Please try again.');
        clearSearch();
      } finally {
        // Only update loading state if this is still the latest query
        if (trimmedQuery === lastQueryRef.current) {
          setIsLoading(false);
        }
      }
    },
    [clearSearch]
  );

  // Cleanup function to abort any pending requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    performSearch,
    clearSearch,
    cleanup
  };
}

// import { useRef, useState } from 'react';

// interface SearchResults {
//   products: any[];
//   collections: any[];
// }

// export function useSearch() {
//   const [results, setResults] = useState<SearchResults>({ products: [], collections: [] });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);
//   const lastQueryRef = useRef<string>('');

//   const performSearch = async (query: string) => {
//     if (!query.trim()) {
//       setResults({ products: [], collections: [] });
//       setError(null);
//       return;
//     }

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     abortControllerRef.current = new AbortController();

//     lastQueryRef.current = query;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `/api/search?q=${encodeURIComponent(query)}`,
//         { signal: abortControllerRef.current.signal }
//       );

//       if (!response.ok) {
//         throw new Error('Search request failed');
//       }

//       const data = await response.json();

//       if (query === lastQueryRef.current) {
//         setResults({
//           products: data.products || [],
//           collections: data.collections || []
//         });
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         return;
//       }

//       console.error('Search error:', error);
//       setError('An error occurred while searching');
//       setResults({ products: [], collections: [] });
//     } finally {
//       if (query === lastQueryRef.current) {
//         setIsLoading(false);
//       }
//     }
//   };

//   return { results, isLoading, error, performSearch };
// }
