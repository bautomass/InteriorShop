// hooks/use-gift-builder.ts
import { GiftBoxVariant, GiftProduct } from '@/types/gift-builder';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGiftBoxes() {
  return useQuery({
    queryKey: ['giftBoxes'],
    queryFn: async () => {
      const response = await fetch('/api/gift-boxes');
      if (!response.ok) throw new Error('Failed to fetch gift boxes');
      return response.json() as Promise<GiftBoxVariant[]>;
    }
  });
}

export function useGiftProducts(search: string = '', collection: string = '') {
  return useQuery({
    queryKey: ['giftProducts', search, collection],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (collection) params.set('collection', collection);

      const response = await fetch(`/api/gift-products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Promise<GiftProduct[]>;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftBundle: { boxVariantId: string; productVariantIds: string[] }) => {
      const response = await fetch('/api/cart/add-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftBundle)
      });

      if (!response.ok) throw new Error('Failed to add gift to cart');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}
