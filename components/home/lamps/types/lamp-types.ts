import type { Product as ShopifyProduct } from '@/lib/shopify/types';

// Base Product type
export type Product = ShopifyProduct;

// Extended LampProduct type
export interface LampProduct extends Product {
  lampType?: string;
  wattage?: number;
  // Add any other lamp-specific properties here
}

// View Settings
export interface ViewSettings {
  minCards: number;
  maxCards: number;
  defaultCards: number;
}

// Component Props
export interface LampProductCardProps {
  product: LampProduct;
  onQuickView: (e: React.MouseEvent<HTMLButtonElement>) => void;
  cardsToShow?: number;
  isPriority?: boolean;
}

export interface LampGridViewProps {
  products: LampProduct[];
  cardsToShow: number;
  onQuickView: (product: LampProduct) => void;
}

export interface LampVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: LampProduct;
  onAddToCart: (variantId: string, quantity: number) => void;
}

export interface LampViewControlsProps {
  current: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isGridView: boolean;
  onViewChange: (value: boolean) => void;
}

export interface LampImageGalleryProps {
  product: LampProduct;
}

// Other types
export interface LampBannerImage {
  src: string;
  alt: string;
}
