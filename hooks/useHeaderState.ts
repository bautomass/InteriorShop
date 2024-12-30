import type { HeaderState } from '@/types/navigation';
import { useCallback, useState } from 'react';

export const useHeaderState = () => {
  const [state, setState] = useState<HeaderState>({
    isScrolled: false,
    isMobileMenuOpen: false,
    activeDropdown: null,
    isSearchOpen: false,
    isAccountOpen: false,
    isCartOpen: false,
    searchQuery: '',
    showSearchModal: false,
    sortBy: 'created_desc',
    priceRange: null,
    isSidebarOpen: false
  });

  const updateState = useCallback((updates: Partial<HeaderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState };
}; 