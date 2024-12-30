// app/page.tsx
import AboutHero from '@/components/home/about-hero';
import AnturamStoolsCollection from '@/components/home/AnturamStoolsCollection';
import CanvasCollection from '@/components/home/CanvasCollection';
import CeramicVaseSection from '@/components/home/CeramicVaseSection';
import { GiftBuilderSection } from '@/components/home/gift-builder-section';
import InfiniteProductBanner from '@/components/home/InfiniteProductBanner';
import NewArrivalsCollection from '@/components/home/NewArrivalsCollection';
import PendantLightSection from '@/components/home/PendantLightSection';
import { Footer } from '@/components/layout/site-footer';
import Hero from 'components/home/hero';
import LampsCollection from 'components/home/LampsCollection';
import WishboneChairSection from 'components/home/WishboneChairSection';
import { TopHeader } from 'components/layout/navbar/top-header';

import InteriorTipsSection from '@/components/home/InteriorTipsSection';
import type { Metadata } from 'next';

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

export default function HomePage() {
  return (
    <>
      <TopHeader />
      <Hero />
      <AboutHero />
      <div className="space-y-8 md:space-y-16">
        <PendantLightSection />
        <InfiniteProductBanner/>
        <LampsCollection />
        <GiftBuilderSection />
        <NewArrivalsCollection />
        <AnturamStoolsCollection />
        <CanvasCollection />
        <CeramicVaseSection />
        <WishboneChairSection/>
        <InteriorTipsSection/>
        <Footer/>
      </div>
    </>
  );
}