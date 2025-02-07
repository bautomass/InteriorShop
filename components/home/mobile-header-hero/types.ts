// types.ts
export interface Collection {
    handle: string;
    title: string;
    description?: string;
  }
  
  export interface PromoItem {
    id: number;
    text: string;
    icon?: React.ReactNode;
  }
  
  export interface HeaderState {
    isSearchOpen: boolean;
    isCartOpen: boolean;
    isNavOpen: boolean;
    isAccountOpen: boolean;
    searchQuery: string;
    collections: Collection[];
    currentPromoIndex: number;
    headerVisible: boolean;
    lastScrollY: number;
    isScrolled: boolean;
    isSearching: boolean;
    searchResults: {
      collections: Collection[];
      products: any[];
    };
    expandedSections: {
      'Help & Information': boolean;
      'Legal': boolean;
    };
  }