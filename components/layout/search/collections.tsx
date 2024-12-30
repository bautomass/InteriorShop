// components/layout/search/collections.tsx
import clsx from 'clsx';
import { getCollections } from 'lib/shopify';
import { Suspense } from 'react';
import FilterList from './filter';

// Constants for styling
const SKELETON_STYLES = {
  base: 'mb-3 h-4 w-5/6 animate-pulse rounded',
  activeAndTitles: 'bg-neutral-800 dark:bg-neutral-300',
  items: 'bg-neutral-400 dark:bg-neutral-700'
} as const;

// Loading Skeleton Component
function CollectionSkeleton() {
  return (
    <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
      <div className={clsx(SKELETON_STYLES.base, SKELETON_STYLES.activeAndTitles)} />
      <div className={clsx(SKELETON_STYLES.base, SKELETON_STYLES.activeAndTitles)} />
      {[...Array(8)].map((_, i) => (
        <div key={i} className={clsx(SKELETON_STYLES.base, SKELETON_STYLES.items)} />
      ))}
    </div>
  );
}

// Server Component for Collections List
async function CollectionList() {
  try {
    const collections = await getCollections();
    return <FilterList list={collections} title="Collections" />;
  } catch (error) {
    console.error('Error loading collections:', error);
    return (
      <div className="text-sm text-red-500">Failed to load collections. Please try again.</div>
    );
  }
}

// Main Collections Component
export default function Collections() {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      {/* @ts-expect-error Server Component */}
      <CollectionList />
    </Suspense>
  );
}

// import clsx from 'clsx';
// import { Suspense } from 'react';

// import { getCollections } from 'lib/shopify';
// import FilterList from './filter';

// async function CollectionList() {
//   const collections = await getCollections();
//   return <FilterList list={collections} title="Collections" />;
// }

// const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
// const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
// const items = 'bg-neutral-400 dark:bg-neutral-700';

// export default function Collections() {
//   return (
//     <Suspense
//       fallback={
//         <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
//           <div className={clsx(skeleton, activeAndTitles)} />
//           <div className={clsx(skeleton, activeAndTitles)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//         </div>
//       }
//     >
//       <CollectionList />
//     </Suspense>
//   );
// }
