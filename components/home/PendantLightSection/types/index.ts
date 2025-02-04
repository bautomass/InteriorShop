import { Product } from "@/lib/shopify/types";

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
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: () => void;
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