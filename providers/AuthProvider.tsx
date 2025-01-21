'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Here you would typically check for an existing session with your backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
      // Here you would typically make an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const user = {
        id: '1',
        email,
        name: 'John Doe'
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Here you would typically make an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const user = {
        id: '1',
        email,
        name
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError('Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    
    try {
      // Here you would typically make an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setUser(null);
      localStorage.removeItem('user');
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