// types/navigation.ts
import type { Collection, Product } from '@/lib/shopify/types';

export interface NavItem {
  label: string;
  href: string;
  featured?: boolean;
  subItems?: Array<{
    label: string;
    href: string;
  }>;
}

export interface HeaderState {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  activeDropdown: string | null;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  isCartOpen: boolean;
  searchQuery: string;
  showSearchModal: boolean;
  sortBy: string;
  priceRange: string | null;
  isSidebarOpen: boolean;
}

export interface SearchResult {
  products: Product[];
  collections: Collection[];
}
