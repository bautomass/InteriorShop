// /app/collections/page.tsx
import { CollectionGrid } from '@/components/collections/collection-grid';
import { CollectionsHero } from '@/components/collections/hero-section';
import { RecentlyViewed } from '@/components/collections/recently-viewed';
import { SearchBar } from '@/components/collections/search-bar';
import { getCollectionsQuery } from 'lib/shopify/queries/collection';
import { shopifyFetch } from 'lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface SEO {
  title: string;
  description: string;
}

interface Collection {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
  image?: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
}

interface CollectionQueryResponse {
  body: {
    data: {
      collections: {
        edges: Array<{
          node: Collection;
        }>;
      };
    };
  };
}

export const metadata: Metadata = {
  title: 'Collections | Modern Living',
  description: 'Explore our curated collections of contemporary furniture and home decor.',
  openGraph: {
    title: 'Collections | Modern Living',
    description: 'Explore our curated collections of contemporary furniture and home decor.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Living Collections'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Modern Living',
    description: 'Explore our curated collections of contemporary furniture and home decor.'
  }
};

interface PageProps {
  searchParams: {
    q?: string;
    sort?: string;
    layout?: 'grid' | 'list' | 'table';
  };
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  let collections: Collection[] = [];
  const layout = searchParams.layout || 'grid';

