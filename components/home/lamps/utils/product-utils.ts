import type { Product } from '@/lib/shopify/types';
import { LAMP_CONSTANTS } from '../constants/lamp-constants';

export const determineProductCategory = (product: Product): string => {
  const title = product.title?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';
  const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];

  // Combined text for searching
  const searchText = `${title} ${description} ${tags.join(' ')}`;

  // Score each category based on keyword matches
  const scores = Object.entries(LAMP_CONSTANTS.CATEGORY_PATTERNS).map(([category, keywords]) => ({
    category,
    score: keywords.reduce((score, keyword) => score + (searchText.includes(keyword) ? 1 : 0), 0)
  }));

  // Find category with highest score
  const bestMatch = scores.reduce(
    (best, current) => (current.score > best.score ? current : best),
    { category: 'Lamp', score: 0 }
  );

  return bestMatch.category;
};