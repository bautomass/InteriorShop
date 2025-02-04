import AboutHero from '@/components/home/about-hero';
import LoyaltyTeaser from '@/components/home/LoyaltyTeaser';
import PendantLightSection from '@/components/home/PendantLightSection';
import Hero from 'components/home/hero';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const InfiniteProductBanner = dynamic(() => import('@/components/home/InfiniteProductBanner'), {
 loading: () => <div className="min-h-[300px] animate-pulse bg-gray-100" />
});
const LampsCollectionSection = dynamic(() => import('components/home/lamps/LampsCollectionSection'));
const MaterialsSection = dynamic(() => import('@/components/home/materials/MaterialsSection'));
const NewArrivalsCollection = dynamic(() => import('@/components/home/NewArrivalsCollection'));
const AnturamStoolsCollection = dynamic(() => import('@/components/home/AnturamStoolsCollection'));
const CanvasCollection = dynamic(() => import('@/components/home/CanvasCollection'));
const BlogSection = dynamic(() => import('@/components/home/BlogSection'));
const CeramicVaseSection = dynamic(() => import('@/components/home/CeramicVaseSection'));
const WishboneChairSection = dynamic(() => import('@/components/home/WishboneChairSection'));
const InteriorTipsSection = dynamic(() => import('@/components/home/InteriorTipsSection'));
const InstagramBanner = dynamic(() => import('@/components/home/InstagramBanner'));
const BackToTop = dynamic(() => import('components/home/BackToTop'), { ssr: false });
export const metadata: Metadata = {
 title: 'Modern Interior Design & Home Decor',
 description:
   'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
 openGraph: {
   type: 'website',
   title: 'Modern Interior Design & Home Decor',
   description:
     'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
   images: [
     {
       url: '/og-image.jpg',
       width: 1200,
       height: 630,
       alt: 'Modern Interior Design'
     }
   ]
 }
};
const SectionLoader = () => (
 <div className="min-h-[400px] w-full animate-pulse bg-gray-100" />
);
export default function HomePage() {
 return (
   <>
     <Hero />
     <AboutHero />
     <LoyaltyTeaser />
       <PendantLightSection />
       <Suspense fallback={<SectionLoader />}>
         <InfiniteProductBanner />
       </Suspense>
       {/* <Suspense fallback={<SectionLoader />}>
         <LampsCollectionSection />
         <MaterialsSection />
       </Suspense> */}
       {/* <Suspense fallback={<SectionLoader />}>
         <NewArrivalsCollection />
         <AnturamStoolsCollection />
       </Suspense> */}
       {/* <Suspense fallback={<SectionLoader />}>
         <CanvasCollection />
         <BlogSection />
       </Suspense> */}
       {/* <Suspense fallback={<SectionLoader />}>
         <CeramicVaseSection />
         <WishboneChairSection />
       </Suspense> */}
       {/* <Suspense fallback={<SectionLoader />}>
         <InteriorTipsSection />
         <InstagramBanner />
       </Suspense> */}
       {/* <BackToTop /> */}
   </>
 );
}