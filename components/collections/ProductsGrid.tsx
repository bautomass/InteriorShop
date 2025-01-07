// ProductsGrid.tsx
'use client';

import { PriceSortFilter } from '@/components/filter/PriceSortFilter';
import { ProductCard } from '@/components/shared/ProductCard';
import { ViewControls } from '@/components/shared/ViewControls';
import type { Product } from '@/lib/shopify/types';

interface ProductsGridProps {
  products: Product[];
  cardsToShow: number;
  isGridView: boolean;
  viewSettings: {
    minCards: number;
    maxCards: number;
  };
}

export function ProductsGrid({ 
  products, 
  cardsToShow, 
  isGridView, 
  viewSettings 
}: ProductsGridProps) {
  const handleSortChange = (direction: 'asc' | 'desc') => {
    const newSort = direction === 'asc' ? 'price-asc' : 'price-desc';
    window.location.href = `?sort=${newSort}`;
  };

  const handleCardCountChange = (count: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('cards', count.toString());
    window.location.href = `?${params.toString()}`;
  };

  const handleViewChange = (isGrid: boolean) => {
    const params = new URLSearchParams(window.location.search);
    params.set('view', isGrid ? 'grid' : 'list');
    window.location.href = `?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PriceSortFilter onSort={handleSortChange} />
        <ViewControls
          current={cardsToShow}
          min={viewSettings.minCards}
          max={viewSettings.maxCards}
          onChange={handleCardCountChange}
          isGridView={isGridView}
          onViewChange={handleViewChange}
          showCardCount={isGridView}
        />
      </div>

      <div className={`grid gap-4 ${
        isGridView 
          ? `grid-cols-1 sm:grid-cols-2 ${
              cardsToShow >= 4 ? 'lg:grid-cols-4' : 
              cardsToShow === 3 ? 'lg:grid-cols-3' : 
              'lg:grid-cols-2'
            }`
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
      }`}>
        {products.map((product) => (
          <div 
            key={product.id}
            className={`transition-all duration-200 ${
              !isGridView ? 'flex flex-col md:flex-row gap-4 items-start' : ''
            }`}
          >
            <ProductCard
              product={product}
              cardsToShow={cardsToShow}
              onQuickView={() => {}}
              className={!isGridView ? 'w-full md:w-1/2 lg:w-1/2' : ''}
            />
          </div>
        ))}
      </div>
    </div>
  );
}