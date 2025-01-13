import { ProductsGrid } from '@/components/collections/ProductsGrid';
// import { NavigationHeader } from '@/components/layout/navigation-header';
import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
import { Footer } from '@/components/layout/site-footer';
import { defaultSort, sorting } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'All Products | Modern Living',
  description: 'Explore our complete collection of high-quality products',
  openGraph: {
    title: 'All Products | Modern Living',
    description: 'Explore our complete collection of high-quality products',
    type: 'website'
  }
};

// Default view settings
const viewSettings = {
  minCards: 4,
  maxCards: 6,
  defaultCards: 4
};

const PRODUCTS_PER_PAGE = 12;

interface PageProps {
  searchParams?: {
    sort?: string;
    view?: string;
    cards?: string;
    page?: string;
  };
}

export default async function AllProductsPage({ searchParams = {} }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  // Get sorting parameters
  const { sort } = searchParams;
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Get view settings
  const isGridView = searchParams.view !== 'list';
  const cardsToShow = Number(searchParams.cards) || viewSettings.defaultCards;

  // Fetch products for current page
  const products = await getProducts({
    sortKey,
    reverse,
    first: 400
  });

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) range.push(i);
        range.push('...');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        range.push(1);
        range.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
      } else {
        range.push(1);
        range.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) range.push(i);
        range.push('...');
        range.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    }
    
    return range;
  };

  // Loading state component
  const LoadingSkeleton = () => (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <LargeScreenNavBar />
      
      <main className="bg-primary-50 pb-20 dark:bg-primary-900">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="pt-24 mb-6">
            <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-50">
              All Products
            </h1>
            <p className="mt-2 text-primary-600 dark:text-primary-300">
              Showing {products.length} products
            </p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <ProductsGrid
              products={currentProducts}
              cardsToShow={cardsToShow}
              isGridView={isGridView}
              viewSettings={viewSettings}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-8 flex justify-center" aria-label="Pagination">
                <ul className="flex items-center gap-2">
                  {/* Previous Page */}
                  <li>
                    <PaginationLink
                      page={currentPage - 1}
                      disabled={currentPage === 1}
                      searchParams={searchParams}
                    >
                      Previous
                    </PaginationLink>
                  </li>

                  {/* Page Numbers */}
                  {getPaginationRange().map((pageNum, idx) => (
                    <li key={idx}>
                      {pageNum === '...' ? (
                        <span className="px-3 py-2">...</span>
                      ) : (
                        <PaginationLink
                          page={Number(pageNum)}
                          active={currentPage === pageNum}
                          searchParams={searchParams}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </li>
                  ))}

                  {/* Next Page */}
                  <li>
                    <PaginationLink
                      page={currentPage + 1}
                      disabled={currentPage === totalPages}
                      searchParams={searchParams}
                    >
                      Next
                    </PaginationLink>
                  </li>
                </ul>
              </nav>
            )}
          </Suspense>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-white/50 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-medium text-primary-900 dark:text-primary-50">
                  No Products Found
                  
                </h2>
                <p className="text-primary-700 dark:text-primary-200">
                  Please check back later for new products.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Pagination Link Component
function PaginationLink({
  page,
  children,
  active = false,
  disabled = false,
  searchParams = {}
}: {
  page: number;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  searchParams?: Record<string, string | undefined>;
}) {
  // Preserve existing search params while changing page
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== 'page') params.set(key, value);
  });
  params.set('page', page.toString());

  return (
    <Link
      href={disabled ? '#' : `?${params.toString()}`}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        {
          'bg-primary-600 text-white': active,
          'bg-primary-100 text-primary-600 hover:bg-primary-200': !active && !disabled,
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </Link>
  );
} 