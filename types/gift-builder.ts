// types/gift-builder.ts
import { Product as ShopifyProduct, ProductVariant } from 'lib/shopify/types';

export interface GiftBoxVariant {
  id: string;
  variantId: string;
  title: string;
  price: number;
  image?: {
    url: string;
    altText: string;
  };
  maxProducts: number;
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
}

export interface GiftBuilderState {
  step: number;
  selectedBox: GiftBoxVariant | null;
  selectedProducts: GiftProduct[];
  totalPrice: number;
  discount: number;
}