  try {
    const response = await shopifyFetch<CollectionQueryResponse['body']>({
      query: getCollectionsQuery,
      cache: 'force-cache'
    });

    if (response?.body?.data?.collections?.edges) {
      collections = response.body.data.collections.edges.map(({ node }) => ({
        ...node,
        path: `/collections/${node.handle}` // Add path based on handle
      }));

      // Apply search filter
      if (searchParams.q) {
        const searchTerm = searchParams.q.toLowerCase();
        collections = collections.filter(
          (collection) =>
            collection.title.toLowerCase().includes(searchTerm) ||
            collection.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (searchParams.sort) {
        switch (searchParams.sort) {
          case 'date-desc':
            collections.sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            break;
          case 'date-asc':
            collections.sort(
              (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            );
            break;
          case 'title-asc':
            collections.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            collections.sort((a, b) => b.title.localeCompare(a.title));
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching collections:', error);
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-primary-50 pb-20 dark:bg-primary-900">
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/50"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Suspense>
          <CollectionsHero />
        </Suspense>

        {/* Recently Viewed */}
        <Suspense>
          <RecentlyViewed />
        </Suspense>

        {/* Search Bar */}
        <Suspense>
          <SearchBar />
        </Suspense>

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-sm text-primary-600 dark:text-primary-300">
            Showing {collections.length} collection{collections.length !== 1 ? 's' : ''}
            {searchParams.q && (
              <span className="ml-1">
                for "<span className="font-medium text-accent-500">{searchParams.q}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Collections Grid/List/Table */}
        <section aria-label="Collections">
          <CollectionGrid collections={collections} layout={layout as 'grid' | 'list' | 'table'} />
        </section>

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-white/50 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-medium text-primary-900 dark:text-primary-50">
                No Collections Found
              </h2>
              <p className="text-primary-700 dark:text-primary-200">
                {searchParams.q
                  ? `No collections found for "${searchParams.q}". Try a different search term.`
                  : 'Please check back later for new collections.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// // /app/collections/page.tsx
// import { CollectionGrid } from '@/components/collections/collection-grid';
// import { CollectionsHero } from '@/components/collections/hero-section';
// import { RecentlyViewed } from '@/components/collections/recently-viewed';
// import { SearchBar } from '@/components/collections/search-bar';
// import { getCollectionsQuery } from 'lib/shopify/queries/collection';
// import { shopifyFetch } from 'lib/utils';
// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { Suspense } from 'react';

// interface SEO {
//   title: string;
//   description: string;
// }

// interface Collection {
//   handle: string;
//   title: string;
//   description: string;
//   seo: SEO;
//   updatedAt: string;
//   image?: {
//     url: string;
//     altText: string;
//     width: number;
//     height: number;
//   };
// }

// interface CollectionQueryResponse {
//   body: {
//     data: {
//       collections: {
//         edges: Array<{
//           node: Collection;
//         }>;
//       };
//     };
//   };
// }

// export const metadata: Metadata = {
//   title: 'Collections | Modern Living',
//   description: 'Explore our curated collections of contemporary furniture and home decor.',
//   openGraph: {
//     title: 'Collections | Modern Living',
//     description: 'Explore our curated collections of contemporary furniture and home decor.',
//     type: 'website',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Modern Living Collections'
//       }
//     ]
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Collections | Modern Living',
//     description: 'Explore our curated collections of contemporary furniture and home decor.'
//   }
// };

// interface PageProps {
//   searchParams: {
//     q?: string;
//     sort?: string;
//     layout?: 'grid' | 'list' | 'table';
//   };
// }

// export default async function CollectionsPage({ searchParams }: PageProps) {
//   let collections: Collection[] = [];
//   const layout = searchParams.layout || 'grid';

//   try {
//     const response = await shopifyFetch<CollectionQueryResponse['body']>({
//       query: getCollectionsQuery,
//       cache: 'force-cache'
//     });

//     if (response?.body?.data?.collections?.edges) {
//       collections = response.body.data.collections.edges.map(({ node }) => node);

//       // Apply search filter
//       if (searchParams.q) {
//         const searchTerm = searchParams.q.toLowerCase();
//         collections = collections.filter(
//           (collection) =>
//             collection.title.toLowerCase().includes(searchTerm) ||
//             collection.description?.toLowerCase().includes(searchTerm)
//         );
//       }

//       // Apply sorting
//       if (searchParams.sort) {
//         switch (searchParams.sort) {
//           case 'date-desc':
//             collections.sort((a, b) =>
//               // Compare timestamps directly instead of converting to locale-specific strings
//               new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//             );
//             break;
//           case 'date-asc':
//             collections.sort((a, b) =>
//               // Compare timestamps directly instead of converting to locale-specific strings
//               new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
//             );
//             break;
//           case 'title-asc':
//             collections.sort((a, b) => a.title.localeCompare(b.title));
//             break;
//           case 'title-desc':
//             collections.sort((a, b) => b.title.localeCompare(a.title));
//             break;
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching collections:', error);
//     notFound();
//   }

//   return (
//     <main className="relative min-h-screen bg-primary-50 pb-20 dark:bg-primary-900">
//       {/* Gradient Background */}
//       <div className="absolute inset-0">
//         <div
//           className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/50"
//           aria-hidden="true"
//         />
//       </div>

//       <div className="relative mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
//         {/* Hero Section */}
//         <Suspense>
//           <CollectionsHero />
//         </Suspense>

//         {/* Recently Viewed */}
//         <Suspense>
//           <RecentlyViewed />
//         </Suspense>

//         {/* Search Bar */}
//         <Suspense>
//           <SearchBar />
//         </Suspense>

//         {/* Results Info */}
//         <div className="mb-8">
//           <p className="text-sm text-primary-600 dark:text-primary-300">
//             Showing {collections.length} collection{collections.length !== 1 ? 's' : ''}
//             {searchParams.q && (
//               <span className="ml-1">
//                 for "<span className="font-medium text-accent-500">{searchParams.q}</span>"
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Collections Grid/List/Table */}
//         <section aria-label="Collections">
//           <CollectionGrid collections={collections} layout={layout as 'grid' | 'list' | 'table'} />
//         </section>

//         {/* Empty State */}
//         {collections.length === 0 && (
//           <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-white/50 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/50">
//             <div className="text-center">
//               <h2 className="mb-2 text-xl font-medium text-primary-900 dark:text-primary-50">
//                 No Collections Found
//               </h2>
//               <p className="text-primary-700 dark:text-primary-200">
//                 {searchParams.q
//                   ? `No collections found for "${searchParams.q}". Try a different search term.`
//                   : 'Please check back later for new collections.'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
