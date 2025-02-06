// app/page.tsx
import Hero from '@/components/home/hero';
import LoyaltyTeaser from '@/components/home/LoyaltyTeaser';
import type { Metadata } from 'next';
import { Suspense, lazy } from 'react';

// Lazy load all other components
const AboutHero = lazy(() => import('@/components/home/about-hero/about-hero'));
const PendantLightSection = lazy(() => import('@/components/home/PendantLightSection/PendantLightSectionIndex'));
const InfiniteProductBanner = lazy(() => import('@/components/home/InfiniteProductBanner/InfiniteProductBannerIndex'));
const LampsCollectionSection = lazy(() => import('@/components/home/lamps/LampsCollectionSection'));
const MaterialsSection = lazy(() => import('@/components/home/materials/MaterialsSection'));
const NewArrivalsCollection = lazy(() => import('@/components/home/NewArrivalsCollection'));
const AnturamStoolsCollection = lazy(() => import('@/components/home/AnturamStoolsCollection'));
const CanvasCollection = lazy(() => import('@/components/home/CanvasCollection'));
const BlogSection = lazy(() => import('@/components/home/BlogSection'));
const CeramicVaseSection = lazy(() => import('@/components/home/CeramicVaseSection'));
const WishboneChairSection = lazy(() => import('@/components/home/WishboneChairSection'));
const InteriorTipsSection = lazy(() => import('@/components/home/InteriorTipsSection'));
const InstagramBanner = lazy(() => import('@/components/home/InstagramBanner'));
const BackToTop = lazy(() => import('@/components/home/BackToTop'));

// Loading components for each section
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const metadata: Metadata = {
  title: 'Modern Living | Timeless Interior Design & Contemporary Home Decor',
  description: 'Transform your space with our curated collection of minimalist, sustainable, and artisanal home furnishings. Discover pieces that blend modern aesthetics with mindful living.',
  keywords: 'modern interior design, sustainable furniture, minimalist home decor, contemporary living, artisanal furnishings, luxury home accessories, eco-friendly decor, scandinavian design, zen interior, natural materials, premium home furnishings, mindful living spaces',
  openGraph: {
    type: 'website',
    title: 'Modern Living | Timeless Interior Design & Contemporary Home Decor',
    description: 'Transform your space with our curated collection of minimalist, sustainable, and artisanal home furnishings. Discover pieces that blend modern aesthetics with mindful living.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Living - Contemporary Interior Design'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': 155,
    'max-image-preview': 'large',
    'max-video-preview': -1
  }
};
export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingSpinner />}>
        <AboutHero />
      </Suspense>
      <div className="space-y-8 md:space-y-16">
        <Suspense fallback={<LoadingSpinner />}>
          <PendantLightSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <InfiniteProductBanner />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <LampsCollectionSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <MaterialsSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <NewArrivalsCollection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <AnturamStoolsCollection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <CanvasCollection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <CeramicVaseSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <WishboneChairSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <InteriorTipsSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <InstagramBanner />
        </Suspense>
        <LoyaltyTeaser />
        <Suspense fallback={<LoadingSpinner />}>
          <BackToTop />
        </Suspense>
      </div>
    </>
  );
}
