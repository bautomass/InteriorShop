export const calculateSalePercentage = (
    priceInEUR: number,
    compareAtPriceInEUR: number | null
  ): number | null => {
    if (!compareAtPriceInEUR || compareAtPriceInEUR <= priceInEUR) return null;
    return Math.round(((compareAtPriceInEUR - priceInEUR) / compareAtPriceInEUR) * 100);
  };

