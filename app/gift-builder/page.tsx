// app/gift-builder/page.tsx
import { GiftBuilderProvider } from '@/components/gift-builder/context';
import { GiftBuilder } from '@/components/gift-builder/gift-builder';
import { GiftBuilderSkeleton } from '@/components/gift-builder/loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Custom Gift Builder | Create Your Perfect Gift',
  description:
    'Create a personalized gift box with our curated collection of products. Perfect for any occasion.',
  openGraph: {
    title: 'Custom Gift Builder | Create Your Perfect Gift',
    description:
      'Create a personalized gift box with our curated collection of products. Perfect for any occasion.',
    images: [{ url: '/images/gift-builder-og.jpg', width: 1200, height: 630 }]
  }
};

export default function GiftBuilderPage() {
  return (
    <main className="dark:from-primary-950 min-h-screen bg-gradient-to-b from-primary-50 to-white dark:to-primary-900">
      <Suspense fallback={<GiftBuilderSkeleton />}>
        <GiftBuilderProvider>
          <GiftBuilder />
        </GiftBuilderProvider>
      </Suspense>
    </main>
  );
}
