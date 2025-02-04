//INFINITE PRODUCT BANNER
import { Product } from "@/lib/shopify/types";

export interface LampSnippet {
    text: string;
  }
  
  export interface ProductCardProps {
    product: Product;
    snippet: string;
  }
  
  export interface InfiniteProductBannerProps {
    className?: string;
  }