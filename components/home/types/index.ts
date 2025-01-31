import { Product } from "@/lib/shopify/types";

export interface ImageItem {
    url: string;
    alt: string;
    text: string;
    caption: string;
  }
  
  export interface Feature {
    title: string;
    id: string;
    description: string;
  }
  
  export interface ScrollMetrics {
    containerWidth: number;
    totalWidth: number;
    isAtStart: boolean;
    isAtEnd: boolean;
  }
  
  export interface ViewAllCardProps {
    inView: boolean;
    index: number;
  }

  // New types for FeaturedProduct
export interface SelectedOptions {
  [key: string]: string;
}

export interface Highlight {
  icon: React.ComponentType;
  title: string;
  description: string;
}

export interface ShareState {
  count: number;
  lastUpdated: string;
}

export interface TouchState {
  start: number | null;
  end: number | null;
}

// Component Props
export interface ProductGalleryProps {
  images: Product['images'];
  title: string;
  activeImage: number;
  onImageChange: (index: number) => void;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export interface ProductOptionsProps {
  product: Product;
  selectedOptions: SelectedOptions;
  onOptionChange: (name: string, value: string) => void;
  onSizeGuideClick: () => void;
}

export interface ShareButtonsProps {
  product: Product;
  shareCount: number;
  onShare: (platform: string) => void;
}

export interface QuantityPickerProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export interface AddToCartButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
}