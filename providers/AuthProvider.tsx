// providers/AuthProvider.tsx
'use client';
import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { initializeCustomerLoyalty } from '@/lib/shopify/loyalty/initializeLoyalty';
import {
  customerAccessTokenCreateMutation,
  customerAccessTokenDeleteMutation,
  customerCreateMutation,
  customerQuery
} from '@/lib/shopify/mutations/customer';
import type { ShopifyCustomer } from '@/lib/shopify/types/customer';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
}

interface User extends ShopifyCustomer {}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'shopifyCustomerAccessToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const fetchCustomer = async (accessToken: string) => {
  //   try {
  //     const { body } = await shopifyFetch({
  //       query: customerQuery,
  //       variables: { customerAccessToken: accessToken },
  //       cache: 'no-store'
  //     });
  
  //     if (body.data?.customer) {
  //       const metafields = (body.data.customer.metafields || []).reduce(
  //         (acc: any, field: any) => {
  //           if (field && field.key) {
  //             acc[field.key.replace('custom.', '')] = field.value;
  //           }
  //           return acc;
  //         },
  //         {}
  //       );
  
  //       setUser({
  //         ...body.data.customer,
  //         metafields
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch customer:', err);
  //     localStorage.removeItem(TOKEN_KEY);
  //     setUser(null);
  //   }
  // };

  const fetchCustomer = async (accessToken: string) => {
    try {
      const { body } = await shopifyFetch({
        query: customerQuery,
        variables: { customerAccessToken: accessToken },
        cache: 'no-store'
      });
  
      if (body.data?.customer) {
        const metafields = body.data.customer.metafields || [];
        const metafieldValues = metafields.reduce((acc: any, field: any) => {
          if (field && field.key) {
            acc[field.key.replace('custom.', '')] = field.value;
          }
          return acc;
        }, {});
  
        setUser({
          ...body.data.customer,
          metafields: metafieldValues
        });
      }
    } catch (err) {
      console.error('Failed to fetch customer:', err);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          await fetchCustomer(token);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { body } = await shopifyFetch({
        query: customerAccessTokenCreateMutation,
        variables: {
          input: { email, password }
        },
        cache: 'no-store'
      });

      const { customerAccessToken, customerUserErrors } = body.data.customerAccessTokenCreate;

      if (customerUserErrors.length > 0) {
        throw new Error(customerUserErrors[0].message);
      }

      if (!customerAccessToken) {
        throw new Error('Failed to create access token');
      }

      localStorage.setItem(TOKEN_KEY, customerAccessToken.accessToken);
      await fetchCustomer(customerAccessToken.accessToken);
      return customerAccessToken;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');
  
      // First create the customer
      const { body: createBody } = await shopifyFetch({
        query: customerCreateMutation,
        variables: {
          input: {
            email,
            password,
            firstName,
            lastName: lastName || undefined
          }
        },
        cache: 'no-store'
      });
  
      if (createBody.data?.customerCreate?.customerUserErrors?.length > 0) {
        throw new Error(createBody.data.customerCreate.customerUserErrors[0].message);
      }
  
      const customerId = createBody.data?.customerCreate?.customer?.id;
      if (!customerId) {
        throw new Error('Failed to create customer');
      }
  
      // Then sign in to get access token
      const { body: signInBody } = await shopifyFetch({
        query: customerAccessTokenCreateMutation,
        variables: {
          input: { email, password }
        },
        cache: 'no-store'
      });
  
      const accessToken = signInBody.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      if (!accessToken) {
        throw new Error('Failed to create access token');
      }
  
      // Store the access token
      localStorage.setItem(TOKEN_KEY, accessToken);
  
      // Initialize loyalty program
      await initializeCustomerLoyalty(accessToken, customerId);
  
      // Finally fetch customer data
      await fetchCustomer(accessToken);
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCustomer]);

  const signOut = useCallback(async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await shopifyFetch({
          query: customerAccessTokenDeleteMutation,
          variables: { customerAccessToken: token },
          cache: 'no-store'
        });
      }
      
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
