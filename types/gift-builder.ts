// types/gift-builder.ts
import { ProductVariant, Product as ShopifyProduct } from 'lib/shopify/types';

export interface GiftBoxImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface GiftBoxVariant {
  id: string;
  title: string;
  price: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: GiftBoxImage;
  featuredImage?: GiftBoxImage;
}

export interface GiftProduct {
  id: string;
  variantId: string;
  title: string;
  price: number;
  image?: {
    url: string;
    altText: string;
  };
  collection: {
    id: string;
    title: string;
  };
  variant: ProductVariant;
  originalProduct: ShopifyProduct;
  featuredImage?: GiftBoxImage;
}

export interface BoxSelectionPayload {
  id: string;
  title: string;
  price: number;
  variantId: string;
  maxProducts: number;
  selectedOptions: { [key: string]: string };
  featuredImage: GiftBoxImage;
}

export interface GiftBuilderState {
  step: number;
  selectedBox: BoxSelectionPayload | null;
  selectedProducts: GiftProduct[];
  editingProductId: string | null;
  totalPrice: number;
  discount: number;
}
