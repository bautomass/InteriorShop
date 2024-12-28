'use client';
// /components/shared/ProductCardWrapper.tsx
import { useCallback, useState } from 'react';
import type { BaseProduct } from './UniversalProductCard';
import { UniversalProductCard } from './UniversalProductCard';

interface ProductCardWrapperProps {
  product: BaseProduct;
  href: string;
}

export default function ProductCardWrapper({ product, href }: ProductCardWrapperProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
    // Implement your quick view logic here
    console.log('Quick view:', product.title);
  }, [product]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Implement your add to cart logic here
    console.log('Add to cart:', product.title);
  }, [product]);

  return (
    <a href={href} className="block">
      <UniversalProductCard
        product={product}
        onQuickView={handleQuickView}
        onAddToCart={handleAddToCart}
        cardsToShow={4}
        className="transition-transform duration-300"
      />
    </a>
  );
}