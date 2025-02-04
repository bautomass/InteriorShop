import { Product, ProductVariant } from "@/lib/shopify/types";

export const calculateSalePercentage = (
    priceInEUR: number,
    compareAtPriceInEUR: number | null
  ): number | null => {
    if (!compareAtPriceInEUR || compareAtPriceInEUR <= priceInEUR) return null;
    return Math.round(((compareAtPriceInEUR - priceInEUR) / compareAtPriceInEUR) * 100);
  };

export const getProductPrices = (
    selectedVariant: ProductVariant | null,
    product: Product | null
  ) => {
    const priceInEUR = selectedVariant 
      ? parseFloat(selectedVariant.price.amount)
      : parseFloat(product?.priceRange.minVariantPrice.amount || '0');
    
    const compareAtPriceInEUR = selectedVariant?.compareAtPrice
      ? parseFloat(selectedVariant.compareAtPrice.amount)
      : product?.compareAtPriceRange?.minVariantPrice
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null;
  
    return {
      price: priceInEUR,
      compareAtPrice: compareAtPriceInEUR,
      isOnSale: compareAtPriceInEUR && compareAtPriceInEUR > priceInEUR
    };
  };